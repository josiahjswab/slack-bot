import React, { Component } from 'react';
import { render } from 'react-dom';
import DataSectionForStudentStats from '../DataSectionForStudentStats';
import {
  calculateIndividualCheckinData,
  calculateIndividualStandupsData,
  calculateIndividualWakatimeData,
  calculateIndividualCommitData,
} from '../../../../../common/utilities';

export default function PartnerDashboard(props) {

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

    let keyMetrics = [];
    let keyClassMetrics = [];
    let keyStandupMetrics = [];
    let keyCodingMetrics = [];
    let keyCommitMetrics = [];

    if (!!checkinData) {
      keyClassMetrics = checkinData.filter(function (obj) {
        return (obj.footer == "Time in class past 7 days") || (obj.footer == "weekly auto-checkouts");
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
      ...keyCommitMetrics
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
          </div>
        </main>
      </>
    );
  }


render(<PartnerDashboard />, document.getElementById('root'));
