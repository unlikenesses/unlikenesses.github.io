---
published: true
layout: post
comments: true
---

To fade between pages in [vue-router](https://github.com/vuejs/vue-router) is pretty simple. The `transition` component can be used to wrap the `router-view` component. But there's a slight issue. If we use it as in the [example](https://vuejs.org/v2/guide/transitions.html), the page transitions look a little janky:

```html
<transition name="fade">
    <router-view></router-view>
</transition>
```

CSS:

```javascript
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s
}

.fade-enter, .fade-leave-to {
    opacity: 0
}
```

This is because the default behaviour when transitioning between two elements is to perform both transitions simultaneously. This is where [transition modes](https://vuejs.org/v2/guide/transitions.html#Transition-Modes) come into play. Using the `out-in` mode the first page will completely fade out before the new one fades in:

```javascript
<transition name="fade" mode="out-in" appear>
```

Finally, adding the `appear` attribute, as above, means that the transition is applied to the first page when it loads ([docs](https://vuejs.org/v2/guide/transitions.html#Transitions-on-Initial-Render)).

*Issue:* the transition is not applied to routes using [dynamic route matching](https://router.vuejs.org/en/essentials/dynamic-matching.html). E.g. there is no transition between `/post/1` and `/post/2`. My guess is that this is because, as the manual says:

> when the user navigates from /user/foo to /user/bar, *the same component instance will be reused*.

The solution (following [this StackOverflow answer, thanks!](https://stackoverflow.com/questions/40137100/vue-js-2-0-transition-on-dynamic-route-not-firing)) is to wrap the contents of the page in a `div` with a specific `key` value (in this example based on the route parameter) and wrap that in the `transition` tag:

```html
<transition name="fade" mode="out-in" appear>
    <div class="page-contents" :key="$route.params.id">
        <!-- component code here -->
    </div>
</transition>
```









