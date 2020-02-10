const moment = require('moment');
const request = require('request-promise');
const cron = require('node-cron');

module.exports = function(app) {
  var Messages = app.models.messages;

  cron.schedule('*/5 * * * *', () => {
    Messages.find({}, (err, data) => {
      if (err) throw err;
      createQueue(data)
    });

    function createQueue(messages) {
      let result = []
      if(messages.length > 0) {
        messages.map((message) => {
          let challengeTime = parseInt(message.date.replace(/[-,:,a-zA-Z]/ig,'').substring(0, 12));
          let currentTime = parseInt(moment().format().replace(/[-,:,a-zA-Z]/ig,'').substring(0,12));
          let cutOffTime = parseInt(moment().format().replace(/[-,:,a-zA-Z]/ig,'').substring(0,12)) + 459;
          if(challengeTime >= currentTime && challengeTime <= cutOffTime) {
            result.push(message)
          }
        })
      }
      return cronJob(result)
    }

    function cronJob(messageArray) {
      if (messageArray.length > 0) {
        const slackBody = {
          mkdwn: true,
          text: `${messageArray[0].message}`,
          attachments: [
            {
              title: `${messageArray[0].url}`
            }
          ]
        };
        request({
          url: `https://hooks.slack.com/services/${process.env.SLACK_CRON_HOOK}`,
          method: 'POST',
          body: slackBody,
          json: true
        });
      } else {
        return;
      }
    }
  },
  {
    timezone: process.env.TZ || "America/Tijuana"
  });
}
