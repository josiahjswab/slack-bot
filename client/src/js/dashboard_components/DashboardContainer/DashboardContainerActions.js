export function getStudentData(authToken) {
    return {
        type: 'GET_STUDENT_DATA',
        payload: fetch(`/api/students?access_token=${authToken}`)
        .then(response => response.json())
        .then(data => { let students = data.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
          return students;
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

export function setStudentsBeingViewed(studentsBeingViewed) {
  return {
    type: 'SET_STUDENTS_BEING_VIEWED',
    payload: studentsBeingViewed
  }
}

export function getStandups(authToken) {
  return {
      type: 'GET_STANDUPS',
      payload: fetch(`/api/standups?access_token=${authToken}`)
      .then(response => response.json())
      .then(data => { return data })
  }
}

export function getCheckins(authToken) {
  return {
      type: 'GET_CHECKINS',
      payload: fetch(`/api/checkins/active?access_token=${authToken}`)
      .then(response => response.json())
      .then(data => { return data })
  }
}
