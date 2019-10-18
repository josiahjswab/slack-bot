import React, { Component } from 'react';
import DataSection from '../DataSection';
import Roster from '../Roster';
import ConfirmAbsentees from '../ConfirmAbsentees';
import {
  calculateDashboardCheckinData,
  calculateDashboardStandupsData, calculateAbsentees
} from '../../utilities';
import {
  addStudentToStore
} from './DashboardContainerActions';
import EditStudent from '../EditStudent.js';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      absentees: {},
      students: [],
      studentsBeingViewed: [],
      allStandups: [],
      activeCheckins: [],
      showStudentEditWindow: false,
      editedStudentInfo: {},
      saveErrorMessage: '',
      display: {},
      showConfirmAbsenteesWindow: false,
      absenteesErrorMessage: '',
		}
		this.inactiveStudentTypes = ['DISABLED', 'ALUMNI'];
		this.getAuthToken = this.getAuthToken.bind(this);
		this.hideStudentEditWindow = this.hideStudentEditWindow.bind(this);
    this.saveStudentData = this.saveStudentData.bind(this);
    this.getViewByType = this.getViewByType.bind(this);
    this.hideStudentEditWindow = this.hideStudentEditWindow.bind(this);
		this.saveStudentData = this.saveStudentData.bind(this);	    this.saveStudentData = this.saveStudentData.bind(this);
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

  getAuthToken() {
    return this.props
      .location
      .search
      .replace(/^(.*?)\auth_token=/, '');
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

showConfirmAbsenteesWindow(){
    const absentees = calculateAbsentees(this.state.activeCheckins, this.state.students);
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

  sendAbsences(absentees){
    const today = new Date();
    const absenceLog = {
      type: 'Absences Log',
      date: today,
      names: absentees
    }
   //console.log(absenceLog);
    fetch(`/api/students?access_token=${this.getAuthToken()}`, {
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

  saveStudentData(studentData) {
    fetch(`/api/students?access_token=${this.getAuthToken()}`, {
      method: 'POST',
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
            students: [...this.state.students, response].sort((a, b) =>
              a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1),
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
    const formattedInactiveStudentTypes = this.inactiveStudentTypes.map(type => {
      return { "type": { "neq": type } };
    })
    const inactiveStudentFilter = JSON.stringify({ "where": { "and": formattedInactiveStudentTypes } });
    fetch(`/api/students?access_token=${this.getAuthToken()}&filter=${inactiveStudentFilter}`)
      .then(response => response.json())
      .then(data => {
        const sorted = data.sort((a, b) =>
				a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        this.setState({
          students: sorted,
          studentsBeingViewed: sorted
         });
      })
      .catch(err => console.log(err));

    fetch(`/api/standups?access_token=${this.getAuthToken()}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ allStandups: data });
      })
      .catch(err => console.log(err));

    fetch(`/api/checkins/active?access_token=${this.getAuthToken()}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ activeCheckins: data });
      })
      .catch(err => console.log(err));
  }

  componentDidUpdate(){
    console.log(this.state.studentsBeingViewed)
    const { dispatch } = this.props;
    const students = this.state.students;
    dispatch(addStudentToStore(students));
  }

  getViewByType(e){
    let typeFilter = e.target.value;
    let filtered = this.state.students.filter(student => student.type === typeFilter);

    if(typeFilter == 'ALL'){
      this.setState({
        studentsBeingViewed: this.state.students
      })
    }
    else {
      this.setState({
		  studentsBeingViewed: filtered
		})
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

    let standupsData;
    let checkinData;
    if (this.state.studentsBeingViewed.length > 0) {
      standupsData = calculateDashboardStandupsData(
        this.state.allStandups,
        this.state.studentsBeingViewed
      );
      checkinData = calculateDashboardCheckinData(
        this.state.activeCheckins,
        this.state.studentsBeingViewed
      );
    }

    let editStudentWindow = null;

    if (this.state.showStudentEditWindow) {
      editStudentWindow = <EditStudent studentData={this.state.editedStudentInfo}
        closeWindow={() => this.hideStudentEditWindow}
        save={this.saveStudentData}
        errorMessage={this.state.saveErrorMessage} />
    }
     let confirmAbsenteesWindow = null;

    if(this.state.showConfirmAbsenteesWindow ) {
      let currentAbsentees = calculateAbsentees(this.state.activeCheckins, this.state.students);
      console.log(currentAbsentees);
      confirmAbsenteesWindow = <ConfirmAbsentees absentees={currentAbsentees}
        closeWindow={() => this.hideConfirmAbsenteesWindow}
        sendAbsences={this.sendAbsences}
        errorMessage={this.state.absenteesErrorMessage}
        />
    }

    return (
      <React.Fragment>
        <header>
          <p className='date red-date'>{`${dayOfWeek}, ${month} ${dayOfMonth}`}</p>
          <div className='card'>
              <p className='' id='tank'>3.50 Class/Daily/Average/Waka</p>
            </div>

          <ul className='navigation'>


            <li>
              <a
                className='link-btn'
                href={`${process.env.BASE_URL}logout?auth_token=${this.getAuthToken()}`}
              >Logout
              </a>
            </li>
            <li className='add-student' id='later' onClick={() => this.showStudentEditWindow({})}>
              Add Student
            </li>
              <li className='confirm-absentees' id='ring' onClick={() => this.showConfirmAbsenteesWindow()} >
              Absences
            </li>
          </ul>
        </header>
        {editStudentWindow}
        {confirmAbsenteesWindow}
        <main className='wrapper dashboard-wrapper'>
          <div className='data-section-container-flex'>
            <div className='data-section data-section-flex'>
              <span className='section-label pointer' onClick={() => this.toggle(1)}><h2>Time in Class</h2></span>
              <div className={this.state.display[1] ? "toggleContent-hidden" : ""}>
                <DataSection
                  data={checkinData ? checkinData.summary : undefined}
                  delinquents={checkinData ? checkinData.delinquents : undefined}
                  delinquentTitle='absentees'
                  students={this.state.studentsBeingViewed}
                  auth_token={this.getAuthToken()}
                />
              </div>
            </div>
            <div className='data-section data-section-flex'>
                <span className='section-label pointer' onClick={() => this.toggle(2)}><h2>Standups</h2></span>
                  <div className={this.state.display[2] ? "toggleContent-hidden" : ""}>
                      <DataSection
                      data={standupsData ? standupsData.summary : undefined}
                      delinquents={standupsData ? standupsData.delinquents : undefined}
                      students={this.state.studentsBeingViewed}
                      auth_token={this.getAuthToken()}
                      />
                  </div>
            </div>
          </div>
          <div>
            <div className=''>
              <span className='' onClick={() => this.toggle(3)}><h2>View data for</h2></span>
              <select className='sprint' onChange={this.getViewByType}>
                <option className='' value={"ALL"}>ALL</option>
                <option value={"PAID"}>PAID</option>
                <option value={"ALUMNI"}>ALUMNI</option>
                <option value={"JOBSEEKER"}>JOBSEEKER</option>
                <option value={'DISABLED'}>DISABLED</option>
                <option value={'FREE'}>FREE</option>
						  </select>
              {/* <h2 className='section-label'>
                <a href={`inactive?auth_token=${this.getAuthToken()}`}>View by Type</a>
              </h2> */}
            </div>
            <div className={this.state.display[3] ? "toggleContent-hidden" : "toggleContent-display"}>
              <Roster
                students={this.state.studentsBeingViewed}
                auth_token={this.getAuthToken()}
              />
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default DashboardContainer;
