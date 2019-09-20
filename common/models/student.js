'use strict';

module.exports = function (Student) {
  Student.reminder = function (cb) {
    Student.find({ where: { or: [{ type: 'PAID' }, { type: 'JOBSEEKER' }] } })
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

};
