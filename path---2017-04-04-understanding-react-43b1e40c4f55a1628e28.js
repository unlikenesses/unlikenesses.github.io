webpackJsonp([0xa1e1562d936d],{339:function(n,s){n.exports={data:{post:{html:'<p>I\'m working my way through the <a href="https://github.com/survivejs/react-book">Survive.js React: From Apprentice to Master book</a> and wanted to highlight a few points of confusion for me, hoping to clarify them on the way. Compared to the approaches I\'ve been taught in other tutorials the approach here is slightly different. I\'ll try to pinpoint two or three areas of difference.</p>\n<ol>\n<li></li>\n</ol>\n<p>This is a simple one. In one of the <a href="https://github.com/survivejs/react-book/blob/dev/manuscript/getting_started/03_implementing_notes.md">early chapters</a> the author <code>export default</code>s a function without assigning it to a variable or constant:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>\n</code></pre>\n      </div>\n<p>Just a detail but it was a shortcut I hadn\'t encountered before. Easy enough to get accustomed to. (NB. Arrow functions were new enough to me that I was a bit confused by the use of round brackets instead of curly braces. If we don\'t use curly braces the arrow function implicitly returns whatever comes after the arrow. )</p>\n<p>2.\nThe next issue came from the fact that the author is, at the start at least, using functions instead of classes to define their React components. This meant that props were being passed in a way that was unfamiliar to me (though perfectly clearly <a href="https://facebook.github.io/react/docs/components-and-props.html">documented</a> in the official docs). See this from the <a href="https://github.com/survivejs/react-book/blob/dev/manuscript/getting_started/03_implementing_notes.md">same chapter</a>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>notes<span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span>\n</code></pre>\n      </div>\n<p>Still slightly confusing, because the above-linked official docs always have <code>props</code> as the function\'s argument - the above example is obviously a way to extract a particular prop from the props object by putting it in curly braces, but I haven\'t seen it documented. </p>\n<p>3.\nWhen they move on to introducing state, the main <code>App</code> component is converted from a function to a class. I\'m on more familiar territory here, but there\'s one or two niggles. First, where before my constructors have looked like this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>their\'s looked like this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token function">constructor</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">super</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>In fact, it seems that no one really knows why the docs recommend passing <code>props</code> to <code>super</code>. The book says:</p>\n<blockquote>\n<p>We\'re passing <code>props</code> to <code>super</code> by convention. If you don\'t pass it, <code>this.props</code> won\'t get set! </p>\n</blockquote>\n<p>But as <a href="http://stackoverflow.com/a/34995257">this Stackoverflow answer</a> says, <code>this.props</code> will still be available in later methods in the class even if it\'s not passed to <code>super()</code>. As the answer puts it, although the docs recommend passing <code>props</code>,</p>\n<blockquote>\n<p>However, no reason is provided. We can speculate it is either because of subclassing or for future compatibility.</p>\n</blockquote>\n<p>4.\nSecond niggle in the <code>App</code> class. Ok, this is less a niggle than something I had to learn. In the <code>render</code> method of <code>App</code>, the <code>notes</code> object of the app\'s <code>state</code> is passed as a prop to the <code>Notes</code> component:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span>notes<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">;</span>\n<span class="token punctuation">[</span><span class="token operator">...</span><span class="token punctuation">]</span>\n<span class="token operator">&lt;</span>Notes notes<span class="token operator">=</span><span class="token punctuation">{</span>notes<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">></span>\n</code></pre>\n      </div>\n<p>This is an ES6 feature called <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment">destructuring</a>. It just grabs the <code>notes</code> object from <code>this.state</code> and puts it in a <code>notes</code> constant.</p>\n<p>5.\nNext one is to do with binding: the author adds an <code>addNote</code> method to the class. From the Wes Bos React for Beginners series I learnt that when a method wants to access <code>this</code> it has to be bound in the constructor like so:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">this</span><span class="token punctuation">.</span>addNote <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>addNote<span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>The author doesn\'t have this, and his method is instantiated like this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token function-variable function">addNote</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n</code></pre>\n      </div>\n<p>Now, when the author mentions binding here, he says:</p>\n<blockquote>\n<p> It would be possible to do that at the <code>constructor</code>, <code>render()</code>, or by using a specific syntax. I\'m opting for the syntax option in this book. </p>\n</blockquote>\n<p>A quick google comes up with <a href="https://medium.com/@housecor/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56">this article</a> about different approaches for binding <code>this</code>. It looks like the approach used by the SurviveJS author is number 5, "Use Arrow Function in Class Property". As the Medium article says, this has several advantages - mainly lack of repetition and performance enhancements.</p>\n<p>6.\nWes Bos\'s tutorial says we need to make a copy of <code>state</code> before updating. It doesn\'t look like the SurviveJS tut does that:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  notes<span class="token punctuation">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>notes<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">{</span>\n    id<span class="token punctuation">:</span> uuid<span class="token punctuation">.</span><span class="token function">v4</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    task<span class="token punctuation">:</span> <span class="token string">\'New task\'</span>\n  <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>What <em>I think</em> is going on here is that since <code>concat</code> <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/concat">doesn\'t change an existing array, but returns a new array</a>, this is equivalent to taking a copy of the existing array, modifying the copy, then assigning the modified copy to the state.</p>\n<p>7.\nThe files have the <code>.jsx</code> extension, while some other tuts I\'ve seen use <code>.js</code>. This appears to be a <a href="https://www.reddit.com/r/reactjs/comments/4kkrwg/ask_js_or_jsx_extension/">debate</a> that is not particularly interesting.</p>\n<p>Ok - those are just from chapter three of the Getting Started section... More to come.</p>',fields:{title:"understanding react",date:"04 April, 2017",url:"http://unlikenesses.com/2017-04-04-understanding-react/"}}},pathContext:{slug:"/2017-04-04-understanding-react/",prev:{fields:{title:"laravel artisan create crud",date:"19 February, 2017",slug:"/2017-02-19-laravel-artisan-create-crud/",_PARENT:"SOURCE"},_PARENT:"SOURCE"},next:{fields:{title:"multiple remotes",date:"12 June, 2017",slug:"/2017-06-12-multiple-remotes/",_PARENT:"SOURCE"},_PARENT:"SOURCE"},_PARENT:"SOURCE"}}}});
//# sourceMappingURL=path---2017-04-04-understanding-react-43b1e40c4f55a1628e28.js.map