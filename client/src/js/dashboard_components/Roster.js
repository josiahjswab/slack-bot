import React from 'react';
import { Link } from 'react-router-dom'

function Roster(props) {
  return(
    <section className='roster'>
      <ul className='student-links box'>
        { props.students.map(student => {
          const link = `/student-summary/${ student.id }?auth_token=${ props.auth_token }`;
          return (
            <li key={ student.id } className={student.wakatime_key ? "" : "rabbit"}>
              <Link to={ link }>{ student.name }</Link>
            </li>
          )
        }) }
      </ul>
    </section>
  );
}

export default Roster;
