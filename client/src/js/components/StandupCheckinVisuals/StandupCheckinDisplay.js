import React from 'react';

const moment = require('moment');

export default function Container(props) {
  const { standupCheckin } = props;
  let firstDay = Object.keys(standupCheckin)[0];
  let today = moment().format('L');
  let totalDaysEnrolled;

  if ( firstDay ) {
      firstDay = moment(firstDay.slice(0,10), 'MM DD YYYY').format('L');
      totalDaysEnrolled = moment(today, 'L').diff(moment(firstDay, 'L'), 'days') + 1;
  }

  let array = [];

  if( standupCheckin && firstDay){
    for (let i = 0; i < totalDaysEnrolled; i++) {
    let day = moment().subtract(i, 'days').format('L') + ' ' + moment().subtract(i, 'days').format('dddd');
      if( standupCheckin[day] ) {
          if ( standupCheckin[day].checkin && standupCheckin[day].standup ) {
              array.push(1);
          } else {
              array.push(2);
          }
      } else {
          array.push(0);
      }
    }
  }

  const display = array.map((item, i) =>
    <Box key={i} item={item} index={(totalDaysEnrolled - 1) - i} />,
  );

  return (
    <div>
      <h2 className='section-label inline-block'>Standup / Checkins Consistency</h2><br />
      <span className='standup-checkin-label left'>oldest</span>
      <span className='standup-checkin-label right'>newest</span>
      <div className='indicator-container'>
        {display}
      </div>
    </div>
  );
}

function Box(props) {
  const { item, index } = props;
  let bc;

  switch (item) {
    case 1:
      bc = '#92C060';
      break;
    case 2:
      bc = 'rgb(218, 230, 117)';
      break;
    default:
      bc = '#ececec';
      break;
  }
  return (
    <div style={{ backgroundColor: bc }} className='indicator-box'>{index + 1}</div>
  );
}
