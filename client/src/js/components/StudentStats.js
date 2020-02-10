import React, { Component } from 'react';
import { connect } from 'react-redux';
import StandupAndCheckin from './StandupAndCheckin';
import HamburgerNavigation from './HamburgerNavigation';
import DataSectionForStudentStats from './DataSectionForStudentStats';
import {
  calculateIndividualCheckinData,
  calculateIndividualStandupsData,
  calculateIndividualWakatimeData,
} from '../../../../common/utilities';
import EditStudent from './EditStudent';
import AccPartnerInfo from './AccPartnerInfo';
import AbsenteeInfo from './AbsenteeInfo';
import {
  getStudentInfo,
  updateStudentInfo,
  toggleEditWindow,
  toggleAccWindow,
  toggleAbsenceWindow,
} from './studentStatsActions';
import StudentStatsDownload from './StudentStatsDownload';
import DailyCodingIndicator from './DailyIndicators/DailyCodingIndicator';

class Standups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: {},
    };
    this.saveStudentData = this.saveStudentData.bind(this);
    this.openEditWindow = this.openEditWindow.bind(this);
    this.closeEditWindow = this.closeEditWindow.bind(this);
    this.toggleAccPartnerWindow = this.toggleAccPartnerWindow.bind(this);
    this.toggleAbsenteeWindow = this.toggleAbsenteeWindow.bind(this);
  }

  componentDidMount() {
    const id = this.props.location.pathname.replace("/admin/student-summary/", "");
    const { dispatch } = this.props;
    dispatch(getStudentInfo(id, localStorage.getItem('token')));
  }

  toggle(panel) {
    this.setState({
      display: {
        ...this.state.display,
        [panel]: !this.state.display[panel]
      }
    });
  }

  toggleAccPartnerWindow() {
    const { dispatch } = this.props;
    dispatch(toggleAccWindow(!this.props.accPartnerWindowOpen));
  }

  toggleAbsenteeWindow() {
    const { dispatch } = this.props;
    dispatch(toggleAbsenceWindow(!this.props.absenteeWindowOpen));
  }

  closeEditWindow(event, override) {
    if (event.target === event.currentTarget || override) {
      const { dispatch } = this.props;
      dispatch(toggleEditWindow(!this.props.editWindowOpen));
    }
  }

  openEditWindow() {
    const { dispatch } = this.props;
    dispatch(toggleEditWindow(!this.props.editWindowOpen));
  }

  saveStudentData(studentData) {
    const id = this.props.location.pathname.replace("/admin/student-summary/", "");
    const { dispatch } = this.props;
    dispatch(updateStudentInfo(id, studentData, localStorage.getItem('token')));
  }

  render() {
    function sortByDate(a, b) {
      let arrA = a[0].split('/')
      let arrB = b[0].split('/')
      if (parseInt(arrA[2].substring(0, 4)) > parseInt(arrB[2].substring(0, 4))) {
        return -1;
      }
      else if (parseInt(arrA[2].substring(0, 4)) < parseInt(arrB[2].substring(0, 4))) {
        return 1;
      }
      else if (parseInt(arrA[0]) > parseInt(arrB[0])) {
        return -1;
      }
      else if (parseInt(arrA[0]) < parseInt(arrB[0])) {
        return 1;
      }
      else if (parseInt(arrA[1]) > parseInt(arrB[1])) {
        return -1;
      }
      else if (parseInt(arrA[1]) < parseInt(arrB[1])) {
        return 1;
      }
      else {
        return 0;
      }
    };

    let StandupAndCheckinComponent;
    let standupsData = [];
    if (this.props.studentStandups.length) {
      standupsData = calculateIndividualStandupsData(
        this.props.studentStandups
      );
    }
    let commitData = [];
    if (this.props.studentCommits) {
      commitData = {
        featured: this.props.studentCommits,
        measurement: '',
        footer: 'Commits past 7 days',
      }
    }
    let absencesData = [];
    if (this.props.studentAbsences) {
      absencesData = {
        featured: this.props.studentAbsences.length,
        measurement: '',
        footer: 'Total Absences'
      }
    }

    let checkinData = [];
    if (this.props.studentCheckins) {
      checkinData = calculateIndividualCheckinData(this.props.studentCheckins);
    }
    let wakatimeData = [];
    if (this.props.studentWakatimes.length > 0) {
      wakatimeData = calculateIndividualWakatimeData(
        this.props.studentWakatimes
      );
    }
    if (Object.keys(this.props.studentStandupsAndCheckins).length > 0) {
      StandupAndCheckinComponent = Object.entries(
        this.props.studentStandupsAndCheckins
      )
        .sort(sortByDate)
        .map(data => (
          <StandupAndCheckin
            key={data[0]}
            date={data[0]}
            checkin={data[1].checkin}
            standup={data[1].standup}
          />
        ));
    } else {
      StandupAndCheckinComponent = (
        <div className="standup-card">
          {`${this.props.studentInfo.name} has not submitted any standups and has not checked in.`}
        </div>
      );
    }

    let editStudentWindow = null;
    if (this.props.editWindowOpen) {
      editStudentWindow = (
        <EditStudent
          studentData={this.props.studentInfo}
          closeWindow={() => this.closeEditWindow}
          save={this.saveStudentData}
          errorMessage={this.props.errMessage}
        />
      );
    }

    let accPartnerWindow = null;
    if (this.props.accPartnerWindowOpen) {
      accPartnerWindow = (
        <AccPartnerInfo
          accPartnerData={this.props.studentInfo}
          closeWindow={() => this.toggleAccPartnerWindow}
        />
      )
    }

    let absenteeWindow = null;
    if (this.props.absenteeWindowOpen) {
     
      absenteeWindow = (
        <AbsenteeInfo
          closeWindow={() => this.toggleAbsenteeWindow}
          auth_token={localStorage.getItem('token')}
        />
      )
    }

    let keyMetrics = [];
    let keyClassMetrics = [];
    let keyStandupMetrics = [];
    let keyCodingMetrics = [];
    let keyCommitMetrics = [];
    let keyAbsenceMetrics = [];

    if (!!checkinData) {
      keyClassMetrics = checkinData.filter(function (obj) {
        return (obj.footer == "Time in class past 7 days") || (obj.footer == "weekly auto-checkouts");
      });
    }

    if (!!commitData) {
      keyCommitMetrics = [commitData];
    }

    if (!!wakatimeData) {
      keyCodingMetrics = wakatimeData.filter(function (obj) {
        return (obj.footer == "Time coding past 7 days");
      });
    }

    if (!!standupsData) {
      keyStandupMetrics = standupsData.filter(function (obj) {
        return (obj.footer == "Standups completed past 7 days");
      });
    }

    if (!!absencesData) {
      keyAbsenceMetrics = [absencesData];
    }

    keyMetrics = [
      ...keyClassMetrics,
      ...keyCodingMetrics,
      ...keyStandupMetrics,
      ...keyCommitMetrics,
      ...keyAbsenceMetrics
    ];

    let otherMetrics = [];
    let otherClassMetrics = [];
    let otherStandupMetrics = [];
    let otherCodingMetrics = [];

    if (!!checkinData) {
      otherClassMetrics = checkinData.filter(function (obj) {
        return (obj.footer == "Time in class weekly average") || (obj.footer == "Time in class total hours");
      });
    }

    if (!!wakatimeData) {
      otherCodingMetrics = wakatimeData.filter(function (obj) {
        return (obj.footer == "Time coding weekly average") || (obj.footer == "Time coding total hours");
      });
    }

    if (!!standupsData) {
      otherStandupMetrics = standupsData.filter(function (obj) {
        return (obj.footer == "Standups completed total hours");
      });
    }

    otherMetrics = [
      ...otherClassMetrics,
      ...otherCodingMetrics,
      ...otherStandupMetrics
    ];
    return (
      <>
        <HamburgerNavigation
          openStudentEditWindow={() => this.openEditWindow}
          openStudentAccountabilityPartnerInfo={() => this.toggleAccPartnerWindow}
          openStudentAbsenteeInfo={() => this.toggleAbsenteeWindow}
          auth_token={localStorage.getItem('token')}
        />
        {editStudentWindow}
        {accPartnerWindow}
        {absenteeWindow}

        <div className="header-name">
          <h4>{this.props.studentInfo.name}</h4>
        </div>
        <main className="wrapper">
          <div className="data-section-container-grid">
            <DataSectionForStudentStats
              title="Key Metrics"
              data={keyMetrics}
              name={this.props.studentInfo.name}
            />
            <DataSectionForStudentStats
              title="Other Metrics"
              data={otherMetrics}
              name={this.props.studentInfo.name}
            />
            <DailyCodingIndicator
              title="Coding Indicator"
              data={this.props.studentWakatimes}
              name={this.props.studentInfo.name}
            />
            <StudentStatsDownload
              title='Checkin Data'
              checkinData={this.props.studentCheckins}
              standupData={this.props.studentStandups}
              wakatimeData={this.props.studentWakatimes}
              name={this.props.studentInfo.name}
            />
          </div>
          <section className="standupAndcheckin">
            <span
              className="section-label pointer"
              onClick={() => this.toggle("standups-panel")}
            >
              <h2>Standups and Checkins</h2>
            </span>
            <div
              className={`standup-container ${
                this.state.display["standups-panel"]
                  ? "toggleContent-hidden"
                  : ""
                }`}
            >
              {StandupAndCheckinComponent}
            </div>
          </section>
        </main>
      </>
    );
  }
}

function mapStoreToProps(store) {
  return {
    studentInfo: store.studentStats.studentInfo,
    studentStandups: store.studentStats.studentStandups,
    studentCheckins: store.studentStats.studentCheckins,
    studentWakatimes: store.studentStats.studentWakatimes,
    studentCommits: store.studentStats.studentCommits,
    studentStandupsAndCheckins: store.studentStats.studentStandupsAndCheckins,
    errMessage: store.studentStats.errMessage,
    editWindowOpen: store.studentStats.editWindowOpen,
    authToken: store.dashboard.authToken,
    accPartnerWindowOpen: store.studentStats.accPartnerWindowOpen,
    absenteeWindowOpen: store.studentStats.absenteeWindowOpen,
    studentAbsences: store.studentStats.studentAbsences,
    absenteeInfo: store.absenteeInfo.toggleWindow
  };
}

export default connect(mapStoreToProps)(Standups);
