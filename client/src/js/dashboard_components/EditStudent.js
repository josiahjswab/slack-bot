import React from 'react';

export default class EditStudent extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			is_inactive: false
		}
		this.save = this.save.bind(this);
	}

	save(){
		let studentData = {
			name: document.getElementById('student-name').value,
			slack_id: document.getElementById('student-slack-id').value,
			wakatime_key: document.getElementById('student-wakatime-key').value,
			is_inactive: document.getElementById('student-is-inactive').checked
		}

		if(this.props.studentData.id){
			studentData.id = this.props.studentData.id;
		}
		
		return studentData;
	}

	toggleInactive(is_inactive){
		this.setState({
			is_inactive
		})
	}

	componentDidMount(){
		if(this.props.studentData){
			this.setState({
				is_inactive: this.props.studentData.is_inactive
			})
		}
	}

	render(){
		let studentData = this.props.studentData || {
			name: '',
			wakatime_key: '',
			slack_id: '',
			is_inactive: false
		}

		return(
			<div className='add-edit-student-window' onClick={this.props.closeWindow(event)}>
				<div className='add-edit-student-container'>
					<div className='add-edit-student-row'>
						<label>Student Name:<br />
							<input id='student-name' type="text" defaultValue={studentData.name} />
						</label>
					</div>
					<div className='add-edit-student-row'>
						<label>Slack ID:<br />
							<input id='student-slack-id' type="text" defaultValue={studentData.slack_id} />
						</label>
					</div>
					<div className='add-edit-student-row'>
						<label>Wakatime API Key:<br />
							<input id='student-wakatime-key' type="text" defaultValue={studentData.wakatime_key} />
						</label>
					</div>
					<div className='add-edit-student-row'>
						<label>Student is inactive: 
							<input id='student-is-inactive' type="checkbox"
								onClick={(e) => this.toggleInactive(e.target.checked)} checked={this.state.is_inactive} />
						</label>
					</div>
					<div className='add-edit-student-row'>
						<button className='link-btn' onClick={() => this.props.save(this.save())}>Save</button>
						<button className='link-btn' onClick={this.props.closeWindow(event, true)}>Cancel</button>
					</div>
					{
						this.props.errorMessage ? <div className='add-edit-student-row error-message'>
							<span>{this.props.errorMessage}</span>
						</div>
						: null
					}
				</div>
			</div>
		)
	}
}