import React from 'react';
import { Link } from 'react-router-dom'

function Delinquents(props) {
  return(
    <div className='delinquents'>
      <h4>{ props.title }</h4>
      <ul className='student-links box'>
        { props.students.map(student => {
          const link = `/student-summary/${ student.id }?auth_token=${ props.auth_token }`;
          return (
            <li key={ student.slack_id } className={student.wakatime_key ? "" : "missing-info"}>
              <Link to={ link }>{ student.name }</Link>
            </li>
          )
        }) }
      </ul>
    </div>
  );
}

export default Delinquents;