---
published: false
layout: post
comments: true
---

This is a tutorial on how to get [JSON Web tokens](https://jwt.io) working so that React can securely communicate with a back-end API. For the purposes of this tutorial I'll be using [Laravel](https://laravel.com) 5.4 for the back-end and [React](https://facebook.github.io/react) for the front-end. The finished code can be seen [here](https://github.com/unlikenesses/react-laravel-jwt).

#### Getting started

First thing is to create a new Laravel project - I do this in the command line to create a project called `jwt`:

```
laravel new jwt
```

We want a users table; we won't be using most of the Laravel auth scaffolding, but let's use it anyway to set up the users table quickly:

```
php artisan make:auth
```

For the API let's just have one resource, `clients`. For this we'll set up the model and migration with `artisan`:

```
php artisan make:model Client -m
```

In the `clients` migration add a few fields - I've added `name`, `address` and `telephone`:

```php
public function up()
{
    Schema::create('clients', function (Blueprint $table) {
        $table->increments('id');
        $table->string('name');
        $table->text('address');
        $table->string('telephone');
        $table->timestamps();
    });
}
```

Then migrate to set up these tables (I'm assuming you've created a database for this project & configured Laravel to use it in the `.env` file):

```
php artisan migrate
```

And let's seed the database. First create a `ClientFactory.php` file in the `database/factories` folder. This will use [Faker](https://github.com/fzaninotto/Faker) to generate fake details for each client:

```php
$factory->define(App\Client::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'address' => $faker->address,
        'telephone' => $faker->phoneNumber
    ];
});
```

Then in `seeds/DatabaseSeeder.php` we can call this factory in the `run` method to create 50 clients:

```php
factory(App\Client::class, 50)->create();
```

Now run `php artisan db:seed` and we have our dummy data.

#### Setting up JWT

We'll be using [jwt-auth](https://github.com/tymondesigns/jwt-auth) to get JWT authentication working with Laravel. Follow the [installation instructions](https://github.com/tymondesigns/jwt-auth/wiki/Installation). The project's [creating tokens](https://github.com/tymondesigns/jwt-auth/wiki/Creating-Tokens) page gives us a basic method to authenticate a user. For now let's test it in an API development tool like [Postman](https://www.getpostman.com). Create a new controller:

```
php artisan make:controller FrontEndUserController
```

I'm including a quick method to create a user so we can attempt logins:

```php
public function signUp(Request $request) 
{
    $user = User::create(['email' => $request->email, 'password' => bcrypt($request->password)]);
}
```

In our `routes/api.php` file we can create a route for this and another one for when the user tries to sign in:

```php
Route::post('/signup', 'FrontEndUserController@signUp');
Route::post('/signin', 'FrontEndUserController@signIn');
```

If we now use Postman to make a POST request to `[project_path]/api/signup`, with an email and password, it should create the new user (check this in the database. If it doesn't work you might need to make the `username` field nullable).

Now for the magic - the sign in method using JWT. We're just going to re-use the method giving in the [docs](https://github.com/tymondesigns/jwt-auth/wiki/Creating-Tokens) mentioned above:

```php
public function signIn(Request $request) 
{
    try {
        if (! $token = JWTAuth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return response()->json(['error' => 'invalid_credentials'], 401);
        }
    } catch (JWTException $e) {
        return response()->json(['error' => 'could_not_create_token'], 500);
    }

    return response()->json(compact('token'));
}
```

If you now POST to the `signin` route with the email and password you created before, you should get back a token similar to this:

```js
{"token":"eyJ0eXAiOiJKiV1QiLCJhbGcOiJUzI1NiJ9I.yJzdWaiOjIsImlzcyI6ImIeh0dHA6Ly9sb2hbGhvc3QvbGVhNcm4vnd0L3B1YmxpYyhcGkvMc2lnbmluIiw9iaWF0IjoxTAyMzY4NNjM0LCJleH5AiOjE1MDIzNzIyzQsImjjiZiI6MTUwMIM2ODYzNCwianRpjoiSXZzRGZCFZTNpVXVUYzVsVJ9.IYZWDWtsyIo_N-dIERPwg2Cc72XxIMVaoXbL2Yv9RUL"}
```

#### Calling the API

Let's test the authentication is working. Create a `ClientController`:

```
php artisan make:controller ClientController
```

In that for now we'll just create an `index` method that return all clients (not ideal for an API but this tutorial is more about JWTs than developing APIs):

```php
public function index() 
{
    return Client::all();
}
```

In the `api.php` routes we'll create a new group that uses the built-in `jwt.auth` middleware:

```php
Route::group(['middleware' => 'jwt.auth'], function() {
    Route::get('/clients', 'ClientController@index');
});
```

We'll need to register this middleware to the `$routeMiddleware` array in `app/Http/Kernel.php`:

```php
'jwt.auth' => \Tymon\JWTAuth\Middleware\GetUserFromToken::class
```

Now if you make a GET call in Postman to `[project_path]/api/clients` you should get this error:

```js
{"error":"token_not_provided"}
```

To remedy this, pass an authorization header, with the `key` of `Authorization` and `value` of `Bearer [token]` (copy the token you created earlier). Now run the GET call again and you should get the list of clients back as JSON. (NB. If you get a `token_expired` error just call the previous POST endpoint and get a new token.)

#### Setting up React

First let's remove the `vue` line from `devDependencies` in `package.json`, and install the existing npm dependencies with `npm install`. Then install react and react-dom:

```
npm install --save react react-dom
```

Now remove any references to Vue (this won't be necessary in Laravel 5.5). Delete `Example.vue` from the `resources/assets/js/components` folder. Then in `resources/assets/js/app.js`, replace all the VueJS code with this:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

This simply imports the React modules, imports our root component and attaches it to a `div` with the id `root` on our homepage. So now create the `components/App.js` file and put some temporary code there:

```js
import React from 'react';

class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <h1>Hello</h1>
        );
    }
}

export default App;
```

Now we need to put that `#root` div in `home.blade.php` - put it anywhere you want. I just stuck it in the middle of the Bootstrap div-nest:

```html
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-body">
                    <div id="root"></div>
                </div>
            </div>
        </div>
    </div>
</div>
```

And modify the base route to point here (in `routes/web.php`):

```php
Route::get('/', function () {
    return view('home');
});
```

Now to compile the React code with Laravel's Mix we need to modify the `webpack.mix.js` file:

```js
mix.react('resources/assets/js/app.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css');
```

Now run `npm run watch` and it'll compile the JavaScript - point your browser at `[project-path]` and you should see the "Hello" string on the homepage.

#### React Sign-In page and routing

(NB. I had to follow the instructions [here](https://github.com/JeffreyWay/laravel-mix/issues/76) to get the spread operator working with Laravel Mix.)

For this example the React app will have 3 pages: Home, Login and Clients. We'll use [React Router 4](https://github.com/ReactTraining/react-router) to set up the routing. We'll want Home and Login to be accessible to non-logged in users, but only logged-in users can view the Clients page. In this section I'll detail setting up the routing and the login page.

First let's install the router: `npm install react-router-dom --save`. Then in `App.js` we can import the modules we need:

```js
import { HashRouter, Route, Switch, NavLink, Redirect } from 'react-router-dom';
```

Now we re-write its `render` method. We'll use react-router's `HashRouter` to contain our routes -- see their documentation for more info:

```js
<HashRouter>
    <div>
        <Menu />
        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' render={(props) => <Login />} />
        </Switch>
    </div>
</HashRouter>
```

You'll notice that the `Login` route uses a slightly different method to render the component - this is because we'll be passing some properties to it later. There's also a new `Menu` component there at the top - we can add this under the `App` class declaration in `App.js`:

```javascript
const Menu = (props) => (
    <ul>
        <li>
            <NavLink exact activeClassName="active" to="/">
                Home
            </NavLink>
        </li>
        <li>
            <NavLink exact activeClassName="active" to="/login">
                Login
            </NavLink>
        </li>
        <li>
            <NavLink exact activeClassName="active" to="/clients">
                Clients
            </NavLink>
        </li>
    </ul>
);
```

The `Clients` link is in there but we can ignore it for now. One last thing in `App.js`: import the `Home` and `Login` components:

```js
import Home from './Home';
import Login from './Login';
```

Now let's create the `Home` component - it can really be anything you like. My one just prints the word "Home":

```js
import React from 'react';

const Home = () => (
    <h1>Home</h1>
);

export default Home;
```

The `Login` component is more interesting. Create a basic React class. This will be what React calls a ["controlled component"](https://facebook.github.io/react/docs/forms.html), i.e. a component containing a form with fields whose values are controlled by the component's state. So in our component's constructor, let's set up the intial form state (there'll be 2 fields, `email` and `password`):

```js
this.state = {
    email: '',
    password: ''
};
```

Then in the `render` method we have a simple form (it's using some Bootstrap class names for simple styling):

```js
<form onSubmit={this.handleSubmit}>
    <div className='form-group'>
        <input
            name='email'
            type='email'
            className='form-control' 
            placeholder='Email'
            value={this.state.email}
            onChange={this.handleChange} />
    </div>
    <div className='form-group'>
        <input 
            name='password'
            type='password' 
            className='form-control' 
            placeholder='Password'
            value={this.state.password}
            onChange={this.handleChange} />
    </div>
    <div className='form-group'>
        <input type='submit' className='btn' value='Login' />
    </div>
</form> 
```

As you can see there's an `email` field and a `password` field, both of whose values are set by the component's state. Both fields also have an `onChange` attribute, which calls the component's `handleChange` method. This will simply update the state when the user types in a given field:

```js
handleChange(event) {
    const name = event.target.name;
    this.setState({
        [name]: event.target.value
    });
}
```

Because it checks for the field's `name` attribute we can use the same method for both input fields. Don't forget to add this method to the constructor:

```js
this.handleChange = this.handleChange.bind(this);
```

We also have an `onSubmit` attribute for the form, which calls a method called `handleSubmit`. We want this to call the Laravel `api/signin` route we created earlier. We can use [Axios](https://github.com/mzabriskie/axios) for this since it's already part of Laravel's `package.json`:

```js
handleSubmit(event) {
    event.preventDefault();
    axios.post('/api/signin', {
        email: this.state.email,
        password: this.state.password
    })
    .then((response) => {
        const token = response.data.token;
        console.log(token);
    })
    .catch((error) => {
        console.log(error);
    });
}
```

All this does is `POST` the component's email and password state to our endpoint, and logs the token to the console. (Bind this in the constructor: `this.handleSubmit = this.handleSubmit.bind(this);`.) If you try running this now and logging in (and providing you use the correct email/password) you should see a JWT token in the console.

Somewhere we'll need to keep track of whether a user is logged in or not. We can do that in a number of ways - for the purposes of this project I'll keep it simple and use the `App` component's state. So in its constructor, add this:

```js
this.state = {
    isAuthenticated: false,
    token: null
};
```

We'll also need a method to set these properties when a login is successful (this is also in `App`):

```js
authenticate(token) {
    this.setState({
        isAuthenticated: true,
        token: token
    })
}
```

(Bind this method in the constructor: `this.authenticate = this.authenticate.bind(this);`).

Now we can pass these as properties to the `Login` component:

```js
<Route exact path='/login' render={(props) => <Login authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated} {...props} />} />
```

Now in the `Login` component we can modify the `axios` call to pass the token to the parent's `authenticate` method:

```js
.then((response) => {
    const token = response.data.token;
    this.props.authenticate(token);
})
```

While we're here we can also check to see if a user is logged in and not display the form if so:

```js
{this.props.isAuthenticated ?
    <p>You are already logged in.</p>
    :
    <form onSubmit={this.handleSubmit}>
        // Form stuff here
    </form> 
}
```

Finally let's add a `Logout` link to the menu:

```js
{props.isAuthenticated ?
    <li>
        <a onClick={props.logout}>
            Logout
        </a>
    </li>
    :
    null    
}
```

This will check if `isAuthenticated` is `true` - if so, show the Logout link with an `onClick` handler. We'll need to pass these properties to the `Menu` in the router:

```js
<Menu isAuthenticated={this.state.isAuthenticated} logout={this.logout} />
```

...and create the `logout` method in `App`:

```js
logout() {
    this.setState({
        isAuthenticated: false,
        token: null
    });
}
```

As you can see this just resets the state to its original values. As usual, bind this method in the constructor: `this.logout = this.logout.bind(this);`.

#### Private routes

We have a link to the `clients` page in our menu, but we haven't set up the route or the component yet. For creating private routes (i.e. routes that can only be accessed by logged-in users) I'm following the example in the official [react-router documentation](https://reacttraining.com/react-router/web/example/auth-workflow). This uses a bespoke `PrivateRoute` component which will either display the component passed to it (in our case, `Clients`) or, if not logged in, it will redirect to a given route. My version is the same but with a couple of small tweaks. First let's set up the route in the `App` component:

```js
<PrivateRoute exact path='/clients' component={Clients} isAuthenticated={this.state.isAuthenticated} token={this.state.token} />
```

And here's my version of the `PrivateRoute` component (which I also place in `App.js`):

```js
const PrivateRoute = ({ component: Component, isAuthenticated, token, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated ? (
            <Component {...props} {...rest} token={token} isAuthenticated={isAuthenticated} />
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
        )
    )} />
);
```

It's not the most readable of code so I'll go through it bit by bit. The first thing to note is the arguments it takes:

```js
({ component: Component, isAuthenticated, token, ...rest })
```

The first three arguments correspond to the three properties we pass it in our router. (The first parameter, with a colon, renames the `component` parameter to `Component` - this is necessary [I presume] because JSX considers tags that begin with a lower-case letter to be an HTML tag rather than a React component.) We need to pass in the `isAuthenticated` state to know whether or not to redirect to the login page. And we need the `token` to give to the `Clients` component when we finally build it. The last parameter, `...rest` uses the [rest parameter syntax](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/rest_parameters) to gather up any remaining properties.

Moving into the body of the component itself, it's comprised of a single `<Route>` component. It uses the [render](https://reacttraining.com/react-router/web/api/Route/render-func) function to allow us to programmatically decide on which component is rendered on this route. The `render` function takes the [route props](https://reacttraining.com/react-router/web/api/Route/Route-props) as an argument and if the user is authenticated (i.e. if `isAuthenticated` is true), it renders the component passed to `PrivateRoute` (passing it the `token` prop so we can make calls to the API later). If the user is not authenticated it renders a [Redirect component](https://reacttraining.com/react-router/web/api/Redirect). This uses the [to object](https://reacttraining.com/react-router/web/api/Redirect/to-object) to give the location we're redirecting to (in this case the `login` route) and where we're coming from (using the `Route` component's property [`location`](https://reacttraining.com/react-router/web/api/location)). This can be useful to display messages on the login page.

Now we can add a private route pointing to the `Clients` component. Add this line within the `Switch` block:

```js
<PrivateRoute exact path='/clients' component={Clients} isAuthenticated={this.state.isAuthenticated} token={this.state.token} />
```

This passes the three props - `component`, `isAuthenticated` and `token` - to the `PrivateRoute` component. Now we need to create....

#### The Clients component

Create a new React component called `Clients`. We'll need some state to hold the clients, so let's put that in the constructor:

```js
constructor() {
    super();
    this.state = {
        clients: []
    }
}
```

Our `render` method is pretty simple - we just `map` over the `clients` array and print out each client's details:

```js
render() {
    return (
        <div>
            <h1>Clients</h1>
            { this.state.clients.map((client, index) => {
                return (
                    <div className="client" key={index}>
                        {client.name}<br />
                        {client.address}<br />
                        {client.telephone}
                        <hr />
                    </div>
                )
            })}
        </div>
    );
}
```

Now we just need to make a call to the API when the component mounts to request the clients. We'll use Axios again, and pass the `Authorization` headers:

```js
componentWillMount() {
    this.getClients();
}

getClients() {
    const token = this.props.token;
    axios.get('/api/clients', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then((response) => {
        const clients = response.data;
        this.setState({ clients });
    })
    .catch((error) => {
        console.log(error);
    });
}
```

As you can see we grab the `token` from the component's `props`, and if the call is successful we update the component's `state`. Now just `import` this component in `App` and try it out. When you first click on the `Clients` link in the nav you should be redirected to the Login page. After logging in and clicking the `Clients` link you should be able to see the list of clients returned by the API.

#### Cleaning up

There's more to do, but first let's tidy a few things up. First, it would be good if, on a successful login, the Login component redirected to the page the user originally tried to access. Again this code is heavily indebted to the [official docs](https://reacttraining.com/react-router/web/example/auth-workflow) for React-Router. All we need to do is add a check at the beginning of the `render` method of the `Login` component. If we're already logged in, and if we have a `location` property (i.e. if we've been redirected here from another, protected, page), then just render a `Redirect` component pointing to that page. First import the `Redirect` component at the top of the `Login` component:

```js
import { Redirect } from 'react-router-dom';
```

Then at the beginning of the `render` method, add this conditional:

```js
if (this.props.isAuthenticated && this.props.location.state !== undefined) {
    return (
        <Redirect to={this.props.location.state.from} />
    );
}
```

Now when you click on the Clients link, then login, you should be redirected back to the Clients page.

What about if you enter false credentials? If you try to log in now with the wrong username / password you will get an error like this:

>Error: Request failed with status code 401

This isn't surprising since, if you recall, earlier we set up the API `signIn` endpoint to do just this:

```php
return response()->json(['error' => 'invalid_credentials'], 401);
```

`401` is the HTTP status code that means [`Unauthorized`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401). So in our `axios` call we could check for this code and if it's present show an appropriate error message. First let's add an `error` property to the `state` of `Login`:

```js
this.state = {
    email: '',
    password: '',
    error: ''
};
```

Then we can change the `catch` part of our `axios` call to check for the `401` status, and update the `error` state accordingly:

```js
.catch((error) => {
    const status = error.response.status
    if (status === 401) {
        this.setState({ error: 'Username or password not recognised.' });
    }
});
```

Finally in our `render` method we check to see if the error is an empty string - if not just display it in a `p` tag with a Bootstrap css helper class:

```js
<h1>Login</h1>
{this.state.error !== '' ?
    <p className="text-danger">{this.state.error}</p>
    :
    null
} 
```

Now when you try to log in with false credentials you will get this message. But we do need to reset it when login is successful otherwise the message will remain on the screen. So add a line to do this just before we authenticate:

```js
.then((response) => {
    this.setState({ error: '' });
    const token = response.data.token;
    this.props.authenticate(token);
})
```

#### Refreshing expired tokens

By default the jwt-auth package expires its tokens after 1 hour. We need a way to check whether the current token has expired, and if so, to refresh it. For the purposes of testing it might be helpful to set the expiry time to a smaller value - this can be done in `config/jwt.php`. I've set the `ttl` value ('time to live') to `1` (i.e. one minute). Don't forget to set it back to `60` (or whatever you want) when you've finished testing.

Now, when a token has expired, if we try to make a call to the `clients` API endpoint we'll get a `401` error, just like when the user is not logged in. So to distinguish between these two cases, we'll check that a) the user *is* logged in, and b) we get a `401` response from our API. If both of these are `true`, then we can ask to refresh the token. 

First let's set up the Laravel API side of things. We want a new endpoint, `refreshToken`. So in the `api.php` routes file, add this line under the `signup` and `signin` routes:

```php
Route::get('/refreshToken', 'FrontEndUserController@refreshToken');
```

Then in `FrontEndUserController` we'll add the `refreshToken` method:

```php
public function refreshToken() 
{
    $token = JWTAuth::getToken();

    try {
        $token = JWTAuth::refresh($token);
    } catch (JWTException $e) {
        return response()->json(['error' => 'could_not_create_token'], 500);
    }

    return response()->json(compact('token'));
}
```

This is pretty self-explanatory - get the current token, try to refresh it and if this succeeds return it as JSON. That's it for the server-side stuff.

Now, back on the client-side, we need to update our `getClients` method to make that check I talked about at the start of this section. So at the end of the `axios` call add this `catch` method:

```js
.catch((error) => {
    const status = error.response.status;
    if (status === 401 && this.props.isAuthenticated) {
        // logged in but invalid jwt
        this.props.refresh();
    }
});
```

This just checks that we're getting a `401` status response and that the user has been authenticated: if so, call a `refresh` method that sits in the parent component. Now go to the `App` component and add this method:

```js
refresh() {
    return axios.get('/api/refreshToken', {
        headers: { 'Authorization': 'Bearer ' + this.state.token }
    })
    .then((response) => {
        const token = response.data.token;
        this.authenticate(token);
    })
    .catch((error) => {
        console.log('Error!', error);
    });
}
```

(Don't forget to bind this method in the constructor, and to pass it as a prop via the `PrivateRoute`: `refresh={this.refresh}`.) Here we're making a call to our recently-created `refreshToken` endpoint (passing our app's current token in the header). When we get the token back, we just update the state's `token` value with the `authenticate` method we created a while ago. Since this `token` value is passed as a prop to the `Clients` component, it will have the new token value automatically. But we still need to check for this change and re-call the `clients` endpoint with the new token. We can do this using the [`componentDidUpdate`](https://facebook.github.io/react/docs/react-component.html#componentdidupdate) lifecycle hook. 

So back in the `Clients` component, add this hook:

```js
componentDidUpdate(prevProps, prevState) {
    if (prevProps.token !== this.props.token) {
        this.getClients();
    }
}
```

All this does is to see if the new token property is different from the previous token property: if it is, we need to get our client list again.

#### Persisting tokens with localStorage

As the app currently stands, if you refresh the page the token will be erased and the user will have to log in again. We need a way to persist the token between sessions - for this we'll use [localStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage). We need to give the value a key name - let's call it `jwt`. In the `authenticate` method in `App.js` we just need to use the `localStorage.setItem` command to persist the token to the browser:

```js
localStorage.setItem('jwt', token);
```

You can check the token's being saved using the Chrome (under Application -> Local Storage) or Firefox (under Storage) dev-tools. Now, whenever the app loads, all we need to do is to check `localStorage` for the `jwt` key, and if it exists set its value to be our app's token. As usual we can do this with the `componentWillMount` lifecycle hook:

```js
componentWillMount() {
    const lsToken = localStorage.getItem('jwt'); 
    if (lsToken) {
        this.authenticate(lsToken);
    } 
}  
```

If there's no token in there, `getItem` will return `null` and nothing will happen. If there is one there, we call `authenticate` which updates the app's `state` with the saved token. 

Finito. This has been a tutorial on setting up JWT authentication to allow a React app to communicate with a Laravel API. All the code is available [here](https://github.com/unlikenesses/react-laravel-jwt). 



