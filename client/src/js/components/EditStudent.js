import React from 'react';

export default class EditStudent extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			is_inactive: false	}
		this.save = this.save.bind(this);
		this.studentTypes = ['FREE', 'PAID', 'JOBSEEKER', 'ALUMNI', 'DISABLED'];
	}

	save(){
		let studentData = {
			name: document.getElementById('student-name').value,
			slack_id: document.getElementById('student-slack-id').value,
			github_id: document.getElementById('student-github-id').value,
			wakatime_key: document.getElementById('student-wakatime-key').value,
			type: document.getElementById('student-type').value
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
			slack_id: '',
			github_id: '',
			wakatime_key: '',
			type: 'FREE'
		}

		return (
			<div className='add-edit-student-window' onClick={this.props.closeWindow(event)}>
				<div className='add-edit-student-container'>
					<br></br>
				<div className='student-padding'>
					<label id='student-drop' >Student type: 
						<br></br>
						<select className='' id='student-type' defaultValue={studentData.type}>
							{
								this.studentTypes.map(type => {
									return <option value={type} key={type}>{type}</option>
								})
							}
						</select>
					</label>
				</div>
				<div className='add-edit-student-row'>
					<label>Student Name:<br />
						<input id='student-name' type="text" defaultValue={studentData.name} />
					</label>
				</div>
				<br></br>
				<div className='add-edit-student-row'>
					<label>Slack ID:<br />
						<input id='student-slack-id' type="text" defaultValue={studentData.slack_id} />
					</label>
				</div>
				<br></br>
				<div className='add-edit-student-row'>
					<label>Wakatime API Key:<br />
						<input id='student-wakatime-key' type="text" defaultValue={studentData.wakatime_key} />
					</label>
				</div>
				<br></br>
				<div className='add-edit-student-row'>
					<label>GitHub Id:<br />
					<input id='student-github-id' type="text" defaultValue={studentData.github_id} />
					</label>
				</div>
				<br></br>
				<br></br>
				<div className='add-edit-student-row'>
					<button id='cancel-btn' className='' onClick={this.props.closeWindow(event, true)}>Cancel</button>
					<button id='position' className='' onClick={() => this.props.save(this.save())}>Save</button>
				</div>
				{
					this.props.errorMessage ? <div className='add-edit-student-row error-message'>
						<span>{this.props.errorMessage}</span>
					</div>
					: null
				}
				<br></br>
			</div>
		</div>
		)
	}
}
