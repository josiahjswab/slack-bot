import React from 'react';
import Container from './DailyCodingIndicatorDisplay';

function DailyCodingIndicator(props) {
  return (
    <div>
      <Container data={props.data} />
    </div>

  );
}

export default DailyCodingIndicator;
