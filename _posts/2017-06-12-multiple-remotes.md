---
published: true
layout: post
comments: true
---

Problem: I'm working on a project that will eventually be open-source, but until I get it to a presentable state I want to store its code in a private repo on [Bitbucket](https://bitbucket.org/). So I've been happily building and committing, pushing to my remote on Bitbucket. Then I want to quickly test creating a public repo on [GitHub](https://github.com/) and posting to it. So I create a new GitHub account, new SSH keys for it, and -- inevitably -- accidentally make GitHub my new remote `origin`. Now I'm still not ready to go live with this, I've deleted the GitHub repo but now need to set my local repo back up with the Bitbucket remote.

Solution: First, remove the GitHub remote: `git remote rm origin`. Now, add the older Bitbucket repo: `git remote add origin [url]`. But now, when I try to push to the remote branch with `git push origin master`, I get this error: 

> remote: Unauthorized
> fatal: Authentication failed for 'https://xxxxx@bitbucket.org/xxxxx/proj.git/'

Following [this SO answer](https://stackoverflow.com/a/17671315) I removed the remote branch and re-added it using the SSH url. After this I was able to push to it.