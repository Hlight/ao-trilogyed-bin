
require('./debug.js');

const logger = require('logat');
// logger.error('this is error');
// logger.warn('this is warn');
// logger.info('this is info');
// logger.debug('this is debug');

// # Commandline Arguments
// ...
// print process.argv
// process.argv.forEach(function (val, index, array) {
//   log(index + ': ' + val);
// });
// return
// ...OR minimist (requires `npm install minimist`)
const argv = require('minimist')(process.argv.slice(2));

const package = require('./package.json');
const fs = require('fs-extra');
// const fromDir = require(__dirname + '/from-dir.js');
const path = require('path');

const userHome = require('user-home');

const isConsoleEnabled = argv.v || argv.verbose || false;



/**
 * Class Repo Options
 *  Resonsible for all configuration data needed to copy source 
 *  class material to the student's shared class curriculum repo.
 */
const options = {
  curriculum: require('./curriculum.json'),
  week: argv.w || argv.week,
  day: argv.d || argv.day,
  cohort: (argv.c || argv.cohort).toUpperCase(),
  get dayFixed () {
    return pad(this.day);
  },
  get weekFixed () {
    return pad(this.week);
  },
  // used for retrieving from config.json
  get dayHandle () {
    return 'day' + this.dayFixed;
  },
  // used for retrieving from config.json
  get weekHandle () {
    return 'week' + this.weekFixed;
  },
  // dir in 02-lesson-plans
  get srcWeekDir () {
    return this.weekFixed + '-Week/';
  },
  get srcLessonPlans () {
      // return package.paths.userHome + 
      return userHome + '/' +
        package.paths.sourceRepoDir + 
        package.paths.lessonPlanDir +
        this.srcWeekDir;
  },
  get srcClassContents () {
    return userHome + '/' + 
      package.paths.sourceRepoDir + 
      package.paths.classContentDir +
      options.loadedCohort.content_dir;
  },
  get srcHomeworkDir () {
    // return this.srcWeekDir + package.paths.homeworkDir;
    return package.paths.homeworkDir;
  },
  get srcSupplementalDir () {
    return this.srcClassContents + package.paths.supplementalDir;
  },
  get dist () {
    return userHome + '/' +
       package.paths.cohorts[this.cohort];
  },
  get distWeek () {
    return this.dist + this.loadedCohort.content_dir;
  },
  get distWeekContentDir () {
    return this.distWeek + '1-Class-Content/';
  },
  get distWeekHomeworkDir () {
    return this.distWeek + '2-Homework/';
  },
  get distSupplementalDir () {
    return this.distWeek + 'Supplemental/';
  },
  getDistWeekActivitiesDir (distDayPath) {
    return distDayPath + 'Activities/';
  },
  /**
   * Creates full system path to single day directory of the week.
   * Adds properties to this object with full paths for each day, 
   * e.g. options.day01, options.day02, etc.
   * 
   * @param {number} num 
   * 
   * @return {string}
   */
  getDistDay: function (num) {
    var prop = 'day' + pad(num);
    this[prop] = this.distWeekContentDir + this.week + '.' + num + '/';
    return this[prop];
  }
};

//----------------------------
// ## Functions
//----------------------------

/**
 * Load cohort curriculum defined in curriculum.json
 * 
 * @param {String} cohort.
 * 
 * @return {Object} cohort curriculum data.
 */
function loadCohort(cohort) {
  // Curriculum Folders
  var curriculum = options.curriculum;
  var cohort = options.cohort;

  for (cohortId in curriculum) {
    if (cohort && cohort == cohortId) {
      return curriculum[cohortId];
    }
  }
}

function log(out) {
  if (isConsoleEnabled) {
    console.log(out);
  }
}

// Pad numbers to two digits e.g. 1 to 01
function pad(num) {
  var s = "0" + num;
  return s.substr(s.length - 2);
}
function mkDir(dir) {
  if (isDirExists(dir)) {
    logger.warn('Already exists! ' + dir);
  }
  fs.ensureDirSync(dir);
}
function isDirExists (path) {
  let isDirExists = fs.existsSync(path) &&
    fs.lstatSync(path).isDirectory();
  return isDirExists;
}
function isFileExists(path) {
  let isFileExists = fs.existsSync(path) &&
    fs.lstatSync(path).isFile();
  return isFileExists;
}
function isFileOrDirectory(path) {
  return isFileExists(path) || isDirExists(path);
}
function copyFile(src, dest) {
  if (!isFileOrDirectory(src)) {
    console.error('Src not found! (' + src + ')');
    return;
  }
  if (isFileExists(dest)) {
    logger.warn('Already exists! (' + dest + ')');
    return;
  }
  if (isDirExists(dest)) {
    logger.warn('Already exists! (' + dest +')');
    return;
  }
  // TODO: enable copy method below
  log('fs.copy(' + src + ', ' + dest + ')')
  // With Promises:
  fs.copy(src, dest)
    .then(() => {
      log('success! ' + dest)
    })
    .catch(err => {
      console.error(err)
    })
}
function copyWeeklyReadmes() {
  let filesToCopy = {
    'VideoGuide.md': 'VideoGuide.md',
    'StudentGuide.md': 'README.md'
  };
  for (srcFileName in filesToCopy) {
    let newName = filesToCopy[srcFileName];
    let src = options.srcLessonPlans + srcFileName;
    let dest = options.distWeek + newName;
    // log('copy('+src+', '+dest+');')
    // log(__line);
    // log(__function);
    copyFile(src, dest);
  }
}
function copyDailyExtras(day) {
  let dest = day.distDir;
  let dirsToCopy = {
    'Images': 'Images',
    'Slide-Shows': 'Slide-Shows',
    'Supplemental': 'Supplemental'
  };
  for (srcDirName in dirsToCopy) {
    let src = options.srcLessonPlans + day.srcDir + '/' + srcDirName;
    // log(__line);
    // log(__function);
    copyFile(src, dest + dirsToCopy[srcDirName]);

  }
}
/**
 * Responsible for copying daily activities defined in the curriculum json.
 * 
 * @param {Array} activities 
 * @param {String} src curriculum github repo.
 * @param {String} dest class gitlab repo.
 */
function copyDailyActivities (activities, src, dest) {
  logger.debug(activities)
  log('   src: ' + src)
  log('   dest: ' + dest)
  fromDir(src, /^.*$/, function (filePath) {
    let fileName = filePath.split('/').slice(-1)[0];
    let destPath = dest + fileName;
    let isActivityInDay = activities.includes(fileName);
    if (isActivityInDay) {
      log(isActivityInDay);
      log('  ' + fileName)
      log('  -- ' + filePath);
      copyFile(filePath, destPath);
    }
  });
}

function createGitIgnore (dest, content) {
  dest = dest + '/.gitignore';
  if (isFileExists(dest)) {
    logger.warn('.gitignore found in ' + dest);
    return;
  }
  var writeStream = fs.createWriteStream(dest);
  writeStream.write(content);
  writeStream.end();
  logger.info('Created .gitignore at ' + dest);
}

function makeDirectories(activities) {
  mkDir(options.distWeek);
  mkDir(options.distWeekContentDir);

  // Add individual class day directories.
  let dayNum = 1;
  for (day in activities) {
    // log(dayNum)
    if (day.length) {
      mkDir(options.getDistDay(dayNum));
      dayNum++;
    }
  }

  // ## Copy src lesson plan material for week.
  copyWeeklyReadmes();

  // ## Copy Homework dir to dist
  // log(__line);
  logger.debug(__function);
  copyFile(
    options.srcClassContents + options.srcHomeworkDir,
    options.distWeekHomeworkDir
  );
  // ## Copy Supplemental directory to dist
  // log(__line);
  logger.debug(__function);
  copyFile(
    options.srcSupplementalDir,
    options.distSupplementalDir
  );

  // ## add .gitignore to ignore 'Solutions' in Homework dir (remove this after 1 week of class passes)
  createGitIgnore(options.distWeekHomeworkDir, 'Solutions');

  // ## Copy class-day activities for week.
  let dayConfig = {
    day01: {
      distDir: options.day01,
      srcDir: '01-Day'
    },
    day02: {
      distDir: options.day02,
      srcDir: '02-Day'
    },
    day03: {
      distDir: options.day03,
      srcDir: '03-Day'
    }
  };
  for (day in dayConfig) {
    // log(dayConfig[day]);
    fs.ensureDir(dayConfig[day].distDir);
    // log(options.loadedCohort.activities[day]);
    copyDailyExtras(dayConfig[day]);
    // ## add .gitignore to ignore "Solved" directories for days activities (remove after class)
    createGitIgnore(dayConfig[day].distDir, 'Solved');
    // Only scan the filesystem when there's configured activities in the JSON for the day.
    if (options.loadedCohort.activities[day].length > 0) {
      copyDailyActivities(
        options.loadedCohort.activities[day],
        options.srcClassContents + package.paths.activitiesDir,
        options.getDistWeekActivitiesDir(dayConfig[day].distDir)
      );
    }

  }
}

/**
 * From Directory Copy Files & Folders (non-recursive).
 * src: https://stackoverflow.com/a/25462405
 * 
 * Usage:
 * 
 fromDir('dir/path/', /^.*$/, function (filename) {
   log('-- found: ', filename);
 });
 * 
 * @param {String} startPath 
 * @param {RegExp} filter 
 * @param {Function} callback 
 * 
 * @return null
 */
function fromDir(startPath, filter, callback) {

  logger.info('Scanning activities from dir: \n' + startPath);

  if (!fs.existsSync(startPath)) {
    logger.error("no dir: " + startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      if (filter.test(filename)) callback(filename);
    }

  }
}


//----------------------------
// ## Script
//----------------------------

// Assign cohort data from config.  This will be used to pull out the weekly content.
options.loadedCohort = loadCohort()[options.weekHandle];

// Create student repo directories and copy source content for day(s) over.
makeDirectories(
  options.loadedCohort.activities
);
