import React from 'react';

function Checkin(props) {
  const date = new Date(props.checkinHistory.checkin_time);
  const formattedDate = 
    "0" + (date.getMonth() + 1).toString().substr(-2)
    + "/" + ("0" + date.getDate().toString()).substr(-2)
    + "/" + (date.getFullYear().toString()).substr(2);
  
  return(
    <div className='standup-card'>
      <p className='standup-card-title'>{ formattedDate }</p>
      <div className='standup-card-content'>
        <p className='standup-question'>Check in</p>
        <p className='standup-response'>{ props.checkinHistory.checkin_time }</p>
      </div>
      <div className='standup-card-content'>
        <p className='standup-question'>Check out</p>
        <p className='standup-response'>{ props.checkinHistory.checkout_time  }</p>
      </div>
      <div className='standup-card-content'>
        <p className='standup-question'>Hours</p>
        <p className='standup-response'>{ props.checkinHistory.hours }</p>
      </div>
    </div>
  );
}

export default Checkin;
