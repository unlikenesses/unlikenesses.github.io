---
published: true
layout: post
comments: true
title: PHP generators in the wild
date: "2020-03-14"
---

Following on from the [previous post about PHP iterators in the wild](https://unlikenesses.com/2020-01-26-php-iterators-in-the-wild/), I want to look at some uses of generators in open source software.

Generators were introduced in PHP 5.5. To quote [the manual](https://www.php.net/manual/en/language.generators.overview.php), "Generators provide an easy way to implement simple iterators without the overhead or complexity of implementing a class that implements the Iterator interface". In other words, there is no difference in behaviour between generators and iterators, as you can see if you look at [the Generator class](https://www.php.net/manual/en/class.generator.php), which implements the `Iterator` interface. A Generator object is obtained by using the `yield` keyword in a function. See [this blog post by Alan Storm](https://alanstorm.com/php-generators-from-scratch/) and [this one by Anthony Ferrara](https://blog.ircmaxell.com/2012/07/what-generators-can-do-for-you.html) for an introduction.

## Example 1: PHP Unit data providers

PHP Unit uses [data providers](https://phpunit.readthedocs.io/en/8.5/writing-tests-for-phpunit.html#data-providers) to supply arrays which contain arguments for a test method. These argument arrays are iterated over, with the test method being called on each array in the provider. Often the arrays are held in an array, but they can also be yielded by an iterator. Since every yield is processed before the tests are run, you do not profit from the improved memory assignment associated with iterators. However it can make the code easier to read.

For example, take a look at [one of the test providers](https://github.com/symfony/security/blob/4.4/Core/Tests/SecurityTest.php#L61) in the test suite for the [`symfony/security` component](https://github.com/symfony/security):

```php
public function getUserTests()
{
    yield [null, null];

    yield ['string_username', null];

    $user = new User('nice_user', 'foo');
    yield [$user, $user];
}
```

this is arguably easier to read than

```php
public function getUserTests()
{
    $user = new User('nice_user', 'foo');

    return [
        [null, null],
        ['string_username', null],
        [$user, $user]
    ];
}
```

if only because it allows the declaration of the `$user` variable to sit next to its usage.

## Example 2: Symfony Console

Symfony's Console package has a [`Table` class](https://github.com/symfony/console/blob/2dfd748ff2ff24ea6e8844a63fa619e7a9b449f3/Helper/Table.php) containing some helpers to display a table. Its [`render` method](https://github.com/symfony/console/blob/2dfd748ff2ff24ea6e8844a63fa619e7a9b449f3/Helper/Table.php#L334) gets the table rows from a method `buildTableRows`, before iterating over them with a `foreach` loop. This is a good use case for a generator given that we do not know in advance how many rows will be in the table.

So how does [`buildTableRows`](https://github.com/symfony/console/blob/2dfd748ff2ff24ea6e8844a63fa619e7a9b449f3/Helper/Table.php#L537) work? First, there are a considerable amount of bytes devoted to catering to the possibility of multiple row-spans and col-spans within the table. Once this is done, it returns a new iterator, [`TableRows`](https://github.com/symfony/console/blob/2dfd748ff2ff24ea6e8844a63fa619e7a9b449f3/Helper/TableRows.php). This iterator implements the `IteratorAggregate` interface, which means you get a quick way of creating an iterator without having to implement all the boilerplate methods (`rewind`, `current`, `valid` etc). Instead, you just implement the `getIterator` method. Sometimes you might just return an `ArrayIterator` or some other common `Traversable` interface here, but `TableRows` can be instantiated with any generator which is then used as the return value for `getIterator` (remember that generators implement the `Iterator` interface, which in turn extends `Traversable`, so they are a valid return value for `getIterator`). In the case of `buildTableRows`, it returns a function which `yield`s each row (formatted appropriately if it spans multiple columns). It will then `yield` any unmerged rows for that row. This requirement to format cells and handle edge cases means that a custom iterator is preferable to, say, an `ArrayIterator`.


## Example 3: Laravel Lazy Collections

[Laravel Lazy Collections](https://laravel.com/docs/6.x/collections#lazy-collections) use generators to provide collection-like classes that, in the words of the manual, "allow you to work with very large datasets while keeping memory usage low." Where Laravel collections are wrappers around arrays, lazy collections are wrappers around iterators. Here's one way to create a lazy collection, taken from the [original pull request](https://github.com/laravel/framework/pull/29415):

```php
LazyCollection::make(function () {
    $handle = fopen('log.txt', 'r');

    while (($line = fgets($handle)) !== false) {
        yield $line;
    }
})
->chunk(4);
```

Essentially, the `LazyCollection` class takes a generator in its constructor, then provides some nice syntax to access items in a collection-like way. The [`make` method](https://github.com/laravel/framework/blob/5b1b3675748649da19c9b6308d1ade25f41eabd5/src/Illuminate/Support/Traits/EnumeratesValues.php#L57) (which is contained in the `EnumeratesValues` trait) simply `new`s up an instance of the class, passing it its parameter. In this case, the parameter is a simple closure which opens a text file and `yield`s a line at a time.

While collections and lazy collections share some of the same implementations for their syntactic sugar, the fact that we are now dealing with generators rather than arrays does mean that many implementations have to change. Let's look at the `chunk` example above. The `Collection` class simply [uses PHP's `array_chunk` method](https://github.com/laravel/framework/blob/5b1b3675748649da19c9b6308d1ade25f41eabd5/src/Illuminate/Support/Collection.php#L1042). On the other hand, the `LazyCollection` class needs [its own implementation](https://github.com/laravel/framework/blob/5b1b3675748649da19c9b6308d1ade25f41eabd5/src/Illuminate/Support/LazyCollection.php#L985). It returns a new `LazyCollection` instance, whose source is a generator which loops over the original source (this is the `while ($iterator->isValid())` loop), splitting into arrays (chunks) of the requested size, and using *those* chunks as sources for yet *another* `LazyCollection` instance. 

## The missing example: co-routines

PHP generators have also played a role in bringing co-routines to the language. This would require another blog post in itself, and to be frank I'm not ready to tackle it yet. The *locus classicus* on this subject is [an eight year old post](https://nikic.github.io/2012/12/22/Cooperative-multitasking-using-coroutines-in-PHP.html) by PHP superman, Nikita Popov. More recently it has been an important feature in asynchronous PHP projects like [Swoole](https://www.swoole.co.uk), [ReactPHP](https://reactphp.org) and [Amp](https://amphp.org).