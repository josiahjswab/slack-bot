import React from 'react';

class AbsenteeEdit extends React.Component {
    constructor(props) {
        super(props);
        this.handleNotes = this.handleNotes.bind(this);
        this.handleExcused = this.handleExcused.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleNotes(event) {
        this.props.handleEditNotes(event.target.value);
    }

    handleExcused(event) {
        this.props.handleExcusedValue(event.target.value);
    }

    handleSave() {
        this.props.handleSave();
    }

    render() {
        return (
            <React.Fragment>
                <div> 
                    <p>{this.props.studentData.date.slice(0,10)}</p>
                    <textarea onChange={this.handleNotes} value={this.props.notes}></textarea>
                    <div>
                        <br></br>
                        <select className='edit-button-mobile' defaultValue='Excused or Not' name='excuseOrNa' onChange={this.handleExcused}>
                            <option value={0}>Select</option>
                            <option id='excuseOrNa-2' value={false} >Not Excused</option>
                            <option id='excuseOrNa-1' value={true} >Excused</option>
                        </select>
                    </div>
                    <br />
                    <button className='edit-button-mobile' onClick={this.handleSave}>Save</button>
                </div>
            </React.Fragment>
        );
    }
}

export default AbsenteeEdit
