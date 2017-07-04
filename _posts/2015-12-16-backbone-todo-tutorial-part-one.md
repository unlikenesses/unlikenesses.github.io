---
published: true
layout: post
comments: true
---

### Based on [Todos - Your First Backbone.js App](http://addyosmani.github.io/backbone-fundamentals/#exercise-1-todos---your-first-backbone.js-app)
#### From the book [Developing Backbone.js Applications](http://addyosmani.github.io/backbone-fundamentals/) by [Addy Osmani](https://twitter.com/addyosmani)

#### Rationale

Addy Osmani's book [Developing Backbone.js Applications](http://addyosmani.github.io/backbone-fundamentals/), an open-source guide to [Backbone.js](http://backbonejs.org/) (though you can also [buy it from O'Reilly](http://shop.oreilly.com/product/0636920025344.do)) contains a number of tutorials that help massively with learning this framework. But as I was working through them I found that I was suffering from an overload of information. Even with an app as simple as a Todo list, I found myself wishing that instead of presenting me with a large chunk of code in one go, the tutorial would go through the app incrementally, first creating all the necessary code for one function, then adding new functions step by step. 

At the same time, no other guide I could find was able to present the concepts of Backbone.js with the clarity and authority of Developing Backbone.js Applications. So rather than throwing my hands up and searching wildly for a poorly-narrated tutorial recorded in a damp, echoey bedroom and uploaded to Youtube, I thought it might be a better idea to break down this app into smaller pieces, and in the process keep a record of it all here. 

So for anyone else who, like me, is coming late to the Backbone.js party and is having trouble finding an authoritative code example (Addy Osmani's) presented with a Backbone-for-Dummies simplicity (dummy==me), this page might be of some help. Of course it's no substitute for reading the [book](http://addyosmani.github.io/backbone-fundamentals/) itself, to which all credit is due for every line of the code that follows in this tutorial. Thanks to Addy Osmani for writing it, and for making it open source. 

#### 1: The HTML

I'm going to assume you have read the [Introduction](http://addyosmani.github.io/backbone-fundamentals/#introduction), [Fundamentals](http://addyosmani.github.io/backbone-fundamentals/#fundamentals) and [Backbones Basics](http://addyosmani.github.io/backbone-fundamentals/#backbone-basics) chapters of Developing Backbone.js Applications. This means that you'll have an awareness of the MVC methodology, as well as some idea of how it's implemented in Backbone.js. You'll know, at least in theory, the roles played by views, controllers, models, collections, and routers; you'll also have a glancing familiarity with [Underscore.js](http://underscorejs.org/).

This part will begin building the Todo app that forms the basis of the [first tutorial](http://addyosmani.github.io/backbone-fundamentals/#exercise-1-todos---your-first-backbone.js-app) in Addy Osmani's book. If you had no trouble following that chapter, then it's safe to assume this blog isn't for you. Otherwise, let's crack on. 

In the rest of this guide I'll be using the exact same code Osmani wrote for his tutorial, but I'll be splitting it up into smaller, more manageable chunks, and offering my own explanations along the way. Apart from the code, all the text in this guide is my own, and I alone am responsible for any mistakes or misinterpretations it contains. Before going any further, I'll make my first and last (well, almost-last) quote from Osmani's book: these are the constituents of what he calls the "application's architecture at a high level":

> * a Todo model to describe individual todo items
> * a TodoList collection to store and persist todos
> * a way of creating todos
> * a way to display a listing of todos
> * a way to edit existing todos
> * a way to mark a todo as completed
> * a way to delete todos
> * a way to filter the items that have been completed or are remaining

What confused me when I first went through this tutorial was that it often tried to fit all of these functions into one chunk of code. What will happen here is we will start off with just the bare-bones functionality. The footer, status, storage, and filter elements will be left to later.

So let's make a start. We'll begin with the HTML, but slightly simplified:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Backbone.js • TodoMVC</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <script type="text/template" id="item-template"></script>
  <script src="js/lib/jquery.min.js"></script>
  <script src="js/lib/underscore-min.js"></script>
  <script src="js/lib/backbone-min.js"></script>
  <script src="js/models/todo.js"></script>
  <script src="js/collections/todos.js"></script>
  <script src="js/views/todos.js"></script>
  <script src="js/views/app.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

Notice the file structure here: a root folder, containing a single folder, `js`. This contains a `lib` folder, containing our dependencies (jQuery, Underscore.js and Backbone.js), along with four folders to contain the Backbone.js files, `views`, `models`, `collections`, and `routers`. There's also a file `app.js` in the `js` root.

Osmani next fills in some of the `<body>` of this page; we'll do the same, but using a stripped-back version:

```html
<section id="todoapp">
  <header id="header">
    <h1>todos</h1>
    <input id="new-todo" placeholder="What needs to be done?" autofocus>
  </header>
  <section id="main">
    <ul id="todo-list"></ul>
  </section>
</section>
```

Stripping out the footer and info sections, we're left with an `<input>` tag to create the next todo, and a `<ul>` list to contain existing todos.

Lastly for this page, there's the template that will hold each individual todo. We won't bother with the stats template for now:

```html
<script type="text/template" id="item-template">
  <div class="view">
    <input class="toggle" type="checkbox" <%= completed ? 'checked' : '' %>>
    <label><%= title %></label>
  </div>
  <input class="edit" value="<%= title %>">
</script>
```

#### 2: The Model

This is the Todo model. Remember, a model represents a single data object. In our case, it contains a title and a flag to specify whether or not the todo has been completed:

```js
var app = app || {};

// Todo Model
// ----------

app.Todo = Backbone.Model.extend({

  defaults: {
    title: '',
    completed: false
  }

});
```

Most of this is pretty straightforward, but some of it could do with some unpacking. For a start, what's that line at the start? 

```js
var app = app || {};
```

This defines the variable `app` to be an empty object (`{}`) if it is not already defined. It takes advantage of the way that Javascript interprets the `||` (OR) operator. If the left hand side is TRUE, that will be returned (i.e. if `app` is already defined, `app` will continue to refer to what `app` was referring to before...); otherwise (if `app` is not already defined, and therefore if the left hand side of the `||` operator is false), the right hand side will be returned, in which case `app` will be set to `{}`, or an empty object. Basically, this line checks to see if the namespace `app` already exists, and if it doesn't, creates it.

#### 3: The Collection

Remember the Todo model represents a *single* todo. Any todo list needs to contain multiple todos, which we will store in a collection. Here's a stripped-back collection code:

```js
var app = app || {};

// Todo Collection
// ---------------

var TodoList = Backbone.Collection.extend({

  model: app.Todo,

});

// Create our global collection of **Todos**.
app.Todos = new TodoList();
```

This could not be simpler: it specifies that the model collected by this collection is `Todo`, in the namespace `app`.

The last line creates a new collection and stores it in the variable `Todos`. Pay attention to this -- it will be referred to elsewhere in the code. If it helps, think of it as the main data structure for the entire app. When we make a `create` call later (as we shall see) it will be `app.Todos` that is being called.

#### 4: The Application View (Part One)

This is a biggy, and Osmani splits it into two sections. As usual, I'm going to give you a minimalized version of it, and we can add more functionality later. Here's the first part:


```js
var app = app || {};

// The Application
// ---------------

app.AppView = Backbone.View.extend({

  el: '#todoapp',

  initialize: function() {
    this.$input = this.$('#new-todo');

    this.listenTo(app.Todos, 'add', this.addOne);
  },

  // Add a single todo item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne: function( todo ) {
    var view = new app.TodoView({ model: todo });
    $('#todo-list').append( view.render().el );
  }

});
```

Recall from the earlier section in the book, [What is `el`?](http://addyosmani.github.io/backbone-fundamentals/#what-is-el), that it `el` refers to an element in the DOM, and is a necessary component of all views. They can be created and added to the DOM, or an already existing element can be referred to. In our case, we're referring to the `id` (`todoapp`) of the `section` element created in the HTML in our first step.

Next up is the `initialize()` method. In my version we only set one jQuery variable, `this.$input`, which we set to the `id` of the `input` field we created above in the HTML: `<input id="new-todo" placeholder="What needs to be done?" autofocus>`. It's just a convenient way for referencing it later when we come to handling the adding of todos.

There is also a `listenTo()` binding. It can be a bit confusing here to see where the events are coming from. As the book puts it:

> When an `add` event is fired the `addOne()` method is called and passed the new model. 

What is firing the `add` event? Let's go back to the book, specifically to the [Events](http://addyosmani.github.io/backbone-fundamentals/#events) section. Here's our binding again:

`this.listenTo(app.Todos, 'add', this.addOne);`

As Osmani puts it, 

> While `on()` and `off()` add callbacks directly to an observed object, `listenTo()` tells an object to listen for events on another object

In our binding, `listenTo()` tells one object (`this`) to listen for events on another object (`app.Todos`). This, recall, is the Collection which I earlier said would be the main focus of the entire app. So we're listening for an `add` event on the Todos Collection. 

But wait! If we go back and look at our Collection, there's no `add` event there. Where is this coming from? Well, if we look at the Backbone.js [manual](http://backbonejs.org/#Collection-add), we'll see that the `add` event is baked in to Backbone.js Collections. So this listener is saying: when a model is added to the collection, call `this.addOne`. (We'll see later what causes the `add` event to be fired.)

Lastly, the `this.addOne()` method is pretty simple. First, it creates an instance of the TodoView (which we have not yet coded), then it renders this instance and adds it to the end of the todo list.

#### 5: The Application View (Part Two)

In the book, [we are reminded](http://addyosmani.github.io/backbone-fundamentals/#events-and-views) to distinguish between two types of events when we are dealing with Views (as we are in this section). One is a DOM event, the other is an event triggered by the Event API. It is this second kind we were dealing with in the previous section. In this section we're going to look at the first kind.

Let's continue with our stripped-down version of `views/app.js`:

```js
var app = app || {};

// The Application
// ---------------

app.AppView = Backbone.View.extend({

  el: '#todoapp',

  // NEW:
  events: {
    'keypress #new-todo': 'createOnEnter'
  },

  initialize: function() {
    this.$input = this.$('#new-todo');

    this.listenTo(app.Todos, 'add', this.addOne);
  },

  // Add a single todo item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne: function( todo ) {
    var view = new app.TodoView({ model: todo });
    $('#todo-list').append( view.render().el );
  },

  // NEW:
  newAttributes: function() {
    return {
      title: this.$input.val().trim(),
      completed: false
    };
  },

  // NEW:
  createOnEnter: function( event ) {
    if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
      return;
    }

    app.Todos.create( this.newAttributes() );
    this.$input.val('');
  }

});
```

In our basic rewriting of Osmani's code, we only have one new piece of functionality: `createOnEnter()`. This is called via a DOM event rather than the Events API. As Osmani said in his section on [Events and Views](http://addyosmani.github.io/backbone-fundamentals/#events-and-views), there are two ways two bind DOM events: using a View's `events` property or using `jQuery.on()`. Here we're using the [`events`](http://backbonejs.org/#View-events) property, which calls the method `createOnEnter()` whenever there's a `keypress` in the `<input>` field.

`createOnEnter()` itself is pretty simple. After checking that the `<input>` text field contains some valid data, it calls the Collection's `create()` method and clears the field. The object passed to `create()` is created by this View's `newAttributes()` method, which simply returns an object with two fields (matching our Model's fields): `title` and `completed`. 

Remember the `add` event in the previous section?

```js
this.listenTo(app.Todos, 'add', this.addOne);
```

We asked what actually triggered this `add` event. Well, as the Backbone.js [manual](http://backbonejs.org/#Collection-create) tells us, it's the Collection's `create()` method that triggers the `add` event. So what the code in this View does is: first, add a listener to the input field; second, if the field has some text and the user hits Return, create a new Todo model and add it to the collection; third, create a new view with this model and append it to the list.

#### 6: The Individual Todo View

We we actually keep all of the original code for this view. But let's break it down into smaller pieces anyway:

```js
var app = app || {};

// Todo Item View
// --------------

// The DOM element for a todo item...
app.TodoView = Backbone.View.extend({

  //... is a list tag.
  tagName: 'li',
```

Notice here that instead of creating our `el` element by associating it with an already existing element in the DOM (as we did with our App View), here it's being created by giving it a `tagName`, in this case the list item tag.

```js
  // Cache the template function for a single item.
  template: _.template( $('#item-template').html() ),
```

This is simply grabbing the item template we created back in the first section. We're using the Underscore.js `_.template()` method to convert it to a template.

```js
  // The DOM events specific to an item.
  events: {
    'dblclick label': 'edit',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },
```

As with the App View, this code creates three DOM event bindings with methods in this View.

```js
  // The TodoView listens for changes to its model, re-rendering. Since there's
  // a one-to-one correspondence between a **Todo** and a **TodoView** in this
  // app, we set a direct reference on the model for convenience.
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
```

As Osmani says, this sets up a listener on the Todo Model, which calls a `render()` method when any change occurs in the Model.

```js
  // Re-renders the titles of the todo item.
  render: function() {
    this.$el.html( this.template( this.model.attributes ) );
    this.$input = this.$('.edit');
    return this;
  },
```

And here we have the `render()` function. It sets the `html` attribute of our `el` element (remember that's the `<li>` tag) to the contents of our template. If we look back at our HTML, we'll see the template has two attributes, `title` and `completed`, which are filled in by our call to the template with `this.model.attributes`. The second line then creates a variable `this.$input` which refers to the element in the template which has the class `edit`. Looking back at the HTML we can see that this is the `<input>` text field.

```js
  // Switch this view into `"editing"` mode, displaying the input field.
  edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },
```

Casting our eyes up for a second to our `events` property, we'll see that this `edit()` method is called when a `<label>` element is double-clicked. All this simple method does is add a CSS class to our template and set the focus to its `<input>` text field.

```js
  // Close the `"editing"` mode, saving changes to the todo.
  close: function() {
    var value = this.$input.val().trim();

    if ( value ) {
      this.model.save({ title: value });
    }

    this.$el.removeClass('editing');
  },
```

`close()` is called when the element with the class `edit` (which is our `<input>` text field) loses focus. Here we grab the value of the field, and save it using the model's `save()` method. Finally, we remove the `editing` CSS class.

```js
  // If you hit `enter`, we're through editing the item.
  updateOnEnter: function( e ) {
    if ( e.which === ENTER_KEY ) {
      this.close();
    }
  }
});
```

`updateOnEnter()` just calls `close()` when the user hits Enter in the `<input>` text field.

#### 7: Startup

We now come to `js/app.js`, where we simply instantiate the root `AppView`:

```js
var app = app || {};
var ENTER_KEY = 13;

$(function() {

  new app.AppView();

});
```

The `ENTER_KEY` constant is used in the Todo View above (in the `updateOnEnter()` method).

#### 8: In Action

At this point the book pauses to try out the app so far, so that's what we'll do too. Open your browser (preferably Chrome) to the index.html page, and open its console. Ideally there'll be no console errors.

One thing you'll notice is that the CSS doesn't seem to be rendering properly. This is because of an error in the CSS supplied with the book. You'll notice, for example, that it refers to `.todoapp`, where in fact (since `todoapp` is the `id` of an element, not the `class`) it should refer to `#todoapp`. The same applies to `.new-todo`, `.main`, `.toggle-all`, `.todo-list`, `.footer`, `.todo-count`, `.filters`, `.clear-completed`, and `.info`. So if you want it to look the same as the tutorial, you'll need to do a search and replace on all these items in the CSS file (searching for `.[selector]` and replacing with `#[selector]`).

Now you should be able to type something in the large text field at the top, and hit Enter to see it appear in the list underneath. Note that ticking the box next to the newly-added entry, or clicking the Close icon, won't do anything yet. 

One thing you will see if you look in the console is an error:

> Uncaught Error: A "url" property or function must be specified

If you've been following the book's tutorial, this won't appear. But it does for us because in my simplified version I've temporarily ignored anything to do with saving or persisting the todo list. You'll see this if you add a few items and then refresh the page: the list will disappear. The error appears because I haven't removed the `save()` methods from my version of the code. You can see them in the Model:

```js
this.model.save({ title: value });
```

and (indirectly) in the `createOnEnter()` method in the App View:

```js
app.Todos.create( this.newAttributes() );
```

This calls the Collection.create() method, which (if we look at the [annotated code](http://backbonejs.org/docs/backbone.html#section-134)), boths `add`s and `save`s a model.

In the [next tutorial](http://unlikenesses.github.io/2015/12/17/backbone-todo-tutorial-part-two/) we'll be adding that functionality to the app, as well as the completion, closing, filtering, and ordering functions.