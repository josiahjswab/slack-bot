import React, { Component } from 'react';
import DataSection from './DataSection';
import Roster from './Roster';
import {
  calculateDashboardCheckinData,
  calculateDashboardStandupsData } from '../utilities'; 
import EditStudent from './EditStudent.js';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      allStandups: [],
			activeCheckins: [],
			showStudentEditWindow: false,
			editedStudentInfo: {},
			saveErrorMessage: '',
      display: {}
    }
		this.getAuthToken = this.getAuthToken.bind(this);
		this.hideStudentEditWindow = this.hideStudentEditWindow.bind(this);
		this.saveStudentData = this.saveStudentData.bind(this);
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
	
	showStudentEditWindow(studentInfo){
		this.setState({
			studentInfo,
			showStudentEditWindow: true
		});
	}

	hideStudentEditWindow(event, override){
		if(event.target === event.currentTarget || override){
			this.setState({
				showStudentEditWindow: false
			})
		}
	}

	saveStudentData(studentData){
		fetch(`/api/students?access_token=${ this.getAuthToken() }`, {
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
			if(response.error){
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
  
  componentDidMount(){
		const activeStudentFilter = JSON.stringify({"where": {"is_inactive": {"neq": true}}})
    fetch(`/api/students?access_token=${ this.getAuthToken() }&filter=${activeStudentFilter}`)
      .then(response => response.json())
      .then(data => {
        const sorted = data.sort((a, b) => 
				a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        this.setState({ students: sorted });
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
    if (this.state.students.length > 0) {
      standupsData = calculateDashboardStandupsData(
        this.state.allStandups,
        this.state.students
      );
      checkinData = calculateDashboardCheckinData(
        this.state.activeCheckins,
        this.state.students
      );
		}
		
		let editStudentWindow = null;

		if(this.state.showStudentEditWindow){
			editStudentWindow = <EditStudent studentData={this.state.editedStudentInfo} 
																				closeWindow={() => this.hideStudentEditWindow}
																				save={this.saveStudentData}
																				errorMessage={this.state.saveErrorMessage}/>
		}

    return (
      <React.Fragment>
        <header>
          <p className='date'>{`${dayOfWeek}, ${month} ${dayOfMonth}`}</p>
          <ul className='navigation'>
            <li>
              <a
                className='link-btn'
                href={`${process.env.BASE_URL}logout?auth_token=${this.getAuthToken()}`}
              >Logout
              </a>
            </li>
						<li className='add-student link-btn' onClick={() => this.showStudentEditWindow({})}>
							Add New Student
						</li>
          </ul>
        </header>
				{editStudentWindow}
        <main className='wrapper dashboard-wrapper'>
          <div className='data-section-container-flex'>
            <h2 className='section-label big-display'>Time in Class</h2>
            <span className='mobile-display' onClick={() => this.toggle(1)}><h2>Time in Class</h2></span>
            <div id="demo" className={this.state.display[1] ? "toggleContent-closed" : "toggleContent-open"}>

              <DataSection
                title='time in class'
                data={checkinData ? checkinData.summary : undefined}
                delinquents={checkinData ? checkinData.delinquents : undefined}
                delinquentTitle='absentees'
              />
            </div>

            <h2 className='section-label big-display'>Standups</h2>
            <span className='mobile-display' onClick={() => this.toggle(2)}><h2>Standups</h2></span>
            <div id="demo" className={this.state.display[2] ? "toggleContent-closed" : "toggleContent-open"}>
              <DataSection
                title='standups'
                data={standupsData ? standupsData.summary : undefined}
                delinquents={standupsData ? standupsData.delinquents : undefined}
              />
            </div>

          </div>
          <div>
						<div className='section-title'>
							<h2 className='section-label big-display'>View data for</h2>
							<span className='mobile-display' onClick={() => this.toggle(3)}><h2>View data for</h2></span>
							<h2 className='section-label'>
								<a href={`inactive?auth_token=${ this.getAuthToken() }`}>View Inactive</a>
							</h2>
						</div>
            <div className={this.state.display[3] ? "toggleContent-closed" : "toggleContent-open"}>
              <Roster
                students={this.state.students}
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
