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
const userHome = require('user-home');

const fs = require('fs-extra');

const isConsoleEnabled = argv.v || argv.verbose || false;

// end shared

/**
 * Performs regex search on lesson plan contents to pull out 
 * the activity dir numbers for the day.
 * 
 * @param string lessonPlanFilePath 
 */
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

      let match = new RegExp(
        // Test this RegEx out here:
        // https://regexr.com/49k9u
        /Summary: Complete activity?(?:ies)? (\d+-?\d+?) in Unit (\d+)/, 'gm').exec(data);
      
      // TODO: clean this match logic up; the nested if statements is ugly.
      if (match) {
        fullString = match[0];
        console.log(fullString)
        range = match[1];
        unit = match[2];
        range = range.split('-');
        // get days activities based on single range
        daysActivities = findActivityFolders(parseInt(range[0]), parseInt(range[1]));
        resolve(daysActivities);
      // TODO: clean this match logic up;
      } else {
        match = new RegExp(/Summary: Complete activity?(?:ies)? ((?:\d+-\d+)?(?:\d+)?) and activity ((?:\d+-\d+)?(?:\d+)?) in Unit (\d+)/, 'gm').exec(data);
  
        // If no match resolve for now an empty array
        if (!match) {
          logger.error('No match found with second pattern! Returning empty array.');
          resolve([]);
        }
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
/**
 * Using a the activities summary start and end strings e.g. 01-07
 * scan the output of 'ls' command for pulling out the entire activity dirname.
 * 
 * @param string start 
 * @param string end 
 */
function findActivityFolders(start, end) {
  // DONE: have this use package.json values.
  const path = userHome + '/' + pkgFile.paths.sourceRepoDir + pkgFile.paths.classContentDir + `/${weekContentDir}/` + pkgFile.paths.activitiesDir;

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
/**
 * Search week's lesson plans for activities summary line. 
 * Formats each day's path to lesson plan and has it scanned.
 * 
 * @param string week 
 */
function findWeeksActs(week) {
  const srcLessonPlansPath = userHome + '/' + pkgFile.paths.sourceRepoDir + pkgFile.paths.lessonPlanDir;
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

const weekContentDir = process.argv[2];
const weekLessonPlanDir = process.argv[2].substring(0,2) + '-Week';

findWeeksActs(weekLessonPlanDir).then(function (weeklyActivitiesByDay) {
  weeklyActivitiesByDay.forEach((day, index) => {
    console.table(`/// Day ${index+1} ///`);
    console.log(day);
  });
});