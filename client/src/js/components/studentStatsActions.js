import { mergeStudentData } from "../../../../common/utilities";

function getStudentStats(id, authToken, slack_id) {
  return dispatch => {
    const standups = dispatch({
      type: "GET_STUDENT_STANDUPS",
      payload: fetch(`/api/students/${id}/standups?access_token=${authToken}`)
        .then(response => response.json())
        .then(standups => {
          return standups;
        })
    });

    const checkins = dispatch({
      type: "GET_STUDENT_CHECKINS",
      payload: fetch(
        `/api/checkins/slackId/${slack_id}?access_token=${authToken}`
      )
        .then(response => response.json())
        .then(checkins => {
          return checkins;
        })
    });

    const userFilter = JSON.stringify({
      where: {
        slack_id: slack_id
      }
    });

    dispatch({
      type: "GET_STUDENT_WAKATIMES",
      payload: fetch(
        `/api/wakatimes/?access_token=${authToken}&filter=${userFilter}`
      )
        .then(response => response.json())
        .then(wakatimes => {
          return wakatimes;
        })
    });

    dispatch({
      type: "GET_STUDENT_COMMITS",
      payload: fetch(`/api/commits/getWeeklyCommits/${slack_id}?isNumber=true&access_token=${authToken}`)
        .then(response => response.json())
        .then(commits => {
          return commits;
        })
    });

    dispatch({
      type: 'GET_ABSENCES',
      payload: fetch(`/api/absences?access_token=${authToken}&filter=${userFilter}`)
        .then(response => response.json())
        .then(absences => {
          return absences;
        })
    })

    Promise.all([standups, checkins]).then(standupsAndCheckins =>
      dispatch({
        type: "GET_STANDUPS_AND_CHECKINS",
        payload: mergeStudentData([standupsAndCheckins[0].value, standupsAndCheckins[1].value])
      })
    );
  };
}

export function getStudentInfo(id, authToken) {
  return dispatch => {
    return dispatch({
      type: "GET_STUDENT_INFO",
      payload: fetch(`/api/students/${id}?access_token=${authToken}`)
        .then(response => response.json())
        .then(data => {
          return data;
        })
    }).then(student => {
      dispatch(getStudentStats(id, authToken, student.value.slack_id));
    });
  };
}

export function updateStudentInfo(id, editedStudentInfo, authToken) {
  return dispatch => {
    fetch(`/api/students/${id}?access_token=${authToken}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editedStudentInfo)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          dispatch({
            type: "GET_EDIT_ERROR",
            payload: data.error.message
          });
        } else {
          dispatch({
            type: "UPDATE_STUDENT_INFO",
            payload: data
          })
          switch (editedStudentInfo.type) {
            case "PAID":
              console.log("PAID")
              fetch(`/admin/student-summary/createStudentRoleMapping/${editedStudentInfo.slack_id}?auth_token=${authToken}`).then(res => console.log(res))
              break;
            case "DISABLED":
              console.log("DISABLED")
              fetch(`/admin/student-summary/deleteStudentRoleMapping/${editedStudentInfo.slack_id}?auth_token=${authToken}`).then(res => console.log(res))
              break;

            default:
              break;
          }
        }
      });
  };
}

export function toggleEditWindow(isOpen) {
  return dispatch => {
    dispatch({
      type: "TOGGLE_EDIT_WINDOW",
      payload: isOpen
    });
  };
}

export function toggleAccWindow(isOpen) {
  return dispatch => {
    dispatch({
      type: "TOGGLE_ACC_PARTNER_WINDOW",
      payload: isOpen
    });
  };
}

export function toggleAbsenceWindow(isOpen) {
  return dispatch => {
    dispatch({
      type: "TOGGLE_ABSENTEE_WINDOW",
      payload: isOpen
    });
  };
}

export function updateAbsence(id, notes, excused, authToken, slack_id, date) {
  const userFilter = JSON.stringify({
    where: {
      slack_id: slack_id
    }
  });
  return dispatch => {
    dispatch({
      type: "PUT_ABSENCE",
      payload: fetch(`/api/absences?access_token=${authToken}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          slack_id: slack_id,
          date: date,
          excused: excused,
          notes: notes,
          id: id
        })
      })
        .then(
          dispatch({
            type: 'UPDATES_ABSENT_STUDENTS',
            payload: fetch(`/api/absences?access_token=${authToken}&filter=${userFilter}`)
              .then(res => res.json())
              .then(data => {
                return data;
              })
          })
        )
    });
  };
}
