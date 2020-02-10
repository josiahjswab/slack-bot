import { combineReducers } from 'redux';
import dashboardReducer from './components/DashboardContainer/dashboardReducer';
import studentStatsReducer from './components/studentStatsReducer';
import absenteeReducer from './components/AbsenteeInfo/absenteeReducer';

const rootReducer = combineReducers({
    dashboard: dashboardReducer,
    studentStats: studentStatsReducer,
    absenteeInfo: absenteeReducer
});
export default rootReducer;
