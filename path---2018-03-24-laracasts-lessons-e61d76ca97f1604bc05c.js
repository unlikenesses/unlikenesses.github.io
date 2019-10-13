webpackJsonp([9808220947040],{352:function(e,a){e.exports={data:{post:{html:'<p><a href="https://laracasts.com/series/lets-build-a-forum-with-laravel">Let\'s Build a Forum with Laravel and TDD</a> is a mega-tutorial (102 lessons) by Jeffrey Way on his <a href="https://laracasts.com">Laracasts</a> site. It\'s a massive, time-intensive beast that contains lots of useful info, and not least gives the opportunity to watch someone build a fairly complex website from scratch. But its size means that a lot of little tricks and tips are hidden away inside the videos. While each lesson\'s title reflects a particular feature Jeffrey Way wants to build, I found that there are also particular technical nuggets of info to be found among the broader strategies. So this is a list of any little snippets that cropped up in the course, just minor points I didn\'t know or found useful. This post contains 50 tips, covering lessons 1-42. More coming soon!</p>\n<h3>1.</h3>\n<p>When making a model in artisan, and <code>-mr</code> to make the migration (<code>m</code>), and a resourceful controller (<code>r</code>). Or use <code>c</code> for a plain controller. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/1">Source</a>)</p>\n<h3>2.</h3>\n<p>For testing we can use an SQLite database in memory. In <code>phpunit.xml</code> set <code>DB_CONNECTION</code> to <code>sqlite</code> and <code>DB_DATABASE</code> to <code>:memory:</code>. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/2">Source</a>)</p>\n<h3>3.</h3>\n<p><code>latest()</code> is an <a href="https://github.com/illuminate/database/blob/master/Query/Builder.php#L1487">Eloquent relation</a> that is basically an alias for <code>orderBy(\'created_at\', \'desc\')</code>. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/2">Source</a>)</p>\n<h3>4.</h3>\n<p>Put code common to all tests in a test file in a <code>setUp</code> method that calls <code>parent::setUp();</code>. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/3">Source</a>)</p>\n<h3>5.</h3>\n<p>Call <code>diffForHumans()</code> on Carbon instances (like <code>created_at</code> fields in Eloquent models) to output something like "2 days ago". (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/3">Source</a>)</p>\n<h3>6.</h3>\n<p>Add the <code>--filter</code> flag to <code>phpunit</code> to run only one test. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/4">Source</a>)</p>\n<h3>7.</h3>\n<p>Instead of specifying mass-assignable fields in a model with <code>fillable</code>, you can set the <code>$guarded</code> variable to block specific fields, or set it to an empty array to make every field assignable. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/4">Source</a>)</p>\n<h3>8.</h3>\n<p><code>back()</code> is a <a href="https://laravel.com/docs/5.6/responses#redirects">helper function</a> to return the user to the previous location. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/4">Source</a>)</p>\n<h3>9.</h3>\n<p>Note the distinction between <code>create</code> and <code>make</code> model factory methods: <code>create</code> persists the model to the database, while <code>make</code> only stores it in memory. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/4">Source</a>)</p>\n<h3>10.</h3>\n<p>The <code>raw</code> model factory method returns an array of the model data, rather than the Eloquent model. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/6">Source</a>)</p>\n<h3>11.</h3>\n<p>Add <code>only()</code> to restrict middleware to particular methods in a controller. E.g. in the constructor:</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token variable">$this</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">middleware</span><span class="token punctuation">(</span><span class="token string">\'auth\'</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">only</span><span class="token punctuation">(</span><span class="token string">\'store\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>(<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/6">Source</a>)</p>\n<p>Or use <code>except()</code> for the opposite. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/8">Source</a>)</p>\n<h3>12.</h3>\n<p>Use the <a href="https://laravel.com/docs/5.6/validation#rule-exists"><code>exists</code> validation rule</a> to check whether a given field exists in a specified database table. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/10">Source</a>)</p>\n<h3>13.</h3>\n<p>You can use <code>whereSlug</code> and <code>whereId</code> as aliases for <code>where(\'slug\', $slug)</code> and <code>where(\'id\', $id)</code> in Eloquent calls. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/11">Source</a>)</p>\n<h3>14.</h3>\n<p>To change the key used in route-model binding, override the <code>getRouteKeyName</code> method in your model. E.g.</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token keyword">public</span> <span class="token keyword">function</span> <span class="token function">getRouteKeyName</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token string">\'slug\'</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>(<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/11">Source</a>)</p>\n<h3>15.</h3>\n<p>If you need some data to be passed to all your views, you don\'t need to use a view composer, you can use the much simpler <a href="https://laravel.com/docs/5.6/views#sharing-data-with-all-views"><code>share</code></a> method. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/13">Source</a>)</p>\n<h3>16.</h3>\n<p>JW says that he uses "query objects" - classes that correspond to a complex SQL query - in the Laracasts codebase. E.g. <code>App/Queries/ThreadsQuery</code>. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/15">Source</a>)</p>\n<h3>17.</h3>\n<p>You can <a href="https://laravel.com/docs/5.6/requests#retrieving-input">retrieve only a portion of the request data</a> using <code>$request->only([\'foo\', \'bar\'])</code>. It saves requesting everything then filtering through it. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/15">Source</a>)</p>\n<h3>18.</h3>\n<p>Performing <code>count()</code> on a relationship given as a <a href="https://laravel.com/docs/5.6/eloquent-relationships#defining-relationships">dynamic property</a> (e.g. <code>$thread->replies->count()</code>) requires a redundant SQL query that will fetch all the replies. If we substitute the method for the property (e.g. <code>$thread->replies()->count()</code>) the SQL query only gets the count of the replies. As the <a href="https://laravel.com/docs/5.6/eloquent-relationships#querying-relations">docs say</a>: "all types of Eloquent relationships also serve as query builders, allowing you to continue to chain constraints onto the relationship query before finally executing the SQL against your database". (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/16">Source</a>)</p>\n<h3>19.</h3>\n<p>The Eloquent <code>load</code> method permits <a href="https://laravel.com/docs/5.6/eloquent-relationships#lazy-eager-loading">"lazy eager loading"</a>, i.e. eager loading a relationship after the model has been retrieved. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/16">Source</a>)</p>\n<h3>20.</h3>\n<p>The Eloquent <a href="https://laravel.com/docs/5.6/eloquent-relationships#counting-related-models"><code>withCount</code> method</a> is a way of counting the results of a relationship without loading them. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/16">Source</a>)</p>\n<h3>21.</h3>\n<p>Eloquent <a href="https://laravel.com/docs/5.6/eloquent#global-scopes"><code>global query scopes</code></a> define constraints applicable to all queries on that model. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/16">Source</a>)</p>\n<h3>22.</h3>\n<p>Laravel\'s <a href="https://laravel.com/docs/5.6/helpers#method-str-plural"><code>str_plural</code> helper</a> returns the appropriate plural form of a string. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/16">Source</a>)</p>\n<h3>23.</h3>\n<p>The <a href="https://github.com/illuminate/database/blob/16980ffecb15e47d0a1942a64d3cc548e22f709c/Query/Builder.php#L1698-L1706"><code>toSql</code> method</a> returns the SQL query of a given Eloquent query. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/17">Source</a>)</p>\n<h3>24.</h3>\n<p>The whole section on <a href="https://laravel.com/docs/5.6/eloquent-relationships#polymorphic-relations">polymorphic relations</a> was new to me. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/18">Source</a>)</p>\n<h3>25.</h3>\n<p>In database migrations, create a unique combined index with <a href="https://laravel.com/docs/5.6/migrations#indexes"><code>unique</code></a>; e.g. <code>$table->unique([\'user_id\', \'favorited_id\', \'favorited_type\']);</code>. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/18">Source</a>)</p>\n<h3>26.</h3>\n<p>JW: "One of the downsides" of Eloquent is its tendency to hide the presence of multiple SQL queries when accessing relationships between models. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/19">Source</a>)</p>\n<h3>27.</h3>\n<p>Global eager loading in an Eloquent model is possible by overriding the <code>$with</code> property. E.g.</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token keyword">protected</span> <span class="token variable">$with</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">\'owner\'</span><span class="token punctuation">]</span>\n</code></pre>\n      </div>\n<p>(<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/21">Source</a>)</p>\n<h3>28.</h3>\n<p>You can use <a href="https://laravel.com/docs/5.6/eloquent#events">model events</a> to (among other things) delete related models when a model is deleted. E.g. in the <code>boot</code> method of a model:</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token keyword">static</span><span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token function">deleting</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token variable">$thread</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token variable">$thread</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">replies</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>(<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/23">Source</a>)</p>\n<h3>29.</h3>\n<p>The <a href="https://laravel.com/docs/5.6/helpers#method-method-field">method_field helper</a> spoofs HTTP verbs in forms. E.g.</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token function">method_field</span><span class="token punctuation">(</span><span class="token string">\'DELETE\'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>(<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/23">Source</a>)</p>\n<h3>30.</h3>\n<p>Use <a href="https://laravel.com/docs/5.6/blade#loops"><code>@forelse</code> and <code>@empty</code></a> to show messages when a collection of data to be looped through is empty. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/24">Source</a>)</p>\n<h3>31.</h3>\n<p>The artisan <a href="https://laravel.com/docs/5.6/authorization#creating-policies"><code>make:policy</code> command</a> generates an empty policy class. The flag <code>--model=Foo</code> adds some boilerplate. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/24">Source</a>)</p>\n<h3>32.</h3>\n<p>The <a href="https://laravel.com/docs/5.6/authorization#via-blade-templates"><code>@can</code> and <code>@cannot</code> Blade directives</a> check whether the logged in user can perform a given action. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/24">Source</a>)</p>\n<h3>33.</h3>\n<p>To give a super admin permission to perform all actions, either use the <a href="https://laravel.com/docs/5.6/authorization#policy-filters"><code>before</code> method</a> on a policy, or to apply this to all policies use the <a href="https://laravel.com/docs/5.6/authorization#gates">Gate class</a> in the <code>boot</code> method of <code>AuthServiceProvider</code>. E.g.:</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code>Gate<span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token function">before</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token variable">$user</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token variable">$user</span><span class="token operator">-</span><span class="token operator">></span><span class="token property">name</span> <span class="token operator">===</span> <span class="token string">\'super admin\'</span><span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>(<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/24">Source</a>)</p>\n<h3>34.</h3>\n<p>Not Laravel specific, but to get the short name of a class (i.e. without the namespace), this can be done with the ReflectionClass method <a href="http://php.net/manual/en/reflectionclass.getshortname.php"><code>getShortName</code></a>. E.g.:</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token variable">$name</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name"><span class="token punctuation">\\</span>ReflectionClass</span><span class="token punctuation">(</span><span class="token variable">$thread</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">getShortName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>(<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/25">Source</a>)</p>\n<h3>35.</h3>\n<p>You can move <code>boot</code> methods from specific models to traits they use with the function <code>boot[TraitName]</code> in the trait. E.g.:</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token keyword">protected</span> <span class="token keyword">static</span> <span class="token keyword">function</span> <span class="token function">bootRecordsActivity</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">{</span>\n\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>(<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/25">Source</a>)</p>\n<h3>36.</h3>\n<p>You can pass a closure to the <code>groupBy</code> method. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/26">Source</a>)</p>\n<h3>37.</h3>\n<p><a href="https://laravel.com/docs/5.6/responses#redirecting-with-flashed-session-data">Chain the <code>with</code> method to a redirect response</a> to flash data to the session. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/29">Source</a>)</p>\n<h3>38.</h3>\n<p>Use the <a href="https://laravel.com/docs/5.6/blade#including-sub-views"><code>@includeIf</code></a> Blade directive to only include a view if it exists. Inspired by (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/30">this video</a>)</p>\n<h3>39.</h3>\n<p>Use <a href="https://vuejs.org/v2/guide/components.html#Inline-Templates">inline templates</a> to use a Blade file (or other HTML) as a Vue component\'s template. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/32">Source</a>)</p>\n<h3>40.</h3>\n<p>Use the <a href="https://vuejs.org/v2/api/#v-cloak"><code>v-cloak</code></a> directive, in combination with a CSS rule like <code>[v-cloak] { display: none; }</code>, to hide a Vue component until it\'s loaded. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/32">Source</a>)</p>\n<h3>41.</h3>\n<p>Use the <a href="https://laravel.com/docs/5.6/eloquent-serialization#appending-values-to-json"><code>appends</code></a> property to add Eloquent attributes to a model\'s array or JSON representation. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/34">Source</a>)</p>\n<h3>42.</h3>\n<p>Use the Eloquent <a href="https://github.com/laravel/framework/blob/5.6/src/Illuminate/Database/Eloquent/Model.php#L1010-L1020"><code>fresh</code></a> method to reload a model from the database. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/34">Source</a>)</p>\n<h3>43.</h3>\n<p>For a model event (e.g. <code>deleting</code>) to fire, the model has to be deleted (or updated etc.), rather than building an SQL command with the query builder. I.e. this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token variable">$this</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">favorites</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">where</span><span class="token punctuation">(</span><span class="token variable">$attributes</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">each</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token variable">$favorite</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token variable">$favourite</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>instead of </p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token variable">$this</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">favorites</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">where</span><span class="token punctuation">(</span><span class="token variable">$attributes</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>(<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/35">Source</a>)</p>\n<h3>44.</h3>\n<p><a href="https://laravel.com/docs/5.6/collections#higher-order-messages">Higher order messages</a> are  "properties" to make performing tasks on collections more readable. E.g., using the <code>each</code> higher order message:</p>\n<div class="gatsby-highlight">\n      <pre class="language-php"><code><span class="token variable">$this</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">favorites</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">where</span><span class="token punctuation">(</span><span class="token variable">$attributes</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">></span><span class="token property">each</span><span class="token operator">-</span><span class="token operator">></span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>(<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/35">Source</a>)</p>\n<h3>45.</h3>\n<p>The Vue <a href="https://vuejs.org/v2/guide/list.html#Mapping-an-Array-to-Elements-with-v-for"><code>v-for</code></a> directive can take a second argument that supplies the index of an item. E,g.:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code><div v-for="(reply, index) in items"\n  <reply :data="reply" @deleted="remove(index)"></reply>\n</div></code></pre>\n      </div>\n<p>(<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/36">Source</a>)</p>\n<h3>46.</h3>\n<p>Use <a href="https://vuejs.org/v2/guide/mixins.html">Vue mixins</a> for creating reusable functionality. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/38">Source</a>)</p>\n<h3>47.</h3>\n<p>A <a href="https://vuejs.org/v2/guide/computed.html#Watchers">Vue watcher</a> can be used to perform some new function when a component\'s data changes. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/38">Source</a>)</p>\n<h3>48.</h3>\n<p>In Vue, the <a href="https://vuejs.org/v2/guide/events.html#Event-Modifiers"><code>.prevent</code></a> event modifier will perform the equivalent of <code>preventDefault()</code>. E.g. <code>@click.prevent</code>. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/38">Source</a>)</p>\n<h3>49.</h3>\n<p><a href="https://laravel.com/docs/5.6/queries#increment-and-decrement"><code>increment</code> and <code>decrement</code></a> are database query builder helpers to increment or decrement the value of a column. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/39">Source</a>)</p>\n<h3>50.</h3>\n<p>To append an attribute to a single instance of an Eloquent model (rather than to every instance as in 41 above), use the <a href="https://laravel.com/docs/5.6/eloquent-serialization#appending-values-to-json"><code>append</code> method</a>. (<a href="https://laracasts.com/series/lets-build-a-forum-with-laravel/episodes/42">Source</a>)</p>',fields:{title:"Lessons from Laracasts, Part 1",date:"24 March, 2018",url:"http://unlikenesses.com/2018-03-24-laracasts-lessons/"}}},pathContext:{slug:"/2018-03-24-laracasts-lessons/",prev:{fields:{title:"Why an HTTP component?",date:"20 February, 2018",slug:"/2018-02-20-http-components/",_PARENT:"SOURCE"},_PARENT:"SOURCE"},next:null,_PARENT:"SOURCE"}}}});
//# sourceMappingURL=path---2018-03-24-laracasts-lessons-e61d76ca97f1604bc05c.js.map