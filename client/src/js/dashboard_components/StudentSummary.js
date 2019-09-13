import React, { Component } from 'react';
import Standup from './Standup';
import Checkin from './Checkin';
import HamburgerNavigation from '../general_components/HamburgerNavigation';
import DataSectionForStudentSummary from './DataSectionForStudentSummary';
import {
  calculateIndividualCheckinData,
	calculateIndividualStandupsData,
	calculateIndividualWakatimeData } from '../utilities';
import EditStudent from './EditStudent.js';

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
      display: {}
    }
    this.getAuthToken = this.getAuthToken.bind(this);
		this.showStudentEditWindow = this.showStudentEditWindow.bind(this);
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
	
	showStudentEditWindow(){
		this.setState({
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
		fetch(`/api/students/${studentData.id}?access_token=${ this.getAuthToken() }`, {
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
			if(response.error){
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

    fetch(`/api/students/${ id }?access_token=${ this.getAuthToken() }`)
      .then(response => response.json())
      .then(student => {
        this.setState({name: student.name, editedStudentInfo: student });

        fetch(`/api/students/${ student.id }/standups?access_token=${ this.getAuthToken() }`)
          .then(response => response.json())
          .then(standups => {
            this.setState({ standups: standups.reverse() });
          })
          .catch(err => console.log(err));

        fetch(`/api/checkins/slackId/${ student.slack_id }?access_token=${ this.getAuthToken() }`)
          .then(response => response.json())
          .then(checkins => {
            this.setState({ checkinHistory: checkins });
          })
					.catch(err => console.log(err));
				
				const wakatimeFilter = JSON.stringify({
					"where": {
						"slack_id": student.slack_id
					}
				})
				fetch(`/api/wakatimes/?access_token=${ this.getAuthToken() }&filter=${wakatimeFilter}`)
          .then(response => response.json())
          .then(wakatimes => {
            this.setState({ wakatimes });
          })
					.catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  render() {
    let standupsComponent;
    let checkinComponent;
    let standupsData = calculateIndividualStandupsData(this.state.standups);
    let checkinData = calculateIndividualCheckinData(this.state.checkinHistory);
		let wakatimeData = calculateIndividualWakatimeData(this.state.wakatimes);

    if(this.state.standups.length > 0) {
      standupsComponent = this.state.standups.map(standup => (
        <Standup key={ standup.id } standup={ standup }/>
      ));
    } else {
      standupsComponent = 
        <div className='standup-card'>
          {`${ this.state.name } has not submitted any standups.`}
        </div>
    }

    if(this.state.checkinHistory.length > 0) {
      checkinComponent = this.state.checkinHistory.map(checkinHistory => (
        <Checkin key={ checkinHistory.id } checkinHistory={ checkinHistory }/>
      ));
    } else {
      checkinComponent = 
        <div className='standup-card'>
          {`${ this.state.name } has not checked in.`}
        </div>
    }
		
		let editStudentWindow = null;
		if(this.state.showStudentEditWindow){
			editStudentWindow = <EditStudent studentData={this.state.editedStudentInfo} 
																				closeWindow={() => this.hideStudentEditWindow}
																				save={this.saveStudentData}
																				errorMessage={this.state.saveErrorMessage}/>
		}

    return(
      <React.Fragment>
        <header>
          <h1>{ this.state.name }</h1>
					<HamburgerNavigation openStudentEditWindow={() => this.showStudentEditWindow}
					 auth_token={ this.getAuthToken() }/>
        </header>
				{editStudentWindow}
        <main className='wrapper'>
          <div className='data-section-container-grid'>
						<DataSectionForStudentSummary title='time in class' data={ checkinData } 
						dataToDownload={this.state.checkinHistory}/>
						<DataSectionForStudentSummary title='standups completed' data={ standupsData } 
						dataToDownload={this.state.standups} />
						<DataSectionForStudentSummary title='time spent coding' data={ wakatimeData } 
						dataToDownload={this.state.wakatimes} />
          </div>
          <section className='standups'>
            <h2 className='section-label big-display'>standups</h2>
            <span className='mobile-display' onClick={() => this.toggle(1)}><h2>standups</h2></span>
            <div className={`standup-container ${this.state.display[1] ? "toggleContent-closed" : ""}`}>
              { standupsComponent }
            </div>
          </section>
          <section className='standups'>
            <h2 className='section-label big-display'>checkins</h2>
            <span className='mobile-display' onClick={() => this.toggle(2)}><h2>checkins</h2></span>
            <div className={`standup-container ${this.state.display[2] ? "toggleContent-closed" : ""}`}>
            { checkinComponent } 
            </div>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default Standups;
