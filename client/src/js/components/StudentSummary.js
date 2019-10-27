import React, { Component } from 'react';
import StandupAndCheckin from './StandupAndCheckin';
import HamburgerNavigation from './HamburgerNavigation';
import DataSectionForStudentSummary from './DataSectionForStudentSummary';
import {
  calculateIndividualCheckinData,
  calculateIndividualStandupsData,
  calculateIndividualWakatimeData
} from '../utilities';
import EditStudent from './EditStudent';

class Standups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      standups: [],
      checkinHistory: [],
      wakatimes: [],
      showStudentEditWindow: false,
      editedStudentInfo: {},
      saveErrorMessage: '',
      display: {},
      dataByDate: {},
    }
    this.getAuthToken = this.getAuthToken.bind(this);
    this.showStudentEditWindow = this.showStudentEditWindow.bind(this);
    this.hideStudentEditWindow = this.hideStudentEditWindow.bind(this);
    this.saveStudentData = this.saveStudentData.bind(this);
    this.mergeStudentData = this.mergeStudentData.bind(this);
  }

  toggle(panel) {
    this.setState({
      display: {
        ...this.state.display,
        [panel]: !this.state.display[panel]
      }
    });
  }

  getAuthToken() {
    return this.props
      .location
      .search
      .replace(/^(.*?)\auth_token=/, '');
  }

  showStudentEditWindow() {
    this.setState({
      showStudentEditWindow: true
    });
  }

  hideStudentEditWindow(event, override) {
    if (event.target === event.currentTarget || override) {
      this.setState({
        showStudentEditWindow: false
      })
    }
  }

  mergeStudentData(data, type) {
    let dateObject = { ...this.state.dataByDate };

    for (let i = 0; i < data.length; i++) {
      let date = new Date(data[i].date || data[i].checkin_time);
      let formattedDate = (date.getMonth() + 1).toString().padStart(2, '0')
      + "/" + (date.getDate().toString()).padStart(2, '0')
      + "/" + (date.getFullYear().toString());
      if (!dateObject[formattedDate]) {
        dateObject[formattedDate] = {}
      }
      dateObject[formattedDate][type] = data[i];
    }
    this.setState({ dataByDate: dateObject })
  }

  saveStudentData(studentData) {
    fetch(`/api/students/${studentData.id}?access_token=${this.getAuthToken()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData)
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        if (response.error) {
          throw response.error.message
        } else {
          this.setState({
            name: response.name,
            editedStudentInfo: response,
            showStudentEditWindow: false,
            saveErrorMessage: null
          })
        }
      })
      .catch(err => {
        this.setState({
          saveErrorMessage: err
        })
      })
  }

  componentDidMount() {
    const id = this.props.location.pathname.replace('/student-summary/', '');
    fetch(`/api/students/${id}?access_token=${this.getAuthToken()}`)
      .then(response => response.json())
      .then(student => {
        this.setState({ name: student.name, editedStudentInfo: student });

        fetch(`/api/students/${student.id}/standups?access_token=${this.getAuthToken()}`)
          .then(response => response.json())
          .then(standups => {
            this.setState({ standups: standups });
            this.mergeStudentData(standups, 'standup')
          })
          .catch(err => console.log(err));

        fetch(`/api/checkins/slackId/${student.slack_id}?access_token=${this.getAuthToken()}`)
          .then(response => response.json())
          .then(checkins => {
            this.setState({ checkinHistory: checkins });
            this.mergeStudentData(checkins, 'checkin')
          })
          .catch(err => console.log(err));

        const wakatimeFilter = JSON.stringify({
          "where": {
            "slack_id": student.slack_id
          }
        })
        fetch(`/api/wakatimes/?access_token=${this.getAuthToken()}&filter=${wakatimeFilter}`)
          .then(response => response.json())
          .then(wakatimes => {
            this.setState({ wakatimes });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

  }

  render() {
    let StandupAndCheckinComponent;
    let standupsData = calculateIndividualStandupsData(this.state.standups);
    let checkinData = calculateIndividualCheckinData(this.state.checkinHistory);
    let wakatimeData = calculateIndividualWakatimeData(this.state.wakatimes);
    if (Object.keys(this.state.dataByDate).length > 0) {
      StandupAndCheckinComponent = Object.entries(this.state.dataByDate).sort(sortByDate).map(data => (
        <StandupAndCheckin key={data[0]} date={data[0]} checkin={data[1].checkin} standup={data[1].standup} />
      ));
    } else {
      StandupAndCheckinComponent =
        <div className='standup-card'>
          {`${this.state.name} has not submitted any standups and has not checked in.`}
        </div>
		}

		function sortByDate(a, b){
			return a[0] < b[0] ? 1 : -1;
		};

    let editStudentWindow = null;
    if (this.state.showStudentEditWindow) {
      editStudentWindow = <EditStudent studentData={this.state.editedStudentInfo}
        closeWindow={() => this.hideStudentEditWindow}
        save={this.saveStudentData}
        errorMessage={this.state.saveErrorMessage} />
    }

    return (
      <React.Fragment>
        <HamburgerNavigation openStudentEditWindow={() => this.showStudentEditWindow}
          auth_token={this.getAuthToken()} />
        {editStudentWindow}
          <div className='header-name'>
            <h1>{this.state.name}</h1>
          </div>
        <main className='wrapper'>
          <div className='data-section-container-grid'>
            <DataSectionForStudentSummary title='time in class' data={checkinData} name={this.state.name}
              dataToDownload={this.state.checkinHistory} />
            <DataSectionForStudentSummary title='standups completed' data={standupsData} name={this.state.name}
              dataToDownload={this.state.standups} />
            <DataSectionForStudentSummary title='time spent coding' data={wakatimeData} name={this.state.name}
              dataToDownload={this.state.wakatimes} />
          </div>
          <section className='standupAndcheckin'>
            <span className='section-label pointer' onClick={() => this.toggle('standups-panel')}><h2>Standups and Checkins </h2></span>
            <div className={`standup-container ${this.state.display['standups-panel'] ? "toggleContent-hidden" : ""}`}>
              {StandupAndCheckinComponent}
            </div>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default Standups;
