import React from 'react';
import IndicatorBox from './IndicatorBox';

const moment = require('moment');

export default function StandupCheckinIndicator(props) {
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
    <IndicatorBox key={i} item={item} index={(totalDaysEnrolled) - i} />,
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
