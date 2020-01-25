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

    user.isStudentRole = (userId, cb) => { 
      const Role = user.app.models.Role;
      const RoleMapping = user.app.models.RoleMapping;
      Role.findOne({ where: { name: 'student' } }, (errFindOne, role) => {
        if (errFindOne) cb(null, false);
        if (!_.isEmpty(role)) {
          RoleMapping.find({ where: { roleId: role.id } }, (errFind, allStudents) => { 
            if (errFind) cb(null, false);
            const currentUser = allStudents.filter(x => x.principalId === userId.toString());
            cb(null, currentUser.length > 0);
          });
        } else {
          cb(null, false);
        }
      });
    };

    user.createStudentRoleMapping = slack_id => {
      const Role = user.app.models.Role.findOne({'where': {'name': 'student'}})
      const User = user.app.models.User.findOne({'where': {'username': 'slack.' + slack_id}})

      Promise.all([Role, User]).then( result => {
        let roleId = result[0].id
        let userId = result[1].id
        user.app.models.RoleMapping.upsertWithWhere({ principalId: userId},
          {
            principalType: "STUDENT",
            principalId: userId,
            roleId: roleId
          })
      })
      .catch(err => {
        console.log(err);
        return -1;
      })
    }

    user.deleteStudentRoleMapping = slack_id => {
      user.app.models.User.findOne({'where': {'username': 'slack.' + slack_id}})
      .then(loginUser => {
        user.app.models.RoleMapping.findOne({'where': {'principalId': loginUser.id}})
        .then(roleMapping => {
          if (!!(roleMapping)) {
            user.app.models.RoleMapping.deleteById(roleMapping.id)
          }
        });
      })
      .catch(err => {
        console.log(err);
        return -1;
      })
    }

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
