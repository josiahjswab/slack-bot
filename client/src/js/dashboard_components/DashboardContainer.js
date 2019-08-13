import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom'

function DashboardContainer(props) {
  return (
    <React.Fragment>
      <header>
        <p className='date'>August 9</p>
        <a href='#' className='link-btn'>Logout</a>
      </header>
       <main className='grid'>
         <div className='grid-column'>
           <section className='card'>
             <h2 className='card-heading'>Completed Standups</h2>
             <p className='percentage'>75%</p>
             <p className='fraction'>12 / 16</p>
           </section>
           <section className='card'>
             <h2 className='card-heading'>Delinquents</h2>
             <ul>
               <li>John Doe</li>
               <li>Student 1</li>
               <li>Student 2</li>
               <li>Student 3</li>
             </ul>
           </section>
         </div>
         <section className='card grid-column'>
           <h2 className='card-heading'>View standups for:</h2>
           <ul className='standup-links'>
             <li><Link to='/standup/1'>John Doe</Link></li>
             <li><Link to='/standup/1'>Student 2</Link></li>
             <li><Link to='/standup/1'>Student 3</Link></li>
             <li><Link to='/standup/1'>Student 4</Link></li>
             <li><Link to='/standup/1'>student 5</Link></li>
             <li><Link to='/standup/1'>student 6</Link></li>
             <li><Link to='/standup/1'>student 7</Link></li>
             <li><Link to='/standup/1'>student 8</Link></li>
             <li><Link to='/standup/1'>student 9</Link></li>
             <li><Link to='/standup/1'>student 10</Link></li>
             <li><Link to='/standup/1'>student 11</Link></li>
             <li><Link to='/standup/1'>student 12</Link></li>
             <li><Link to='/standup/1'>student 13</Link></li>
             <li><Link to='/standup/1'>student 14</Link></li>
             <li><Link to='/standup/1'>student 15</Link></li>
             <li><Link to='/standup/1'>student 16</Link></li>
           </ul>
         </section>
       </main>
     </React.Fragment>
  );
}

export default DashboardContainer;
