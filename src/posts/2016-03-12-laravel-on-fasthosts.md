---
published: true
layout: post
comments: true
---

Yet another tutorial about deploying [Laravel](https://laravel.com/) to a shared server! To be precise, I'm deploying to a Fasthosts server. While this obviously isn't ideal, sometimes there's no escaping it, and there's no reason you can't deploy Laravel to Fasthosts. Here are the steps I went through (I'm using Laravel 5.2).

My FTP space looked like this at the start:

```bash
├── /
|   ├── htdocs
|   ├── logfiles
|   ├── webapp
```

Normally you would upload your web site to `htdocs`, but with Laravel things are slightly different. You don't want the application source code to be publicly accessible. So I created a new folder to contain this code, on the same level as `htdocs`, and called it `app_base`:

```bash
├── /
|   ├── app_base
|   ├── htdocs
|   ├── logfiles
|   ├── webapp
```

Before uploading it was necessary to make a small change to the `public/index.php` file. I changed the first two lines to:

```php
require __DIR__.'/../app_base/bootstrap/autoload.php';
$app = require_once __DIR__.'/../app_base/bootstrap/app.php';
```

I uploaded the contents of my website's `public` folder to `htdocs`, and the rest of the app to `app_base`. I visit my website in the browser, and get a `500` error. Fasthosts stores their error logs in the `logfiles` folder, so I go there and open up `error.log`, and see "Option MultiViews not allowed here".

This relates to a section in `public/.htaccess`: `Options -MultiViews`. By removing that I have a fully working Laravel app on Fasthosts.

