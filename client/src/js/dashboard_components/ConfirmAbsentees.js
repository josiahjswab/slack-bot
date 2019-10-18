import React, { Component } from 'react';

class AbsentStudent extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className='add-edit-student-row'>
                <h4>{this.props.name}</h4>
                <p>Absent</p>
                <input type='checkbox' value={this.props.absent} onClick={() => this.props.toggleAbsence(this.props.index)}/>
            </div>
        )
    }
}

export default class ConfirmAbsentees extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            absentees: []
        }
        this.confirmAbsentees=this.confirmAbsentees.bind(this);
        this.toggleAbsence=this.toggleAbsence.bind(this);
    }

    componentDidMount(){
        let list = this.props.absentees;
        for(let i = 0; i < list.length; i++){
            list[i].absent = true;
        }
        this.setState({
            absentees: list
        });
    }

    toggleAbsence(index){
        let students = this.state.absentees;
        if(students[index].absent !== false){
            students[index].absent = false;
            this.setState({
                absentees: students
            });
        } else {
            students[index].absent = true;
            this.setState({
                absentees: students
            })
        }
        console.log(students[index]);
    }

    confirmAbsentees(absentees){
        let names = [];
        for(let i = 0; i < absentees.length; i++){
            if(absentees[i].absent !== false){
                names.push(absentees[i].name);
            }
        }
        console.log(names);
        this.props.sendAbsences(names);
    }

    render(){
        return(
            <div className='add-edit-student-window' onClick={this.props.closeWindow(event)}>
                <div className='slam'>
                <h3>Students who have not checked in today: </h3>
                    <div>
                        {this.state.absentees.map((student, index) => (
                            <AbsentStudent id='stack' key={student.id} name={student.name} index={index} toggleAbsence={this.toggleAbsence}/>
                        ))}
                    </div>
                    <br></br>
                    <br></br>
                    <div className=''>
                        <button className='' id='cap' onClick={() => this.confirmAbsentees(this.state.absentees)}>Confirm Absences</button>
                        <button className='' id='cap1' onClick={this.props.closeWindow(event, true)}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
} 
