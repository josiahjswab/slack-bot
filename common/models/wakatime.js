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

module.exports = function (wakatime) {
    wakatime.getHours = function (slackId, cb) {
        wakatime.find({ where: { slack_id: slackId } })
            .then(wakatimes => {
                if (wakatimes.length == 0) {let result = 'no wakatime data \n'; cb(null,result);return}
                let totalSeconds = wakatimes.reduce((accumulator, wakatime) => {
                    return accumulator + wakatime.duration;
                }, 0);
                let totalHours = Math.round(totalSeconds) / (60 * 60);
                const dayOne = new Date(wakatimes[0].date);
                const dayOneMidnight = new Date(
                    `${dayOne.getFullYear()}-
                     ${dayOne.getMonth() + 1}-
                     ${dayOne.getDate()}`
                );
                const totalDaysEnrolled =
                    Math.round((tomorrowMidnight - dayOneMidnight) / millisecondsToDays);
                let weeklyAverageHours;
                if (totalDaysEnrolled <= 7) {
                    weeklyAverageHours = totalHours;
                } else {
                    weeklyAverageHours = Math.round(totalHours / totalDaysEnrolled * 7);
                }

                // time spent in coding in the last seven days
                const wakatimesLastSevenDays = wakatimes.filter(wakatime => {
                    return new Date(wakatime.date) > sevenDaysAgoMidnight;
                });
                let timeSpentLastSevenDays = wakatimesLastSevenDays.reduce((accumulator, wakatime) => {
                    return accumulator + wakatime.duration;
                }, 0);
                timeSpentLastSevenDays = Math.round(timeSpentLastSevenDays) / (60 * 60);

                let result = `--Time coding last 7 days: ${timeSpentLastSevenDays.toFixed(2)}hrs \n --Daily Average hours coding: ${(weeklyAverageHours.toFixed(2) / 7).toFixed(2)} \n --Total hours coding: ${totalHours.toFixed(2)} \n`
                cb(null, result);
            })
            .catch(err => console.log(err));
    };


    wakatime.remoteMethod(
        'getHours', {
        http: {
            path: '/wakatime/:slack_id',
            verb: 'get',
        },
        accepts: {
            arg: 'slack_id',
            type: 'string',
            required: true,
            http: { source: 'path' },
        },
        returns: { arg: 'checkins', type: ['checkin'], root: true },
    }
    );

};