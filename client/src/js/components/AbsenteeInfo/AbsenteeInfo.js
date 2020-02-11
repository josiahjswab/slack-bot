import React from 'react';
import {
	toggleEditWindow,
	getId,
	getDate,
	getNotes,
	toggleExcused,
	getData,
} from './absenteeActions';
import { updateAbsence } from '../studentStatsActions';
import AbsenteeEdit from './AbsenteeEdit';
import AbsenteeItem from './AbsenteeItem';

class AbsenteeInfo extends React.Component {
	constructor(props) {
		super(props);

		this.openEditWindow = this.openEditWindow.bind(this);
		this.closeEditWindow = this.closeEditWindow.bind(this);
		this.handleEditNotes = this.handleEditNotes.bind(this);
		this.handleExcusedValue = this.handleExcusedValue.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	openEditWindow(event) {
		const { dispatch } = this.props;
		const studentData = event.studentData;
		dispatch(getDate(studentData.date));
		dispatch(getId(studentData.id));
		dispatch(toggleEditWindow(!this.props.toggleWindow));
		dispatch(getData(studentData));
		dispatch(getNotes(studentData.notes));
		dispatch(toggleExcused(studentData.excused))
	}

	closeEditWindow() {
		const { dispatch } = this.props;
		dispatch(toggleEditWindow(!this.props.toggleWindow));
	}

	handleEditNotes(notes) {
		const { dispatch } = this.props;
		dispatch(getNotes(notes));
	}

	handleExcusedValue(excused) {
		const { dispatch } = this.props;
		dispatch(toggleExcused(excused));
	}

	handleSave() {
		const { dispatch } = this.props;
		dispatch(toggleEditWindow(!this.props.toggleWindow));
		dispatch(updateAbsence(
			this.props.currentId,
			this.props.notes,
			this.props.excused,
			this.props.auth_token,
			this.props.studentInfo.slack_id,
			this.props.currentDate
			))
		dispatch(getNotes(''))
	}

	render() {
		return (
			<div className='acc-partner-window'>
				<div className='acc-partner-container'>
					<h3 className='acc-partner-header'>Absentee Info</h3>
					<div className='acc-partner-row'>
						<p><strong>Name</strong></p>
						<p>{this.props.studentInfo.name}</p>
					</div>
					<hr className='linePad' />
					<p className='namePad'><strong>{!this.props.toggleWindow ? 'Date of Absences' : 'Date of Absence'}</strong></p>
					{!this.props.toggleWindow && this.props.studentAbsences ?
						this.props.studentAbsences.map((student, i) =>
							<AbsenteeItem
								studentData={student}
								handleOnClick={this.openEditWindow}
								key={i}
							/>)
						:
						<AbsenteeEdit
							closeEditWindow={() => this.closeEditWindow}
							notes={this.props.notes}
							handleEditNotes={this.handleEditNotes}
							handleExcusedValue={this.handleExcusedValue}
							handleSave={this.handleSave}
							studentData={this.props.studentData}
						/>}
					<br />
					<div className='acc-partner-row'>
						<button className='student-stats-other-buttons' onClick={!this.props.toggleWindow ?
							this.props.closeWindow() : this.closeEditWindow}>{!this.props.toggleWindow ? 'Return' : 'Cancel'}</button>
					</div>
					<br />
				</div>
			</div>
		)
	}
}

export default AbsenteeInfo
