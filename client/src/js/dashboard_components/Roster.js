import React from 'react';
import { Link } from 'react-router-dom'

function Roster(props) {
  return(
        <a>
    <section className='roster'>
      <ul className='student-links box'>
        { props.students.map(student => {
          const link = `/student-summary/${ student.id }?auth_token=${ props.auth_token }`;
          return (
            <li id='' key={ student.slack_id }>
            <Link style={{"width": "100%" }} to={ link }>{ student.name}
            <span title="Missing Wakatime key" style={{"font-size": "15px"}} className={student.wakatime_key ? "" : "glyphicon glyphicon-time"}/>
            <span title="Missing GitHub Id" style={{"font-size": "15px"}} className={student.github_id ? "" : "glyphicon glyphicon-equalizer"}/>
            </Link>
            </li>
          )
        })}
      </ul>
    </section>
        </a>
  );
}

export default Roster;
