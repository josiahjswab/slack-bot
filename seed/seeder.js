const mongoose = require('mongoose');
const moment = require('moment');

const Student = require('./models/Student');
const StandUp = require('./models/StandUp');
const CheckIn = require('./models/CheckIn');
const WakaTime = require('./models/WakaTime');

mongoose.connect('mongodb://localhost:27017/slack-bot-dev');

const student = [
  new Student({
    name: 'Jeremy Kim',
    slack_id: 'UFAKEID1',
    github_id: '1',
    wakatime_key: '1',
    type: 'PAID',
    _id: '01',
  }),
  new Student({
    name: 'Diego Flores',
    slack_id: 'UQHEJTATF',
    github_id: '2',
    wakatime_key: 'f1f23b4e-4ecd-49e7-a83c-cfe337a943b3',
    type: 'PAID',
    _id: '02',
  }),
  new Student({
    name: 'Asten Fuller',
    slack_id: 'UFAKEID3',
    github_id: '2',
    wakatime_key: '3',
    type: 'PAID',
    _id: '03',
  }),
  new Student({
    name: 'Josiah Swab',
    slack_id: 'UMHHFKRS4',
    github_id: '2',
    wakatime_key: '46663b81-3185-49d9-b2ad-a3a5b7fb9cb7',
    type: 'PAID',
    _id: '04',
  }),
  new Student({
    name: 'Ryan Lypps',
    slack_id: 'UFAKEID5',
    github_id: '2',
    wakatime_key: '3',
    type: 'PAID',
    _id: '05',
  }),
  new Student({
    name: 'Shawn Taylor',
    slack_id: 'UFAKEID6',
    github_id: '2',
    wakatime_key: '3',
    type: 'PAID',
    _id: '06',
  }),
  new Student({
    name: 'Chad',
    slack_id: 'UFAKEID9',
    github_id: '2',
    wakatime_key: '3',
    type: 'FREE',
    _id: '07',
  }),
];

const standup = [
  new StandUp({
    slack_id: 'UMHHFKRS4',
    date: moment().format(),
    tasks_yesterday: 'Wait for Mike to look at our pull request.',
    tasks_today: 'Wait for Mike to look at our pull request.',
    blockers: 'Emotionally I am still twelve.',
    studentId: '04',
  }),
  new StandUp({
    slack_id: 'UQHEJTATF',
    date: moment().format(),
    tasks_yesterday: 'Walked my dog.',
    tasks_today: 'Go to a hackathon.',
    blockers: 'I don\'t have a car',
    studentId: '02',
  }),
  new StandUp({
    slack_id: 'UFAKEID1',
    date: moment().format(),
    tasks_yesterday: 'Coded while wading through the ocean.',
    tasks_today: 'Code while hiking around torrey pines.',
    blockers: 'My laptops battery life.',
    studentId: '01',
  }),
  new StandUp({
    slack_id: 'UQHEJTATF',
    date: moment().format(),
    tasks_yesterday: 'Updated the slack readme.',
    tasks_today: 'Update the readme again because it is out of date.',
    blockers: 'Ryan won\t stop asking me if he should update his mac os.',
    studentId: '02',
  }),
  new StandUp({
    slack_id: 'UFAKEID3',
    date: moment().format(),
    tasks_yesterday: 'Speed ran the Witcher III',
    tasks_today: '1000 lines of code and 100 push-ups.',
    blockers: 'Not finding true love has been the greatest block in my life.',
    studentId: '03',
  }),
  new StandUp({
    slack_id: 'UFAKEID5',
    date: moment().format(),
    tasks_yesterday: 'Was out sick with the coronavirus.',
    tasks_today: 'Create a very complex todo app.',
    blockers: 'My poor ability to wield the law of attraction.',
    studentId: '05',
  }),
];

const checkin = [
  new CheckIn({
    slack_id: 'UMHHFKRS4',
    auto_checkout: false,
    checkin_time: moment().subtract(4, 'hours').format(),
    checkout_time: moment().format(),
    hours: 4,
    notAtSchool: false,
  }),
  new CheckIn({
    slack_id: 'UFAKEID1',
    auto_checkout: false,
    checkin_time: moment().subtract(4, 'hours').format(),
    checkout_time: moment().format(),
    hours: 4,
    notAtSchool: false,
  }),
  new CheckIn({
    slack_id: 'UQHEJTATF',
    auto_checkout: false,
    checkin_time: moment().subtract(4, 'hours').format(),
    checkout_time: moment().format(),
    hours: 4,
    notAtSchool: false,
  }),
  new CheckIn({
    slack_id: 'UFAKEID3',
    auto_checkout: false,
    checkin_time: moment().subtract(4, 'hours').format(),
    checkout_time: moment().format(),
    hours: 4,
    notAtSchool: false,
  }),
  new CheckIn({
    slack_id: 'UFAKEID4',
    auto_checkout: false,
    checkin_time: moment().subtract(4, 'hours').format(),
    checkout_time: moment().format(),
    hours: 4,
    notAtSchool: false,
  }),
];

const wakatime = [
  new WakaTime({
    slack_id: 'UFAKEID1',
    duration: 28800,
    date: moment().format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID1',
    duration: 0,
    date: moment().subtract(1, 'day').format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID1',
    duration: 28800,
    date: moment().subtract(1, 'day').format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID1',
    duration: 0,
    date: moment().subtract(2, 'day').format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID1',
    duration: 200,
    date: moment().subtract(3, 'day').format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID1',
    duration: 28800,
    date: moment().subtract(4, 'day').format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID3',
    duration: 28800,
    date: moment().format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID3',
    duration: 28800,
    date: moment().subtract(1, 'day').format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID3',
    duration: 0,
    date: moment().subtract(1, 'day').format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID3',
    duration: 800,
    date: moment().subtract(2, 'day').format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID3',
    duration: 800,
    date: moment().subtract(3, 'day').format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID3',
    duration: 0,
    date: moment().subtract(4, 'day').format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID5',
    duration: 8000,
    date: moment().format(),
  }),
  new WakaTime({
    slack_id: 'UFAKEID6',
    duration: 5400,
    date: moment().format(),
  }),
];

function exit() {
  setTimeout(() => {
    mongoose.disconnect();
    console.log('=== SEEDING COMPLETED ===');
  }, 3000);
}

let done = 0;
for (let i = 0; i < wakatime.length; i++) {
  wakatime[i].save();
  if (standup[i]) standup[i].save();
  if (checkin[i]) checkin[i].save();
  if (student[i]) student[i].save();
  done++;
  if (done === student.length) {
    exit();
  }
}
