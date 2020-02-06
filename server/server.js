'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');
const path = require('path');
const session = require('express-session');
const explorer = require('loopback-component-explorer');
require('dotenv').config()
const app = module.exports = loopback();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const loopbackPassport = require('loopback-component-passport');
const PassportConfigurator = loopbackPassport.PassportConfigurator;
const passportConfigurator = new PassportConfigurator(app);

const flash = require('express-flash');

const ensureAdmin = (req, res, next) => {
  if(!!req.query.auth_token) {
  app.models.accessToken.find({'where': {id: req.query.auth_token}}).then(token => {
    if ( token.length == 0) {
      res.redirect('/admin/login')
    } else {
    app.models.user.isAdminRole(token[0].userId, (err, isAdmin) => 
            {
              if (!isAdmin) {
                res.redirect('/admin/login')
             } else {
                next()
             }
          })
        }
    })
  } else {
    res.redirect('/admin/login')
  }
}

const ensureStudent = (req, res, next) => {
  if(!!req.query.auth_token) {
  app.models.accessToken.find({'where': {id: req.query.auth_token}}).then(token => {
    if ( token.length == 0) {
      res.redirect('/login')
    } else {
    app.models.user.isStudentRole(token[0].userId, (err, isStudent) => 
            {
              if (!isStudent) {
                res.redirect('/login')
             } else {
                next()
             }
          })
        }
    })
  } else {
    res.redirect('/login')
  }
}

app.use('/explorer/$', ensureAdmin, explorer.routes(app, { basePath: '/api' }));

let config = {};
try {
  config = require('../providers.js');
} catch (err) {
  console.trace(err);
  process.exit(1);
}

boot(app, __dirname, function(err) {
  if (err) throw err;
});

app.middleware('auth', loopback.token({
  model: app.models.accessToken,
}));

app.middleware('session', session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true,
}));

passportConfigurator.init();

app.use(flash());

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential,
});

for (let s in config) {
  let c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
};

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/login.html'));
});


app.get('/admin/auth', (req, res) => {
  const token = req.headers.cookie.match(/\access_token=(.*?)(;|$)/)[1];
  res.redirect(`/admin/dashboard?auth_token=${token}`);
});

app.get('/admin/dashboard', ensureAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.post('/admin/dashboard', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  app.models.User.login({
    email: email,
    password: password,
  }, 'user', function(err, user) {
    if (err) {
      return res.status(401).redirect('/admin/login');
    }
    let token = user.toJSON();
    res.redirect(`/admin/dashboard?auth_token=${token.id}`);
  });
});

app.get('/admin/student-summary/:id', ensureAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/admin/student-summary/createStudentRoleMapping/:slack_id', ensureAdmin, (req, res) => {
  if (app.models.user.createStudentRoleMapping(req.params.slack_id) != -1) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
})

app.get('/admin/student-summary/deleteStudentRoleMapping/:slack_id', ensureAdmin, (req, res) => {
  if (app.models.user.deleteStudentRoleMapping(req.params.slack_id) != -1) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
})

app.get('/admin/logout', (req, res, next) => {
  if (req.query.auth_token) {
    app.models.accessToken.destroyAll({
      id: req.query.auth_token,
    });
  };
  req.logout();
  res.redirect('/admin/login');
});

app.start = function() {
  return app.listen(function() {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
  });
};

if (require.main === module) {
  app.start();
}

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/auth', (req, res) => {
  const token = req.headers.cookie.match(/\access_token=(.*?)(;|$)/)[1];
  const slack_id = req.user.username.replace(/^.*\./, '');

  app.models.user.isStudentRole(req.user.id, (err, isStudent) => {
    if (isStudent) {
      res.redirect(`/dashboard/${slack_id}?auth_token=${token}`)
    } else {
      app.models.userIdentity.findOne({'where': { externalId: slack_id}}).then((identity) => {
        let email = identity.profile.user.email
        let partner_slackId = identity.profile.user.id
        app.models.student.upsertWithWhere({partner_email: email}, {partner_slackId}).then((result) => 
            res.redirect(`/partner/${result.slack_id}?auth_token=${token}`)
        )
        .catch((err) => {
          console.log(err + " Not a partner")
          res.redirect('/login')
        })
      })
    }
  })
});

app.get('/dashboard/:slack_id', ensureStudent, (req, res) => {
  sendDataToStudentDash(req, res);
});

app.get('/partner/:slack_id', (req, res) => {
  sendDataToStudentDash(req, res);
})

function sendDataToStudentDash(req, res) {
let studentSlackId = req.params.slack_id
let studentObject = {
  name: '',
  standups: [],
  checkins: [],
  wakatimes: [],
  commits: ''
}
  app.models.student.find({'where':{slack_id: studentSlackId}}).then(student => {
    if(student.length == 0 ) {
      res.send("No Student Found")
    }
    studentObject.name = student[0].name;
    const standups = app.models.standup.find({'where':{slack_id: studentSlackId}}).then(standups => {
      studentObject.standups = standups
      return standups
    })
    const checkins = app.models.checkin.find({'where':{slack_id: studentSlackId}}).then(checkins => {
      studentObject.checkins = checkins
      return checkins
    })
    const wakatimes = app.models.wakatime.find({'where':{slack_id: studentSlackId}}).then(wakatimes => {
      studentObject.wakatimes = wakatimes
    })
    const commits = app.models.commits.find({'where':{slack_id: studentSlackId}}).then(commits => {
      studentObject.commits = commits
    })

    return Promise.all([wakatimes, commits, standups, checkins]).then(() => {
      res.render('dash', {studentObject})
    })
  }
)};
