import { combineReducers } from 'redux';
import dashboardreducer from './components/DashboardContainer/reducer'
const rootReducer = combineReducers({
    dashboard: dashboardreducer
});
export default rootReducer;
