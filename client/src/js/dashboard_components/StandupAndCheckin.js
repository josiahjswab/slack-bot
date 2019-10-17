import React from 'react';

function StandupAndCheckin(props) {
  let { date, checkin, standup } = props;
  let checkinTime, checkoutTime, hours, notAtSchool, tasksYesterday, tasksToday, blockers, autoCheckout;
  if (checkin){
    checkinTime = checkin.checkin_time;
    checkoutTime = checkin.checkout_time;
    hours = checkin.hours;
    notAtSchool = checkin.notAtSchool;
    autoCheckout = checkin.auto_checkout;
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
  if(notAtSchool){
    notAtSchool='No'
  }

  if(autoCheckout){
    autoCheckout='Yes'
  }

  return(
    <div className='standup-card'>
      <p className='standup-card-title'>{ date }</p>
 
      <div className='hours-container'>
        <p className={`standup-response ${ !checkinTime ? 'missing-info' : '' } ${ notAtSchool ? 'missing-info' : ''} `}><strong className='shifting'>In: </strong>{checkinTime ? checkinTime : 'missed' }</p>
        <p className={`standup-response ${ !checkoutTime ? 'missing-info' : '' } ${ notAtSchool ? 'missing-info' : ''} `}><strong className='shifting'>Out: </strong>{ checkoutTime ? checkoutTime : 'missed' }</p>
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
      <div className='standup-card-content'>
        <p className={`standup-response ${ notAtSchool ? 'missing-info' : ''} `}><strong>At School: </strong>{ notAtSchool ? notAtSchool : 'Yes' }</p>
      </div>
      <div className='standup-card-content'>
        <p className={`standup-response ${ autoCheckout ? 'missing-info' : ''} `}><strong>Auto-Checked Out? </strong>{ autoCheckout ? autoCheckout : 'No' }</p>
      </div>
    </div>
  );
}

export default StandupAndCheckin;
