import React, { Component } from 'react';
import { calculateAbsentees } from '../../utilities';
import moment from 'moment';
import { sendAbsences } from '../DashboardContainer/dashboardActions';
import AbsentStudent from './AbsentStundent';

export default class ConfirmAbsentees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unexcusedAbsentees: [],
        }
        this.confirm = this.confirm.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }

    confirm() {
        const { unexcusedAbsentees } = this.state;
        const { dispatch } = this.props;
        var slack_ids = unexcusedAbsentees.map(absentee => {
            if (absentee.absent) {
                let today = moment().format();
                let absence = {
                    "slack_id": absentee.slack_id,
                    "date": today
                }
                return absence
            }
        });
        dispatch(sendAbsences(slack_ids));
    }

    handleCheckbox(e) {
        if (!e.target.checked) {
            let filteredUnexcusedStudents = this.state.unexcusedAbsentees.filter(function (obj) {
                return obj.id != e.target.id;
            });
            this.setState({ unexcusedAbsentees: filteredUnexcusedStudents });
        } else {
            let filteredStudentFromStore = this.props.students.filter(function (obj) {
                return obj.id == e.target.id;
            });

            this.setState({ unexcusedAbsentees: [...filteredStudentFromStore, ...this.state.unexcusedAbsentees] });
        }
    }

    componentDidMount() {
        const { activeCheckins, students } = this.props;
        let absentees = calculateAbsentees(activeCheckins, students);
        this.setState({
            unexcusedAbsentees: absentees,
        })
    }

    render() {
        const { activeCheckins, students } = this.props;
        let absentees = [];
        if (!!students) {
            absentees = calculateAbsentees(activeCheckins, students);
        }
        return (
            <div className='add-edit-student-window' onClick={this.props.closeWindow(event)}>
                <div className='unchecked'>
                    <h3 className='not-checked-in-color'>Not checked In:</h3>
                    <br></br>
                    <div>
                        {absentees.map((student) => (
                            <AbsentStudent key={student.id} student={student} onClick={this.handleCheckbox} />
                        ))}
                    </div>
                    <div className='absentess-btn'>
                        <button id="cap" onClick={this.confirm}>Confirm Absences</button>
                        <button id="cap1" onClick={this.props.closeWindow(event, true)}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}
