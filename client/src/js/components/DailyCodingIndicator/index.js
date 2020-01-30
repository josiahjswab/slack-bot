import { connect } from 'react-redux';
import DailyCodingIndicator from './DailyCodingIndicator';

function mapStoreToProps(store) {
  return {
    studentWakatimes: store.studentStats.studentWakatimes,
  };
}

export default connect(mapStoreToProps)(DailyCodingIndicator);
