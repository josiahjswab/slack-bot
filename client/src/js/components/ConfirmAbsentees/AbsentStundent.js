import React, { Component } from 'react';

const AbsentStudent = (props) => {
    return (
        <div>
            <h4 className='name-margin'>{props.student.name}
                <p className='absent-padding'>Absent</p>
                <input className='checkbox-position' type='checkbox' id={props.student.id} defaultChecked onClick={props.onClick} />
            </h4>
        </div>
    )
}

export default AbsentStudent;
