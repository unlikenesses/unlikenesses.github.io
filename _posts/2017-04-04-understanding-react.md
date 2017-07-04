---
published: true
layout: post
comments: true
---

I'm working my way through the [Survive.js React: From Apprentice to Master book](https://github.com/survivejs/react-book) and wanted to highlight a few points of confusion for me, hoping to clarify them on the way. Compared to the approaches I've been taught in other tutorials the approach here is slightly different. I'll try to pinpoint two or three areas of difference.

1. 
This is a simple one. In one of the [early chapters](https://github.com/survivejs/react-book/blob/dev/manuscript/getting_started/03_implementing_notes.md) the author `export default`s a function without assigning it to a variable or constant:

```javascript
export default () => (
```

Just a detail but it was a shortcut I hadn't encountered before. Easy enough to get accustomed to. (NB. Arrow functions were new enough to me that I was a bit confused by the use of round brackets instead of curly braces. If we don't use curly braces the arrow function implicitly returns whatever comes after the arrow. )

2.
The next issue came from the fact that the author is, at the start at least, using functions instead of classes to define their React components. This meant that props were being passed in a way that was unfamiliar to me (though perfectly clearly [documented](https://facebook.github.io/react/docs/components-and-props.html) in the official docs). See this from the [same chapter](https://github.com/survivejs/react-book/blob/dev/manuscript/getting_started/03_implementing_notes.md):

```javascript
export default ({notes}) => (
```

Still slightly confusing, because the above-linked official docs always have `props` as the function's argument - the above example is obviously a way to extract a particular prop from the props object by putting it in curly braces, but I haven't seen it documented. 

3.
When they move on to introducing state, the main `App` component is converted from a function to a class. I'm on more familiar territory here, but there's one or two niggles. First, where before my constructors have looked like this:

```javascript
constructor() {
    super();
}
```

their's looked like this:

```javascript
constructor(props) {
    super(props);
}
```

In fact, it seems that no one really knows why the docs recommend passing `props` to `super`. The book says:

> We're passing `props` to `super` by convention. If you don't pass it, `this.props` won't get set! 

But as [this Stackoverflow answer](http://stackoverflow.com/a/34995257) says, `this.props` will still be available in later methods in the class even if it's not passed to `super()`. As the answer puts it, although the docs recommend passing `props`,

> However, no reason is provided. We can speculate it is either because of subclassing or for future compatibility.

4.
Second niggle in the `App` class. Ok, this is less a niggle than something I had to learn. In the `render` method of `App`, the `notes` object of the app's `state` is passed as a prop to the `Notes` component:

```javascript
const {notes} = this.state;
[...]
<Notes notes={notes} />
```

This is an ES6 feature called [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). It just grabs the `notes` object from `this.state` and puts it in a `notes` constant.

5.
Next one is to do with binding: the author adds an `addNote` method to the class. From the Wes Bos React for Beginners series I learnt that when a method wants to access `this` it has to be bound in the constructor like so:

```javascript
this.addNote = this.addNote.bind(this);
```

The author doesn't have this, and his method is instantiated like this:

```javascript
addNote = () => {
```

Now, when the author mentions binding here, he says:

>  It would be possible to do that at the `constructor`, `render()`, or by using a specific syntax. I'm opting for the syntax option in this book. 

A quick google comes up with [this article](https://medium.com/@housecor/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56) about different approaches for binding `this`. It looks like the approach used by the SurviveJS author is number 5, "Use Arrow Function in Class Property". As the Medium article says, this has several advantages - mainly lack of repetition and performance enhancements.

6.
Wes Bos's tutorial says we need to make a copy of `state` before updating. It doesn't look like the SurviveJS tut does that:

```javascript
this.setState({
  notes: this.state.notes.concat([{
    id: uuid.v4(),
    task: 'New task'
  }])
});
```

What *I think* is going on here is that since `concat` [doesn't change an existing array, but returns a new array](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), this is equivalent to taking a copy of the existing array, modifying the copy, then assigning the modified copy to the state.

7.
The files have the `.jsx` extension, while some other tuts I've seen use `.js`. This appears to be a [debate](https://www.reddit.com/r/reactjs/comments/4kkrwg/ask_js_or_jsx_extension/) that is not particularly interesting.

Ok - those are just from chapter three of the Getting Started section... More to come.
