import React from 'react';
import DataBox from './DataBox';
import StudentList from './StudentList';

function DataSection(props) {
  let boxes;
  let studentsList1;
  let studentsList2;

  if(props.data) {
    boxes = props.data.map(data => (
      <DataBox key={data.footer} data={ data } /> 
    ));
  } else {
    boxes = <p>No data available</p>
  }

  if(props.studentsList1) {
    studentsList1 =
      (<StudentList 
        title={props.title1}
        students={props.studentsList1}
        auth_token={props.auth_token}
      />)
  }

  if(props.studentsList2) {
    studentsList2 =
      (<StudentList
        title={props.title2}
        students={props.studentsList2}
        auth_token={props.auth_token}
        />)
  }
  
  return(
    <section className='data-section data-section-flex'>
      <div className='data-container'>
        { boxes }
      </div>
        {studentsList1}
        {studentsList2}
    </section>
  );
}

export default DataSection;
