'use strict';

module.exports = function (Student) {
  Student.reminder = function (cb) {
    Student.find({ where: { or: [{ type: 'PAID' }, { type: 'JOBSEEKER' }] } })
      .then(result => {
        cb(null, result);
      })
      .catch(err => console.log(err));
  };

  Student.getBySlackId = function(slackId, cb) {
    Student.find({where: {slack_id: slackId}})
      .then(result => {
        cb(null, result);
      })
      .catch(err => console.log(err));
  };

  Student.remoteMethod(
    'reminder', {
    http: {
      path: '/student',
      verb: 'get',
    },
    returns: { arg: 'data', type: ['student'], root: true },
  }
  );

  Student.remoteMethod(
    'getBySlackId', {
    http: {
      path: '/slackId/:slack_id',
      verb: 'get',
    },
    accepts: {
      arg: 'slack_id',
      type: 'string',
      required: true,
      http: { source: 'path' },
    },
    returns: { arg: 'student', type: ['student'], root: true },
  }
  )
};
