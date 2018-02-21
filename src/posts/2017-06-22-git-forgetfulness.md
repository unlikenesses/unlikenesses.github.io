---
published: true
layout: post
comments: true
---

Another git problem: 

I come back to a project after a few days and start working on some fixes (I don't bother creating new branches for these). When I'm done and ready to commit, I go to my command line and see that I'm still in a feature branch I created a while back and haven't yet finished with. I don't want my fixes to be in this branch but in `master`. 

The answer's pretty simple:

```
git stash && git checkout master && git stash pop
```