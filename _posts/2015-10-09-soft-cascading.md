---
published: true
layout: post
comments: true
---

So despite my adventures in Laravel (which continue whenever I have some spare time), the difficulties deploying it to crappy shared hosting are making me stick to Codeigniter for any real-life, paid work projects. I've recently been porting (well, completely rewriting) my CMS for Codeigniter 3, and have decided to implement cascading deletes. All very easy with MySQL:

Imagine I have two tables, `employers` and `employees`. `employees` is a child table of `employers`, and has a field that contains the parent row's `id`. Set this as index. Then set as foreign key related to the employer `id`. Then specify `on delete cascade`.

This works fine. But what if I want to implement soft-deletes? I am using Jamie Rumbelow's [base model](https://github.com/jamierumbelow/codeigniter-base-model). It's very easy to set up soft deletes. In `MY_Model`, set

```php?start_inline=true
protected $soft_delete = TRUE;
```

and

```php?start_inline=true
protected $soft_delete_key
```

to the `deleted` field (must be `INT` or `TINYINT`) in your table.

Now I create an employer, add an employee. Delete the employer, and magically its `deleted` flag is set to `1`. I can restore the employer by resetting the flag to zero.

The problem we now have is that we want to soft-delete any children of this employer too: a kind of cascade for the `deleted` flag. Luckily `MY_Model` provides callback functions for `create`, `update`, `get` and `delete`. I should be able to create a function which is called after the `delete` method, which will go through all the children of a parent row and set their `deleted` flag to `1`.

So in my `Admin` model (which extends `MY_Model`) I add `public $before_delete = array('cascade_soft_delete');`, and create a function `cascade_soft_delete`. But then how do I know what the child table is of any given parent table? Or even if the table in which the row has been deleted IS a parent table? 

Enter relationships, also provided for by Rumbelow's `MY_Model`. I can say that one table 'belongs to' another, and that another table 'has many' of another. So in this case, `employees` 'belongs to' `employers`, and `employers` 'has many' `employees`. But here I hit a problem. According to the repo's [readme](https://github.com/jamierumbelow/codeigniter-base-model/blob/master/README.md), 'It will assume that a `MY_Model` API-compatible model with the singular relationship's name has been defined'. But I am not using models for each table. Instead, I have a single, `Admin` model which takes care of CRUD commands for all my tables. If I want to change the `$table` variable, I call a `set_table` method in the `Admin` model, called from the controller for a particular table. Actually, it turns out that this works anyway.

So if I go ahead and create a similar function called `set_belongs_to` in my `Admin` model, then call it in my `Employees` controller, like so:

Admin model:

```php?start_inline=true
public function set_belongs_to($table)
{
    $this->belongs_to[] = $table;
}
```
	
Employees controller:

```php?start_inline=true
$this->Admin_model->set_belongs_to('employers');
```

I can then finally write the `cascade_soft_delete` method. It's very simple:

```php?start_inline=true
public function cascade_soft_delete($row)
{
    $table = $this->table;
    foreach ($this->has_many as $child)
    {
        $this->set_table($child);
        $this->update_by(array('parent'=>$row), array('deleted'=>1));
    }
    $this->set_table($table);
    return $row;
}
```
	
First it grabs the current table so it can restore it at the end. Then, it loops through the `has_many` array (which in my example only contains `employees`) to grab the children. For each child, it sets it as the current working table, then updates it, setting `deleted` to be `1` where the `parent` foreign key field is equal to the `$row` variable (i.e. the `id` of the row about to be deleted from the parent table). At the end it resets the working table to the parent table. And hey presto: cascading soft deletes!
