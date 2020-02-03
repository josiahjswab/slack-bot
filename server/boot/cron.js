const moment = require('moment');
const request = require('request-promise');
const cron = require('node-cron');

module.exports = function(app) {
  var Challenge = app.models.challenges;

  cron.schedule('*/5 * * * *', () => {
    Challenge.find({}, (err, data) => {
      if (err) throw err;
      createQueue(data)
    });

    function createQueue(d) {
      let result = []
      d.map((chal) => {
        let challengeTime = parseInt(chal.date.toISOString().replace(/[-,:,a-zA-Z]/ig,'').substring(0, 14));
        let currentTime = parseInt(moment().format().replace(/[-,:,a-zA-Z]/ig,'').substring(0,14));
        let cutOffTime = parseInt(moment().format().replace(/[-,:,a-zA-Z]/ig,'').substring(0,14)) + 459;
        if(challengeTime >= currentTime && challengeTime < cutOffTime) {
          result.push(chal)
        }
      })
      return cronJob(result)
    }

    function cronJob(r) {
      if (r.length > 0) {
        const slackBody = {
          mkdwn: true,
          text: `${r[0].message}`,
          attachments: [
            {
              title: `${r[0].url}`
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
    timezone: process.env.TZ ||"America/Tijuana"
  });
}
