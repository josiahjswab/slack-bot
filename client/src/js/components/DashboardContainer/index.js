import { connect } from 'react-redux';
import DashboardContainer from './DashboardContainer';
function mapStoreToProps(store) {
    return {
        students: store.dashboard.students,
        studentsBeingViewed: store.dashboard.studentsBeingViewed,
        authToken: store.dashboard.authToken,
        standupsBeingViewed: store.dashboard.standupsBeingViewed,
        activeCheckinsBeingViewed: store.dashboard.activeCheckinsBeingViewed
    };
}

export default connect(mapStoreToProps)(DashboardContainer);
