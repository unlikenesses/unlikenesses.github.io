---
published: true
layout: post
comments: true
---

So I'm taking a break from Laravel to continue to brush up my Javascript skills, and I thought a small Chrome extension would be ideal. It's pretty embryonic for now, but basically it involves highlighting certain words on a page and calling an API to find more info related to those words, then displaying a tooltip containing this info when the user hovers over them.

I got the extension working ok, but it was a tangled mess of code. So it was time to refactor. I decided at first to try the object literal pattern. At first I wanted to convert the `event.js` file into this notation. I quickly discovered the benefits: what was before an unreadable trail of spaghetti became a neatly demarcated set of functions whose names made the overall intent of the code easy to ascertain at a glance. In the `init` method I placed my listener:

```javascript
init: function(){

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.fn in event) {
            event[request.fn](request,sender,sendResponse);
        }
        return true;
    });

},
```

Basically, the listener is sent as part of its `request` object a function name -- if this function is in the `event` object then it's called. So in my `content.js` file I would send a message to `event.js` with a `request` object containing the property `fn`.

This worked fine, but there was a new problem now that I had modularised the event script. I had a main method (let's call it `getDetails`): this was the function I passed as `fn`, and hence the method that would get called by the listener.

This method, `getDetails`, would then call two more methods, to make two different calls to an API. Each of these would return an object, and `getDetails` would put these two objects into a container object, and send it back with `sendResponse()`.

I'm using jquery's `$.ajax` to make the API calls. Now, before I modularised this script, I would use `.then` to store the result, make *another* `$.ajax` call to the next API endpoint, and in *that* call's `.then` finally call `sendResponse()`. 

But after modularising this script, these chained (or rather embedded) `$.ajax` calls were split into two methods (say, `getDetailsA` and `getDetailsB`), from which I had to return the result of the API calls. And the problem is that a function can't return data from an asychronous call, and synchronous calls (as Chrome's console told me) are now deprecated. 

So, after some googling, came callbacks to the rescue. I added an argument `callback` to each of the API methods (`getDetailsA` and `getDetailsB`). In those methods, after the `$.ajax` call is made, in the `.then` section instead of `return data`, I have `callback(data)`:

```javascript
getDetailsA: function(request,callback) {
    $.ajax({
        url: request.url,
        type: 'GET',
        dataType: 'json'
    })
    .then(function(data){
        // return data;
        callback(data);
    },function(xhr,status,error) {
        console.log('Error');
    });
}
```

Then, when I call this method in `getDetails`, I pass as a second argument a closure that does what I want to do with the data. In this case, what I want to do with the data, is first add it to the container object, then call another method (`getDetailsB`), add the result of that to the same container object, then send it back with `sendResponse()`:

```javascript
getDetails: function(request,sender,sendResponse) {
    var returnObj = {};
    var that = this;
    that.getDetailsA(request,function(data){ 
        returnObj['detailsA'] = data; 
        that.getDetailsB(request,function(data){
            returnObj['detailsB'] = data;
            sendResponse(returnObj);
        });	
    });
},
```
Small projects like this are great for getting your head around little gotchas which you read about in tutorials and manuals, but which until you actually build something remain pretty abstract. One example is the use of callbacks in ajax functions; another was the scope of `this` and its vicissitudes. Although I already knew about it, I hadn't had a chance to see this issue in action, and was pleased that I knew what to do after seeing the error caused by at first having `this.getDetailsB` in the above snippet. I fixed it with a simple `var that = this`, and all was well. 

**Update**

The final Chrome extension is viewable [here](https://github.com/unlikenesses/mp-info).
