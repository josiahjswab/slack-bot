const moment = require('moment')

export function getStudentData(authToken) {
  return dispatch => {
    return dispatch({
      type: 'GET_STUDENT_DATA',
      payload: fetch(`/api/students?access_token=${authToken}`)
      .then(response => response.json())
      .then(
        data => { let students = data.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        return students;
      })
    }).then((students)=>{
      let studentsPaid = students.value.filter(student => student.type == "PAID");
      let studentsJobseeking = students.value.filter(
        student => student.type == "JOBSEEKER"
      );
      let studentsPaidAndJobseeking = studentsPaid.concat(studentsJobseeking);
      dispatch(getCheckinsToday(authToken));
      dispatch(setStudentsBeingViewed(studentsPaidAndJobseeking, authToken));
    })
  }
}

function getCheckinsToday(authToken) {
  return {
    type: 'GET_CHECKINS_TODAY',
    payload: fetch(`/api/checkins?access_token=${authToken}`)
    .then(response => response.json())
    .then(data => {
      let today = moment().format('L');
      let checkinsToday = data.filter( checkin => 
        moment(checkin.checkin_time).format('L') == today
      )
      return checkinsToday;
    })
}
}

export function saveStudentData(studentData, authToken) {
    return {
        type: 'SAVE_STUDENT_DATA',
        payload: fetch(`/api/students?access_token=${authToken}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData)
          })
            .then(response => response.json())
    }
}

export function setStudentsBeingViewed(studentsBeingViewed, authToken) {
  return dispatch => {
    dispatch({
      type: 'SET_STUDENTS_BEING_VIEWED',
      payload: studentsBeingViewed
    });

    dispatch(getStandups(studentsBeingViewed, authToken));
    dispatch(getCheckinsViewed(studentsBeingViewed, authToken));

  };
}

function getStandups(studentsBeingViewed, authToken) {
  return {
      type: 'GET_STANDUPS',
      payload: fetch(`/api/standups?access_token=${authToken}`)
      .then(response => response.json())
      .then(data => {
        let slack_ids = {};
        studentsBeingViewed.forEach(student => slack_ids[student.slack_id] = 1)
        let standupsViewed = data.filter(standup => 
            standup.slack_id in slack_ids
          );
         
        return standupsViewed;
       })
  }
}

function getCheckinsViewed(studentsBeingViewed, authToken) {
  return {
      type: 'GET_CHECKINS_VIEWED',
      payload: fetch(`/api/checkins?access_token=${authToken}`)
      .then(response => response.json())
      .then(data => {
        let slack_ids = {};
        studentsBeingViewed.forEach(student => slack_ids[student.slack_id] = 1)
        let checkinsViewed = data.filter(checkin => 
            checkin.slack_id in slack_ids
          );
         
        return checkinsViewed;
      })
  }
}

export function sendAbsences(slack_ids, authToken) {
  return {
    type: 'SEND_ABSENCES',
    payload: fetch(`/api/absences?access_token=${authToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slack_ids)
    })
      .then(response => response.json())
  }
}

export function sendCronJob(post ,authToken) {
  return {
    type: 'POST_CRONJOB',
    payload: fetch(`/api/messages?access_token=${authToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post)
    })
    .then(response => response.json())
  }
}
