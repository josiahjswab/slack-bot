import React from 'react';

function handleClickDataToCSV(data, name) {
  // transfer student data into CSV file
  if (data.length) {
    const separator = ',';
    const keys = Object.keys(data[0]);
    const studentName = name;
    const csvContent = `${keys.join(separator)}\n${data
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k];
            cell = cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n')}`;

    // create a hidden variable which become a download function
    const hiddenElement = document.createElement('a');
    hiddenElement.href = `data:text/csvContent;charset=utf-8,${encodeURI(csvContent)}`;
    hiddenElement.target = '_blank';
    hiddenElement.download = `${studentName}.csv`;
    hiddenElement.click();
  } else {
    alert("no data");
  }
}

function StudentStatsDownload(props) {

  return (
    <section className="data-section data-section-flex">
      <h2 className="section-label inline-block">Downloads</h2>
      <div className="data-container">
        <div className='center-data box'>
          <div className='data'>
            <span className='featured-data'>
              <span className="glyphicon glyphicon-download-alt"
                onClick={() => handleClickDataToCSV(props.checkinData, props.name)}>
              </span>
            </span>
            <p>Checkin Data</p>
          </div>
        </div>
        <div className='center-data box'>
          <div className='data'>
            <span className='featured-data'>
              <span className="glyphicon glyphicon-download-alt"
                onClick={() => handleClickDataToCSV(props.standupData, props.name)}>
              </span>
            </span>
            <p>Standup Data</p>
          </div>
        </div>
        <div className='center-data box'>
          <div className='data'>
            <span className='featured-data'>
              <span className="glyphicon glyphicon-download-alt"
                onClick={() => handleClickDataToCSV(props.wakatimeData, props.name)}>
              </span>
            </span>
            <p>Coding Data</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentStatsDownload;
