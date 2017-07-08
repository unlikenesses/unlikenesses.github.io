---
published: true
layout: post
comments: true
---

![Screenshot]({{ site.baseurl }}public/images/sequencer.jpg)

As an exercise I'm going to build a simple sequencer in React. You can view it in action [here](http://unlikenesses.com/react-sequencer/). The final source code is on [Github](https://github.com/unlikenesses/react-sequencer).

I'll start with [create-react-app](https://github.com/facebookincubator/create-react-app), which provides the necessary initial bootstrapping so we can get going quickly. If you don't already have it installed, run

```
npm install -g create-react-app
```

Then to create a new app:

```
create-react-app sequencer
```

When that's finished, run `npm start` to open the base project in the browser.

The first thing we need to do is consider the structure of the app. At the most basic level we're going to want a `controls` component and an area to contain the pads. So open up `src/App.js` and replace it with this skeleton structure:

```js
import React, { Component } from 'react';
import './App.css';
import Pads from './components/Pads';
import Controls from './components/Controls';

class App extends Component {
  render() {
    return (
        <div className="App">
            <Controls />
            <Pads />
        </div>
    );
  }
}

export default App;
```

All we've done is import two non-existent components, `Pads` and `Controls` and inserted them in the `App` component. For now create a `components` folder in `src` and then create two empty components:

**Pad**
```js
import React from 'react';

class Pads extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="pads">
                Pads
            </div>
        );
    }
}

export default Pads;
```

**Controls**
```js
import React from 'react';

class Controls extends React.Component {
    render() {
        return (
            <div className="controls">
                Controls
            </div>          
        );
    }
}

export default Controls;
```

Let's look at building out the `Pads` component first. We're going to want 8 rows, each row having 8 pads. Because we want to keep track of the state of each pad (on or off), we need to define a state object in the `constructor` of the `Pads` component:

```js
this.state = {
    pads: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ]
}
```

I'm just using an array of 8 rows, each row containing 8 elements which will be `0` or `1` depending on their state. We can use the `map` function to display these in the `render` function:

```js
return (
    <div className="pads">
        {this.state.pads.map((row, rowIndex) => {
            return (
                <div className="row" key={rowIndex}>a
                    {row.map((pad, index) => {
                        return <Pad key={index} />
                    })}
                </div>
            )
        })}
    </div>
);
```

This iterates over each row in the `pads` state, and for each row returns a `div`, in which we map again over each element in that row, for each element returning a `Pad` component. We have to pass the `key` attribute so that React can [identify which elements have changed](https://facebook.github.io/react/docs/lists-and-keys.html#keys) at any given point.

We need to quickly create this `Pad` component in `components/Pad.js`:

```js
import React from 'react';

class Pad extends React.Component {
    render() {
        return (
            <div className="pad"></div>
        );
    }
}

export default Pad;
```

And let's add some styling: in `src/App.css` delete everything and add these styles:

```css
.row {
  clear: both;
}

.pad {
  width: 50px;
  height: 50px;
  float: left;
  margin: 0 5px 5px 0;
  cursor: pointer;
  background: grey;
}
```

The next step is to allow the active state of a pad to be changed when you click on it. In `Pads` create a new function to toggle a pad's state - we'll just `console.log` the output for now:

```js
toggleActive(rowIndex, id) {
    console.log('Changed', rowIndex, id);
}
```

This will take the index of a row and the index of a pad within that row. We'll also need to bind `toggleActive` to `this` so we can reference the state later. So in the constructor put this line:

```js
this.toggleActive = this.toggleActive.bind(this);
```

We then need to pass it - along with `rowIndex`, the pad's index, and the pad's active state - as properties to the `Pad` component, so modify `Pads` like so:

```js
return <Pad 
        key={index} 
        rowIndex={rowIndex} 
        id={index} 
        state={pad}
        toggleActive={this.toggleActive} />
```

Then in `Pad` we just need to add an `onClick` event that calls the `toggleActive` method in its parent component, passing its `rowIndex` and `id`:

```js
render() {
    return (
        <div 
            className="pad"
            onClick={() => this.props.toggleActive(this.props.rowIndex, this.props.id)}>
        </div>
    );
}
```

Now when you click on a pad you should see its coordinates in the console. Now we need to find the appropriate element in the `state` and toggle its value between `0` and `1`. In the `toggleActive` function in `Pads` first we make a copy of the `pads` state and get the current value of the pad that's been clicked:

```js
var pads = [...this.state.pads];
var padActive = pads[rowIndex][id];
```

We're using the [spread operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator) to make a clone of the pads array, then getting the clicked pad's current active state (`0` or `1`). Then we just need to toggle it and update the state:

```js
toggleActive(rowIndex, id) {
    var pads = [...this.state.pads];
    var padState = pads[rowIndex][id];
    if (padState === 1) {
        pads[rowIndex][id] = 0;
    } else {
        pads[rowIndex][id] = 1;
    }
    this.setState({ pads: pads });
}
```

We now need to conditionally add an `active` class to the `Pad` component depending on whether its value is `0` or `1`:

```js
<div 
    className={"pad " + (this.props.state === 1 ? 'active' : '')}
    onClick={() => this.props.toggleActive(this.props.rowIndex, this.props.id)}>
</div>
```

Finally, add a quick `active` style to `App.css` so we can see it in action:

```css
.pad.active {
    background: green;
}
```

Now when you click on a pad, it should turn green, and go back to grey when you click on it again.

Onto the controls... We'll need a piece of state that keeps track of whether the sequencer is playing or not. This needs to go in the root `App` component, so add a `constructor` and put it there. We'll also put a `pos` variable there to keep track of our position in the grid when the sequencer's playing, and a `bpm` value for when we set up our timer:

```js
constructor() {
    super();
    this.state = {
        playing: false,
        pos: 0,
        bpm: 220
    }
    this.togglePlaying = this.togglePlaying.bind(this);
}
```

I've added a binding for the next method we'll need, which will toggle between playing and not-playing. Add this to `App.js`:

```js
togglePlaying() {
    if (this.state.playing) {
        this.setState({ playing: false });
    } else {
        this.setState({ playing: true });
    }
}
```

This grabs the current state, and updates it with its opposite. Pass this method as a property to the `Controls` component, along with the `playing` state:

```js
<Controls playing={this.state.playing} togglePlaying={this.togglePlaying} />
```

Then pick it up in `Controls.js`. I'm adding a line to set the button text according to whether the `playing` state is `true` or `false`:

```js
render() {
    var buttonText = this.props.playing ? 'Stop' : 'Play';
    return (
        <div className="controls">
            <button onClick={() => this.props.togglePlaying()}>{buttonText}</button>
        </div>          
    );
}
```

We now need to be able to set and clear a timer that will call a `tick` method every `x` seconds, where `x` is calculated from our `bpm`. Let's start with the set method, remaining in `App.js`:

```js
setTimer() {
    this.timerId = setInterval(() => this.tick(), this.calculateTempo(this.state.bpm));
}
```

This uses Javascript's `setInterval` method to call `tick()` on a regular basis. We store it in a `timerId` variable so we can clear it when the user clicks Stop. `calculateTempo()` is pretty simple:

```js
calculateTempo(bpm) {
    return 60000 / bpm;
}
```

Our `tick` method will increment the current `pos` and reset it to `0` if it reaches `7`:

```js
tick() {
    var pos = this.state.pos;
    pos++;
    if (pos > 7) {
        pos = 0;
    }
    this.setState({ pos: pos });
    console.log(pos);
}
```

Now hook this all up to the `togglePlaying` method:

```js
togglePlaying() {
    if (this.state.playing) {
        clearInterval(this.timerId);
        this.setState({ playing: false });
    } else {
        this.setTimer();
        this.setState({ playing: true });
    }
}
```

Notice that now if the Play/Stop button is clicked and we are currently playing, we call `clearInterval` on the timer, which will stop it. If we are not currently playing we start the timer. If you run this now you should see the `pos` variable being logged to the console when you click Play. But we want the actual pads to be highlighted when their position corresponds to the root `pos` state. To do this we need to pass the `pos` state down, via the `Pads` component, to the `Pad` component. In `App.js`:

```js
<Pads pos={this.state.pos} />
```

Then in `Pads.js` add the pos to pass down to `Pad`:

```js
return <Pad 
        key={index} 
        rowIndex={rowIndex} 
        id={index} 
        state={pad}
        pos={this.props.pos}
        toggleActive={this.toggleActive} />
```

Finally in `Pad` we can add another class called `playing` depending on whether `pos` corresponds to the pad's position in the grid:

```js
<div 
    className={"pad " + (this.props.state === 1 ? 'active' : '') + (this.props.pos === this.props.id ? ' playing' : '')}
    onClick={() => this.props.toggleActive(this.props.rowIndex, this.props.id)}>
</div>
```

And add that class to `App.css`, as well as a state for when a pad is both active and playing:

```css
.pad.playing {
    background: silver;
}
.pad.active.playing {
    background: lime;
}
```

Now when you click Play the current column will be highlighted.

Our next task is to check, each time `pos` advances, whether or not any pads at that position in the row are active. We can add a method `checkPad()` and call it in `tick()`. Put this at the end of the `tick` method:

```js
this.checkPad();
```

Now we're ready to create the function:

```js
checkPad() {
        
}
```

But here we encounter a problem. Ideally we'd like to iterate over the `pads` state to check which pads are active - but we've put the `pads` state in a child component (`Pads`), so we can't access it from its parent. The solution is to follow the React best practices and [lift the state up](https://facebook.github.io/react/docs/lifting-state-up.html). This means shifting the "source of truth", when it comes to pads, from the `Pads` component to its parent, `App`. So remove the entire `pads` state from the `Pads` component, and add it to the `App` state:

```js
this.state = {
    pads: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    playing: false,
    pos: 0,
    bpm: 220
}
```

We then pass it back down to `Pads`:

```js
<Pads pos={this.state.pos} pads={this.state.pads} />
```

and then in `Pads` change

```js
{this.state.pads.map((row, rowIndex) => {
```

to

```js
{this.props.pads.map((row, rowIndex) => {
```

Now we've moved the `pads` state the `toggleActive` method in `Pads` won't work. Take it and move it to `App`, then add

```js
this.toggleActive = this.toggleActive.bind(this);
```
 
to `App`'s constructor. We then need to pass it back down as a prop to `Pads`:

```js
<Pads pos={this.state.pos} pads={this.state.pads} toggleActive={this.toggleActive} />
```

and modify `Pads` to call it:

```js
return <Pad 
    key={index} 
    rowIndex={rowIndex} 
    id={index} 
    state={pad}
    pos={this.props.pos}
    toggleActive={() => this.props.toggleActive(rowIndex, index)} />
```

You should also now remove the entire `constructor` method from `Pads`. Now everything should work as it did before, except now we have access to `pads` in our root component. This means we can now write our `checkPad` method, which simply loops through the `pads` state and calls a new method, `playSound`, if the `pad` at the current `pos` is active:

```js
checkPad() {
    this.state.pads.forEach((row, rowIndex) => {
        row.forEach((pad, index) => {
            if (index === this.state.pos && pad === 1) {
                this.playSound(rowIndex);
            };
        })
    });
}
```

For simplicity's sake we're going to use the audio API to play a note depending on the row's position in the grid. Of course we could also play a sample instead. Let's set some frequencies in our state ([source](https://en.wikipedia.org/wiki/Piano_key_frequencies)):

```js
frequencies: [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392]
```

Also in the `constructor` we'll initialise the audio API (since this tutorial isn't focused on the API I won't go into details here):

```js
this.audioCx = new (window.AudioContext || window.webkitAudioContext)();
this.gain = this.audioCx.createGain();
this.gain.connect(this.audioCx.destination);
this.gain.gain.value = 1;
```

Then our `playSound` method, which has already been given the `rowIndex`, grabs the appropriate frequency from the `frequencies` array, and plays a sine wave at that frequency:

```js
playSound(rowIndex) {
    var freq = this.state.frequencies[rowIndex];
    var node = this.audioCx.createOscillator();
    var currentTime = this.audioCx.currentTime;
    node.frequency.value = freq;
    node.detune.value = 0;
    node.type = 'sine';
    node.connect(this.gain);
    node.start(currentTime);
    node.stop(currentTime + 0.2);
}
```

There's a couple more things to do: add a control for the BPM, and make the whole thing a bit prettier.

The BPM control is a range `input`, which goes under the `button` tag in the `Controls` component:

```js
<div className="bpm">
    <label>BPM:</label>
    <input 
        type="range" 
        id="bpm" 
        min="1" 
        max="420" 
        step="1" 
        defaultValue={this.props.bpm} 
        onChange={this.props.handleChange} />
    <output>
        { this.props.bpm }
    </output>
</div>
```

It takes two properties passed from `App`: `bpm` and `handleChange`. So back in `App`, first add these as props to the `render` method:

```js
<Controls 
    bpm={this.state.bpm} 
    handleChange={this.changeBpm} 
    playing={this.state.playing} 
    togglePlaying={this.togglePlaying} />
```

Then add the `changeBpm` method:

```js
changeBpm(bpm) {
    this.setState({ bpm: bpm.target.value });
    if (this.state.playing) {
        clearInterval(this.timerId);
        this.setTimer();
    }
}
```

This sets the new `bpm` in state, and if we're already playing, stop the timer (since it's tied to the previous `bpm`) and restart it.

That's it for the functionality. All that remains is to add some CSS polish - if you want, head over to [my raw CSS file](https://raw.githubusercontent.com/unlikenesses/react-sequencer/master/src/App.css) and copy it into `App.css`. 








