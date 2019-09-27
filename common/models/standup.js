'use strict';

const today = new Date();

function offsetDate(initialDate, dayOffset) {
  return new Date(initialDate.setDate(initialDate.getDate() + dayOffset));
}

function midnight(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

const todayMidnight = midnight(new Date(today));
const tomorrowMidnight = midnight(offsetDate(new Date(today), 1));
const sevenDaysAgoMidnight = midnight(offsetDate(new Date(today), -6));

const millisecondsToHours = 1000 * 60 * 60;
const millisecondsToDays = 1000 * 60 * 60 * 24;

module.exports = function(standup) {
    standup.getStats = function(slackId, cb) {
        standup.find({where: {slack_id: slackId}})
          .then(standups => {
            if (standups.length === 0) {let result = 'no standup data \n';cb(null,result);return }

            // standups completed in the last seven days
            const standupsLastSevenDays = standups.filter(standup => {
              return new Date(standup.date) > sevenDaysAgoMidnight;
            });
            const standupsLastSevenDaysDates = standupsLastSevenDays.map(standup => {
              const standupDate = new Date(standup.date);
              return (
                `${standupDate.getFullYear()}-
                ${standupDate.getMonth() + 1}-
                ${standupDate.getDate()}`
              );
            });
            const uniqueStandupsLastSevenDays =
              [...new Set(standupsLastSevenDaysDates)];
          
            const weekOfStandupsPercent =
              Math.round((uniqueStandupsLastSevenDays.length / 7) * 100);
          
            // standups completed during entire enrollment (assuming standup submitted on day 1)
            const dayOne = new Date(standups[standups.length - 1].date);
            const dayOneMidnight = midnight(dayOne);
            const totalDaysEnrolled =
              Math.round((tomorrowMidnight - dayOneMidnight) / millisecondsToDays);
            const standupsDates = standups.map(standup => {
              const standupDate = new Date(standup.date);
              return (
                `${standupDate.getFullYear()}-
                ${standupDate.getMonth() + 1}-
                ${standupDate.getDate()}`
              );
            });
            const uniqueDaysWithStandups = [...new Set(standupsDates)];
            const averageStandupPercent =
              Math.round((uniqueDaysWithStandups.length / totalDaysEnrolled) * 100);
            let result = `--Standups completed in the last 7 days : ${ uniqueStandupsLastSevenDays.length } / 7 \n`
            cb(null, result);
          })
          .catch(err => console.log(err));
      };



    standup.remoteMethod(
        'getStats', {
          http: {
            path: '/standups/:slack_id',
            verb: 'get',
          },
          accepts: {
            arg: 'slack_id',
            type: 'string',
            required: true,
            http: {source: 'path'},
          },
          returns: {arg: 'checkins', type: ['checkin'], root: true},
        }
      );

};