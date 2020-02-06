const defaultState = {
  studentInfo: {},
  studentStandups: [],
  studentCheckins: [],
  studentWakatimes: [],
	studentCommits: [],
  studentStandupsAndCheckins: [],
  errMessage: "",
  editWindowOpen: false,
  accPartnerWindowOpen: false,
  studentAbsences: [],
};
export default function studentStatsReducer(state = defaultState, action) {
  const { type, payload } = action;
  switch (type) {
    case "GET_STUDENT_INFO_FULFILLED": {
      return {
        ...state,
        studentInfo: payload
      };
    }
    case "GET_STUDENT_STANDUPS_FULFILLED": {
      return {
        ...state,
        studentStandups: payload
      };
    }
    case "GET_STUDENT_CHECKINS_FULFILLED": {
      return {
        ...state,
        studentCheckins: payload
      };
    }
    case "GET_STUDENT_WAKATIMES_FULFILLED": {
      return {
        ...state,
        studentWakatimes: payload
      };
    }
		case "GET_STUDENT_COMMITS_FULFILLED": {
      return {
        ...state,
        studentCommits: payload
      };
    }
    case "GET_STANDUPS_AND_CHECKINS": {
      return {
        ...state,
        studentStandupsAndCheckins: payload
      };
    }
    case "UPDATE_STUDENT_INFO": {
      return {
        ...state,
        studentInfo: payload,
        errMessage: "",
        editWindowOpen: false
      };
    }
    case "GET_EDIT_ERROR": {
      return {
        ...state,
        errMessage: payload
      }
    }
    case "TOGGLE_EDIT_WINDOW": {
      return {
        ...state,
        editWindowOpen: payload
      }
    }
    case "TOGGLE_ACC_PARTNER_WINDOW": {

      return {
        ...state,
        accPartnerWindowOpen: payload,
      }
    }

    case "GET_ABSENCES_FULFILLED": {
      return {
        ...state,
        studentAbsences: payload
      };
    }

    default: {
      return state;
    }
  }
}
