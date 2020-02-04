'use strict';

module.exports = {
  'google-login': {
    'provider': 'google',
    'module': 'passport-google-oauth',
    'strategy': 'OAuth2Strategy',
    'clientID': process.env.GOOGLE_ID,
    'clientSecret': process.env.GOOGLE_SECRET,
    'callbackURL': '/admin/auth/google/callback',
    'authPath': '/admin/auth/google',
    'callbackPath': '/admin/auth/google/callback',
    'successRedirect': '/admin/auth',
    'failureRedirect': '/admin/login',
    'scope': ['email', 'profile'],
    'failureFlash': true,
  },
  'slack-login': {
    'provider': 'slack',
    'module': 'passport-slack-oauth2',
    'clientID': process.env.SLACK_CLIENT_ID,
    'clientSecret': process.env.SLACK_CLIENT_SECRET,
    'callbackURL': '/auth/slack/callback',
    'authPath': '/auth/slack',
    'callbackPath': '/auth/slack/callback',
    'successRedirect': '/auth',
    'failureRedirect': '/login',
    'scope': ['identity.basic', 'identity.email'],
    'failureFlash': true,
  }
};
