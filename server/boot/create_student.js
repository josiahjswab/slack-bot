'use strict'
module.exports = function(app) {
    var Role = app.models.Role;
           // creates student role
    Role.findOne({where: {'name': 'student'}})
        .then(studentRole => {
           if(!studentRole) {
              return Role.create({
                  name: 'student'
              })
           } else {
              return studentRole 
            }
        })
        .catch(err => {
            console.log('unable to create student role');
            return err
        });
    };
