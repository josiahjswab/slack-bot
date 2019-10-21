import React, { Component } from 'react';

function AbsentStudent(student){
        return (
            <div className=''>
                <h4 className='name-margin'>{student.name}
                <p className='absent-padding'>Absent</p>
                <input className='checkbox-position' type='checkbox'  />
                </h4>
            </div>
        )
    }


export default class ConfirmAbsentees extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
    this.confirm = this.confirm.bind(this);
}
confirm(absentees){
  console.log(this.state);
  console.log('Absentees: ', absentees)
}

    confirmAbsentees(absentees) {
        let names = [];
        for (let i = 0; i < absentees.length; i++) {
            if (absentees[i].absent !== false) {
                names.push(absentees[i].name);
            }
        }
        console.log(names);
        this.props.sendAbsences(names);
    }

    render() {
      let absentees = this.props.absentees.absentees;
        return (
            <div className='add-edit-student-window' onClick={this.props.closeWindow(event)}>
                <div className='unchecked'>
                    <h3 className='not-checked-in-color'>Not checked In:</h3>
                    <br></br>
                    <div>
                        {absentees.map((student) => (
                            <AbsentStudent id='absentStud' key={student.id} name={student.name}/>
                        ))}
                    </div>
                    <div className='absentess-btn'>
                        <button  id="cap" onClick={() => this.confirm(absentees)}>Confirm Absences</button>
                        <button  id="cap1" onClick={this.props.closeWindow(event, true)}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}
