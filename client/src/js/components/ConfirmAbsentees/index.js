import { connect } from 'react-redux';
import ConfirmAbsentees from './ConfirmAbsentees';

function mapStoreToProps(store){
    return{
        studentsBeingViewed: store.dashboard.studentsBeingViewed,
        authToken: store.dashboard.authToken,
        activeCheckins: store.dashboard.activeCheckins
    }
}

export default connect(mapStoreToProps)(ConfirmAbsentees);
