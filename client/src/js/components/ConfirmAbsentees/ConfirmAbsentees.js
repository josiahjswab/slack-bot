import React from 'react';
import { withRouter } from "react-router";
import { calculateAbsentees } from '../../../../../common/utilities';
import moment from 'moment';
import AbsentStudent from './AbsentStundent';

class ConfirmAbsentees extends React.Component {
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
        let slack_ids = unexcusedAbsentees.map(absentee => {
                let today = moment().format();
                let absence = {
                    "slack_id": absentee.slack_id,
                    "date": today,
                    "notes": "",
                    "excused": false
                };
                return absence;
        });
        return slack_ids;
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
        const { activeCheckinsToday, students } = this.props;
        let absentees = calculateAbsentees(activeCheckinsToday, students);
        this.setState({
            unexcusedAbsentees: absentees,
        })
    }

    render() {

        return (
            <div className='add-edit-student-window' onClick={this.props.closeWindow(event, true)}>
                <div className='unchecked'>
                    <h3 className='not-checked-in-color'>Not checked In:</h3>
                    <br></br>
                    <div>
                        {this.props.absentees.map((student) => (
                            <AbsentStudent key={student.id} student={student} onClick={this.handleCheckbox} />
                        ))}
                    </div>
                    <div className='absentees-btn'>
                        <button id="cap" onClick={() => this.props.saveAbsentees(this.confirm())}>Confirm Absences</button>
                        <button id="cap1" onClick={this.props.closeWindow(event, true)}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ConfirmAbsentees);
