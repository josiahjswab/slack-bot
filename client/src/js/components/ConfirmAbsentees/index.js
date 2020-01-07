import { connect } from 'react-redux';
import ConfirmAbsentees from './ConfirmAbsentees';

function mapStoreToProps(store){
    return{
        students: store.dashboard.students,
        authToken: store.dashboard.authToken,
        activeCheckinsToday: store.dashboard.activeCheckinsToday,
    }
}

export default connect(mapStoreToProps)(ConfirmAbsentees);
