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
      let fullString;
      let range;
      let unit;
      let daysActivities;
      let startActivityNum;
      let endActivityNum;

      let match = new RegExp(
        // Test this RegEx out here:
        // https://regexr.com/49k9u
        /Summary: Complete activity?(?:ies)? (\d+-?\d+?) in Unit (\d+)/, 'gm').exec(data);  
      if (match) {
        fullString = match[0];
        console.log(fullString)
        range = match[1];
        unit = match[2];
        range = range.split('-');
        // get days activities based on single range
        daysActivities = findActivityFolders(parseInt(range[0]), parseInt(range[1]));
        resolve(daysActivities);
      } else {
        match = new RegExp(/Summary: Complete activity?(?:ies)? ((?:\d+-\d+)?(?:\d+)?) and activity ((?:\d+-\d+)?(?:\d+)?) in Unit (\d+)/, 'gm').exec(data);
        fullString = match[0];
        console.log(fullString)
        range1 = match[1].split('-');
        range2 = match[2].split('-');
        unit = match[3];
        // Get days based on two ranges found.
        daysActivities = [];
        [range1, range2].forEach((range) => {
          let acts;
          if (range[0] && range[1]) {
            acts = findActivityFolders(parseInt(range[0]), parseInt(range[1]));
          } else if (range[0] && !range[1]) {
            acts = findActivityFolders(parseInt(range[0]));
          }
          daysActivities = daysActivities.concat(acts);
        });
        resolve(daysActivities);
      }   
    });
  });
}

function findActivityFolders(start, end) {
  // TODO: have this use package.json values.
  const path = `/Users/aaronostrowsky/Documents/TrilogyEd/FullStack-Lesson-Plans/01-Class-Content/${globalContentDir}/01-Activities/`;

  return shell.ls(path).filter((item) => {
    let itemDirNum = item.substring(0, 2);

    // If only 1 activity provided return directory name where numbers match.
    if (start && !end && parseInt(itemDirNum) === parseInt(start)) {
      return item;
    }
    // Otherwise, ensure folder number is within range of start & end dir numbers found in lesson plan.
    if (parseInt(itemDirNum) >= parseInt(start) &&
      parseInt(itemDirNum) <= parseInt(end)) {
      return item;
    }
  })
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

//--------------------------------------------

var globalContentDir = process.argv[2];
var globalWeek = process.argv[2].substring(0,2) + '-Week';

findWeeksActs(globalWeek).then(function (data) {
  data.forEach((day, index) => {
    console.table(`/// Day ${index+1} ///`)
    console.log(day)
  });
  // return data; 
});