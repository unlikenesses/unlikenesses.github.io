---
published: true
layout: post
comments: true
---

### Based on [Todos - Your First Backbone.js App](http://addyosmani.github.io/backbone-fundamentals/#exercise-1-todos---your-first-backbone.js-app)
#### From the book [Developing Backbone.js Applications](http://addyosmani.github.io/backbone-fundamentals/) by [Addy Osmani](https://twitter.com/addyosmani)

#### Rationale

If you haven't already, take a look at [part one](http://unlikenesses.github.io/2015/12/16/backbone-todo-tutorial-part-one/) for info on why this thing exists.

#### 1: Storage.

Ok, let's get rid of that nasty error:

> Uncaught Error: A "url" property or function must be specified

Remember that this was being triggered by a couple of `save()` methods, without our having specified any resource to save to. 

So, let's go back and add that in. First, in `index.html`, near the bottom, add in a reference to `backbone.localStorage.js` (you can [get it from here](https://github.com/jeromegn/Backbone.localStorage)).

```javascript
<script src="assets/js/lib/backbone.localStorage.js"></script>
```

Try it again and you'll see we still get that error. This is because we still need to specify in our Collection that we're overriding the usual Backbone.js `sync()` method with local storage. This line goes in `collections\todo.js`:

```javascript
localStorage: new Backbone.LocalStorage('todos-backbone'),
```

(Go back to Addy Osmani's [book](http://addyosmani.com/backbone-fundamentals/#todo-collection) if you need to get an overview of what the code looks like in its finished state.)

Ok, now go back to the browser, refresh the page, add a todo, and at last that error is gone. It's not working perfectly though. Refresh the page again and you'll see that the contents of the list are wiped. What we want is for them to be persisted through page refreshes.

#### 2: Recovery

To retrieve the stored todos on page refresh, we just need to open up `views/app.js` and add one line to the end of the `initialize()` method:

```javascript
app.Todos.fetch();
```

This simply calls the `fetch()` method on the Collection. Try refreshing again and you'll see the todos you already entered appear as part of the list when it's initialized.

Before going on with the rest of the app, it might be worth pausing here to consider what's going on with the local storage part of the code, because it's something that puzzled me on first looking at it.

As you probably know, [local storage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) is a way of preserving state between browser sessions, like a cookie on steroids. 

If you recall, previously we received this error on `save()`:

> Uncaught Error: A "url" property or function must be specified

This is because `save()` and `fetch()` normally expects a URL to be supplied. This URL would point to a data resource (e.g. an API endpoint). Since we're not working with those yet, local storage is the simpler route.

##### 3: Completing Todos

Open up `views/todos.js`, we're going to stick pretty closely to the original tutorial here, but I'll break it up into smaller pieces. 

First, we want to add an extra event to the DOM events object:

```javascript
'click .toggle': 'togglecompleted',
```

This will simply listen for the `.toggle` checkbox to be clicked, and call the `togglecompleted()` method when triggered. So let's add that to the View now:

```javascript
togglecompleted: function() {
  this.model.toggle();
},
```

And as you can see, this calls the Model's `toggle()` method. So let's open up `models/todo.js` and add that method (don't forget to add a comma after the `defaults` object):

```javascript
toggle: function() {
  this.save({
    completed: !this.get('completed')
  });
}
```

You might have to look twice at:

```javascript
completed: !this.get('completed')
```

To understand this, we need to consult the [manual entry for the `save` method](http://backbonejs.org/#Model-save): "The attributes hash (as in set) should contain the attributes you'd like to change — keys that aren't mentioned won't be altered". So for a start, we know here we're only saving the `completed` key: we're leaving the `title` key alone. And what are we setting `completed` to? Well, we're negating (with `!`) the current value of `completed` (fetched with `this.get()`). Which is what a `toggle` function should do.

And that's all we need for completing a todo. Try it now - click the checkbox next to a todo item, then refresh the page. It will stay ticked. There is one final cosmetic touch in the book's code, which toggles a `completed` CSS class on the list item. Add this line to the `render()` method:

```javascript
this.$el.toggleClass( 'completed', this.model.get('completed') );
```

Now refresh and tick a todo again, and you'll see a line-through is added to it.

I'd recommend going to the [relevant section of the original book](http://addyosmani.com/backbone-fundamentals/#completing-deleting-todos), if you haven't already, because Osmani gives a great step-by-step explanation of the events that are triggered by clicking the checkbox.

#### 4: Deleting / Closing Todos

Ok, this is pretty similar to the above, so let's breeze through it. First, add the new event to the DOM events handler in the View:

```javascript
'click .destroy': 'clear',
```

As you can see, this calls the `clear()` method in the View, so let's create that:

```javascript
clear: function() {
  this.model.destroy();
}
```

And this calls the `destroy()` method in the Model, but in contrast to the `toggle()` method we created above, we don't need to create a `destroy()` method, because [it's already built in to the Model](http://backbonejs.org/#Model-destroy). Since this is different from the `change` trigger, we need to add a new listener to the `initialize()` method of the View:

```javascript
this.listenTo(this.model, 'destroy', this.remove);
```

This waits for a `destroy` event to come from the Model, and when it does, calls the View's `remove()` method, which [is also built in](http://backbonejs.org/#View-remove).

#### 5: Mark All as Complete

A little detail we've left to near the end: in the `index.html` file add this to the `<section>` with the ID of `main`:

```html
<input type="checkbox" id="toggle-all">
<label for="toggle-all">Mark all as complete</label>
```

Refresh the page and you'll see this adds an arrow to the left column at the top. We'll want to add a DOM handler to take care of that, and since it occurs at a level *above* individual todos, we'll need to put that in the root View, so open `views/app.js`, and add this to the `events` object:

```javascript
'click #toggle-all': 'toggleAllComplete'
```

We'll then need to create the `toggleAllComplete()` method in the same View:

```javascript
toggleAllComplete: function() {
  var completed = this.allCheckbox.checked;

  app.Todos.each(function( todo ) {
    todo.save({
      'completed': completed
    });
  });
}
```

This is pretty straightforward: first it gets the boolean value of the "Mark All" checkbox (here rendered as an arrow by the CSS). Then it assigns this boolean to each todo in the `app.Todos` Collection. For this to work, we need to create the variable `this.allCheckbox`. So add this line to the `initialize()` method:

```javascript
this.allCheckbox = this.$('#toggle-all')[0];
```

Try it out: click the "All Completed" arrow, and it should toggle the state of all the items in the list. The only problem is that when refreshing the page, although the todos stay in their correct state, the arrow doesn't. So we need to add something to our `render()` method. First, add the method declaration and these two variables to the beginning:

```javascript
render: function() {
  var completed = app.Todos.completed().length;
  var remaining = app.Todos.remaining().length;
},
```

Then, set the state of the checkbox at the end of the `render()` method:

```javascript
this.allCheckbox.checked = !remaining;
```

You'll have noticed that the two variables `completed` and `remaining` depend on methods in the Collection which we haven't yet created, so let's do that now. In `collections/todos.js`, add:

```javascript
completed: function() {
  return this.filter(function(todo){
    return todo.get('completed');
  });
},

remaining: function() {
  return this.without.apply(this, this.completed());
},
```

The `completed()` method simply calls Javascript's [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method to build an array of todos which have the `completed` flag set. 

The `remaining()` method uses the Underscore.js [`without()`](http://underscorejs.org/#without) method to return an array of todos *without* the completed ones.

With these in place, when you refresh the page the Mark all as Complete checkbox retains its state.

#### 6: Statistics

You'll have noticed I've left out the statistics and filters. We'll turn to these now.

First, add the `<footer>` tag right after the `<section>` with the `id` of `main`:

```html
<footer id="footer"></footer>
```

then add the stats template right after the item template:

```html
<script type="text/template" id="stats-template">
  <span id="todo-count"><strong><%= remaining %></strong> <%= remaining === 1 ? 'item' : 'items' %> left</span>
  <ul id="filters">
    <li><a href="#/" class="selected">All</a></li>
    <li><a href="#/active">Active</a></li>
    <li><a href="#/completed">Completed</a></li>
  </ul>
  <% if (completed) { %>
  <button id="clear-completed">Clear completed (<%= completed %>)</button>
  <% } %>
</script>
```

This code is all pretty self-explanatory. But we need to add some functionality, so go back to `views/app.js`, and define the `template`:

```javascript
statsTemplate: _.template( $('#stats-template').html() ),
```

This works exactly the same as the `_.template()` method in `views/todos.js`. In the `initialize()` method we also want to instantiate a `footer` variable to grab the footer element:

```javascript
this.$footer = this.$('#footer');
```

Finally, we have to render the footer. Add this code in the `render()` method:

```javascript
if ( app.Todos.length ) {
  this.$main.show();
  this.$footer.show();

  this.$footer.html(this.statsTemplate({
    completed: completed,
    remaining: remaining
  }));

  this.$('#filters li a')
    .removeClass('selected')
    .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
    .addClass('selected');
} else {
  this.$main.hide();
  this.$footer.hide();
}
```

This logic shows or hides certain parts of the GUI depending on whether or not there are any todos in the Collection. If not, the footer and the Mark all as Complete button (in the `main` section) are hidden. If there *are* todos, it shows the main and footer sections, fills the footer template with the `completed` and `remaining` variables already created in this method, and performs a bit of jQuery magic to highlight the appropriate filter (All, Active or Completed) depending on what the URL is (we will come to this in the next section).

Now if you look in the stats template, you'll see a button with the `id` of `clear-completed`. So let's add that functionality. First, add the event to the DOM handler:

```javascript
'click #clear-completed': 'clearCompleted',
```

then create the `clearCompleted()` method:

```javascript
clearCompleted: function() {
  _.invoke(app.Todos.completed(), 'destroy');
  return false;
},
```

This uses the Underscore.js [`invoke()`](http://underscorejs.org/#invoke) method to call `destroy` on all completed todos in the `app.Todos` Collection.

#### 7: The Router and Filtering

Lastly, let's get the filters working. First, add the reference to the router in `index.html`:

`<script src="assets/js/routers/router.js"></script>`

[As Osmani says](http://addyosmani.com/backbone-fundamentals/#todo-routing), the following routes will be needed:

```
#/ (all - default)
#/active
#/completed
```

Then, create the file (`routers/router.js`). This is copied verbatim from the tutorial:

```javascript
var app = app || {};

var Workspace = Backbone.Router.extend({
  routes:{
    '*filter': 'setFilter'
  },

  setFilter: function( param ) {
    // Set the current filter to be used
    if (param) {
      param = param.trim();
    }
    app.TodoFilter = param || '';

    // Trigger a collection filter event, causing hiding/unhiding
    // of Todo view items
    app.Todos.trigger('filter');
  }
});

app.TodoRouter = new Workspace();
Backbone.history.start();
```

Let's take a quick tour of this file. Notice it sets up a `routes` object. If we look at the [manual](http://backbonejs.org/#Router-routes) we'll see that this maps a series of routes to a series of functions. In our case we're using a wildcard, or a `*splat` part, for the whole path; in other words, any path will be matched by this and passed to the `setFilter()` method. We want the URL to specify what kind of filter is being applied to the todo list - display all, active or completed.

The `setFilter()` method trims the URL parameter (if it exists), sets the `app.TodoFilter` variable to it, and triggers a `filter` event on the Collection `app.Todos`. 

This event makes no difference to the collection - it only affects what we can see. So it makes sense that Osmani puts the code for this in the main App View. Open up `views/app.js` and add two new event listeners to the `initialize()` method:

```javascript
this.listenTo(app.Todos, 'change:completed', this.filterOne);
this.listenTo(app.Todos, 'filter', this.filterAll);
```

and add the two methods:

```javascript
filterOne : function (todo) {
  todo.trigger('visible');
},

filterAll : function () {
  app.Todos.each(this.filterOne, this);
},
```

These trigger an event called `visible` which is listened to by the individual todo view. So let's create that listener. Open `views/todos.js`, and add the listener to its `initialize()` method:

```javascript
this.listenTo(this.model, 'visible', this.toggleVisible);
```

We then create the `toggleVisible()` method:

```javascript
toggleVisible : function () {
  this.$el.toggleClass( 'hidden',  this.isHidden());
},
```

This calls the jQuery `toggleClass()` method, passing it another new method, `isHidden()` as the boolean test:

```javascript
isHidden : function () {
  var isCompleted = this.model.get('completed');
  return ( // hidden cases only
    (!isCompleted && app.TodoFilter === 'completed')
    || (isCompleted && app.TodoFilter === 'active')
  );
},
```

This returns `TRUE` if the filter is set to `completed` (i.e. if the URL is `#/completed`) and this todo is not completed, or if the filter is `active` (the URL is `#/active`) and the todo *is* completed. In either of these cases, it returns `TRUE`, i.e. this todo is hidden. 

That's all you need for the filtering. Refresh the page and you'll see the filters at the bottom hiding todos depending on their state. 

There's a couple of other things in Osmani's tutorial which I haven't had time to go into here, but hopefully this has given you enough of a clue to figure them out. As I said, I think it's a great tutorial, but breaking it down into these smaller blocks really helped me to understand Backbone at these early stages.