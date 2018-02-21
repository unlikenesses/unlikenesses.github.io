webpackJsonp([4684662507324],{335:function(t,a){t.exports={data:{post:{html:'<p>I\'ve been meaning for ages to clean up my Chrome extension <a href="https://chrome.google.com/webstore/detail/mp-info/ecihneinfjdhacjgolbgdbmjffpipgla">MP Info</a>, which sort of worked except for one major problem. It\'s sole, simple idea is to highlight the names of British Members of Parliament on any webpage, and to show a tooltip with an (admittedly slightly confusing at the moment) voting record, with data drawn from the <a href="http://www.theyworkforyou.com/">They Work For You</a> <a href="http://www.theyworkforyou.com/api/">API</a>:</p>\n<p>The problem was that not only was my extension highlighting the names of MPs, it was also highlighting all code displays in Github.</p>\n<p>Thinking at first this had something to do with the <a href="https://github.com/bartaz/sandbox.js/blob/master/jquery.highlight.js">third party highlight script</a> I was using, but on inspecting Github\'s markup for the code element I found that it was contained in a table with the class name of <code>highlight</code>, which happened to be the class name I was using to highlight MP\'s names. So it was just a case of my SASS seeing that table and applying the yellow background to it. All I had to do was change the class name I used in the highlight call:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code><span class="token function">$</span><span class="token punctuation">(</span><span class="token string">\'body\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">highlight</span><span class="token punctuation">(</span>mps<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>name<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n\twordsOnly<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n\tclassName<span class="token punctuation">:</span> <span class="token string">\'mpHighlight\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>And all was right with the world again. You can get the Chrome extension <a href="https://chrome.google.com/webstore/detail/mp-info/ecihneinfjdhacjgolbgdbmjffpipgla">here</a> and pore over its arcane mysteries <a href="https://github.com/unlikenesses/mp-info">here</a>.</p>',fields:{title:"mp info",date:"20 February, 2016",url:"http://unlikenesses.com/2016-02-20-mp-info/"}}},pathContext:{slug:"/2016-02-20-mp-info/",prev:{fields:{title:"backbone todo tutorial part two",date:"17 December, 2015",slug:"/2015-12-17-backbone-todo-tutorial-part-two/",_PARENT:"SOURCE"},_PARENT:"SOURCE"},next:{fields:{title:"laravel on fasthosts",date:"12 March, 2016",slug:"/2016-03-12-laravel-on-fasthosts/",_PARENT:"SOURCE"},_PARENT:"SOURCE"},_PARENT:"SOURCE"}}}});
//# sourceMappingURL=path---2016-02-20-mp-info-b196533debc22059fc42.js.map