import React from 'react';
import DataBox from './DataBox';
import StudentList from './StudentList';

function DataSectionForStudentStats(props) {
  let delinquents;
  let boxes;

  if (props.delinquents) {
    delinquents = (
      <StudentList
        title={props.delinquentTitle ? props.delinquentTitle : 'delinquents'}
        students={props.delinquents}
      />
    );
  }

  if (props.data) {
    if (props.data.length != 0) {
      boxes = props.data.map(data => <DataBox key={data.footer} data={data} />);
    } else {
      boxes = <p>No data available</p>;
    }
  } else {
    boxes = <p>No data available</p>;
  }

  return (
    <section className="data-section data-section-flex">
      <h2 className="section-label inline-block">
        {props.title}
      </h2>
      <div className="data-container">{boxes}</div>
      {delinquents}
    </section>
  );
}

export default DataSectionForStudentStats;
