---
published: true
layout: post
comments: true
---

Some notes on setting up Rails on Windows with a Vagrant Ubuntu box.

### Step 1: Installing Vagrant

1. Install [VirtualBox](https://www.virtualbox.org/). I'm using version `5.1.24`.

2. Install [Vagrant](https://www.vagrantup.com/downloads.html). (Version `1.9.7`.)

3. Test it's working with `vagrant -v`.

4. Add the box: `vagrant box add ubuntu/xenial64`.

5. Create the project folder, `cd` into it and `vagrant init`.

6. Add `hashicorp/precise64` to the `config.vm.box` in `Vagrantfile`.

### Step 2: Installing Ruby

This entire section is taken from [this guide](https://gorails.com/setup/ubuntu/16.04).

1. `sudo apt-get update` and `sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev nodejs`.

2. 
```
cd
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

rbenv install 2.4.0
rbenv global 2.4.0
ruby -v
```

I end up with Ruby version `2.4.0`.

3. `gem install bundler` and `rbenv rehash`.

### Step 3: Installing Rails

1. `gem install rails` and `rbenv rehash`. Gets me Rails version `5.1.2`.

2. Add this line to `Vagrantfile`: `config.vm.network "forwarded_port", guest: 3000, host: 3000`.

3. `vagrant up` and `vagrant ssh`.

4. `rails new myApp`, `cd myApp`. 

5. Start the server with `rails s -b 0.0.0.0`.

6. In Windows go to `localhost:3000`.



