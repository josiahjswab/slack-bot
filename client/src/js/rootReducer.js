import { combineReducers } from 'redux';
import DashboardContainerReducer from './dashboard_components/DashboardContainer/DashboardContainerReducer' 
const rootReducer = combineReducers({
    dashboard: DashboardContainerReducer
});
export default rootReducer;