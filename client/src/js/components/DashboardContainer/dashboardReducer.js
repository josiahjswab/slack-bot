const defaultState = {
  students: [],
  studentsBeingViewed: [],
  standupsBeingViewed: [],
  activeCheckinsBeingViewed: [],
  activeCheckinsToday: [],
  absences: [],
  cronjob: [],
};
export default function dashboardReducer(state = defaultState, action) {
  const { type, payload } = action;
  switch (type) {
    case "SAVE_STUDENT_DATA": {
      return {
        ...state,
        students: payload
      };
    }

    case "SAVE_STUDENT_DATA_FULFILLED": {
      return {
        ...state,
        students: [...state.students, payload]
      };
    }

    case "GET_STUDENT_DATA_FULFILLED": {
      return {
        ...state,
        students: payload
      };
    }

    case "SET_STUDENTS_BEING_VIEWED": {
      return {
        ...state,
        studentsBeingViewed: payload
      };
    }

    case "GET_STANDUPS_FULFILLED": {
      return {
        ...state,
        standupsBeingViewed: payload
      };
    }

    case "GET_CHECKINS_TODAY_FULFILLED": {
      return {
        ...state,
        activeCheckinsToday: payload
      };
    }

    case "GET_CHECKINS_VIEWED_FULFILLED": {
      return {
        ...state,
        activeCheckinsBeingViewed: payload
      };
    }
    case "SEND_ABSENCES_FULFILLED": {
      return {
        ...state,
        absences: payload
      };
    }
    case "POST_CRONJOB_FULLFILLED": {
      return {
        ...state,
        cronjob: payload
      };
    }

    default: {
      return state;
    }
  }
}
