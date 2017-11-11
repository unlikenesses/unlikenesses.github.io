---
published: true
layout: post
comments: true
---

So many clients still use servers which don't have the facility to deploy via [Git](https://git-scm.com/). While one or two of my ongoing sites do use Git (in fact they were my introduction to it) with most jobs I'm forced to wrack my brains, and my fingers, clicking through folders in Filezilla's local pane until I find the files which I've recently changed, before clicking through to the corresponding folders on the server pane and dragging the files across. It's a huge waste of time, strains your eyes, confounds your fingers, and discombobulates your brain. 

It just so happens that one of the recent jobs involves working with another coder, and therefore the use of Git was absolutely necessary (using a repo on Bitbucket). Unfortunately the target server, of course, does not support Git. So it's looking like we're back to FTP.

Determined with a bloody-minded obstinacy to move away from such evils, I did some research into alternatives, and found [git-ftp](https://github.com/git-ftp/git-ftp), originally built by [René Moser](https://github.com/resmo) but [apparently](https://github.com/git-ftp/git-ftp/blob/develop/AUTHORS) elaborated by a bunch of other contributors.

I've only just got it working, and its documentation isn't great, but from the looks of things I think this is going to save me a lot of time in the future. I had a couple of problems installing. In the repo's [install doc](https://github.com/git-ftp/git-ftp/blob/develop/INSTALL.md) we have these instructions:

```
$ cd ~
$ git clone https://github.com/git-ftp/git-ftp
$ cd git-ftp && chmod +x git-ftp
$ cd /bin
$ ln -s ~/git-ftp/git-ftp
```

All of this was fine apart from the last line. I'm still learning the command line so I'm not familiar with symbolic linking, but in any case what I had to do instead was this:

```
cp ~/git-ftp.git/git-ftp /bin/git-ftp
```
    
And I was able to access `git ftp` from anywhere. After that, I went into my new project's folder, ran a `git init`, then a `git add .` and an initial `git commit`. The next thing was to set up the **git-ftp** config: I opened `.git/config` in Notepad++ and added the following four lines:
```
[git-ftp]
	user = username
	password = password
	url = ftp.example.com/public_html/
```

Where `user` and `password` are the authentication details for my server's FTP.

With all that configured, I just had to run `git ftp init`, and hey presto, instant command line transfer of all my files to the server! Of course the real test was whether in subsequent pushes it would correctly detect which files had changed and *only* FTP those ones up to the server. So, a quick change to a couple of files, `add` and `commit` them via git in the normal manner, then `git ftp push`: and only those changed files are uploaded, just as advertised. 

This could potentially make the work process a lot smoother. I still have to explore it more: what's the workflow, for example, if I want to add this to an already existing project? I read somewhere something about its own `.gitignore` file -- how does this relate to the official one? I also need to start persuading clients to use better hosting, but that's another story...
