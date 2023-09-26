---
published: true
layout: post
comments: true
---

I'm in the process of converting the [React version](https://github.com/drumvc/drumvc.github.io/tree/master/framework/react) of [DruMVC](http://drumvc.com) to use [Redux](https://github.com/reactjs/react-redux). It was pretty straightforward until I got to the bits that used `localStorage`, the browser-based [storage object](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage). The "vanilla"-React version uses the `componentWillMount` and `componentWillUpdate` [lifecycle hooks](https://facebook.github.io/react/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) to get and set, respectively, the `localStorage` data. I.e. when the `App` component loads, it checks if `localStorage` contains any data (in the case of DruMVC, this data is just the configuration of on/off notes for each track), and if so it updates the `state` accordingly. Similarly, when the `state` changes, the `App` component will save it to `localStorage`. You can see the code [here](https://github.com/drumvc/drumvc.github.io/blob/master/framework/react/src/components/App.js).

But now that the `state`, under Redux, is no longer a property of the `App` component, how and when do we call the relevant `getItem` and `setItem` commands?

[This SO answer](https://stackoverflow.com/a/35675304) by Redux co-author [Dan Abramov](https://github.com/gaearon) suggests using `subscribe` to set `localStorage` and to get it by passing it as an argument to `createStore`. His [video](https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage) shows in more detail how to do this. Briefly, following the video, I create a new module, `localStorage.js`, with two methods, `loadState` and `saveState`. In my `index.js` I then pass the loaded state to `createStore`, and set up a [`subscribe` listener](http://redux.js.org/docs/api/Store.html#subscribe), which saves a subsection of the state. 