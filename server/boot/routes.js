'use strict';
require('dotenv').config();

const axios = require('axios');

const {
  doorbell,
  gotIn,
  standup,
  cancelStandup,
  submitStandup,
  checkIn,
  checkOut,
  adminReport,
} = require('../events');

module.exports = (app) => {
  app.post('/slack/doorbell', (req, res) => {
    res.send('Ringing the doorbell');
    handleEvent(req.body, 'doorbell');
  });

  app.post('/slack/standup', (req, res) => {
    handleEvent(req.body, 'standup');
    res.status(200).send('');
  });

  app.post('/slack/checkin', (req, res) => {
    const {user_id, channel_id} = req.body;
    res.send(`Click the link to confirm your location to check in: ${process.env.BASE_URL}getGeo?user=${user_id}&channel=${channel_id}&checkin=true`);
  });

  app.post('/slack/checkout', (req, res) => {
    const {user_id, channel_id} = req.body;
    res.send(`Click the link to confirm your location to check out: ${process.env.BASE_URL}getGeo?user=${user_id}&channel=${channel_id}&checkin=false`);
  });

  app.post('/slack/interactive', (req, res) => {
    const body = JSON.parse(req.body.payload);
    switch (body.callback_id) {
      case 'gotin':
        handleEvent(body, 'gotin');
        res.send('Have a nice day');
        break;
      case 'latecheckout':
        if (body.actions[0].value === 'yes') {
          res.send(`Click the link to confirm your location to check out: ${process.env.BASE_URL}getGeo?user=${body.user.id}&channel=${body.channel.id}&checkin=false`);
        } else {
          handleEvent(body, 'checkout');
          res.send('Remember to check out before you leave next time.');
        }
        break;
      case 'standupResponse':
        if (body.type === 'dialog_cancellation') {
          handleEvent(body, 'cancelStandup');
        } else { // dialog_submission
          handleEvent(body, 'submitStandup');
        }
        res.send('');
        break;
      default:
        res.send('Not sure what you were trying to do here...');
        break;
    }
  });

  app.post('/submitGeo', (req, res) => {
    if (req.body.token == process.env.token || '0') {
      if (req.body.checkin === 'true') {
        handleEvent(req.body, 'checkin');
      } else {
        handleEvent(req.body, 'checkout');
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });

  app.get('/getGeo', (req, res) => {
    const {user, channel, checkin} = req.query;
    res.render('index', {user, channel, checkin, token: process.env.token});
  });
};

const handleEvent = (body, command) => {
/* the variable on the left represents the response from a slash command, and
the variables on the right are coming from an interactive command  */
  const user = body.user_id ||  body.user.id;
  const channel = body.channel_id || body.channel.id;

  const loc = {
    lat: body.lat,
    long: body.long,
  };

  switch (command) {
    case 'doorbell':
      doorbell(user, channel);
      break;
    case 'standup':
      standup(user, channel, body.trigger_id);
      break;
    case 'cancelStandup':
      cancelStandup(user, channel);
      break;
    case 'submitStandup':
      submitStandup(user, channel, body.submission);
      break;
    case 'gotin':
      gotIn(user, channel);
      break;
    case 'checkin':
      checkIn(user, loc, channel);
      break;
    case 'checkout':
      checkOut(user, loc, channel);
      break;
    default:
      break;
  }
};