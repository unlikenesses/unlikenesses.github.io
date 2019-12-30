---
published: true
layout: post
comments: true
title: CI with Jenkins and Symfony
date: "2019-10-08"
---

These are my notes on the process of setting up a CI environment on Jenkins for Symfony projects. It's pretty generic, though, so most if not all of it will apply to Laravel or other PHP frameworks too. Note this is not about CD (deployment): that might come in a later post.

## The Jenkins Server

First, we need a server running Jenkins. I'm going to use a Digital Ocean $5 droplet for this, with Ubuntu 18.04.3.

### Setting up the Digital Ocean droplet

First, follow [this tutorial](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04) to set up a new sudo user, configure and enable the firewall, and make sure you have SSH access to the server with the new user.

Then install Java following the instructions in [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-on-ubuntu-18-04#installing-specific-versions-of-openjdk):

```bash
sudo apt update
sudo apt upgrade
sudo apt install default-jre # Install Java Runtime Environment
```

### Installing Jenkins

Following [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-jenkins-on-ubuntu-18-04):

```bash
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins
```

### Starting Jenkins

Still following the DO tutorial. Start the Jenkins service:

```bash
sudo systemctl start jenkins
sudo systemctl status jenkins
```

Allow it access through the firewall:

```bash
sudo ufw allow 8080
sudo ufw status
```

Now you should be able to visit it in your browser, with your droplet's IP address followed by `:8080`. Get the password from your server:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

and copy it into the form on the browser. I'm now going to install the suggested plugins, create a user, then accept the Jenkins URL and click "Start Using Jenkins".

### Testing it works

Let's just test it works. Click "New Item", select "Freestyle Project" and give it a name like "test", then click OK. On the configuration page, scroll down to the bottom, click "Add build step", then select "Execute shell" from the dropdown list. In the "Command" text area that appears, enter `echo 'hello'`, then click "Save". You'll be taken back to the project's overview page. Click "Build Now" in the left-hand menu. After a few seconds a new entry should appear in the Build History. Click it, then click "Console Output": you should see your echoed string there.

## Jenkins and PHP

I'll start with a single action to keep things simple at first. I want to pull the latest code from its repo, run its tests in PHPUnit, and log the results. Create a new Freestyle Project, give it a name, then enter the Git repo URL under "Source Code Management". Click "Save". If you now click on "Build Now" and let the build run, then click the build and "Console Output", you'll see that Jenkins clones the repo into its server. Now if you SSH into your server, and go to the Jenkins `jobs` directory: 

```bash
cd /var/lib/jenkins/jobs
```

You'll see a directory named after the project you just created. `cd` into it, then `cat config.xml`. This is your job's template. You'll see an `scm` tag which contains your git repo's URL. 

### Installing PHP

Back in the Jenkins panel, we want to add a build step that will run PHPUnit. So click "Add build step", then select "Execute shell", then... what? Well we want to run PHPUnit, but we haven't installed it yet. We know PHPUnit is a dependency of Symfony, so we would need to run a `composer install` after cloning the repo. So we can SSH into the server and install Composer, right? But wait! We still haven't even installed PHP on the server yet. So let's do that. SSH into the server, then run:


```bash
sudo apt update
sudo apt install php 
```

This will install the PHP [metapackage](https://help.ubuntu.com/community/MetaPackages), which includes a number of useful packages as well as the most up to date PHP interpreter for your operating system. Now to check it's installed, enter `php -v` (the `-v` flag requests the version). You should see something like this:

> PHP 7.2.19-0ubuntu0.18.04.2 (cli) (built: Aug 12 2019 19:34:28) ( NTS )
> Copyright (c) 1997-2018 The PHP Group
> Zend Engine v3.2.0, Copyright (c) 1998-2018 Zend Technologies
>     with Zend OPcache v7.2.19-0ubuntu0.18.04.2, Copyright (c) 1999-2018, by Zend Technologies

We also want to install some packages required by Symfony and PHPUnit:

```bash
sudo apt install php-xml php-zip php-curl php-mbstring php-xdebug
```

### Installing Composer

Now to install Composer, go to [Composer's download page](https://getcomposer.org/download/), copy the first line of the script there, and paste it in your terminal:

```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
```

Then we want to install it globally: 

```bash
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
```

Now if you type `composer` and hit enter you should see its help page.

### Add Composer build step

Go back to the Jenkins front-end, and configure the project. Add a build step, of the "Execute shell" type, then enter `composer install`, and click "Save". Now go back to the project's homepage and click "Build Now" and look at the console results. With any luck, you'll see the repo being cloned, and then composer installing its dependencies.

## PHPUnit

So now we're ready to add our first CI action: running tests with PHPUnit. This is now very simple. Add a build step, "Execute shell", and enter `php ./bin/phpunit`. The first time this is run it might install PHPUnit and its dependencies via Composer, and once that's done it'll run any tests you have.

You can see the output in the build's Console Output section as usual. But this is not very pretty, and it would be more useful to have a permanent record of it somewhere. The [Clover PHP plugin](http://wiki.jenkins-ci.org/display/JENKINS/Clover+PHP+Plugin) can produce reports from PHPUnit test runs. To install it, go to Manage Jenkins > Manage Plugins, click the "Available" tab and filter by "clover". [NOTE: [this guy](https://www.youtube.com/watch?v=kuBD3p20oyE) says not to use Clover PHP, it's old and abandoned. Instead use the general Clover Plugin. Maybe try this step again with only that, since we're going to need it later anyway for the Pipeline.]

Now back in the project config, let's modify the call to `phpunit` to specify locations for the Clover reports:

```bash
--coverage-clover='reports/coverage/coverage.xml' --coverage-html='reports/coverage'
```

Now we just need to tell Clover to publish these reports. Add a Post-build Action, and select "Publish Clover PHP Coverage Report" from the dropdown. In the "Clover XML Location", enter "reports/coverage/coverage.xml", then tick the "Publish HTML Report" checkbox and enter "reports/coverage" (obviously change these if you've put different locations in the `phpunit` arguments). Now click Save, then Build, and you'll see the reports on the project's homepage.

## PHP CS Fixer

The [PHP Coding Standards Fixer](https://cs.symfony.com) looks at your code and can change it to conform to any number of PHP coding standards. I run it with the `--dry-run` option so I can inspect the output and make the changes myself if I want to. We need to install it in bash:

```bash
wget https://cs.symfony.com/download/php-cs-fixer-v2.phar -O php-cs-fixer
sudo chmod a+x php-cs-fixer
sudo mv php-cs-fixer /usr/local/bin/php-cs-fixer
```

Then we can add it as a build action (before composer / phpunit):

```bash
php-cs-fixer fix --dry-run --no-interaction --diff -vvv src/
```

Now the build will fail if it contains code which is not compliant with PHP CS Fixer's rules (by default PSR-1 and PSR-2). If you don't want the build to fail at this step (e.g. you still want tests to run even if the code is not compliant), you can add `|| true` to the end of the code.

## Crap4J

[Crap4J](http://www.crap4j.org) is a plugin that helps identify methods whose complexity might cause problems in the future. PHPUnit has an option to generate reports in this format. So if you want to use this, install the plugin, then add `--coverage-crap4j='reports/crap4j.xml'` to the end of the `phpunit` build step. And finally add a "Report Crap" post-build step.

## Composer packages

Some useful metrics can be obtained from Composer packages. I prefer to install these globally on the server rather than include them as part of the `composer.json` in the project's repo. For example, PHPLoc, which gives you stats on the number of lines of code in your project, can be installed on the server with:

```bash
sudo composer global require phploc/phploc
```

Then, for reasons best known to the Jenkins deities, I need to use some strange syntax to add my vendor directory to the Jenkins `PATH` environment variable. Go to **Manage Jenkins > Configure System**, then add an environment variable called `PATH+EXTRA`, with the value `/home/user_name/.composer/vendor/bin`. (Note: I first used `~` instead of `/home/user_name`, but that didn't seem to work.) 

## First pain-point: The database

If you have any tests which require accessing the database, you'll quickly run into problems. We haven't set up any databases on the server yet. We could do that, but since we'll then be heading in the direction of having to ensure our Jenkins environment matches our development environment, it makes more sense to use Docker. That way we can be sure both environments match. So let's first install Docker on our Jenkins server:

```bash
sudo apt update
sudo apt install docker.io
sudo apt install docker-compose
```

(Since the Ubuntu repository may not contain the latest version of Docker, if you want the latest version you'll need to follow a few more steps, outlined in [this Digital Ocean tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04).)

Then in the Jenkins UI, add a build step just before the `composer install` step:

```bash
docker-compose up -d
```

Error! 

> "ERROR: Couldn't connect to Docker daemon at http+docker://localunixsocket - is it running?
> 
> If it's at a non-standard location, specify the URL with the DOCKER_HOST environment variable."

To fix this I had to add my user to the `docker` user group and restart everything:

```bash
sudo usermod -aG docker username # Replace with your username
systemctl daemon-reload
systemctl restart docker
sudo service jenkins restart
```

Now when you trigger a build and look in the console you should see Docker pulling in the relevant images and creating the services. (Note: Depending on the size of your droplet and the memory usage of your Docker services, you may need to add swap space to your Jenkins server - in this case refer to [this Digital Ocean tutorial](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04).)

The final step is to update the subsequent steps to be called via the container:

```bash
docker exec app_name composer install
docker exec app_name php ./bin/phpunit --coverage-clover='reports/coverage/coverage.xml' --coverage-html='reports/coverage' --coverage-crap4j='reports/crap4j.xml'
```

## Second pain-point: Jenkins configuration

Rather than setting up each build step in the Jenkins UI, it would be more convienient, and more portable, to have a single configuration file that does it all. This is the `Jenkinsfile`, a text file with its own syntax, which can be checked into source control, with all the benefits that entails.

To do this, create a `Jenkinsfile` in the root of your project. The syntax can be found in any number of other sources on the internet, so I'm just going to post a stripped-down version of my file here:

```
pipeline {
  agent any
  stages {
    stage('Build') {
      agent any
      steps {
        sh 'docker-compose up -d'
        sh 'docker exec app_name composer install'
      }
    }    
    stage('PHP CS Fixer') {
      steps {
        sh 'php-cs-fixer fix --dry-run --no-interaction --diff -vvv src/'
      }
    }
    stage('Test') {
      steps {
        sh 'docker exec app_name php ./bin/phpunit --coverage-clover=\'reports/coverage/coverage.xml\' --coverage-html=\'reports/coverage\''
      }
    }
    stage('Coverage') {
      steps {
        step([$class: 'CloverPublisher', cloverReportDir: '/reports/coverage', cloverReportFileName: 'coverage.xml'])
      }
    }
  }  
}
```

As you can see, the pipeline is divided into stages, whose names are arbitrary, but which makes the output easier to read.  Once this file is in the repo, you can create a new Pipeline project and specify the repo's address. It will then automatically pull in the `Jenkinsfile` and execute its steps. (NB. Since I couldn't find a way to publish the Crap4J report in a pipeline, I've removed it from the PHPUnit output.)

## Adding badges to your README file

Install the Jenkins [Embeddable Build Status plugin](https://wiki.jenkins-ci.org/display/JENKINS/Embeddable+Build+Status+Plugin). Next, make your project viewable by everyone: go to **Manage Jenkins > Configure Global Security**, then under **Authorization**, click "Matrix-based security", and for **Anonymous Users** check the **View Status** box under **Jobs**. For **Authenticated Users** click everything else. 

Now, back in your project, there will be a new menu item, "Embeddable Build Status". From there you can select the Markdown for the image you want, and paste it in your repo's `readme.md`.