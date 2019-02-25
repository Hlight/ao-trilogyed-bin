// get-weeks-activities-by-day.js

// shared in class_repo.js
const logger = require('logat');
const shell = require('shelljs');

// # Commandline Arguments
// ...
// print process.argv
// process.argv.forEach(function (val, index, array) {
//   log(index + ': ' + val);
// });
// return
// ...OR minimist (requires `npm install minimist`)
const argv = require('minimist')(process.argv.slice(2));
const pkgFile = require('./package.json');
const fs = require('fs-extra');
const path = require('path');
// const userHome = require('user-home');
const isConsoleEnabled = argv.v || argv.verbose || false;

// end shared

function findLessonPlanActivities(lessonPlanFilePath) {
  logger.debug(lessonPlanFilePath)
  if (!isFileExists(lessonPlanFilePath)) {
    logger.warn('file not found, ' + lessonPlanFilePath);
    return;
  }

  return new Promise(function (resolve, reject) {
    fs.readFile(lessonPlanFilePath, 'utf8', function (err, data) {
      if (err) {
        // return logger.error('ERROR:' + err);
        logger.error('ERROR:' + err);
        reject(err);
      }

      let match = new RegExp(/Summary: Complete activities (\d+-\d+) in Unit (\d+)/, 'gm').exec(data);
      logger.debug(match);
      

      let fullString = match[0];
      let range = match[1];
      let unit = match[2];

      range = range.split('-');

      // temp resolve the match object
      resolve(range) // TODO: make daysActivities populated with folder names of activities.

      let daysActivities = [];

      let startActivityNum = parseInt(range[0]);
      let endActivityNum = parseInt(range[1]);
      for (let i=startActivityNum; i<endActivityNum; i++) {
        // create activity padded number.
        // use number to search dir contents for full dirname of activity.
        // add activity dirname to list
      }

      // return daysActivities;
      resolve(daysActivities);


    });
  });
}

function isFileExists(path) {
  let isFileExists = fs.existsSync(path) &&
    fs.lstatSync(path).isFile();
  return isFileExists;
}

function findWeeksActs(week) {
  const srcLessonPlansPath = '/Users/aaronostrowsky/Documents/TrilogyEd/FullStack-Lesson-Plans/02-lesson-plans/part-time/';
  const getDayPath = function (day) {
    return '/0' + day + '-Day/0' + day + '-Day-LessonPlan.md';
  };
  const activities = [];
  for (let i=1; i<=3; i++) {
    activities.push(findLessonPlanActivities(srcLessonPlansPath + week + getDayPath(i)));
  }
  return Promise.all(activities);
}
findWeeksActs('12-Week').then(function(data){ 
  console.log(data)
  return data; 
});