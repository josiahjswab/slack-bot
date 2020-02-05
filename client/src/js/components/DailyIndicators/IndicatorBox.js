import React from 'react';

export default function IndicatorBox(props) {
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
      <div style={{ backgroundColor: bc }} className='indicator-box' >{index}</div>
    );
  }
  