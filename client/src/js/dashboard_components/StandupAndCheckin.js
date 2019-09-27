import React from 'react';

function StandupAndCheckin(props) {
  let { date, checkin, standup } = props;
  let checkinTime, checkoutTime, hours, tasksYesterday, tasksToday, blockers;
  
  if (checkin){
    checkinTime = checkin.checkin_time;
    checkoutTime = checkin.checkout_time;
		hours = checkin.hours;
	}
	 
  if (standup){
    tasksYesterday = standup.tasks_yesterday;
    tasksToday = standup.tasks_today;
    blockers = standup.blockers;
  }

	if(checkinTime){
		let checkinDate = new Date(checkinTime);
		checkinTime = checkinDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
	}
  if(checkoutTime) {
    let checkoutDate = new Date(checkoutTime);
		checkoutTime = checkoutDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  return(
    <div className='standup-card'>
      <p className='standup-card-title'>{ date }</p>
 
      <div className='hours-container'>
        <p className={`standup-response ${ !checkinTime ? 'missing-info' : '' } `}><strong>In: </strong>{ checkinTime ? checkinTime : 'missed' }</p>
        <p className={`standup-response ${ !checkoutTime ? 'missing-info' : '' } `}><strong>Out: </strong>{ checkoutTime ? checkoutTime : 'missed' }</p>
        <p className='standup-response'><strong>Hrs: </strong>{ hours ? hours.toFixed(2) : 'none' }</p>
      </div>

      <div className='standup-card-content'>
        <p className='standup-question'>What have you done since yesterday?</p>
        <p className='standup-response'>{ tasksYesterday ? tasksYesterday : '-' }</p>
      </div>
      <div className='standup-card-content'>
        <p className='standup-question'>What will you do today?</p>
        <p className='standup-response'>{ tasksToday ? tasksToday : '-' }</p>
      </div>
      <div className='standup-card-content'>
        <p className='standup-question'>Blockers?</p>
        <p className='standup-response'>{ blockers ? blockers : '-' }</p>
      </div>
    </div>
  );
}

export default StandupAndCheckin;
