webpackJsonp([0xfbc1ac0efde1],{341:function(n,a){n.exports={data:{post:{html:'<p>To fade between pages in <a href="https://github.com/vuejs/vue-router">vue-router</a> is pretty simple. The <code>transition</code> component can be used to wrap the <code>router-view</code> component. But there\'s a slight issue. If we use it as in the <a href="https://vuejs.org/v2/guide/transitions.html">example</a>, the page transitions look a little janky:</p>\n<div class="gatsby-highlight">\n      <pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>transition</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>fade<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>router-view</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>router-view</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>transition</span><span class="token punctuation">></span></span>\n</code></pre>\n      </div>\n<p>CSS:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token punctuation">.</span>fade<span class="token operator">-</span>enter<span class="token operator">-</span>active<span class="token punctuation">,</span> <span class="token punctuation">.</span>fade<span class="token operator">-</span>leave<span class="token operator">-</span>active <span class="token punctuation">{</span>\n    transition<span class="token punctuation">:</span> opacity <span class="token punctuation">.</span>5s\n<span class="token punctuation">}</span>\n\n<span class="token punctuation">.</span>fade<span class="token operator">-</span>enter<span class="token punctuation">,</span> <span class="token punctuation">.</span>fade<span class="token operator">-</span>leave<span class="token operator">-</span>to <span class="token punctuation">{</span>\n    opacity<span class="token punctuation">:</span> <span class="token number">0</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>This is because the default behaviour when transitioning between two elements is to perform both transitions simultaneously. This is where <a href="https://vuejs.org/v2/guide/transitions.html#Transition-Modes">transition modes</a> come into play. Using the <code>out-in</code> mode the first page will completely fade out before the new one fades in:</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code><span class="token operator">&lt;</span>transition name<span class="token operator">=</span><span class="token string">"fade"</span> mode<span class="token operator">=</span><span class="token string">"out-in"</span> appear<span class="token operator">></span>\n</code></pre>\n      </div>\n<p>Finally, adding the <code>appear</code> attribute, as above, means that the transition is applied to the first page when it loads (<a href="https://vuejs.org/v2/guide/transitions.html#Transitions-on-Initial-Render">docs</a>).</p>\n<p><em>Issue:</em> the transition is not applied to routes using <a href="https://router.vuejs.org/en/essentials/dynamic-matching.html">dynamic route matching</a>. E.g. there is no transition between <code>/post/1</code> and <code>/post/2</code>. My guess is that this is because, as the manual says:</p>\n<blockquote>\n<p>when the user navigates from /user/foo to /user/bar, <em>the same component instance will be reused</em>.</p>\n</blockquote>\n<p>The solution (following <a href="https://stackoverflow.com/questions/40137100/vue-js-2-0-transition-on-dynamic-route-not-firing">this StackOverflow answer, thanks!</a>) is to wrap the contents of the page in a <code>div</code> with a specific <code>key</code> value (in this example based on the route parameter) and wrap that in the <code>transition</code> tag:</p>\n<div class="gatsby-highlight">\n      <pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>transition</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>fade<span class="token punctuation">"</span></span> <span class="token attr-name">mode</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>out-in<span class="token punctuation">"</span></span> <span class="token attr-name">appear</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>page-contents<span class="token punctuation">"</span></span> <span class="token attr-name">:key</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>$route.params.id<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n        <span class="token comment">&lt;!-- component code here --></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>transition</span><span class="token punctuation">></span></span>\n</code></pre>\n      </div>',fields:{title:"vue transitions",date:"21 June, 2017",url:"http://unlikenesses.com/2017-06-21-vue-transitions/"}}},pathContext:{slug:"/2017-06-21-vue-transitions/",prev:{fields:{title:"multiple remotes",date:"12 June, 2017",slug:"/2017-06-12-multiple-remotes/",_PARENT:"SOURCE"},_PARENT:"SOURCE"},next:{fields:{title:"git forgetfulness",date:"22 June, 2017",slug:"/2017-06-22-git-forgetfulness/",_PARENT:"SOURCE"},_PARENT:"SOURCE"},_PARENT:"SOURCE"}}}});
//# sourceMappingURL=path---2017-06-21-vue-transitions-ef4008d05480f1750ad9.js.map