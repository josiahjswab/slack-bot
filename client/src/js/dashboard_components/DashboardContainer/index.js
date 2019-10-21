import { connect } from 'react-redux';
import DashboardContainer from './DashboardContainer';
function mapStoreToProps(store) {
    return {
        students: store.dashboard.students,
        studentsBeingViewed: store.dashboard.studentsBeingViewed,
        authToken: store.dashboard.authToken,
        allStandups: store.dashboard.allStandups,
        activeCheckins: store.dashboard.activeCheckins
    };
}
export default connect(mapStoreToProps)(DashboardContainer);