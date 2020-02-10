import React, { Component } from 'react';
import { render } from 'react-dom';
import StandupAndCheckin from '../StandupAndCheckin';
import DataSectionForStudentStats from '../DataSectionForStudentStats';
import {
  calculateIndividualCheckinData,
  calculateIndividualStandupsData,
  calculateIndividualWakatimeData,
  calculateIndividualCommitData,
  mergeStudentData
} from '../../../../../common/utilities';
import StudentProgressDials from '../StudentProgressDials';
import StandupCheckinIndicator from '../DailyIndicators/StandupCheckinIndicator';

function sortByDate(a, b) {
  let arrA = a[0].split('/')
  let arrB = b[0].split('/')
  if (parseInt(arrA[2].substring(0, 4)) > parseInt(arrB[2].substring(0, 4))) {
    return -1;
  }
  else if (parseInt(arrA[2].substring(0, 4)) < parseInt(arrB[2].substring(0, 4))) {
    return 1;
  }
  else if (parseInt(arrA[0]) > parseInt(arrB[0])){
    return -1;
  }
  else if (parseInt(arrA[0]) < parseInt(arrB[0])){
    return 1;
  }
  else if (parseInt(arrA[1]) > parseInt(arrB[1])){
    return -1;
  }
  else if (parseInt(arrA[1]) < parseInt(arrB[1])){
    return 1;
  }
  else{
    return 0;
  }
};

export default function StudentDashboard(props) {

    let StandupAndCheckinComponent;
    let standupsData = [];
    if (window.student.standups.length) {
      standupsData = calculateIndividualStandupsData(
        window.student.standups
      );
    }
    let commitData = {}
    let commits = calculateIndividualCommitData(window.student.commits)
    if (window.student.commits) {
      commitData = {
        featured: commits,
        measurement: '',
        footer: 'Commits past 7 days',
      }
    }
    let checkinData = [];
    if (window.student.checkins) {
      checkinData = calculateIndividualCheckinData(window.student.checkins);
    }
    let wakatimeData = [];
    if (window.student.wakatimes) {
      wakatimeData = calculateIndividualWakatimeData(
        window.student.wakatimes
      );
    }
    let standupAndCheckinData = mergeStudentData([window.student.standups, window.student.checkins]);
    if (Object.keys(standupAndCheckinData).length > 0) {
      StandupAndCheckinComponent = Object.entries(
        standupAndCheckinData
      )
        .sort(sortByDate)
        .map(data => (
          <StandupAndCheckin
            key={data[0]}
            date={data[0]}
            checkin={data[1].checkin}
            standup={data[1].standup}
          />
        ));
    } else {
      StandupAndCheckinComponent = (
        <div className="standup-card">
          {`${window.student.name} has not submitted any standups and has not checked in.`}
        </div>
      );
    }

    let keyMetrics = [];
    let keyClassMetrics = [];
    let keyStandupMetrics = [];
    let keyCodingMetrics = [];
    let keyCommitMetrics = [];
    let keyAbsenceMetrics = [];

    if (!!checkinData) {
      keyClassMetrics = checkinData.filter(function (obj) {
        return (obj.footer == "Time in class past 7 days") || (obj.footer == "weekly auto-checkouts");
      });
    }

    if (!!checkinData) {
      keyClassMetrics = checkinData.filter(function (obj) {
        return (obj.footer == "absences");
      });
    }

    if (!!commitData) {
      keyCommitMetrics = [commitData];
    }

    if (!!wakatimeData) {
      keyCodingMetrics = wakatimeData.filter(function (obj) {
        return (obj.footer == "Time coding past 7 days");
      });
    }

    if (!!standupsData) {
      keyStandupMetrics = standupsData.filter(function (obj) {
        return (obj.footer == "Standups completed past 7 days");
      });
    }

    keyMetrics = [
      ...keyClassMetrics,
      ...keyCodingMetrics,
      ...keyStandupMetrics,
      ...keyCommitMetrics,
      ...keyAbsenceMetrics
    ];

    let otherMetrics = [];
    let otherClassMetrics = [];
    let otherStandupMetrics = [];
    let otherCodingMetrics = [];

    if (!!checkinData) {
      otherClassMetrics = checkinData.filter(function (obj) {
        return (obj.footer == "Time in class weekly average") || (obj.footer == "Time in class total hours");
      });
    }

    if (!!wakatimeData) {
      otherCodingMetrics = wakatimeData.filter(function (obj) {
        return (obj.footer == "Time coding weekly average") || (obj.footer == "Time coding total hours");
      });
    }

    if (!!standupsData) {
      otherStandupMetrics = standupsData.filter(function (obj) {
        return (obj.footer == "Standups completed total hours");
      });
    }

    otherMetrics = [
      ...otherClassMetrics,
      ...otherCodingMetrics,
      ...otherStandupMetrics
    ];

    return (
      <>
        <div>
          <ul className='navigation hamburger-navigation'>
            <li>
                <p id='logo-style-student-page'></p>
            </li>
          </ul>
        </div>
        <div className="header-name">
          <h4>{window.student.name}</h4>
        </div>
        <main className="wrapper">
          <div className="data-section-container-grid">
            <DataSectionForStudentStats
              title="Key Metrics"
              data={keyMetrics}
              name={window.student.name}
            />
            <DataSectionForStudentStats
              title="Other Metrics"
              data={otherMetrics}
              name={window.student.name}
            />
            <StudentProgressDials
              checkins={checkinData}
              wakatime={wakatimeData}
              commits={commitData}
            />
            <StandupCheckinIndicator
              title='Standup Checkin Visuals'
              standupCheckin={standupAndCheckinData}
              name={window.student.name}
            />
          </div>
          <section className="standupAndcheckin">
            <span
              className="section-label pointer"
              onClick={() => this.toggle("standups-panel")}
            >
              <h2>Standups and Checkins</h2>
            </span>
            <div className={`standup-container`}>
              {StandupAndCheckinComponent}
            </div>
          </section>
        </main>
      </>
    );
  }

render(<StudentDashboard />, document.getElementById('root'));

