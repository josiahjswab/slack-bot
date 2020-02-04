import React, { useState } from 'react';

export default function Container(props) {
  const [selectValue, setSelectValue] = useState(7);
  const wakaDay = props.data;
  let array = [];

  if (wakaDay.length > 0) {
    for (let i = 0; i < selectValue; i++) {
      if (!wakaDay[i]) {
        break;
      }
      if (wakaDay[(wakaDay.length -1) - i].duration >= 7200) {
        array.push(1);
      } else if (wakaDay[(wakaDay.length -1) - i].duration > 0 && wakaDay[(wakaDay.length -1) - i].duration < 7200) {
        array.push(2);
      } else {
        array.push(0);
      }
    }
  }

  function handleChange(e) {
    setSelectValue(e.target.value);
  }

  const display = array.map((item, i) =>
    <Box key={i} item={item} index={(wakaDay.length) - i}/>,
  );

  return (
    <div>
      <h2 className='section-label inline-block'>Daily Coding Indicator</h2><br />
      <span className='standup-checkin-label left'>oldest</span>
      <select className='indicator-selector' value={selectValue} onChange={handleChange}>
            <option value={7}>1 week</option>
            <option value={14}>2 weeks</option>
            <option value={112}>16 weeks</option>
      </select>
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
    <div style={{ backgroundColor: bc }} className='indicator-box' >{index}</div>
  );
}
