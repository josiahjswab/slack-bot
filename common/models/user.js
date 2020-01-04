'use strict';

const _ = require('lodash');

module.exports = (user) => {
    user.isAdminRole = (userId, cb) => { 
      const Role = user.app.models.Role;
      const RoleMapping = user.app.models.RoleMapping;
      Role.findOne({ where: { name: 'admin' } }, (errFindOne, role) => {
        if (errFindOne) cb(null, false);
        if (!_.isEmpty(role)) {
          RoleMapping.find({ where: { roleId: role.id } }, (errFind, allAdmins) => { 
            if (errFind) cb(null, false);
            const currentUser = allAdmins.filter(x => x.principalId === userId.toString());
            cb(null, currentUser.length > 0);
          });
        } else {
          cb(null, false);
        }
      });
    };
    user.remoteMethod('isAdminRole', {
      isStatic: true,
      accepts: [
        { arg: 'userId', type: 'string', http: { source: 'query' } }
      ],
      returns: [
        { arg: 'isAdminRole', type: 'boolean' }
      ],
      http: { path: '/isAdminRole', verb: 'get' }
    });
    const getAdminByID = x =>
      new Promise((resolve, reject) =>
        user.findById(x.principalId)
          .then(result => resolve(result))
          .catch(error => reject(error)));
    user.getAllAdmins = (cb) => {
      const Role = user.app.models.Role;
      const RoleMapping = user.app.models.RoleMapping;
      Role.findOne({ where: { name: 'admin' } }, (errFindOne, role) => {
        if (errFindOne) cb(null, []);
        if (!_.isEmpty(role)) {
          RoleMapping.find({ where: { principalType: 'admin' } }, (errFind, allAdmins) => {
            if (errFind) cb(null, false);
            const results = allAdmins.map(getAdminByID);
            Promise.all(results)
              .then(response => cb(null, response))
              .catch((error) => { throw error; });
          });
        } else {
          cb(null, false);
        }
      });
   };
}
