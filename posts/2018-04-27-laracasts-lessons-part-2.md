---
published: true
layout: post
comments: true
title: Lessons from Laracasts, Part 2
date: "2018-04-27"
---

This is part 2 of my collection of tips I've taken from [Let's Build a Forum with Laravel and TDD](https://laracasts.com/series/lets-build-a-forum-with-laravel), the mega-tutorial (102 lessons) by Jeffrey Way on his [Laracasts](https://laracasts.com) site. [Part 1 is here.](http://unlikenesses.com/2018-03-24-laracasts-lessons/) This post contains 51 tips, covering lessons 43-102.

#### <a name="51"></a> 51.
The artisan [`notifications:table`](https://laravel.com/docs/5.6/notifications#database-prerequisites) command creates a migration for a table to hold database notifications. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/43)]

#### <a name="52"></a> 52.
The [`tap` helper](https://laravel.com/docs/5.6/helpers#method-tap), [inspired by Ruby](https://medium.com/@taylorotwell/tap-tap-tap-1fc6fc1f93a6) can help refactoring by removing temporary variables. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/44)]

#### <a name="53"></a> 53.
Use the [`artisan event:generate` command](https://laravel.com/docs/5.6/events) to create events and listeners. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/46)]

#### <a name="54"></a> 54.
The [`Notification::fake` and `Notification:assertSentTo` methods](https://laravel.com/docs/5.6/mocking#notification-fake) allow you to test notifications without triggering their usual behaviour. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/47)]

#### <a name="55"></a> 55.
JW uses `[identifier]CacheKey` as a method to supply a single point of truth for a cache's key. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/48)]

#### <a name="56"></a> 56.
An example of using Laravel's container when refactoring spam inspection methods to their own classes: [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/50)], around 06:35.

#### <a name="57"></a> 57.
The [`resolve` method](https://laravel.com/docs/5.6/helpers#method-resolve) resolves a class out of Laravel's container. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/51)]

#### <a name="58"></a> 58.
JW uses a [`422 Unprocessable Entity`](https://httpstatuses.com/422) HTTP status code when catching exceptions thrown during AJAX calls. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/52)]

#### <a name="59"></a> 59.
Artisan's [`make:rule` command](https://laravel.com/docs/5.6/validation#custom-validation-rules) will scaffold the necessary code for custom validation rules. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/53)]

#### <a name="60"></a> 60.
The [`throttle` middleware](https://laravel.com/docs/5.6/routing#rate-limiting) rate limits access to Laravel routes. But JW notes that failing validation would make this solution problematic. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/54)]

#### <a name="61"></a> 61.
Use [`form requests`](https://laravel.com/docs/5.6/validation#form-request-validation) for more complex form situations requiring authorization and validation. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/55)]

#### <a name="62"></a> 62.
The [`collect` helper](https://laravel.com/docs/5.6/collections#creating-collections) converts arrays to collections. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/57)]

#### <a name="63"></a> 63.
When the [`filter` method](https://laravel.com/docs/5.6/collections#method-filter) is called without an argument on a collection it removes falsey values. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/57)]

#### <a name="64"></a> 64.
In the tutorial, JW uses the [At.js](https://github.com/ichord/At.js) library to add mentions autocomplete functionality to the forum. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/60)]

#### <a name="65"></a> 65.
Use the [`pluck` method](https://laravel.com/docs/5.6/collections#method-pluck) to get the values for a given key from a collection. JW uses it to return values from a collection retrieved by Eloquent:

```php
return User::where('name', 'LIKE', '$search%')->take(5)->pluck('name');
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/61)]

#### <a name="66"></a> 66.
One way to grab CSS from an NPM package: use the [`copy` method](https://github.com/JeffreyWay/laravel-mix/blob/master/docs/copying-files.md) in your `webpack.mix.js` file:

```js
mix.js('resources/assets/js/app.js', 'public.js')
   .sass('resources/assets/sass/app.scss', 'public.css')
   .copy('node_modules/[path_to_src_css_file]', '[path_to_dest_css_file]');
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/61)]

#### <a name="67"></a> 67.
Another way to grab a package's CSS: import it in your main `scss` file. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/61)]

#### <a name="68"></a> 68.
Another way to grab a package's CSS: just manually copy it to your `css` directory. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/61)]

#### <a name="69"></a> 69.
To import CSS files depending on the view, use a `@yield('head')` directive, then in the template you want to load this file, include the `link` tag in a `@section('head')` directive. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/61)]

#### <a name="70"></a> 70.
The [`UploadedFile::fake` method](https://laravel.com/docs/5.6/http-tests#testing-file-uploads) allows you to fake a file (or image) for testing:

```php
UploadedFile::fake()->image('filename.jpg', $width, $height)
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/63)]

#### <a name="71"></a> 71.
The [`Storage::fake` method](https://laravel.com/docs/5.6/mocking#storage-fake) will create a fake storage disk for testing. E.g.:

```php
Storage::fake('public');

$this->json('POST', 'api/upload', [
  'file' => UploadedFile::fake()->image('filename.jpg')
]);

Storage::disk('public')->assertExists('filename.jpg');
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/63)]

#### <a name="72"></a> 72.
[`hashName`](https://laravel.com/api/5.6/Illuminate/Http/FileHelpers.html#method_hashName) returns the filename for an uploaded file. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/63)]

#### <a name="73"></a> 73.
Compare Eloquent models with [`is`](https://laravel.com/api/5.6/Illuminate/Database/Eloquent/Model.html#method_is) and [`isNot`](https://laravel.com/api/5.6/Illuminate/Database/Eloquent/Model.html#method_isNot). [From the comments to [Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/64)]

#### <a name="74"></a> 74.
How did I not know about this? The `input` tag [has an `accept` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept) which takes a comma-separated list of content type specifiers, either file extensions, MIME types or `audio/*`, `video/*` or `image/*`. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/65)]

#### <a name="76"></a> 76.
Any native attribute (e.g. `name` on a form element) specified on a Vue component instance will be passed to that component, when the root element of the component is a single form element. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/65)]

#### <a name="77"></a> 77.
As of PHP 7, you can use the [`null coalescing operator`](http://php.net/manual/en/language.operators.comparison.php#language.operators.comparison.coalesce) to assign a default value. E.g.:

```php
return Redis::get($this->cacheKey()) ?? 0;
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/68)]

#### <a name="78"></a> 78.

The steps to create a custom [middleware](https://laravel.com/docs/5.6/middleware):

1. `php artisan make:middleware NameOfMiddleware`

2. In the `handle` method of the new middleware write the code to filter access to the route:

```php
if (! $request->user()->confirmed) {
  return redirect('/threads');
}
```

3. List the middleware class in `app/Http/Kernel.php`:

```php
protected $routeMiddleware = [
  'name-of-middleware' => NameOfMiddleware::class
];
```

4. Attach the middleware to a route:

```php
Route::post('threads', 'ThreadsController@store')->middleware('name-of-middleware');
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/71)]

#### <a name="79"></a> 79.
To simulate a new user registration in a test you can call the event that's called by the `register` method in the `RegistersUsers` trait:

```php
event(new Registered($user));
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/72)]

#### <a name="80"></a> 80.
Faking emails while testing can be done with the [`Mail::fake`](https://laravel.com/docs/5.6/mocking#mail-fake) method.

```php
Mail::fake();

[test code here]

Mail::assertSent(MailableName::class);
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/72)]

#### <a name="81"></a> 81.
Eloquent models have a [`$cast` property](https://laravel.com/docs/5.6/eloquent-mutators#attribute-casting) that, in the words of the docs, "provides a convenient method of converting attributes to common data types". Useful, for example, for converting `0` or `1` to booleans. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/72)]

#### <a name="82"></a> 82.
The [`forceCreate` Eloquent method](https://laravel.com/api/5.6/Illuminate/Database/Eloquent/Builder.html#method_forceCreate) is like `create` except that it ignores any mass-assignment rules. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/72)]

#### <a name="83"></a> 83.
You can define modifications of your model factories with [the `state` method](https://laravel.com/docs/5.6/database-testing#factory-states). [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/73)]

#### <a name="84"></a> 84.
Laravel's [`str-slug` helper](https://laravel.com/docs/5.6/helpers#method-str-slug) converts strings to slugs. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/75)]

#### <a name="85"></a> 85.
Use the query builder's [`max` method](https://laravel.com/docs/5.6/queries#aggregates) to return the highest value of a given model field. E.g.:

```php
$max = Book::wherePublisher('foobar')->max('pages');
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/76)]

#### <a name="86"></a> 86.
As of PHP 7, [you can access characters in strings](http://php.net/manual/en/language.types.string.php#language.types.string.substr) using an offset in array-type brackets. To access the final character of string, use `-1`:

```php
$final = $slug[-1];
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/76)]

#### <a name="87"></a> 87.
Use the [`abort_if` helper](https://laravel.com/docs/5.6/helpers#method-abort-if) to throw an exception under a given boolean condition. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/78)]

#### <a name="88"></a> 88.
You can render an array as JSON in a blade template with the [`@json` directive](https://laravel.com/docs/5.6/blade#displaying-data). [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/81)]

#### <a name="89"></a> 89.
MySQL has a [`SET NULL` action](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html#foreign-keys-referential-actions) that can be set for `UPDATE` and `DELETE` operations on a foreign key. In a Laravel migration, this reads as:

```php
$table->foreign('user_id')
  ->references('id')
  ->on('users')
  ->onDelete('set null');
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/82)]

#### <a name="90"></a> 90.
If you get a "Cannot add foreign key constraint" error when migrating, that can be because the migration where you're setting the foreign key has a timestamp earlier than the migration for the table you're referencing in your foreign key. JW fixes this by manually altering the timestamp of the migration to a later date. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/82)]

#### <a name="91"></a> 91.
A potential error when using foreign keys and testing with an SQLite database: [foreign keys are not enabled by default](https://www.sqlite.org/foreignkeys.html#fk_enable). To enable them, in your test include:

```php
DB::statement('PRAGMA foreign_keys = ON');
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/82)]

NB. A comment to this video notes that instead you can use:

```php
Schema::enableForeignKeyConstraints();
```

#### <a name="92"></a> 92.
Use double negation (`!!`) to cast variables to a boolean. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/85)]

#### <a name="93"></a> 93.
Use the [`@php` directive](https://laravel.com/docs/5.6/blade#php) to embed PHP code in Blade views. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/88)]

#### <a name="94"></a> 94.
It is recommended not to reference the `.env` file within the application. Instead, pull environment variables from a configuration file (e.g. `config/services.php`) which itself pulls from `.env`. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/89)]

#### <a name="95"></a> 95.
Instead of getting the remote IP address with `$_SERVER['REMOTE_ADDR']`, use [`request()->ip()`](https://laravel.com/api/5.6/Illuminate/Http/Request.html#method_ip). [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/90)]

#### <a name="96"></a> 96.
Use [`app()->runningUnitTests()`](https://laravel.com/api/5.3/Illuminate/Foundation/Application.html#method_runningUnitTests) for behaviour conditional on whether you're running your tests. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/90)]

#### <a name="97"></a> 97.
As of Laravel 5.5, validation returns the validated data, which makes it possible to create concise flows like this:

```php
$thread->update(request()->validate([
  'title' => 'required',
  'body' => 'required'
]));
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/91)]

#### <a name="98"></a> 98.
Using an external search service like Algolia can slow down tests. To circumvent this, set `SCOUT_DRIVER` to `null` in your test environment variables (`phpunit.xml`). For tests where you want to use the search service, you can update the config for that specific test:

```php
config(['scout.driver' => 'algolia']);
```

[[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/95)]

#### <a name="99"></a> 99.
For tests which use a search service, remember to remove any created elements at the end of the test to avoid false positives, with the [`unsearchable` method](https://laravel.com/docs/5.6/scout#removing-records) on a collection. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/95)]

#### <a name="100"></a> 100.
Specify the data sent to your search service by [overriding `toSearchableArray`](https://laravel.com/docs/5.6/scout#configuring-searchable-data) in your model. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/97)]

#### <a name="101"></a> 101.
Any property passed to a Vue component that isn't accepted as a property in that component, will be assigned to the top-level element in that component's template. [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/100)]

#### <a name="102"></a> 102.
When you want to display sanitized data in a Vue (or other front-end framework) component, and you want to sanitize it with PHP, you can do it with a [custom accessor](https://laravel.com/docs/5.6/eloquent-mutators#accessors-and-mutators). [[Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/101)]

