'use strict';
const moment = require('moment');

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

function calculateDashboardStandupsData(standups, students) {
  const todaysStandups = standups.filter(standup => {
    return new Date(standup.date) > todayMidnight;
  });
  const uniqueStandupsToday = [...new Set(todaysStandups.map(standup => {
    return standup.slack_id;
  }))];
  const delinquents = students.filter(student => {
    return !uniqueStandupsToday.some(slackId => {
      return student.slack_id === slackId;
    });
  });
  const nonDelinquents = students.filter(student => {
    return uniqueStandupsToday.some(slackId => {
      return student.slack_id === slackId;
    });
  });
  const todaysStandupPercent = Math.round((uniqueStandupsToday.length /
    students.length) * 100);
  return {
    summary: [
      {
        featured: `${todaysStandupPercent}%`,
        fraction: `${uniqueStandupsToday.length} / ${students.length}`,
        footer: 'today',
      },
    ],
    delinquents,
    nonDelinquents,
  };
}

function calculateDashboardCheckinData(activeCheckins, students) {
  // assumes a student cannot have more than one active checkin
  // u gotta filter activeCheckins to be 'activeCheckinsToday'
  const checkinPercent =
    Math.round((activeCheckins.length / students.length) * 100);
  const absentees = students.filter(student => {
    return !activeCheckins.some(checkin => {
      return student.slack_id === checkin.slack_id;
    });
  });
  const presentAtHome = students.filter(student => {
    return activeCheckins.some(checkin => {
      student.notAtSchool = checkin.notAtSchool;
      return (student.slack_id === checkin.slack_id &&
              checkin.notAtSchool === true );
    });
  });
  const presentAtSchool = students.filter(student => {
    return activeCheckins.some(checkin => {
      student.notAtSchool = checkin.notAtSchool;
      return (student.slack_id === checkin.slack_id &&
              checkin.notAtSchool === false );
    });
  });
  return {
    summary: [
      {
        featured: `${checkinPercent}%`,
        fraction: `${activeCheckins.length} / ${students.length}`,
        footer: 'checked in',
      },
    ],
    delinquents: absentees,
    atHome: presentAtHome,
    atSchool: presentAtSchool,
  };
}

function calculateAbsentees(activeCheckinsToday, students) {
  // assumes a student cannot have more than one active checkin
  let slack_ids = {};
  activeCheckinsToday.forEach(checkin => slack_ids[checkin.slack_id] = 1)
  let absentees = students.filter(student => 
      !(student.slack_id in slack_ids) && student.type == "PAID"
  );
  return absentees;
}

function calculateIndividualStandupsData(standups) {
  if (standups.length === 0) { return 0; }
  // standups completed in the last seven days
  const standupsLastSevenDays = standups.filter(standup => {
    return new Date(standup.date) > sevenDaysAgoMidnight;
  });
  const standupsLastSevenDaysDates = standupsLastSevenDays.map(standup => {
    const standupDate = new Date(standup.date);
    return (
    `${standupDate.getFullYear()} - ${standupDate.getMonth() + 1} - ${standupDate.getDate()}`
    );
  });
  const uniqueStandupsLastSevenDays =
    [...new Set(standupsLastSevenDaysDates)];

    const weekOfStandupsPercent =
    Math.round((uniqueStandupsLastSevenDays.length / 7) * 100);
  // standups completed during entire enrollment (assuming standup submitted on day 1)
  const dayOne = new Date(standups[0].date);

  const dayOneMidnight = midnight(dayOne);
  const totalDaysEnrolled = Math.round((tomorrowMidnight - dayOneMidnight)/ millisecondsToDays);
  const standupsDates = standups.map(standup => {
    const standupDate = new Date(standup.date);
    return (
      `${standupDate.getFullYear()}-${standupDate.getMonth() + 1}-${standupDate.getDate()}`);
  });

  const uniqueDaysWithStandups = [...new Set(standupsDates)];
  const averageStandupPercent = Math.round((uniqueDaysWithStandups.length / totalDaysEnrolled) * 100);
  return ([
    {
      // featured: `${weekOfStandupsPercent}%`,
      featured: `${uniqueStandupsLastSevenDays.length} / 7`,
      footer: 'Standups completed past 7 days',
    },
    {
      featured: `${averageStandupPercent}%`,
      fraction: `${uniqueDaysWithStandups.length} / ${totalDaysEnrolled}`,
      footer: 'Standups completed total average',
    },
  ]);
}

function calculateIndividualCheckinData(checkins) {
  if (checkins.length === 0) { return null; }
  // total time spent in classroom
  checkins.forEach(checkin => {
    if (!checkin.checkout_time) {
      checkin.hours = (new Date() - new Date(checkin.checkin_time)) /
        millisecondsToHours;
    }
  });
  let totalHours = checkins.reduce((accumulator, checkin) => {
    return accumulator + checkin.hours;
  }, 0);

  totalHours = Math.round(totalHours);

  // weekly average = daily average * 7, but only if student has already been
  // enrolled for at least one week
  const dayOne = new Date(checkins[0].checkin_time);
  const dayOneMidnight = midnight(dayOne);
  const totalDaysEnrolled =
    Math.round((tomorrowMidnight - dayOneMidnight) / millisecondsToDays);
  let weeklyAverageHours;
  if (totalDaysEnrolled <= 7) {
    weeklyAverageHours = totalHours;
  } else {
    weeklyAverageHours = Math.round((totalHours / totalDaysEnrolled) * 7);
  }

  // time spent in classroom in the last seven days
  const checkinsLastSevenDays = checkins.filter(checkin => {
    return new Date(checkin.checkin_time) > sevenDaysAgoMidnight;
  });

  let timeSpentLastSevenDays =
    checkinsLastSevenDays.reduce((accumulator, checkin) => {
      return accumulator + checkin.hours;
    }, 0);
  timeSpentLastSevenDays = Math.round(timeSpentLastSevenDays);
  //missed checkins in the last seven days
  const completedCheckinsLastSevenDays = checkins.filter(checkin => {
    return new Date(checkin.checkin_time) > sevenDaysAgoMidnight;
  });

  let autoCheckoutsLastSevenDays =
      completedCheckinsLastSevenDays.reduce((accumulator, checkin) => {
       if(checkin.auto_checkout){accumulator++};
       return accumulator;
    }, 0);
  return ([
    {
      featured: `${timeSpentLastSevenDays}`,
      measurement: 'hrs',
      footer: 'Time in class past 7 days',
    }, {
      featured: `${weeklyAverageHours}`,
      measurement: 'hrs',
      footer: 'Time in class weekly average',
    }, {
      featured: `${totalHours}`,
      measurement: 'hrs',
      footer: 'Time in class total hours',
    }, {
      featured: `${autoCheckoutsLastSevenDays}`,
      measurement: '',
      footer: 'weekly auto-checkouts'
    }
  ]);
}

function calculateIndividualWakatimeData(wt) {

    let totalHours = 0;
    wt.forEach(obj => totalHours += obj.duration);
  
    let lastSevenDays = wt.filter(obj => moment(obj.date).isAfter(moment().utc().subtract(7, 'days').startOf('day')));
  
    let totalDaysEnrolled;
    if (lastSevenDays.length == 0) {
      totalDaysEnrolled = 0;
    } else {
      totalDaysEnrolled = moment().diff(moment(lastSevenDays[0].date), 'days');
    }
  
  
    let timeSpentLastSevenDays = 0;
    lastSevenDays.forEach(obj => timeSpentLastSevenDays += obj.duration);
  
    let weeklyAverageHours;
    if (totalDaysEnrolled) {
      weeklyAverageHours = timeSpentLastSevenDays / totalDaysEnrolled;
    } else {
      weeklyAverageHours = 0;
    }
  
    return ([
      {
        featured: `${(timeSpentLastSevenDays/3600).toFixed(2)}`,
        measurement: 'hrs',
        footer: 'Time coding past 7 days',
      }, {
        featured: `${(weeklyAverageHours/3600).toFixed(2)}`,
        measurement: 'hrs',
        footer: 'Time coding weekly average',
      }, {
        featured: `${(totalHours/3600).toFixed(2)}`,
        measurement: 'hrs',
        footer: 'Time coding total hours',
      },
    ]);
  }
  
  function calculateIndividualCommitData(commits) {
    const lastSevenDays = moment().subtract(7,'d').format('YYYY-MM-DD');
    if (commits.length == 0) {
      return 0;
    };    
    const commitDays = commits.filter(commit => 
      moment(commit.date).format('YYYY-MM-DD') > lastSevenDays
    );
    let commitsLastSevenDays = commitDays.reduce((accumulator, github) => {
      return accumulator + github.commits;
    }, 0);				
    
    return commitsLastSevenDays
  }
  
  function mergeStudentData(studentStandupsAndCheckins) {
    let mergedData = {};
    const checkins = studentStandupsAndCheckins[1];
    for (let i = 0; i < checkins.length; i++) {
      const formattedDate = moment(checkins[i].checkin_time).format("L dddd");
      if (!mergedData[formattedDate]) {
        mergedData[formattedDate] = {};
      }
      mergedData[formattedDate]["checkin"] = checkins[i];
    }
  
    const standups = studentStandupsAndCheckins[0];
    for (let i = 0; i < standups.length; i++) {
      const formattedDate = moment(standups[i].date).format("L dddd");
      if (!mergedData[formattedDate]) {
        mergedData[formattedDate] = {};
      }
      mergedData[formattedDate]["standup"] = standups[i];
    }
  
    return mergedData;
  }
  
module.exports = {
  calculateAbsentees,
  calculateDashboardCheckinData,
  calculateDashboardStandupsData,
  calculateIndividualStandupsData,
  calculateIndividualCheckinData,
  calculateIndividualWakatimeData,
  calculateIndividualCommitData,
  mergeStudentData
};
