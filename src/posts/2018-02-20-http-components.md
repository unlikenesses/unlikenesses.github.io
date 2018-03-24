---
published: true
layout: post
comments: true
title: Why an HTTP component?
date: "2018-02-20"
---

Patrick Louys [recommends](https://github.com/PatrickLouys/no-framework-tutorial/blob/master/04-http.md) using an HTTP interface for dealing with web requests and responses, rather than relying on PHP [superglobals](http://php.net/manual/en/language.variables.superglobals.php). I want to look into why this is, i.e. why packages like [his](https://github.com/PatrickLouys/http) (and [the](https://github.com/symfony/http-foundation) [others](https://github.com/nette/http) [he](https://github.com/auraphp/Aura.Web) [lists](https://github.com/fruux/sabre-http)) exist.

Let's consider an HTTP request. The PHP global variable for a `GET` request is `$_GET`. So if we have a URL like `http://www.unlikenesses.com/?post=32`, and we run 

```php
echo $_GET['post'];
```

it will output `32`. Using the Symfony HTTP component, to get the same result we would run

```php
echo $request->query->get('post');
```

With Patrick Louys's component, it's 

```php
echo $request->getParameter('post');
```

Of course, before calling these methods we need to instantiate the request classes, and in both these packages this simply means passing the PHP superglobals to a constructor method; in other words, the request class is basically a wrapper for these globals. This is how it looks in Patrick Louys's package:

```php
$request = new \Http\HttpRequest($_GET, $_POST, $_COOKIE, $_FILES, $_SERVER);
```

and in Symfony's package (according to the [docs](https://symfony.com/doc/current/components/http_foundation.html)):

```php
$request = new Request(
    $_GET,
    $_POST,
    array(),
    $_COOKIE,
    $_FILES,
    $_SERVER
);
```

The classes then provide methods that allow us to access the globals. Of course, depending on the package, there may be a raft of other helper methods to ease working with requests.

How about response objects? They usually contain three pieces of information: the content of the response, the status code (`200`, `404`, etc), and the HTTP headers (e.g. `text/html`). These packages will contain setter methods to define this information, which can then either be retrieved by getter methods and manually output (as with Patrick Louys's package) or output with [helper methods](https://symfony.com/doc/current/components/http_foundation.html#sending-the-response) like `send` (as with Symfony's package). Such helper methods are basically wrappers around the PHP `header` and `echo` commands.

So that's what the packages do. Why are they necessary, or desirable? In the Symfony guide to creating a framework from scratch, a number of problems [are raised](https://symfony.com/doc/current/create_framework/http_foundation.html) with using the `$_GET` superglobal. First, if the given variable doesn't exist, you'll get a PHP warning. This is fixed in the above packages by having their `get` methods return `null` (or a given default) if the requested variable name doesn't exist in their `GET` arrays. E.g., [these lines](https://github.com/symfony/http-foundation/blob/8f68c79bce646f965f38f4d892f72128f8a030d8/Request.php#L685-L714) from the Symfony package:

```php
public function get($key, $default = null)
{
    if ($this !== $result = $this->attributes->get($key, $this)) {
        return $result;
    }
    if ($this !== $result = $this->query->get($key, $this)) {
        return $result;
    }
    if ($this !== $result = $this->request->get($key, $this)) {
        return $result;
    }
    return $default;
}
```

Next, the Symfony doc points out that blindly accepting variables taking from (e.g.) `$_GET` leaves your app open to XSS (Cross-Site Scripting). Its short-term fix (i.e. before getting around to using the HTTP package) is this:

```php
header('Content-Type: text/html; charset=utf-8');

printf('Hello %s', htmlspecialchars($input, ENT_QUOTES, 'UTF-8'));
```

How does this combat XSS? For a start, it uses [htmlspecialchars](http://php.net/manual/en/function.htmlspecialchars.php) to convert any HTML characters (the presence of which might indicate that code is being injected via the query string) to HTML entities (e.g. `<` to `&lt;`). The `header` statement sets encoding to UTF-8 (Owasp [notes](https://www.owasp.org/index.php/PHP_Security_Cheat_Sheet#Use_UTF-8_unless_necessary) that "Many new attack vectors rely on encoding bypassing" and recommends to "Use UTF-8 as your database and application charset"). As of PHP 5.4 UTF-8 is default but I guess this allows for security on earlier PHP environments.

How are these issues handled in Symfony's HTTP package? Well, actually it doesn't automatically escape the input for you:

```php
$response = new Response(sprintf('Hello %s', htmlspecialchars($input, ENT_QUOTES, 'UTF-8')));
$response->send();
```

But, as the docs say, the `send` method "first outputs the HTTP headers followed by the content". In any case, since "the charset of the Response object defaults to UTF-8" there is no need to specify it in the `Content-Type`. 

The last benefit mentioned is improved testability. Since these HTTP packages are basically representations of HTTP messages in the form of PHP objects, they can be more easily instantiated, manipulated, mocked, and passed between methods and classes. If we want to test a class that requires a `GET` variable we can rewrite the class to accept the `Request` via dependency injection, and in the test mock the `Request` object and pass it to the class. It's a commonly-held principle of testing that the isolation of functionality allowed by dependency injection increases the testability of your code.

The Symfony HttpFoundation component is used on (of course) Symfony, Drupal and Laravel, amongst other frameworks.