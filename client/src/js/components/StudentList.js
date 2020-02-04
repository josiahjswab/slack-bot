import React from 'react';
import { Link } from 'react-router-dom'

function StudentList(props) {
  return (
    <div className='studentListContainer'>
      { props.title &&
        <div>
          <h4>{props.title}</h4>
        </div>
      }
      <ul className='student-links box'>
        {props.students.map(student => {
          const link = `/admin/student-summary/${student.id}?auth_token=${props.auth_token}`;
          return (
                <li id='stomp' key={student.slack_id}>
                <Link style={{ "width": "100%" }} to={link}>
                  <span className='gly-padding'>{student.name} </span>
                  <span title="Missing Wakatime key" style={{ "font-size": "15px" }} className={student.wakatime_key ? "" : "glyphicon glyphicon-time"}></span>
                    <span title="Missing GitHub Id" style={{ "font-size": "15px" }} className={student.github_id ? "" : "gitHub"}></span>
                </Link>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default StudentList;
