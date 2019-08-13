'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var session = require('express-session');
var express = require('express');
var path = require('path');
require('dotenv').config();


var app = module.exports = loopback();

var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

var flash = require('express-flash');

var config = {};
try {
  config = require('../providers.js');
} catch (err) {
  console.trace(err);
  process.exit(1);
}

boot(app, __dirname, function(err) {
  if (err) throw err;
});

app.middleware('parse', express.json());

app.middleware('parse', express.urlencoded({
  extended: true,
}));

app.middleware('auth', loopback.token({
  model: app.models.accessToken,
}));

app.middleware('session', session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true,
}));

passportConfigurator.init();

app.use(flash());

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential,
});

for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/login.html'));
});

app.get('/admin', ensureLoggedIn('/login'), (req, res, next) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/standup/:id', ensureLoggedIn('/login'), (req, res) => {
  res.redirect('/admin');
});

app.get('/admin/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

app.start = function() {
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

if (require.main === module) {
    app.start();
}
