---
published: true
layout: post
comments: true
title: Lessons from Laracasts, Part 1
date: "2018-03-24"
---

[Let's Build a Forum with Laravel and TDD](https://laracasts.com/series/lets-build-a-forum-with-laravel) is a mega-tutorial (102 lessons) by Jeffrey Way on his [Laracasts](https://laracasts.com) site. It's a massive, time-intensive beast that contains lots of useful info, and not least gives the opportunity to watch someone build a fairly complex website from scratch. But its size means that a lot of little tricks and tips are hidden away inside the videos. While each lesson's title reflects a particular feature Jeffrey Way wants to build, I found that there are also particular technical nuggets of info to be found among the broader strategies. So this is a list of any little snippets that cropped up in the course, just minor points I didn't know or found useful. This post contains 50 tips, covering lessons 1-42. More coming soon!

1.
When making a model in artisan, and `-mr` to make the migration (`m`), and a resourceful controller (`r`). Or use `c` for a plain controller. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/1))

2.
For testing we can use an SQLite database in memory. In `phpunit.xml` set `DB_CONNECTION` to `sqlite` and `DB_DATABASE` to `:memory:`. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/2))

3.
`latest()` is an [Eloquent relation](https://github.com/illuminate/database/blob/master/Query/Builder.php#L1487) that is basically an alias for `orderBy('created_at', 'desc')`. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/2))

4.
Put code common to all tests in a test file in a `setUp` method that calls `parent::setUp();`. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/3))

5.
Call `diffForHumans()` on Carbon instances (like `created_at` fields in Eloquent models) to output something like "2 days ago". ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/3))

6.
Add the `--filter` flag to `phpunit` to run only one test. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/4))

7.
Instead of specifying mass-assignable fields in a model with `fillable`, you can set the `$guarded` variable to block specific fields, or set it to an empty array to make every field assignable. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/4))

8.
`back()` is a [helper function](https://laravel.com/docs/5.6/responses#redirects) to return the user to the previous location. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/4))

9.
Note the distinction between `create` and `make` model factory methods: `create` persists the model to the database, while `make` only stores it in memory. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/4))

10.
The `raw` model factory method returns an array of the model data, rather than the Eloquent model. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/6))

11.
Add `only()` to restrict middleware to particular methods in a controller. E.g. in the constructor:

```php
$this->middleware('auth')->only('store');
```

([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/6))

Or use `except()` for the opposite. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/8))

12.
Use the [`exists` validation rule](https://laravel.com/docs/5.6/validation#rule-exists) to check whether a given field exists in a specified database table. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/10))

13.
You can use `whereSlug` and `whereId` as aliases for `where('slug', $slug)` and `where('id', $id)` in Eloquent calls. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/11))

14.
To change the key used in route-model binding, override the `getRouteKeyName` method in your model. E.g.

```php
public function getRouteKeyName()
{
  return 'slug';
}
```

([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/11))

15.
If you need some data to be passed to all your views, you don't need to use a view composer, you can use the much simpler [`share`](https://laravel.com/docs/5.6/views#sharing-data-with-all-views) method. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/13))

16.
JW says that he uses "query objects" - classes that correspond to a complex SQL query - in the Laracasts codebase. E.g. `App/Queries/ThreadsQuery`. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/15))

17.
You can [retrieve only a portion of the request data](https://laravel.com/docs/5.6/requests#retrieving-input) using `$request->only(['foo', 'bar'])`. It saves requesting everything then filtering through it. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/15))

18.
Performing `count()` on a relationship given as a [dynamic property](https://laravel.com/docs/5.6/eloquent-relationships#defining-relationships) (e.g. `$thread->replies->count()`) requires a redundant SQL query that will fetch all the replies. If we substitute the method for the property (e.g. `$thread->replies()->count()`) the SQL query only gets the count of the replies. As the [docs say](https://laravel.com/docs/5.6/eloquent-relationships#querying-relations): "all types of Eloquent relationships also serve as query builders, allowing you to continue to chain constraints onto the relationship query before finally executing the SQL against your database". ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/16))

19.
The Eloquent `load` method permits ["lazy eager loading"](https://laravel.com/docs/5.6/eloquent-relationships#lazy-eager-loading), i.e. eager loading a relationship after the model has been retrieved. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/16))

20.
The Eloquent [`withCount` method](https://laravel.com/docs/5.6/eloquent-relationships#counting-related-models) is a way of counting the results of a relationship without loading them. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/16))


21.
Eloquent [`global query scopes`](https://laravel.com/docs/5.6/eloquent#global-scopes) define constraints applicable to all queries on that model. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/16))

22.
Laravel's [`str_plural` helper](https://laravel.com/docs/5.6/helpers#method-str-plural) returns the appropriate plural form of a string. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/16))

23.
The [`toSql` method](https://github.com/illuminate/database/blob/16980ffecb15e47d0a1942a64d3cc548e22f709c/Query/Builder.php#L1698-L1706) returns the SQL query of a given Eloquent query. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/17))

24.
The whole section on [polymorphic relations](https://laravel.com/docs/5.6/eloquent-relationships#polymorphic-relations) was new to me. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/18))

25.
In database migrations, create a unique combined index with [`unique`](https://laravel.com/docs/5.6/migrations#indexes); e.g. `$table->unique(['user_id', 'favorited_id', 'favorited_type']);`. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/18))

26.
JW: "One of the downsides" of Eloquent is its tendency to hide the presence of multiple SQL queries when accessing relationships between models. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/19))

27.
Global eager loading in an Eloquent model is possible by overriding the `$with` property. E.g.

```php
protected $with = ['owner']
```

([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/21))

28.
You can use [model events](https://laravel.com/docs/5.6/eloquent#events) to (among other things) delete related models when a model is deleted. E.g. in the `boot` method of a model:

```php
static::deleting(function($thread) {
  $thread->replies()->delete();
});
```

([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/23))

29.
The [method_field helper](https://laravel.com/docs/5.6/helpers#method-method-field) spoofs HTTP verbs in forms. E.g.

```php
{{ method_field('DELETE') }}
```

([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/23))

30.
Use [`@forelse` and `@empty`](https://laravel.com/docs/5.6/blade#loops) to show messages when a collection of data to be looped through is empty. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/24))

31.
The artisan [`make:policy` command](https://laravel.com/docs/5.6/authorization#creating-policies) generates an empty policy class. The flag `--model=Foo` adds some boilerplate. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/24))

32.
The [`@can` and `@cannot` Blade directives](https://laravel.com/docs/5.6/authorization#via-blade-templates) check whether the logged in user can perform a given action. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/24))

33.
To give a super admin permission to perform all actions, either use the [`before` method](https://laravel.com/docs/5.6/authorization#policy-filters) on a policy, or to apply this to all policies use the [Gate class](https://laravel.com/docs/5.6/authorization#gates) in the `boot` method of `AuthServiceProvider`. E.g.:

```php
Gate::before(function($user) {
  if ($user->name === 'super admin') return true;
});
```

([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/24))

34.
Not Laravel specific, but to get the short name of a class (i.e. without the namespace), this can be done with the ReflectionClass method [`getShortName`](http://php.net/manual/en/reflectionclass.getshortname.php). E.g.:

```php
$name = (new \ReflectionClass($thread))->getShortName();
```

([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/25))

35.
You can move `boot` methods from specific models to traits they use with the function `boot[TraitName]` in the trait. E.g.:

```php
protected static function bootRecordsActivity()
{

}
```

([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/25))

36.
You can pass a closure to the `groupBy` method. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/26))

37.
[Chain the `with` method to a redirect response](https://laravel.com/docs/5.6/responses#redirecting-with-flashed-session-data) to flash data to the session. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/29))

38.
Use the [`@includeIf`](https://laravel.com/docs/5.6/blade#including-sub-views) Blade directive to only include a view if it exists. Inspired by ([this video](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/30))

39.
Use [inline templates](https://vuejs.org/v2/guide/components.html#Inline-Templates) to use a Blade file (or other HTML) as a Vue component's template. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/32))

40.
Use the [`v-cloak`](https://vuejs.org/v2/api/#v-cloak) directive, in combination with a CSS rule like `[v-cloak] { display: none; }`, to hide a Vue component until it's loaded. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/32))

41.
Use the [`appends`](https://laravel.com/docs/5.6/eloquent-serialization#appending-values-to-json) property to add Eloquent attributes to a model's array or JSON representation. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/34))

42.
Use the Eloquent [`fresh`](https://github.com/laravel/framework/blob/5.6/src/Illuminate/Database/Eloquent/Model.php#L1010-L1020) method to reload a model from the database. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/34))

43.
For a model event (e.g. `deleting`) to fire, the model has to be deleted (or updated etc.), rather than building an SQL command with the query builder. I.e. this:

```php
$this->favorites()->where($attributes)->get()->each(function($favorite) {
  $favourite->delete();
});
```

instead of 

```php
$this->favorites()->where($attributes)->delete();
```

([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/35))

44.
[Higher order messages](https://laravel.com/docs/5.6/collections#higher-order-messages) are  "properties" to make performing tasks on collections more readable. E.g., using the `each` higher order message:

```php
$this->favorites()->where($attributes)->each->delete();
```

([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/35))

45.
The Vue [`v-for`](https://vuejs.org/v2/guide/list.html#Mapping-an-Array-to-Elements-with-v-for) directive can take a second argument that supplies the index of an item. E,g.:

```
<div v-for="(reply, index) in items"
  <reply :data="reply" @deleted="remove(index)"></reply>
</div>
```

([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/36))

46.
Use [Vue mixins](https://vuejs.org/v2/guide/mixins.html) for creating reusable functionality. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/38))

47.
A [Vue watcher](https://vuejs.org/v2/guide/computed.html#Watchers) can be used to perform some new function when a component's data changes. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/38))

48.
In Vue, the [`.prevent`](https://vuejs.org/v2/guide/events.html#Event-Modifiers) event modifier will perform the equivalent of `preventDefault()`. E.g. `@click.prevent`. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/38))

49.
[`increment` and `decrement`](https://laravel.com/docs/5.6/queries#increment-and-decrement) are database query builder helpers to increment or decrement the value of a column. ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/39))

50.
To append an attribute to a single instance of an Eloquent model (rather than to every instance as in 41 above), use the [`append` method](https://laravel.com/docs/5.6/eloquent-serialization#appending-values-to-json). ([Source](https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/42))