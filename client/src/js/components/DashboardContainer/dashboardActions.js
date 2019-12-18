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
      dispatch(setStudentsBeingViewed(studentsPaidAndJobseeking, authToken))
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
    dispatch(getCheckins(studentsBeingViewed, authToken));

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

function getCheckins(studentsBeingViewed, authToken) {
  return {
      type: 'GET_CHECKINS',
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

export function storeAuthToken(authToken) {
  return {
    type: 'STORE_AUTH_TOKEN',
    payload: authToken
  }
}