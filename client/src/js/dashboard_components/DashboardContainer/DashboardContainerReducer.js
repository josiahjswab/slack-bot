const defaultState = {
    students: []
};
export default function DashboardContainerReducer(state = defaultState, action) {
    const { type, payload } = action;
    switch (type) {
        case 'ADD_STUDENT_TO_STORE': {
            return {
                ...state,
                students: payload
            };
        }
        default: {
            return state;
        }
    }
}