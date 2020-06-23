---
published: true
layout: post
comments: true
title: PHP iterators in the wild
date: "2020-01-26"
---

Although they were introduced way back in PHP 5, iterators are one of the language's less commonly used features. Almost all articles about PHP iterators seem to resort to one of two fairly contrived examples: reading a file line-by-line, or creating a bespoke `range` function. In this post I want to take a look at some examples of their use in open source applications, with the hope that this approach will demonstrate how they can solve real-world problems.

In lieu of an introduction, I will point you to the most helpful explanation of iterators I've found, Anthony Ferrara's video ["Iterators"](https://www.youtube.com/watch?v=tW6GcZjBc3E). He shows how a basic `for` loop in PHP is analogous to the methods implementable in PHP's [Iterator interface](https://www.php.net/manual/en/class.iterator.php), such that 

```php
for ($i = 0; $i < count($array); $i++) {
```

corresponds to 

```php
for ($it->rewind(); $it->valid(); $it->next()) {
    $key = $it->key();
```     

(where `$it->key()` in the second example maps to `$i` in the first example). (These operations, `rewind`, `valid`, `next`, `key` and (not mentioned above) `current`, correspond to the classes defined in the Iterator pattern as described in Gang of Four.)

## Example 1: Flysystem

As I said, file operations are a favourite example when introducing iterators. One concrete implementation would be the PHP League's [Flysystem](https://github.com/thephpleague/flysystem) package. Its [`listContents` method](https://flysystem.thephpleague.com/v1/docs/usage/filesystem-api/#list-contents) takes a path string and a boolean to specify whether or not the contents should be listed recursively. If we take a look at [the code for this method on GitHub](https://github.com/thephpleague/flysystem/blob/d03f7e1e0f2fa47f52d445a60ec8ed93d433ddc1/src/Adapter/Local.php#L269), we'll find that it instantiates an iterator (either a `DirectoryIterator` or a `RecursiveDirectoryIterator` depending on the boolean), which then makes it very easy to traverse the contents of the directory with a simple `foreach` loop. Far simpler than messing about with `openddir`, `readdir`, etc. (Note the package also makes use of `FilesystemIterator`, which allows you to skip `.` and `..` when traversing a directory tree.)

## Example 2: PHP Unit

Another useful iterator is the [`FilterIterator`](https://www.php.net/manual/en/class.filteriterator.php). By creating a class which extends this iterator, you can easily filter the result of iterators by wrapping them with your new filter iterator. An example of this in the wild is in PHP Unit. You've probably run `phpunit --filter`, `phpunit --group`, or `phpunit --exclude-group`, many times. If we look in PHP Unit's [GitHub repo](https://github.com/sebastianbergmann/phpunit/blob/master/src/TextUI/TestRunner.php#L1258) we find a method `processSuiteFilters`. This method makes use of a few classes in the [`PHPUnit/Runner/Filter` namespace](https://github.com/sebastianbergmann/phpunit/tree/1d937a963f5755ad8298c400447f812c65ddc687/src/Runner/Filter), specifically a factory, then a number of Iterators which extend `FilterIterator` (or rather `RecursiveFilterIterator`, which itself extends `FilterIterator`). All filter iterators require an `accept` method. For example, the `accept` method of the `IncludeGroupFilterIterator` checks whether the current test (in the traversal) is in the array of groups permissible by the user's filter.

## Example 3: Symfony Finder

In [a blog post](http://fabien.potencier.org/php-iterators-and-streams-are-awesome.html) from 2010, Symfony creator Fabien Potencier said that iterators were "largely underused", and described using them when rewriting the [Finder component](https://github.com/symfony/symfony/blob/2.0/src/Symfony/Component/Finder/Finder.php) for Symfony 2. 

The Finder component combines the approaches outlined in the previous two examples: the `DirectoryIterator` and the `FilterIterator`. Here Potencier implements the [IteratorAggregate interface](https://www.php.net/manual/en/class.iteratoraggregate.php), which requires just one method, `getIterator`, which returns an external iterator. In the case of `Finder`, it returns PHP's [AppendIterator](https://www.php.net/manual/en/class.appenditerator). So, to adapt the example from [the manual](https://symfony.com/doc/2.0/components/finder.html):

```php
$finder = new Finder();
$finder->files()->in(__DIR__)->in('/home');
foreach ($finder as $file) {
    // do stuff
}
```

Here we want the finder instance to focus only on files (`files()`) and to look in the current and `/home` directories. Each repeated `in` call just adds its argument to the class's `dirs` property. Finally, when the iterator is triggered with the `foreach` statement, then for every directory in the `dirs` array, it does two things. First, it calls the `searchInDirectory` method, which basically configures the iterator. Like Flysystem, it uses the [RecursiveDirectoryIterator](https://www.php.net/manual/en/class.recursivedirectoryiterator.php) and adds some bespoke Symfony filters depending on Finder's configuration (these filters extend PHP's [FilterIterator](https://www.php.net/manual/en/class.filteriterator.php)). Second, having obtained this iterator, it adds it to the `AppendIterator` it instantiated earlier. Finally it appends any more iterators that have been explicitly provided by the user, and returns the `AppendIterator`. So here we have an example of PHP's various iterator classes providing a clean way to compose an extensible, flexible API for traversing a file system.

## Example 4: CSV

Another use of iterators is as a memory-saving technique. When you are dealing with data sets of very large, or of unknown, size, processing the data iteratively means you do not suffer the performance drawbacks of holding the entire data set in memory. Basically, it can turn an O(n) process to an O(1) process.

As an example, let's look at another PHP League package, [CSV](https://csv.thephpleague.com), which makes heavy use of iterators. What happens when you run this code? 

```php
$csv = Reader::createFromPath('/path/to/file.csv', 'r');
$records = $csv->getRecords();
```

First the static [`createFromPath` method](https://github.com/thephpleague/csv/blob/42c8916bd02d05169ea31a9479cc789a082cd93f/src/AbstractCsv.php#L172) returns an instance of the [`Stream` object](https://github.com/thephpleague/csv/blob/42c8916bd02d05169ea31a9479cc789a082cd93f/src/Stream.php#L49), which in turn implements PHP's [`SeekableIterator`](https://www.php.net/manual/en/class.seekableiterator.php). This is a simple extension to the common-or-garden iterator, allowing clients to specify the position of the cursor. This instance of the Stream object is set to the [`document` property](https://github.com/thephpleague/csv/blob/42c8916bd02d05169ea31a9479cc789a082cd93f/src/AbstractCsv.php#L105) of the `AbstractCsv` class which `Reader` [extends](https://github.com/thephpleague/csv/blob/42c8916bd02d05169ea31a9479cc789a082cd93f/src/Reader.php#L51). 

Next, [`getRecords`](https://github.com/thephpleague/csv/blob/42c8916bd02d05169ea31a9479cc789a082cd93f/src/Reader.php#L269) gives the client this iterator after applying some cleaning to it. [This line](https://github.com/thephpleague/csv/blob/42c8916bd02d05169ea31a9479cc789a082cd93f/src/Reader.php#L282) does two things: first, it uses PHP's [`CallbackFilterIterator`](https://www.php.net/manual/en/class.callbackfilteriterator.php) to normalize the data (remove any corrupt or empty rows), before using the package's own [`MapIterator`](https://github.com/thephpleague/csv/blob/42c8916bd02d05169ea31a9479cc789a082cd93f/src/MapIterator.php) to remove any [BOMs](https://en.wikipedia.org/wiki/Byte_order_mark). Next the `getRecords` method uses another `CallbackFilterIterator` to skip headers if required. Finally, it returns the return value of `combineHeader`, a method which takes the iterator produced so far in `getRecords` and if necessary adds a header to the records using another `MapIterator`. All of this means that at the end you have an iterator you can use to `foreach` over the records in a CSV file.
