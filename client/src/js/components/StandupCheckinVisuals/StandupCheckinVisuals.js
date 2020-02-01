import React from 'react';
import Container from './StandupCheckinDisplay';

function StandupCheckinVisuals(props) {
    return (
      <div>
        <Container 
        standupCheckin={props.standupCheckin}
        />
      </div>
  
    );
  }
  
  export default StandupCheckinVisuals;
