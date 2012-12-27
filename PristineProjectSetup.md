# Overview

This document contains the general steps you need to follow to get up-and-running with Crush + Lovely's base static site.

## Clone the Pristine Static project.

If you don't have the project cloned locally yet, do that now:

    git clone git@github.com:crushlovely/pristine-static.git

If you already have the project locally, make sure it's up-to-date:

    git pull origin master

## Create your new project.

Let's say your new project is called "Super Widgets" and that your Pristine project is cloned to `~/Projects/pristine-static` on your computer. Do the following:

    cp -R ~/Projects/pristine-static ~/Projects/super_widgets
    cd ~/Projects/super_widgets
    # Remove old .git directory
    rm -rf .git
    # Initialize a new git repository
    git init

## Update Application Name

Using a global search and replace, `Pristine Static` with `Super Widgets` and `pristine-static` with `super-widgets`.

## Update Readme

Update the `Readme.md` with any project-specific information you want.

<hr>

These last two steps need to be done by someone with GitHub and Heroku admin status.

## Push to GitHub

Setup a repository on GitHub, then configure, commit, and push.

## Deploy to Heroku

    git config heroku.account work
    heroku create super-widgets-production --remote=production --stack=cedar --buildpack=https://github.com/ddollar/heroku-buildpack-multi.git
    heroku addons:add deployhooks:http --url="https://api.hipchat.com/v1/webhooks/heroku?auth_token=2369931e4f84caa693a2d4331eca1e&room_id=34312"
    git push production master

## Delete this file.