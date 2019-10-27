const defaultState = {
  students: [],
  studentsBeingViewed: [],
  allStandups: [],
  activeCheckins: [],
  absences: []
};
export default function dashboardreducer(state = defaultState, action) {
  const { type, payload } = action;
  switch (type) {
    case "ADD_STUDENTS_TO_STORE": {
      return {
        ...state,
        students: payload
      };
    }

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

    case "GET_STUDENT_DATA": {
      return {
        ...state,
        students: payload
      };
    }

    case "GET_STUDENT_DATA_FULFILLED": {
      return {
        ...state,
        students: payload,
        studentsBeingViewed: payload
          .filter(student => student.type == "PAID")
          .concat(payload.filter(student => student.type == "JOBSEEKER"))
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
        allStandups: payload
      };
    }

    case "GET_CHECKINS_FULFILLED": {
      return {
        ...state,
        activeCheckins: payload
      };
    }

    case "SEND_ABSENCES_FULFILLED": {
      return {
        ...state,
        absences: payload
      };
    }

    default: {
      return state;
    }
  }
}
