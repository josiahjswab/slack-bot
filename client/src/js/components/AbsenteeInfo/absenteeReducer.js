const defaultState = {
    toggleWindow: false,
    currentId: '',
    currentDate: '',
    notes: '',
    excused: false,
    studentData: '',
  };
  
export default function absenteeInfo (state = defaultState, action) {
    const { type, payload } = action;
    switch (type) {
      case "TOGGLE_WINDOW": {
        return {
          ...state,
          toggleWindow: payload
        }
      }
      case "GET_CURRENT_ID": {
          return {
              ...state,
              currentId: payload
          }
      }
      case "GET_CURRENT_DATE": {
          return {
              ...state,
              currentDate: payload
          }
      }
      case "GET_NOTES": {
          return {
              ...state,
              notes: payload
          }
      }
      case "GET_EXCUSED": {
          return {
              ...state,
              excused: payload
          }
      }

      case "GET_DATA": {
          return {
              ...state,
              studentData: payload
          }
      }
      default: {
        return state;
      }
    }
}
