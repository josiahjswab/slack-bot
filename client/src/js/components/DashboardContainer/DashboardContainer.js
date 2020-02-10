import React, { Component } from "react";
import DataSection from "../DataSection";
import StudentList from "../StudentList"
import { Link } from "react-router-dom";
import ConfirmAbsentees from "../ConfirmAbsentees/index";
import {
  calculateDashboardCheckinData,
  calculateDashboardStandupsData,
  calculateAbsentees
} from "../../../../../common/utilities";
import {
  saveStudentData,
  getStudentData,
  setStudentsBeingViewed,
  sendAbsences,
  sendCronJob
} from "./dashboardActions";
import SlackChatBlast from "../CronMessage/SlackChatBlast";
import EditStudent from "../EditStudent";

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showStudentEditWindow: false,
      editedStudentInfo: {},
      saveErrorMessage: "",
      display: {},
      showConfirmAbsenteesWindow: false,
      showSlackBlast: false,
      absenteesErrorMessage: ""
    };
    this.hideStudentEditWindow = this.hideStudentEditWindow.bind(this);
    this.handleSaveStudentData = this.handleSaveStudentData.bind(this);
    this.getViewByType = this.getViewByType.bind(this);
    this.hideStudentEditWindow = this.hideStudentEditWindow.bind(this);
    this.hideConfirmAbsenteesWindow = this.hideConfirmAbsenteesWindow.bind(
      this
    );
    this.showSlackBlast = this.showSlackBlast.bind(this);
    this.hideSlackBlast = this.hideSlackBlast.bind(this);
    this.saveAbsentees = this.saveAbsentees.bind(this)
    this.showConfirmAbsenteesWindow = this.showConfirmAbsenteesWindow.bind(
      this
    );
    this.postCronJob = this.postCronJob.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    let authToken = this.props.location.search.replace(
      /^(.*?)\auth_token=/,
      ""
    );
    if (localStorage.getItem('token') == null) {
      localStorage.setItem('token', authToken);
    }
    dispatch(getStudentData(localStorage.getItem('token')));
  }

  toggle(panel) {
    this.setState({
      display: {
        ...this.state.display,
        [panel]: !this.state.display[panel]
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
      });
    }
  }

  showConfirmAbsenteesWindow() {
    this.setState({
      showConfirmAbsenteesWindow: true
    });
  }
  showSlackBlast() {
    this.setState({
      showSlackBlast: true
    });
  }

  hideSlackBlast(event, override) {
    if (event.target === event.currentTarget || override) {
      this.setState({
        showSlackBlast: false
      });
    }
  }

  postCronJob(post) {
    const { dispatch } = this.props;
    dispatch(sendCronJob(post, localStorage.getItem('token')))
  }

  hideConfirmAbsenteesWindow(event, override) {
    if (event.target === event.currentTarget || override) {
      this.setState({
        showConfirmAbsenteesWindow: false
      });
    }
  }

  saveAbsentees(slack_ids) {
    this.setState({
      showConfirmAbsenteesWindow: false
    });
    const { dispatch } = this.props;
    dispatch(sendAbsences(slack_ids, localStorage.getItem('token')));
  }

  handleSaveStudentData(studentData) {
    this.setState({
      showStudentEditWindow: false,
      saveErrorMessage: null
    });
    const { dispatch } = this.props;
    dispatch(saveStudentData(studentData, localStorage.getItem('token')));
  }

  getViewByType(e) {
    const typeFilter = e.target.value;
    const { students, dispatch } = this.props;
    let filtered = students.filter(student => student.type == typeFilter);
    if (typeFilter == "PAID_JOBSEEKING") {
      let studentsPaid = students.filter(student => student.type == "PAID");
      let studentsJobseeking = students.filter(
        student => student.type == "JOBSEEKER"
      );
      let studentsPaidAndJobseeking = studentsPaid.concat(studentsJobseeking);
      dispatch(setStudentsBeingViewed(studentsPaidAndJobseeking, localStorage.getItem('token')));
    } else if (typeFilter == "ALL") {
      dispatch(setStudentsBeingViewed(students, localStorage.getItem('token')));
    } else {
      dispatch(setStudentsBeingViewed(filtered, localStorage.getItem('token')));
    }
  }

  render() {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    const today = new Date();
    const dayOfWeek = days[today.getDay()];
    const month = months[today.getMonth()];
    const dayOfMonth = today.getDate();
    const currentYear = today.getFullYear();
    const monthAsNumber = today.getMonth() + 1;

    let standupsData;
    let checkinData;
    const { studentsBeingViewed, standupsBeingViewed, activeCheckinsBeingViewed } = this.props;

    if (standupsBeingViewed.length) {
      standupsData = calculateDashboardStandupsData(
        standupsBeingViewed,
        studentsBeingViewed
      );
    }

    if (activeCheckinsBeingViewed.length) {
      let checkinsToday = [];
      for (let i = 0; i < activeCheckinsBeingViewed.length; i++) {
        let thisCheckin = activeCheckinsBeingViewed[i].checkin_time;
        let checkinDate = thisCheckin.slice(0, 10);
        let checkinYear = checkinDate.slice(0, 4);
        let checkinMonth = checkinDate.slice(5, 7);
        let checkinDayOfMonth = checkinDate.slice(8, 11);
        if (
          checkinMonth == monthAsNumber &&
          checkinDayOfMonth == dayOfMonth &&
          checkinYear == currentYear
        ) {
          checkinsToday.push(activeCheckinsBeingViewed[i]);
        }
      }

      checkinData = calculateDashboardCheckinData(
        checkinsToday,
        studentsBeingViewed
      );
    }

    let editStudentWindow = null;

    if (this.state.showStudentEditWindow) {
      editStudentWindow = (
        <EditStudent
          studentData={this.state.editedStudentInfo}
          closeWindow={() => this.hideStudentEditWindow}
          save={this.handleSaveStudentData}
          errorMessage={this.state.saveErrorMessage}
        />
      );
    }
    let confirmAbsenteesWindow = null;

    if (this.state.showConfirmAbsenteesWindow) {
      const { activeCheckinsToday, students } = this.props;
      let currentAbsentees = calculateAbsentees(activeCheckinsToday, students);
      confirmAbsenteesWindow = (
        <ConfirmAbsentees
          absentees={currentAbsentees}
          saveAbsentees={this.saveAbsentees}
          closeWindow={() => this.hideConfirmAbsenteesWindow}
        />
      );
    }

    let slackBlask = null;
    if (this.state.showSlackBlast) {
      slackBlask = (
        <SlackChatBlast
          callback={this.postCronJob}
          closeWindow={() => this.hideSlackBlast}
        />
      );
    }

    return (
      <React.Fragment>
        <div className="container col-sm-12 white-space-reducer">
          <div className="row">
            <div className="col-sm-2">
              <div className="card adminDashStyle">
                <div className="red-stripe-1"></div>
                <p className="sdcs-logo" id="logo-style"></p>
                <p className="date red-date">{`${dayOfWeek}, ${month} ${dayOfMonth}`}</p>
              </div>
            </div>
            <nav id="page-nav">
              <label for="hamburger">&#9776;</label>
              <div className='right1'>
                <input type="checkbox" id="hamburger" />
                <br></br>
                <ul className='navigation'>
                  <li className="hamCentering20">
                    <button>
                      <div onClick={() => this.showSlackBlast()}>Slack Blast</div>
                    </button>
                  </li>
                  <li className="hamCentering20">
                    <button>
                      <div
                        onClick={() => this.showConfirmAbsenteesWindow()}>
                        Absences
                      </div>
                    </button>
                  </li>
                  <li className="hamCentering20">
                    <button>
                      <div
                        onClick={() => this.showStudentEditWindow({})}>
                        Add Student
                      </div>
                    </button>
                  </li>
                  <li className='hamCentering20'>
                    <Link
                      to={`/admin/login`}
                      onClick={() => localStorage.removeItem('token')}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
        <div className="container col-sm-12">
          {editStudentWindow}
          {confirmAbsenteesWindow}
          {slackBlask}
          <div className="row">
            <div className="col-sm-4 student-col-size">
              <div className="card">
                <select className="type-drop" onChange={this.getViewByType}>
                  <option value={"PAID_JOBSEEKING"}>PAID/JOBSEEK</option>
                  <option value={"FREE"}>FREE</option>
                  <option value={"PAID"}>PAID</option>
                  <option value={"JOBSEEKER"}>JOBSEEKING</option>
                  <option value={"ALUMNI"}>ALUMNI</option>
                  <option value={"DISABLED"}>DISABLED</option>
                  <option value={"ALL"}>ALL</option>
                </select>
                <div
                  className="card cursor-pointer"
                  onClick={() => this.toggle("view-data-panel")}
                >
                  <h2>View data for</h2>
                </div>
              </div>
              <div
                className={
                  this.state.display["view-data-panel"]
                    ? "toggleContent-hidden"
                    : "toggleContent-display"
                }
              >
                <StudentList
                  students={this.props.studentsBeingViewed}
                  auth_token={localStorage.getItem('token')}
                />
              </div>
            </div>
            <div className="col-sm-4 student-col-size">
              <span
                className="card cursor-pointer"
                onClick={() => this.toggle("standups-panel")}
              >
                <h2>Standups</h2>
              </span>
              <div
                className={
                  this.state.display["standups-panel"]
                    ? "toggleContent-hidden"
                    : ""
                }
              >
                <DataSection
                  title1='Not Completed'
                  title2='Completed'
                  data={standupsData ? standupsData.summary : undefined}
                  studentsList1={
                    standupsData ? standupsData.delinquents : undefined
                  }
                  studentsList2={
                    standupsData ? standupsData.nonDelinquents : undefined
                  }
                  auth_token={localStorage.getItem('token')}
                />
              </div>
            </div>
            <div className="col-sm-4 student-col-size">
              <span
                className="card cursor-pointer"
                onClick={() => this.toggle("checkins-panel")}
              >
                <h2>Checkins</h2>
              </span>
              <div
                className={
                  this.state.display["checkins-panel"]
                    ? "toggleContent-hidden"
                    : ""
                }
              >
                <DataSection
                  title1='Absentees'
                  title2='At School'
                  title3='At Home'
                  data={checkinData ? checkinData.summary : undefined}
                  studentsList1={
                    checkinData ? checkinData.delinquents : undefined
                  }
                  studentsList2={
                    checkinData ? checkinData.atSchool : undefined
                  }
                  studentsList3={
                    checkinData ? checkinData.atHome : undefined
                  }
                  auth_token={localStorage.getItem('token')}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DashboardContainer;
