---
published: true
layout: post
comments: true
---

Some notes on setting up Laravel with React.

1. Remove the reference to Vue from `devDependencies`.

2. `npm install`.

3. `npm install --save react react-dom`.

4. Replace the code in `resources/assets/js/app.js` with the root React boilerplate (importing the root `App.js` component and rendering it to the DOM).

5. Replace `components/Example.vue` with `App.js`.

6. Set up the root div in the home view and route to it if necessary.

7. In `webpack.mix.js`, replace `mix.js` with `mix.react`.

8. `npm run watch`.



