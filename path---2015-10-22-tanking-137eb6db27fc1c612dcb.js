webpackJsonp([0xb8d2a16834ab],{333:function(e,t){e.exports={data:{post:{html:'<p>Porting a project built on Codeigniter 2 to <a href="https://codeigniter.com/">Codeigniter 3</a>, with a fairly heavily modified <a href="https://github.com/TankAuth/Tank-Auth">Tank Auth</a> built in to it, I couldn\'t find any resources on how to get Tank Auth working in CI3. So here\'s a brief post to tell you what I did; hopefully it\'ll be useful for anyone else in the same situation.</p>\n<p>In <code>config.php</code>, remove the options which are no longer in the new default <code>config.php</code>, and add the ones specified in the <a href="https://www.codeigniter.com/userguide3/installation/upgrade_300.html">upgrade guide</a>. </p>\n<p>Set <code>sess_driver</code> to <code>files</code>.</p>\n<p>In the <code>Auth</code> controller, remove <code>$this->load->library(\'security\');</code> this is because the security library is loaded automatically.</p>\n<p>In the same controller, add <code>$this->load->helper(\'security\');</code> -- this allows the XSS clean method which is used in Tank Auth\'s default controller. You might as well also remove <code>xss_clean</code> from the validation rules in the <code>Auth</code> controller - these are now obsolete. See this <a href="http://stackoverflow.com/questions/28568871/codeigniter-3-unable-to-access-an-error-message">this</a> Stack Overflow question. </p>\n<p>All this is of course assuming that the rest of the instructions in the <a href="https://www.codeigniter.com/userguide3/installation/upgrade_300.html">upgrade guide</a> have been followed.</p>',fields:{title:"tanking",date:"22 October, 2015",url:"http://unlikenesses.com/2015-10-22-tanking/"}}},pathContext:{slug:"/2015-10-22-tanking/",prev:{fields:{title:"soft cascading",date:"09 October, 2015",slug:"/2015-10-09-soft-cascading/",_PARENT:"SOURCE"},_PARENT:"SOURCE"},next:{fields:{title:"backbone todo tutorial part one",date:"16 December, 2015",slug:"/2015-12-16-backbone-todo-tutorial-part-one/",_PARENT:"SOURCE"},_PARENT:"SOURCE"},_PARENT:"SOURCE"}}}});
//# sourceMappingURL=path---2015-10-22-tanking-137eb6db27fc1c612dcb.js.map