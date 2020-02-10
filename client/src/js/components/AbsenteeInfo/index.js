import { connect } from 'react-redux';
import AbsenteeInfo from './AbsenteeInfo';

function mapStoreToProps(store) {
    return {
        studentAbsences: store.studentStats.studentAbsences,
        studentInfo: store.studentStats.studentInfo,
        toggleWindow: store.absenteeInfo.toggleWindow,
        currentId: store.absenteeInfo.currentId,
        currentDate: store.absenteeInfo.currentDate,
        notes: store.absenteeInfo.notes,
        excused: store.absenteeInfo.excused,
        studentData: store.absenteeInfo.studentData,
    };
}

export default connect(mapStoreToProps)(AbsenteeInfo);
