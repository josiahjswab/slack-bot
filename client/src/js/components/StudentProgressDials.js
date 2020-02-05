import React from 'react';
import ReactSpeedometer from 'react-d3-speedometer';

function StudentProgressDials(props) {
  const inClassHours = parseInt(props.checkins[0].featured) > 60 ? 60 : parseInt(props.checkins[0].featured);
  const codingHours = parseInt(props.wakatime[0].featured) > 30 ? 30 : parseInt(props.wakatime[0].featured);
  const commits = props.commits.featured > 7 ? 7 : props.commits.featured;
  return (
    <div className="dials-container">
      <div className="dial">
        <label>Time In Class Past 7 Days</label>
        <ReactSpeedometer
          maxValue={60}
          customSegmentStops={[0, 20, 40, 60]}
          maxSegmentLabels={0}
          ringWidth={30}
          width={200}
          height={200}
          needleHeightRatio={0.7}
          value={parseInt(props.checkins ? inClassHours: 0)}
          currentValueText="${value} hours"
          needleColor="black"
          segments={3}
          startColor="#FF471A"
          endColor="#33CC33"
        />
      </div>
      <div className="dial">
        <label>Time Coding Past 7 Days</label>
        <ReactSpeedometer
          maxValue={30}
          customSegmentStops={[0, 10, 20, 30]}
          maxSegmentLabels={0}
          ringWidth={30}
          width={200}
          height={200}
          needleHeightRatio={0.7}
          value={props.wakatime ? codingHours : 0}
          currentValueText="${value} hours"
          needleColor="black"
          segments={3}
          startColor="#FF471A"
          endColor="#33CC33"
        />
      </div>
      <div className="dial">
        <label>Commits Past 7 Days</label>
        <ReactSpeedometer
          maxValue={7}
          customSegmentStops={[0, 2.3, 4.7, 7]}
          maxSegmentLabels={0}
          ringWidth={30}
          width={200}
          height={200}
          needleHeightRatio={0.7}
          value={commits}
          currentValueText={props.commits.featured > 7 ? "More than ${value}" : "${value} commits"}
          needleColor="black"
          segments={3}
          startColor="#FF471A"
          endColor="#33CC33"
        />
      </div>
    </div>
  );
}

export default StudentProgressDials;
