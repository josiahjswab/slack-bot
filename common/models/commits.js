'use strict';

const moment = require('moment');
const lastSevenDays = moment().subtract(7,'d').format('YYYY-MM-DD');

module.exports = function (github) {
  github.getWeeklyCommits = function (slackId, isNumber = "false", callback) {
    github.find({ where: { slack_id: slackId } })
      .then(commits => {
        if (commits.length == 0) {
					let result = '0';
					callback(null,result);
					return
				};    
				const commitDays = commits.filter(commit => 
					moment(commit.date).format('YYYY-MM-DD') > lastSevenDays
				);
				let commitsLastSevenDays = commitDays.reduce((accumulator, github) => {
					return accumulator + github.commits;
				}, 0);				
				let result;				
				if (isNumber === "false") {
					result = `--Total commits in the last 7 days: ${commitsLastSevenDays}`;
				} else {
					result = commitsLastSevenDays;
				}
        callback(null, result);
		  })
    .catch(err => console.log(err));
  };

  github.remoteMethod(
    'getWeeklyCommits', {
			http: {
				path: '/getWeeklyCommits/:slack_id',
				verb: 'get',
			},
			accepts: [{
				arg: 'slack_id',
				type: 'string',
				required: true,
				http: { source: 'path' },
			},
			{
				arg: 'isNumber',
				type: 'string',
			}],
			returns: {root: true },
    }
  );
};