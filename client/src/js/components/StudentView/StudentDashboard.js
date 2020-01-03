import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import StandupAndCheckin from '../StandupAndCheckin';
import DataSectionForStudentStats from '../DataSectionForStudentStats';
import {
  calculateIndividualCheckinData,
  calculateIndividualStandupsData,
  calculateIndividualWakatimeData,
} from '../../utilities';
import PartnerForm from '../AccountabilityPartner/PartnerForm';
import {
  getStudentInfo,
  updateStudentInfo,
  toggleEditWindow,
} from '../studentStatsActions';

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: {},
    };
    this.saveStudentData = this.saveStudentData.bind(this);
    this.openEditWindow = this.openEditWindow.bind(this);
    this.closeEditWindow = this.closeEditWindow.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    let slack_id = (this.props.match.params.id).replace(/^.*\./, '');
    let token = (this.props.location.search).replace(/^.*\=/, '');
    dispatch(getStudentInfo(slack_id, token, true));
  }

  toggle(panel) {
    this.setState({
      display: {
        ...this.state.display,
        [panel]: !this.state.display[panel]
      }
    });
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
    this.setState({
      showPartnerEditWindow: false,
      saveErrorMessage: null
    });
    const id = this.props.location.pathname.replace("/admin/student-summary/", "");
    const { dispatch } = this.props;
    dispatch(updateStudentInfo(id, studentData, this.props.authToken));
  }

  showPartnerEditWindow(studentInfo) {
    this.setState({
      studentInfo,
      showPartnerEditWindow: true
    });
  }

  hidePartnerEditWindow (event, override) {
    if (event.target === event.currentTarget || override) {
      this.setState({
        showPartnerEditWindow: false
      });
    }
  }

  render() {
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
    let checkinData = [];
    if (this.props.studentCheckins) {
      checkinData = calculateIndividualCheckinData(this.props.studentCheckins);
    }
    let wakatimeData = [];
    if (this.props.studentWakatimes) {
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

    function sortByDate(a, b) {
      return a[0] < b[0] ? 1 : -1;
    }

    let editPartnerWindow = null;

    if (this.state.showPartnerEditWindow) {
      editPartnerWindow = (
        <PartnerForm
          studentData={this.state.editedStudentInfo}
          closeWindow={() => this.hideStudentEditWindow}
          save={this.handleSaveStudentData}
          errorMessage={this.state.saveErrorMessage}
        />
      );
    }

    let keyMetrics = [];
    let keyClassMetrics = [];
    let keyStandupMetrics = [];
    let keyCodingMetrics = [];
    let keyCommitMetrics = [];

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

    keyMetrics = [
      ...keyClassMetrics,
      ...keyCodingMetrics,
      ...keyStandupMetrics,
      ...keyCommitMetrics
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
        <div>
          <ul className='navigation hamburger-navigation'>
            <li>
              <Link className='link-btn2' to={'/login'}
              >Logout
         </Link>
              <li
                className="add-partner"
                id="add-part-btn"
                onClick={() => this.showPartnerEditWindow({})}
              >
                Add Partner
              </li>
            </li>
            <li className='dashboard-link'>
              <div className='sdcs-logo'>
                <p className='student-dash-logo' id='logo-style-student-page'></p>
              </div>
            </li>
          </ul>
        </div>
        <div className="header-name">
          {!(Object.entries(this.props.studentInfo).length === 0) && <h4>{this.props.studentInfo[0].name}</h4>}
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
    authToken: store.dashboard.authToken
  };
}

export default connect(mapStoreToProps)(StudentDashboard);
