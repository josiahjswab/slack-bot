import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom'

function Standups(props) {
  return(
    <React.Fragment>
      <header>
        <h1>John Doe</h1>
        <a href='/logout' className='link-btn'>Logout</a>
      </header>
      <main className='grid'>
        <div className='standup-card'>
          <p className='standup-card-title'>08/09/19</p>
          <div className='standup-card-content'>
            <p className='standup-question'>What have you done since yesterday?</p>
            <p className='standup-response'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, consectetur ex odio ratione iusto fugit?</p>
          </div>
          <div className='standup-card-content'>
            <p className='standup-question'>What will you do today?</p>
            <p className='standup-response'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa, enim!</p>
          </div>
          <div className='standup-card-content'>
            <p className='standup-question'>Blockers?</p>
            <p className='standup-response'>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className='standup-card'>
          <p className='standup-card-title'>08/08/19</p>
          <div className='standup-card-content'>
            <p className='standup-question'>What have you done since yesterday?</p>
            <p className='standup-response'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, laboriosam minima quos natus nobis praesentium porro eius atque esse rem, cumque eum vitae fuga molestias?</p>
          </div>
          <div className='standup-card-content'>
            <p className='standup-question'>What will you do today?</p>
            <p className='standup-response'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id magnam ad harum iusto magni modi!</p>
          </div>
          <div className='standup-card-content'>
            <p className='standup-question'>Blockers?</p>
            <p className='standup-response'>Lorem, ipsum dolor.</p>
          </div>
        </div>
        <div className='standup-card'>
          <p className='standup-card-title'>08/07/19</p>
          <div className='standup-card-content'>
            <p className='standup-question'>What have you done since yesterday?</p>
            <p className='standup-response'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla, ipsa!</p>
          </div>
          <div className='standup-card-content'>
            <p className='standup-question'>What will you do today?</p>
            <p className='standup-response'>Lorem ipsum dolor sit amet.</p>
          </div>
          <div className='standup-card-content'>
            <p className='standup-question'>Blockers?</p>
            <p className='standup-response'>No</p>
          </div>
        </div>
        <div className='standup-card'>
          <p className='standup-card-title'>08/04/19</p>
          <div className='standup-card-content'>
            <p className='standup-question'>What have you done since yesterday?</p>
            <p className='standup-response'>- Lorem ipsum dolor sit amet
              <br/>- consectetur adipisicing elit
              <br/>- Dolorum, consectetur ex odio ratione iusto fugit?
            </p>
          </div>
          <div className='standup-card-content'>
            <p className='standup-question'>What will you do today?</p>
            <p className='standup-response'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa, enim!</p>
          </div>
          <div className='standup-card-content'>
            <p className='standup-question'>Blockers?</p>
            <p className='standup-response'>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className='standup-card'>
          <p className='standup-card-title'>08/03/19</p>
          <div className='standup-card-content'>
            <p className='standup-question'>What have you done since yesterday?</p>
            <p className='standup-response'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum, consectetur ex odio ratione iusto fugit?</p>
          </div>
          <div className='standup-card-content'>
            <p className='standup-question'>What will you do today?</p>
            <p className='standup-response'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa, enim!</p>
          </div>
          <div className='standup-card-content'>
            <p className='standup-question'>Blockers?</p>
            <p className='standup-response'>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

export default Standups;
