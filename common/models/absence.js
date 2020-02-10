'use strict';

module.exports = function(Absence) {
  Absence.getById = function(id, cb) {

    Absence.upsertWithWhere({where:{id: theId}})
      .then(res => {
        cb(result)
      })
      .catch(err => console.log(err));
  }

  Absence.remoteMethod(
    'getById', {
    http: {
      path: '/absence/:id',
      verb: 'put',
    },
    accepts: {
      arg: 'id',
      type: 'string',
      required: true,
      http: { source: 'path' },
    },
    returns: { arg: 'student', type: ['student'], root: true },
  }
  )
};

