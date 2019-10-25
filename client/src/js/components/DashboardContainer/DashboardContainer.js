import React, { Component } from 'react';
import DataSection from '../DataSection';
import Roster from '../Roster';
import { Link } from 'react-router-dom'
import ConfirmAbsentees from '../ConfirmAbsentees/index';
import {
  calculateDashboardCheckinData,
  calculateDashboardStandupsData,
  calculateAbsentees
} from '../../utilities';
import {
  saveStudentData,
  getStudentData,
  setStudentsBeingViewed,
  getStandups,
  getCheckins
} from './actions';
import EditStudent from '../EditStudent';


class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      absentees: {},
      authToken: '',
      showStudentEditWindow: false,
      editedStudentInfo: {},
      saveErrorMessage: '',
      display: {},
      showConfirmAbsenteesWindow: false,
      absenteesErrorMessage: '',
    }
    this.hideStudentEditWindow = this.hideStudentEditWindow.bind(this);
    this.handleSaveStudentData = this.handleSaveStudentData.bind(this);
    this.getViewByType = this.getViewByType.bind(this);
    this.hideStudentEditWindow = this.hideStudentEditWindow.bind(this);
    this.hideConfirmAbsenteesWindow = this.hideConfirmAbsenteesWindow.bind(this);
    this.showConfirmAbsenteesWindow = this.showConfirmAbsenteesWindow.bind(this);
    this.sendAbsences = this.sendAbsences.bind(this);
  }

  toggle(panelNumber) {
    this.setState({
      display: {
        ...this.state.display,
        [panelNumber]: !this.state.display[panelNumber]
      }
    });
  }

  showStudentEditWindow(studentInfo) {
    this.setState({
      studentInfo,
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

  showConfirmAbsenteesWindow() {
    const { activeCheckins, studentsBeingViewed } = this.props;
    const absentees = calculateAbsentees(activeCheckins, studentsBeingViewed);
    this.setState({
      absentees: absentees,
      showConfirmAbsenteesWindow: true
    });
  }

  hideConfirmAbsenteesWindow(event, override) {
    if (event.target === event.currentTarget || override) {
      this.setState({
        showConfirmAbsenteesWindow: false
      });
    }
  }

  sendAbsences(absentees) {
    const today = new Date();
    const absenceLog = {
      type: 'Absences Log',
      date: today,
      names: absentees
    }
    fetch(`/api/students?access_token=${'getAuthToken'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(absenceLog)
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        if (response.error) {
          throw response.error.message
        } else {
          this.setState({
            showConfirmAbsenteesWindow: false,
            absenteesErrorMessage: null
          })
        }
      })
      .catch(err => {
        this.setState({
          absenteesErrorMessage: err
        })
      })
  }

  handleSaveStudentData(studentData) {
    this.setState({
      showStudentEditWindow: false,
      saveErrorMessage: null
    })
    const { dispatch } = this.props;
    dispatch(saveStudentData(studentData, this.state.authToken));
  }

  componentDidMount() {
    const { dispatch, students } = this.props;

    let authToken = this.props
      .location
      .search
      .replace(/^(.*?)\auth_token=/, '');

    this.setState({ authToken });

    dispatch(getStudentData(authToken))
    let studentsPaid = students.filter(student => student.type == 'PAID');
    let studentsJobseeking = students.filter(student => student.type == 'JOBSEEKER');
    let studentsPaidAndJobseeking = studentsPaid.concat(studentsJobseeking);

    dispatch(getStandups(authToken));
    dispatch(getCheckins(authToken));
    dispatch(setStudentsBeingViewed(studentsPaidAndJobseeking));
  }

  getViewByType(e) {
    const typeFilter = e.target.value;
    const { students, dispatch } = this.props;
    let filtered = students.filter(student => student.type == typeFilter);
    if (typeFilter == 'PAID_JOBSEEKING') {
      let studentsPaid = students.filter(student => student.type == 'PAID');
      let studentsJobseeking = students.filter(student => student.type == 'JOBSEEKER');
      let studentsPaidAndJobseeking = studentsPaid.concat(studentsJobseeking);
      dispatch(setStudentsBeingViewed(studentsPaidAndJobseeking))
    }
    else if (typeFilter == 'ALL') {
      dispatch(setStudentsBeingViewed(students))
    }
    else {
      dispatch(setStudentsBeingViewed(filtered))
    }
  }

  render() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const today = new Date();
    const dayOfWeek = days[today.getDay()];
    const month = months[today.getMonth()];
    const dayOfMonth = today.getDate();
    const currentYear = today.getFullYear();
    const monthAsNumber = today.getMonth() + 1;

    let standupsData;
    let checkinData;
    const { studentsBeingViewed, allStandups, activeCheckins } = this.props;
    
    if(allStandups.length){
      standupsData = calculateDashboardStandupsData(
        allStandups,
        studentsBeingViewed
      );
    }

    if (activeCheckins.length) {
      let checkinsToday = [];
      for(let i=0; i < activeCheckins.length; i++){ // this for loop filters all checkins into only checkins that happened today
        let thisCheckin = activeCheckins[i].checkin_time;
        let checkinDate = thisCheckin.slice(0,10);
        let checkinYear = checkinDate.slice(0,4);
        let checkinMonth = checkinDate.slice(5,7);
        let checkinDayOfMonth = checkinDate.slice(8,11);
        if(checkinMonth == monthAsNumber && checkinDayOfMonth == dayOfMonth && checkinYear == currentYear){
          checkinsToday.push(activeCheckins[i]);
        }
      }

      checkinData = calculateDashboardCheckinData(
        checkinsToday, // all checkins ever (needs to be filtered)
        studentsBeingViewed
      );
  }


    let editStudentWindow = null;

    if (this.state.showStudentEditWindow) {
      editStudentWindow = <EditStudent studentData={this.state.editedStudentInfo}
        closeWindow={() => this.hideStudentEditWindow}
        save={this.handleSaveStudentData}
        errorMessage={this.state.saveErrorMessage} />
    }
    let confirmAbsenteesWindow = null;

    if (this.state.showConfirmAbsenteesWindow) {
      let currentAbsentees = calculateAbsentees(this.props.activeCheckins, this.props.students);
      confirmAbsenteesWindow = <ConfirmAbsentees absentees={currentAbsentees}
        closeWindow={() => this.hideConfirmAbsenteesWindow}
      />
    }

    return (
      <React.Fragment>
        <div className='container col-sm-12'>
          <div className='row'>
            <div className='col-sm-2'>
              <div className='card'>
                <p className='sdcs-logo' id='logo-style'></p>
                <p className='date red-date'>{`${dayOfWeek}, ${month} ${dayOfMonth}`}</p>
              </div>
            </div>
            <ul className=''>
            <Link className='link-btn1' to={`/login?auth_token=${ this.state.authToken}`}
          >Logout
          </Link>

              <li className='add-student' id='add-stud-btn' onClick={() => this.showStudentEditWindow({})}>
                Add Student
            </li>
              <li className='confirm-absentees' id='absence-btn' onClick={() => this.showConfirmAbsenteesWindow()} >
                Absences
            </li>
            </ul>
          </div>
        </div>
        <div className='container col-sm-12'>
          {editStudentWindow}
          {confirmAbsenteesWindow}
          <div className='row'>
            <div className='col-sm-4 student-col-size'>
              <div className='card'>
                <select className='type-drop' onChange={this.getViewByType}>
                  <option value={'PAID_JOBSEEKING'}>PAID/JOBSEEK</option>
                  <option value={'FREE'}>FREE</option>
                  <option value={'PAID'}>PAID</option>
                  <option value={'JOBSEEKER'}>JOBSEEKING</option>
                  <option value={'ALUMNI'}>ALUMNI</option>
                  <option value={'DISABLED'}>DISABLED</option>
                  <option value={'ALL'}>ALL</option>
                </select>
                <div className='card' onClick={() => this.toggle(3)}><h2>View data for
          </h2>
                </div>
              </div>
              <div className={this.state.display[3] ? "toggleContent-hidden" : "toggleContent-display"}>
                <Roster
                  students={this.props.studentsBeingViewed}
                  auth_token={this.state.authToken}
                />
              </div>
            </div>
            <div className='col-sm-4 student-col-size'>
              <span className='card' onClick={() => this.toggle(2)}><h2>Standups</h2></span>
              <div className={this.state.display[2] ? "toggleContent-hidden" : ""}>
                <DataSection
                  data={standupsData ? standupsData.summary : undefined}
                  delinquents={standupsData ? standupsData.delinquents : undefined}
                  students={this.props.studentsBeingViewed}
                  auth_token={this.state.authToken}
                />
              </div>
            </div>
            <div className='col-sm-4 student-col-size'>
              <span className='card' onClick={() => this.toggle(1)}><h2>Checkins</h2></span>
              <div className={this.state.display[1] ? "toggleContent-hidden" : ""}>
                <DataSection
                  data={checkinData ? checkinData.summary : undefined}
                  delinquents={checkinData ? checkinData.delinquents : undefined}
                  delinquentTitle='absentees'
                  students={this.props.studentsBeingViewed}
                  auth_token={this.state.authToken}
                />
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>
      </React.Fragment >
    );
  }
}

export default DashboardContainer;
