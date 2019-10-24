import React, { Component } from 'react';
import { calculateAbsentees } from '../../utilities';

class AbsentStudent extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        const { student } = this.props;
        return (
            <div className=''>
                <h4 className='name-margin'>{student.name}
                    <p className='absent-padding'>Absent</p>
                    <input className='checkbox-position' type='checkbox' defaultChecked onClick={this.props.onClick} />
                </h4>
            </div>
        )
    }
}

export default class ConfirmAbsentees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            absentees: []
        }
        this.confirm = this.confirm.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }
    confirm() {
        const { absentees } = this.state;
    }

    handleCheckbox(id){
        var { absentees } = this.state;
        var student;
        absentees.map(absentee => {
            if(absentee.id === id){
                student = absentee;
                student.absent = !absentee.absent;
            }
            return student;
        })
        this.setState({absentees})
    }

    componentDidMount() {
        const { activeCheckins, studentsBeingViewed } = this.props;
        let absentees = calculateAbsentees(activeCheckins, studentsBeingViewed);
        this.setState({
            absentees
        })
    }

    render() {
        var { absentees } = this.state;
        return (
            <div className='add-edit-student-window' onClick={this.props.closeWindow(event)}>
                <div className='unchecked'>
                    <h3 className='not-checked-in-color'>Not checked In:</h3>
                    <br></br>
                    <div>
                        {absentees.map((student) => (
                            <AbsentStudent id='absentStud' key={student.slack_id} student={student} onClick={() => this.handleCheckbox(student.id)} />
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
