'use strict';
require('dotenv').config();
const axios = require('axios');

const bot = require('./bot');

let checkedIn = [];
let url = process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:3000/';
let students = [];

axios.get(`${url}api/students/import`)
.then(res => {
  students = res.data.students.map(student => ({
    ...student,
    submitted: false,
    reported: false,
    questionOne: 'What did you do since Yesterday?',
    yesterday: '',
    questionTwo: 'What will you do Today?',
    today: '',
    questionThree: 'Anything blocking your progress?',
    blockers: '',
    date: null
  }));
})
.catch(err => console.log(err));

var schedule = require('node-schedule');

// 9:00am
const morningReminder = schedule.scheduleJob({hour: 9, minute: 0}, () => {
  bot.getUsers().then(users => {
    users.members.forEach(user => {
      if (!checkedIn.includes(user.id)) {
        bot.postEphemeral(process.env.STUDENTS_CHANNEL, user.id, ':alarm_clock: Don\'t forget to check in');
      }
    });
  });
});

// 5:50pm
const earlyCheckOutReminder = schedule.scheduleJob({hour: 17, minute: 50}, () => {
  checkedIn.forEach(user => {
    bot.postEphemeral(process.env.STUDENTS_CHANNEL, user, ':alarm_clock: Don\'t forget to check out before you leave');
  });
});

// 6:15pm
const lateCheckOutReminder = schedule.scheduleJob({hour: 18, minute: 15}, () => {
  var message = {
    "attachments": [
      {
        "title": "Time to check out!",
        "text": "Are you still here?",
        "callback_id": "latecheckout",
        "color": "#3AA3E3",
        "attachment_type": "default",
        "actions": [
          {
            "name": "yes",
            "text": "Yes, please check me out",
            "style": "primary",
            "type": "button",
            "value": "yes",
          },
          {
            "name": "no",
            "text": "No",
            "style": "danger",
            "type": "button",
            "value": "no",
          },
        ],
      },
    ],
  };
  checkedIn.forEach(user => {
    bot.postEphemeral(process.env.STUDENTS_CHANNEL, user, '', message);
  });
});

// 6:20pm
const checkOutCache = schedule.scheduleJob({hour: 18, minute: 20}, () => {
  checkedIn.forEach(user => {
    events.checkOut(user, {}, process.env.STUDENTS_CHANNEL, 'timeout');
  });
  checkedIn = [];
});

function doorbell(user, channel) {
  var params = {
    icon_url: 'icon.png',
  };
  var message = {
    "attachments": [
      {
        "text": "Once inside please click the button below",
        "callback_id": "gotin",
        "color": "#3AA3E3",
        "attachment_type": "default",
        "actions": [
          {
            "name": "yes",
            "text": "Got In!",
            "type": "button",
            "value": "gotin",
          },
        ],
      },
    ],
  };
  bot.postMessage(process.env.KEY_CHANNEL, `<@${user}> is at the door.`, params)
    .then((response) => {
      bot.postEphemeral(channel, user, 'Did you get in?', message);
    });
};
function gotIn(user, channel) {
  bot.postMessage(process.env.KEY_CHANNEL, "I'm in!", {});
};
function standup(user, channel, trigger_id) {
  let currentStudent = students.find(s => s.slack_id === user);
  if (!currentStudent.submitted) {
    axios({
      'method': 'post',
      'url': 'https://slack.com/api/dialog.open',
      'headers': {
        'Authorization': 'Bearer ' + process.env.OAUTH_ACCESS_TOKEN,
        'content-type': 'application/json',
      },
      'data': {
        'trigger_id': trigger_id,
        'dialog': {
          'callback_id': 'standupResponse',
          'title': 'Daily Standup',
          'submit_label': 'Submit',
          'notify_on_cancel': true,
          'elements': [
            {
              'type': 'textarea',
              'label': 'What did you do since yesterday?',
              'name': 'yesterday',
            },
            {
              'type': 'textarea',
              'label': 'What will you do today?',
              'name': 'today',
            },
            {
              'type': 'textarea',
              'label': 'Is anything blocking your progress?',
              'name': 'blockers',
            },
          ],
        },
      },
    })
    .catch(err => {
      console.log(`error in standup was ${err}`);
    });
  } else {
    var params = {
      icon_emoji: ':smiley:',
    };
    bot.postEphemeral(channel, user, 'You have already submitted your standup for today.', params);
  }
};
function cancelStandup(user, channel) {
  var params = {
    icon_emoji: ':sadpepe:',
  };
  bot.postEphemeral(channel, user, 'Please submit your standup later today.', params);
};
function submitStandup(user, channel, submission) {
  let currentStudent = students.find(s => s.slack_id === user);
  currentStudent.yesterday = submission.yesterday;
  currentStudent.today = submission.today;
  currentStudent.blockers = submission.blockers;
  currentStudent.submitted = true;
  currentStudent.date = new Date(Date.now());
  var params = {
    icon_emoji: ':pepedance:',
  };
  bot.postEphemeral(channel, user, `Have a great day!`, params);
  adminReport();
};
function checkIn(user, loc, channel) {
  if (checkedIn.includes(user)) {
    // can't check in if already checked in
    // post message "you have already checked in"

    var params = {
      icon_emoji: ':x:',
    };
    bot.postEphemeral(channel, user, 'You have already checked in!', params);

  } else {
    // post message "you have checked in"
    const isNearby = (loc.lat && loc.long) && (Math.abs(loc.lat - process.env.LAT) < 0.0001 && Math.abs(loc.long - process.env.LONG) < 0.0001);

    axios.post('/api/logs/checkIn', `user=${user}&lat=${loc.lat}&long=${loc.long}`,
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        baseURL: process.env.BASE_URL,
      })
      .then((response) => {
        if (response.status === 200) {
          var params = {
            icon_emoji: ':heavy_check_mark:',
          };
          bot.postEphemeral(channel, user, 'You have checked in!', params);
          checkedIn.push(user);
          if (process.env.EXTERNAL_LOGGING) {
            axios.post(process.env.EXTERNAL_LOGGING_URL,
              {
                user,
                method: 'checkin',
                loc,
                isNearby,
                token: process.env.EXTERNAL_LOGGING_TOKEN,
              }
            );
          };
        } else {
          var params = {
            icon_emoji: ':x:',
          };
          bot.postEphemeral(channel, user, 'Error', params);
        }
      })
      .catch(err => {
        console.log(err);
        checkedIn.push(user);
        var params = {
          icon_emoji: ':x:'
        };
        bot.postEphemeral(channel, user, 'You have already checked in!', params);
      });
  }
};
function checkOut(user, loc, channel, penalty = 'none') {
  if (!checkedIn.includes(user)) {
    // can't check out if not checked in
    // post message "you have not checked in"

    var params = {
      icon_emoji: ':x:',
    };
    bot.postEphemeral(channel, user, 'You have not checked in!', params);

  } else {
    // remove from checkedIn array -> for loop, if user, remove
    // post message "you have checked out"
    const isNearby = (loc.lat && loc.long) && (Math.abs(loc.lat - process.env.LAT) < 0.0001 && Math.abs(loc.long - process.env.LONG) < 0.0001);
    if (penalty === 'none' && !isNearby) {
      penalty = 'notAtSchool';
    }

    axios.post('/api/logs/checkOut',`user=${user}&lat=${loc.lat || 0}&long=${loc.long || 0}&penalty=${penalty}`,
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        baseURL: process.env.BASE_URL,
      })
      .then((response) => {
        if (response.status === 200) {
          var params = {
            icon_emoji: ':heavy_check_mark:',
          };
          bot.postEphemeral(channel, user, penalty === 'timeout' ? ':warning: You have been automatically checked out.' : 'You have checked out!', params);
          checkedIn.splice(checkedIn.indexOf(user), 1);
          if (process.env.EXTERNAL_LOGGING) {
            axios.post(process.env.EXTERNAL_LOGGING_URL,
              {
                user,
                method: 'checkout',
                loc,
                isNearby,
                token: process.env.EXTERNAL_LOGGING_TOKEN,
              }
            );
          };
        } else {
          var params = {
            icon_emoji: ':x:',
          };
          bot.postEphemeral(channel, user, 'Error', params);
        }
      })
      .catch(err => {
        console.log(err);
        checkedIn.splice(checkedIn.indexOf(user), 1);
      });
  }
};
function adminReport() {
  students.map( reports => {
    if (reports.submitted === true && reports.reported === false) {
      let report = `
        <@${reports.slack_id}> @${reports.date.toLocaleString()}
        *${reports.questionOne}*
        - ${reports.yesterday}
        *${reports.questionTwo}*
        - ${reports.today}
        *${reports.questionThree}*
        - ${reports.blockers}
      `;
      bot.postMessage(process.env.ADMIN_REPORTS_CHANNEL, report, {mrkdwn: true})
      reports.reported = true;
    }
  })
};

// resets student standups @11:59pm.

const standupReset = schedule.scheduleJob({ hour: 23, minute: 59 }, () => {
  students.map( reports => {
    reports.reported = false;
    reports.submitted = false;
    reports.yesterday = '';
    reports.today = '';
    reports.blockers = '';
    reports.date = null;
  })
});

//9:00am stand-up reminder
const earlyReminder = schedule.scheduleJob({ hour: 9, minute: 15 }, () => {
  students.forEach(user => {
    if (!user.submitted) {
      bot.postEphemeral(
        process.env.STUDENTS_CHANNEL,
        user.slack_id,
        ":alarm_clock: Don't forget to do your Stand-Up!"
      );
    }
  });
});
//1:00pm stand-up reminder
const lateReminder = schedule.scheduleJob({ hour: 13, minute: 0 }, () => {
  students.forEach(user => {
    if (!user.submitted) {
      bot.postEphemeral(
        process.env.STUDENTS_CHANNEL,
        user.slack_id,
        ":alarm_clock: Don't forget to do your Stand-Up!"
      );
    }
  });
});

module.exports = {
  doorbell,
  gotIn,
  standup,
  cancelStandup,
  submitStandup,
  checkIn,
  checkOut,
  adminReport
};