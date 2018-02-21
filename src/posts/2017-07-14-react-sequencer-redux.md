---
published: true
layout: post
comments: true
---

In the [previous article](http://unlikenesses.com/2017/07/05/react-sequencer/) we created a simple sequencer in React. In this one we're going to port the state over to [Redux](http://redux.js.org). To do this we need to install the `redux` and `react-redux` packages with `npm install --save redux react-redux`. 

My aim is to take the previous non-Redux version and convert it bit by bit. This might end up being more painful than starting from scratch but it will allow us to see the differences in architecture more clearly. Unlike most tutorials I'm going to start with an [action](http://redux.js.org/docs/basics/Actions.html). For now we'll take something simple, the toggle play button. Create a folder in `src` called `actions` and a file in it called `index.js`:

```javascript
export function togglePlay() {
    return {
        type: 'TOGGLE_PLAY'
    };
}
```

We return the action type `TOGGLE_PLAY` in the action definition `togglePlay`. Since there is only one play button and we are not updating any other properties the `type` of the action is the only information we need to pass. The next task is to define a [reducer](http://redux.js.org/docs/basics/Reducers.html) to handle this action and update the state accordingly. Create another new folder in `src` called `reducers` and a file there called `index.js`. We'll just create one reducer for now, called `controls`, but since we'll be creating more later, we'll also use `combineReducers` to put them all into one reducer:

```javascript
import { combineReducers } from 'redux';

const controls = (state = { playing: false }, action) => {
    switch (action.type) {
        case 'TOGGLE_PLAY':
            return Object.assign({}, state, {
                playing: !state.playing
            });
        default:
            return state;
    }
}

const reducer = combineReducers({
    controls
});

export default reducer;
```

Since the only piece of state we're moving into Redux for now is the `playing` property, that's all we need to set in the reducer's first argument as the default state. We then check if the `action` is `TOGGLE_PLAY`, and if so return a copy of the state with its `playing` property toggled.

The next thing is to create a container which has access to this state. We can re-use the root `App` component we already have. Create a new folder in `src` called `containers` and move `App.js` into there. We'll need to add a couple of `import` statements at the top:

```javascript
import { connect } from 'react-redux';
import { togglePlay } from '../actions';
```

And after the `class` definition, we need a few things:

First, something to pass the Redux state to our container's `props`: 

```javascript
const mapStateToProps = (state, ownProps) => {
    return {
        playing: state.controls.playing
    };
};
```

This grabs the value of the `controls` reducer's state and passes it as a `playing` prop to the container. We also need to get the toggle action and give that as a prop:

```javascript
const mapDispatchToProps = (dispatch) => {
    return {
        togglePlaying: () => {
            dispatch(togglePlay());
        }
    };
};
```

This means that `togglePlaying` will be a new prop available in the `App` container, which when called dispatches the `togglePlay` action we created earlier.

Finally we need to connect it all up to the Redux store:

```javascript
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
```

As a last detail, now that we have these two new props, we can replace the existing ones in the container's invocation of the `Controls` component:

```javascript
<Controls 
    bpm={this.state.bpm} 
    handleChange={this.changeBpm} 
    playing={this.props.playing} 
    togglePlaying={this.props.togglePlaying} />
```

The next step to get this working is to wrap the `App` container in a `Provider` component which [passes the store](http://redux.js.org/docs/basics/UsageWithReact.html#passing-the-store) to all container components. So we import a few modules:

```javascript
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import App from './containers/App';
```

... create the store:

```javascript
let store = createStore(reducer);
```

... and render the `App` component within the `Provider`:

```javascript
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
    );
```

One last thing: we need to watch for when the `props.playing` property changes and set or clear the timer as appropriate. We can do this with the `componentWillReceiveProps` lifecycle hook. Add this in `App`:

```javascript
componentWillReceiveProps(nextProps, prevProps) {
    if (nextProps.playing !== this.props.playing) {
        this.togglePlaying(this.props.playing);
    }
}
```

Now the app should be working as before.

Let's do the same with the BPM control. Add a new action to the `actions/index.js` file:

```javascript
export function changeBpm(bpm) {
    return {
        type: 'CHANGE_BPM',
        bpm
    }
}
```

Unlike the `togglePlay` action, this one takes a `bpm` value and returns it as a property of the action. In our reducers file we can add this as a `case` to our `switch` statement:

```javascript
case 'CHANGE_BPM': {
    return Object.assign({}, state, {
        bpm: action.bpm
    });
}
```

We also need to add the default state to the reducer:

```javascript
const controls = (state = { playing: false, bpm: 220 }, action) => {
```

Then add the appropriate props to `App`. In `mapStateToProps` add the new `bpm` prop:

```javascript
return {
    playing: state.controls.playing,
    bpm: state.controls.bpm
};
```

Then in `mapDispatchToProps` add the new action:

```javascript
return {
    togglePlaying: () => {
        dispatch(togglePlay());
    },
    changeBpm: (bpm) => {
        dispatch(changeBpm(bpm));
    }
};
```

We can then update our invocation of `Controls` so that it's only using the Redux props:

```javascript
<Controls 
    bpm={this.props.bpm} 
    handleChange={this.props.changeBpm} 
    playing={this.props.playing} 
    togglePlaying={this.props.togglePlaying} />
```

And in the `Controls` component modify the `onChange` handler to pass the input's value:

```javascript
onChange={(e) => props.handleChange(e.target.value)}
```

Finally, back in `App` we can update our `componentWillReceiveProps` hook:

```javascript
if (nextProps.bpm !== this.props.bpm) {
    this.changeBpm(nextProps.bpm);
}
```

If we remove the state update and modify our reference to `playing` in `changeBpm`, it should now be working as previously:

```javascript
changeBpm(bpm) {
    if (this.props.playing) {
        clearInterval(this.timerId);
        this.setTimer();
    }
}
```

We can now remove `playing` and `bpm` from the `App` component's state, and update `setTimer` to reference `this.props.bpm` instead of `this.state.bpm`.

Now to take care of the pads. First let's create an action `togglePad`:

```javascript
export function togglePad(row, col) {
    return {
        type: 'TOGGLE_PAD',
        row,
        col
    }
}
```

This takes a row and column as well as the action type. We can now create a reducer (in the same `reducers/index.js` file) which has an initial `pads` state and a case to handle toggling a pad - both taken from the `App` component:

```javascript
const main = (state = { pads: [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ]}, action) => {
    switch (action.type) {
        case 'TOGGLE_PAD':
            let pads = [...state.pads];
            let padState = pads[action.row][action.col];
            if (padState === 1) {
                pads[action.row][action.col] = 0;
            } else {
                pads[action.row][action.col] = 1;
            }
            return Object.assign({}, state, { pads });
        default:
            return state;
    }
}
```

Don't forget to add `main` to the `combineReducers` method.

Now add the new `pads` state as a prop to `App` in `mapStateToProps`:

```javascript
pads: state.main.pads
```

and finally pass it to the `Pads` component:

```javascript
pads={this.props.pads}
```

Hopefully the pads will be rendering ok but now they're coming from the Redux store. We can now add the new reducer to our `mapDispatchToProps` method in `App`. 

```javascript
togglePad: (row, col) => {
    dispatch(togglePad(row, col));
}
```

and reference it in our invocation to `Pads`:

```javascript
toggleActive={this.props.togglePad}
```

We also need to import it at the top:

```javascript
import { togglePlay, changeBpm, togglePad } from '../actions';
```

We can also now delete `toggleActive` from `App` (and its binding in the `constructor`).

Now just update the `checkPad` method to loop over `this.props.pads` instead of `this.state.pads` and everything should be working as usual. We can also now remove `pads` from the state in `App`.

The final source code is [on GitHub](https://github.com/unlikenesses/react-sequencer-redux).



