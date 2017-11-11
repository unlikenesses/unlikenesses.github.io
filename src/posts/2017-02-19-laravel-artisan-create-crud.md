---
published: true
layout: post
comments: true
---

I recently found myself creating a simple CMS in Laravel to administer a small site, and wanted to speed up development while abstracting away from the fiddly bits around creating CRUD functionality. So I created an [Artisan command](https://laravel.com/docs/5.4/artisan) to generate all the boring bits. Now I just run

```
art crud:make {resource-name}
```

And the model, migration, controller, routes and views are created for me. I'll take you through the steps I followed to get to this point.

1 - Create the `artisan` command.

This was easy. As [the manual](https://laravel.com/docs/5.4/artisan#writing-commands) says, just run

```
php artisan make:command [name-of-command]
```

and [add it](https://laravel.com/docs/5.4/artisan#registering-commands) to `app/Console/Kernel.php`. From there we can fill in the `signature`: 'crud:make {name}', and start to flesh out the `handle` method:

```php
public function handle()
{
    $this->name = $this->argument('name');

    $this->info('Creating CRUD for table "' . $this->name . '"');
    $this->makeModel();
    $this->makeController();
    $this->info('Controller created successfully.');
    $this->makeRoutes();
    $this->info('Routes created successfully.');
    $this->makeViews();
    $this->info('Views created successfully.');
    $this->makeMenu();
    $this->info('Admin menu created successfully.');
}
```

2 - Make the model.

This bit's also straightforward. We want it so that when we run `crud:make` a model, controller etc are created. The model and migration are the easiest because an `artisan` command already exists for that. So again, following [the manual](https://laravel.com/docs/5.4/artisan#programmatically-executing-commands), we arrive at:

```php
protected function makeModel()
{
    $this->call('make:model', ['name' => $this->name, '-m' => true]);
}
```

This calls the `artisan make:model` command and the `-m` flag means that it should create the migration. That's two birds with one stone.

3 - Make the controller.

This is a bit more tricky. We could just use the `artisan make:controller` command, but we want some boilerplate already in there (the various CRUD commands). The answer is to create a `controller.stub` - basically a template of how we want the controller to look - and to inject our new resource's name at the appropriate points. This can be done easily with `str_replace`. So `makeController` looks a bit like this:

```php
protected function makeController()
{
    $controllerName = $this->name . 'Controller.php';

    file_put_contents(
        base_path('app/Http/Controllers/' . $controllerName),
        $this->compileStub('controller.stub')
    );
}
```

First we create the target name of the controller, which will be the resource's name concatenated to 'Controller.php'. We then use `file_put_contents` to create a file. The destination of the file is the first argument (i.e. the `Controllers` folder), while the second argument is the contents of the file. I use a helper method `compileStub` to inject the resource's name where applicable.

The `controller.stub` file is basically a resource controller with the methods partially filled in. I won't give the whole file - that will vary from app to app - but for me, the class and `index` method look like this:

```php
namespace App\Http\Controllers;

use App\{{name}};
use App\User;
use Illuminate\Http\Request;

class {{name}}Controller extends Controller
{
    public function __construct()
    {
    }

    public function index()
    {
        $rows = {{ "{{name" }}}}::all();

        return view('admin.{{ "{{routeName" }}}}.index', ['rows' => $rows]);
    }
}
```

I use the convention of two curly brackets to specify the placeholders where the name will be injected: `{{ "{{name" }}}}` and `{{ "{{routeName" }}}}`. So if our resource is called `Post`, the above would resolve to:

```php
namespace App\Http\Controllers;

use App\Post;
use App\User;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct()
    {
    }

    public function index()
    {
        $rows = Post::all();

        return view('admin.posts.index', ['rows' => $rows]);
    }
}
```

This replacement occurs in my `compileStub` method:

```php
protected function compileStub($stub)
{
    return str_replace(
        '{{ "{{name" }}}}',
        $this->name,
        str_replace(
            '{{ "{{routeName" }}}}',
            $this->pluralisedName,
            str_replace(
                '{{ "{{argName" }}}}',
                strtolower($this->name),
                file_get_contents(base_path('app/stubs/crud/' . $stub))
            )
        )
    );
}
```

This rather ungainly code replaces all instances of `{{ "{{name" }}}}` with the resource name; all instances of `{{ "{{routeName" }}}}` with a pluralised, lower-case version of the name (I'll leave it up to you to figure out the pluralisation); and all instances of `{{ "{{argName" }}}}` with a lower-case version of the resource name (which I assume to be singular). This is just the nomenclature I use in my CMS - it could be anything.

4 - Make the routes.

This follows a similar principle to the previous step: I have a stub file (`routes.stub`) which contains the generic routes for a resource:

```php
Route::get('/{{ "{{routeName" }}}}', '{{ "{{name" }}}}Controller@index');
Route::get('/{{ "{{routeName" }}}}/create', '{{ "{{name" }}}}Controller@create');
Route::post('/{{ "{{routeName" }}}}', '{{ "{{name" }}}}Controller@store');
Route::get('/{{ "{{routeName" }}}}/{{ "{{{argName" }}}}}/edit', '{{ "{{name" }}}}Controller@edit');
Route::patch('/{{ "{{routeName" }}}}/{{ "{{{argName" }}}}}', '{{ "{{name" }}}}Controller@update');
Route::get('/{{ "{{routeName" }}}}/{{ "{{{argName" }}}}}/delete', '{{ "{{name" }}}}Controller@confirmDelete');
Route::delete('/{{ "{{routeName" }}}}/{{ "{{{argName" }}}}}', '{{ "{{name" }}}}Controller@destroy');
```

I then replace the placeholders with the resource's name but this time instead of creating a new file I append this to the end of my existing admin routes file:

```php
protected function makeRoutes()
{
    file_put_contents(
        base_path('routes/admin.php'),
        $this->compileStub('routes.stub'),
        FILE_APPEND
    );
}
```

5 - Make the views.

This is getting a bit predictable. Again, to create the CMS views I have a stub for each view which I then inject with the appropriate names, before creating the views folder for this resource and creating the view files from the stubs.

That's it! In following this procedure with stubs and injecting the resource name I was just copying how Laravel already does it. If you take a look at the code for the `make:auth` command, in `framework\src\Illuminate\Auth\Console\MakeAuthCommand.php` ([source on Github](https://github.com/laravel/framework/blob/5.4/src/Illuminate/Auth/Console/MakeAuthCommand.php)) you'll find almost exactly this workflow.

