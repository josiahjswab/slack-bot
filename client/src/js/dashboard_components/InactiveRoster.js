import React, { Component } from 'react';
import Roster from './Roster';
import EditStudent from './EditStudent.js';
let studentsData;

class DashboardContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			students: [],
			showStudentEditWindow: false,
			editedStudentInfo: {},
			saveErrorMessage: '',
			display: {}
		}
		this.getAuthToken = this.getAuthToken.bind(this);
		this.hideStudentEditWindow = this.hideStudentEditWindow.bind(this);
		this.saveStudentData = this.saveStudentData.bind(this);
		this.getViewByType = this.getViewByType.bind(this);
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

	getViewByType(e){

		let typeFilter = e.target.value

		let filtered = studentsData.filter(student => student.type === typeFilter)

		this.setState({
		  students: filtered
		})

	 	}

		hideStudentEditWindow(event, override) {
		if (event.target === event.currentTarget || override) {
			this.setState({
				showStudentEditWindow: false
				})
			}
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
		fetch(`/api/students?access_token=${this.getAuthToken()}`)
			.then(response => response.json())
			.then(data => {
				const sorted = data.sort((a, b) =>
					a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
				this.setState({ students: sorted });
				studentsData = sorted;
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

		let editStudentWindow = null;

		if (this.state.showStudentEditWindow) {
			editStudentWindow = <EditStudent studentData={this.state.editedStudentInfo}
				closeWindow={() => this.hideStudentEditWindow}
				save={this.saveStudentData}
				errorMessage={this.state.saveErrorMessage} />
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
						<li>
							<a
								className='link-btn'
								href={`${process.env.BASE_URL}dashboard?auth_token=${this.getAuthToken()}`}
							>
								Dashboard
          			</a>
						</li>
					</ul>
				</header>
				{editStudentWindow}
				<main className='typeStudentsWrapper'>
					<h2 className='section-label big-display'>Students:
					<select onChange={this.getViewByType}>
							<option value={"PAID"}>PAID</option>
							<option value={"ALUMNI"}>ALUMNI</option>
							<option value={"JOBSEEKER"}>JOBSEEKER</option>
							<option value={'DISABLED'}>DISABLED</option>
							<option value={'FREE'}>FREE</option>
						</select>
					</h2>
					<Roster
						students={this.state.students}
						auth_token={this.getAuthToken()}
					/>
				</main>
			</React.Fragment>
		);
	}
}

export default DashboardContainer;
