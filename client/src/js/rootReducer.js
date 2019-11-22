import { combineReducers } from 'redux';
import dashboardReducer from './components/DashboardContainer/dashboardReducer';
import studentStatsReducer from './components/studentStatsReducer';
const rootReducer = combineReducers({
    dashboard: dashboardReducer,
    studentStats: studentStatsReducer
});
export default rootReducer;
