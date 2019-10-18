import { connect } from 'react-redux';
import DashboardContainer from './DashboardContainer';
function mapStoreToProps(store) {
    return {
        students: store.dashboard.students,
    };
}
export default connect(mapStoreToProps)(DashboardContainer);