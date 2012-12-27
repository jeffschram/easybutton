# Easy Button

## Development

First, ensure that you have all the dependencies installed on your system.  It's a good idea to run this each time you pull to make sure your dependencies are up-to-date.

```
bundle install
```

This site is built on top of [Middleman](http://middlemanapp.com). There are two ways to run the site in development:

### Middleman Server

```
bundle exec middleman server
```

Once that boots up, the website will be available at <http://0.0.0.0:4567>.

### Pow

Setup and access the site via pow as you would any other Rack application. Caveat: When using Pow, if you notice new assets aren't available, you may need to restart the site as per the usual `touch tmp/restart.txt`.