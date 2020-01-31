import React from 'react';
import DataBox from './DataBox';
import Delinquents from './Delinquents';

function DataSection(props) {
  let boxes;
  let delinquents;

  if(props.data) {
    boxes = props.data.map(data => (
      <DataBox key={data.footer} data={ data } /> 
    ));
  } else {
    boxes = <p>No data available</p>
  }

  if(props.delinquents || props.presentStudents) {
    delinquents =
      (<Delinquents 
        title={ props.title }
        students={ props.delinquents }
        auth_token={ props.auth_token }
        presentStudents={ props.presentStudents }

      />)
  }
  
  return(
    <section className='data-section data-section-flex'>
      <div className='data-container'>
        { boxes }
      </div>
        { delinquents }
    </section>
  );
}

export default DataSection;
