'use strict';

/**
 * class_repo.js
 * 
 * @name Class Repo
 * @version 1.0.0
 * @author Aaron Ostrowsky <aaronostrowsky@gmail.com>
 * @description Class Repo Helper Script - responsible
 for creating student class repo directories
 for a given week of curriculum.
 * 
 * - Creates week directory (distWeek) in configured class repo.
 * - Copies weekly StudentGuide.md into distWeek as README.md
 * - Updates links in StudentGuide.md to be relative to the class repo it's copied to.
 * - Copies weekly Homework folder into distWeek
 * - Copies class-day activities into their respective day directory.
 * - Copies images and slideshows for each day into each dist day directory.
 * 
 * @docs See README.md
 * 
 */


// require('./extra/debug.js'); // enables __function, __linen

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
const userHome = require('user-home');
// const fromDir = require(__dirname + '/extra/from-dir.js');
const isConsoleEnabled = argv.v || argv.verbose || false;

/**
 * Class Repo Options
 *  Resonsible for all configuration data needed to copy source 
 *  class material to the student's shared class curriculum repo.
 */
const options = {
  curriculum: require('./config/curriculum-part-time.json'),
  week: argv.w || argv.week,
  day: argv.d || argv.day,
  cohort: argv.c || argv.cohort,
  get dayFixed () {
    return pad(this.day);
  },
  get weekFixed () {
    return pad(this.week);
  },
  // used for retrieving from config.json
  get dayHandle () {
    return (this.day) ? 'day' + this.dayFixed : false;
  },
  // used for retrieving from config.json
  get weekKey () {
    return 'week' + this.weekFixed;
  },
  // dir in 02-lesson-plans
  get srcWeekDirName () {
    return this.weekFixed + '-Week/';
  },
  get srcLessonPlans () {
      return userHome + '/' +
        pkgFile.paths.sourceRepoDir + 
        pkgFile.paths.lessonPlanDir +
        this.srcWeekDirName;
  },
  get srcClassContents () {
    return userHome + '/' + 
      pkgFile.paths.sourceRepoDir + 
      pkgFile.paths.classContentDir +
      options.loadedCohort.content_dir;
  },
  get srcHomeworkDir () {
    // return this.srcWeekDirName + pkgFile.paths.homeworkDir;
    return this.srcHomeworkDirName + '/';
  },
  get srcSupplementalDir () {
    return this.srcClassContents + pkgFile.paths.supplementalDir;
  },
  get dist () {
    return userHome + '/' +
       pkgFile.paths.cohorts[this.cohort];
  },
  get distWeek () {
    return this.dist + this.loadedCohort.content_dir;
  },
  distClassContentDirName: '1-Class-Content',
  get distWeekContentDir () {
    return this.distWeek + this.distClassContentDirName + '/';
  },
  get distWeekHomeworkDir () {
    return this.distWeek + this.distHomeworkDirName + '/';
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
   * @param number num 
   * 
   * @return string
   */
  getDistDay: function (num) {
    var prop = 'day' + pad(num);
    // create new prop on this ojbect to get this path info later.
    this[prop] = {
      fullPath: this.distWeekContentDir + this.week + '.' + num + '/',
      folder: this.week + '.' + num
    };
    return this[prop].fullPath;
  }
};

//----------------------------
// ## Functions
//----------------------------

function init() {
  if (typeof pkgFile.paths.cohorts[options.cohort] === 'undefined') {
    logger.error('pkgFile.paths.cohorts[options.cohort] === undefined ')
    return false;
  }
  console.log(options.srcClassContents)
  let folderName = findFileOrDir(options.srcClassContents, /\d+-Homework/);
  options.srcHomeworkDirName = folderName;
  // logger.debug(folderName);
  // logger.debug(/^0/.test(folderName))
  // Remove the leading zeros e.g. 01 becomes 1
  if (/^0/.test(folderName)) {
    folderName = folderName.replace(/^0/, '');
    logger.debug(folderName)
  }
  options.distHomeworkDirName = folderName + '/';
  return true;
}
/**
 * Wrapper for console.log so we can turn it off with an option.
 * @param String out 
 */
function log(out) {
  if (isConsoleEnabled) {
    console.log(out);
  }
}
/**
 * Pad numbers to two digits e.g.1 to 01
 * @param Number num 
 */
function pad(num) {
  var s = "0" + num;
  return s.substr(s.length - 2);
}
/**
 * Make a directory using fs - extra 's "ensureDirSync"
 * @param String dir 
 */
function mkDir(dir) {
  if (isDirExists(dir)) {
    logger.warn('Already exists! ' + dir);
  }
  fs.ensureDirSync(dir);
}
/**
 * @param String path 
 */
function isDirExists (path) {
  let isDirExists = fs.existsSync(path) &&
    fs.lstatSync(path).isDirectory();
  return isDirExists;
}
/**
 * @param String path 
 */
function isFileExists(path) {
  let isFileExists = fs.existsSync(path) &&
    fs.lstatSync(path).isFile();
  return isFileExists;
}
/**
 * @param String path 
 */
function isFileOrDirectory(path) {
  return isFileExists(path) || isDirExists(path);
}
/**
 * 
 * @param {*} dirPath 
 * @param {*} search 
 */
function findFileOrDir(dirPath, search) {
  const files = shell.ls(dirPath);
  let out = '';
  logger.debug(files)
  for (let i=0;i<files.length;i++) {
    let file = files[i];
    if (search.test(file)) {
      out = file;
      break;
    }
  }
  return out;
}
/**
 * Copies a given src file to supplied dest folder.
 * Throws error if src does not exist.
 * 
 * @param String src 
 * @param String dest 
 */
function copyFile(src, dest) {
  if (!isFileOrDirectory(src)) {
    logger.warn('Src not found! (' + src + ')');
    return;
  }
  if (isFileExists(dest)) {
    logger.warn('File already exists! (' + dest + ')');
    return;
  }
  if (isDirExists(dest)) {
    logger.warn('Dir already exists! (' + dest +')');
    return;
  }
  logger.info('\nfs.copySync(' + src + ', ' + dest + ')')
  // We need sync so we can fix the links in the files.
  fs.copySync(src, dest)

}
/**
 * Copies video and student guides to class repo week directory.
 */
function copyWeeklyReadmes() {
  const fixActivityLinks = (filePath) => {
    logger.debug(filePath)
    if (!isFileExists(filePath)) {
      logger.warn('file not found, ' + filePath);
      return;
    }

    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        return logger.error('ERROR:' + err);
      }

      let result;

      // Update homework link
      // old: ../../../01-Class-Content/10-nodejs/02-Homework/
      // new: 2-Homework/
      var regexString = '(\\.\\.\\/\\.\\.\\/\\.\\.\\/01-Class-Content\\/' +
        options.loadedCohort.content_dir +
        '(\\d+-Homework)\\/)';
      logger.debug(regexString)
      var regex = new RegExp(regexString, 'gm');
      result = data.replace(
        regex,
        function (match, origUrl) {
          logger.info('Rename directory: \n' +
          'OLD: ' + origUrl + '\n' +
          'NEW: ' + options.distHomeworkDirName);

          return options.distHomeworkDirName;
        }
      );

      // Update activities links
      result = result.replace(
        //... get activity foldername
        // https://regexr.com/47mrn
        /(..\/..\/..\/01-Class-Content\/.*\/01-Activities\/(\d+-[\w\d-_]+))/gm,
        function (match, origUrl, activity, offset, inputString) {
          //... search curriculum json config for foldername
          let activities = options.loadedCohort.activities;
          for (let day in activities) {
            logger.debug(day)
            if (activities[day].includes(activity)) {
              // logger.debug('day.includes(activity): ' + activities[day].includes(activity))
              // Create replacement url to dist class repo location
              logger.debug(options[day])
              let newUrl = 
                options.distClassContentDirName + '/' +
                options[day].folder + '/Activities/' + activity;
              logger.info('Replaced Link\n' +
              'OLD: ' + origUrl + '\n' +
              'NEW: ' + newUrl + '/');

              return newUrl;

            }
          }
        }
      );

      logger.debug(result);

      fs.writeFile(filePath, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }

  let filesToCopy = {
    'VideoGuide.md': 'VideoGuide.md',
    'StudentGuide.md': 'README.md'
  };
  for (let srcFileName in filesToCopy) {
    let newName = filesToCopy[srcFileName];
    let src = options.srcLessonPlans + srcFileName;
    let dest = options.distWeek + newName;
  
    copyFile(src, dest);

    if (srcFileName === 'StudentGuide.md') fixActivityLinks(dest);


  }
}
/**
 * Copies files (defined as keys in dirsToCopy) to their day folder destination.  The values of dirsToCopy represent the new file names (if changed).
 *
 * @param Object day 
 */
function copyDailyExtras(day) {
  let dest = day.distDir;
  let dirsToCopy = {
    'Images': 'Images',
    'Slide-Shows': 'Slide-Shows',
    'Supplemental': 'Supplemental'
  };
  for (let srcDirName in dirsToCopy) {
    let src = options.srcLessonPlans + day.srcDir + '/' + srcDirName;
    // log(__line);
    // log(__function);
    copyFile(src, dest + dirsToCopy[srcDirName]);
  }
}
/**
 * Responsible for copying daily activities defined in the curriculum json.
 * 
 * @param Array activities 
 * @param String src curriculum github repo.
 * @param String dest class gitlab repo.
 */
function copyDailyActivities (activities, src, dest) {
  logger.debug(activities)
  log('   src: ' + src)
  log('   dest: ' + dest)

  isActivityInDay({ src, dest, activities },
    function (isActivityInDay, fileName, filePath, destPath) {
      if (isActivityInDay) {
        log(isActivityInDay);
        log('  ' + fileName);
        log('  -- ' + filePath);
        copyFile(filePath, destPath);
      }
    }
  );
}
/**
 * Determines if a src folder is configured for a specific class-day.
 * 
 * @param Object opts { src, dest, callback }
 * @param Function callback function
 * 
 * @returns Boolean true is activity dir found in curriculum json.
 */
function isActivityInDay (opts, callback) {

  let src = opts.src;
  let dest = opts.dest;
  let activities = opts.activities;
  let isActivityInDay = false;
  fromDir(src, /^.*$/, function (filePath) {
    let fileName = filePath.split('/').slice(-1)[0];
    let destPath = dest + fileName;
    isActivityInDay = activities.includes(fileName);

    if (callback) callback(isActivityInDay, fileName, filePath, destPath);
  });

  return isActivityInDay;
}
/**
 * Responsible for creating a .gitignore file with the given content.
 * 
 * @param String dest 
 * @param String content
 */
function createGitIgnore (dest, content) {
  fs.ensureDir(dest);// ensure directory exists
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
/**
 * Main script to setup our class repo directories for the week.
 * 
 * @param Object activities 
 */
function makeDirectories(activities) {
  if (!init()) {
    logger.error('Failed initializing please check configuration.');
    return;
  }

  mkDir(options.distWeek);
  // Add individual class day directories.
  let dayNum = 1;
  for (let day in activities) {
    // log(dayNum)
    logger.error(activities[day].length)
    let dayPath = options.getDistDay(dayNum);
    if (activities[day].length > 0) {
      logger.debug('activities[day].length: ' + activities[day].length)
      mkDir(dayPath);
    }
    dayNum++;
  }
  // ## Copy src lesson plan material for week.
  copyWeeklyReadmes();
  // ## Copy Homework dir to dist
  // logger.debug(__function);
  logger.debug('copyFile \n' +
  'SRC: ' + options.srcClassContents + options.srcHomeworkDir  +
  'DEST: ' + options.distWeekHomeworkDir)
  copyFile(
    options.srcClassContents + options.srcHomeworkDir,
    options.distWeekHomeworkDir
  );
  // ## Copy Supplemental directory to dist
  // logger.debug(__function);
  copyFile(
    options.srcSupplementalDir,
    options.distSupplementalDir
  );
  // ## add .gitignore to ignore 'Solutions' in Homework dir (remove this after 1 week of class passes)
  logger.debug(options.distWeekHomeworkDir)
  // Add Solutions & Solution to .gitignore
  // createGitIgnore(options.distWeekHomeworkDir, 'Solutions\nSolution');
  createGitIgnore(options.distWeekHomeworkDir, findFileOrDir(options.distWeekHomeworkDir, /Solutions?/));
  // ## Copy supplemental folder in the week.
  copyFile(options.srcLessonPlans + 'Supplemental', options.distWeek + 'Supplemental');
  // ## Copy class-day activities for week.
  const dayConfig = {
    day01: {
      distDir: options.day01.fullPath,
      srcDir: '01-Day'
    },
    day02: {
      distDir: options.day02.fullPath,
      srcDir: '02-Day'
    },
    day03: {
      distDir: options.day03.fullPath,
      srcDir: '03-Day'
    }
  };
  for (let day in dayConfig) {

    switch (true) {
      // Only scan the filesystem when there's configured activities in the JSON for the day.
      case options.loadedCohort.activities[day].length === 0:
        logger.error('\n' + day + ' has no configured activities!\nSee ./config/curriculum.json');
        continue;
      // --day option was passed in so limit filesystem activity to only the passed in day.
      case options.dayHandle && options.dayHandle !== day:
        logger.debug('Skipping ' + day);
        continue;
    }

    // Create day dist directory
    fs.ensureDir(dayConfig[day].distDir);
    // Any extra directories for the day.
    copyDailyExtras(dayConfig[day]);
    // ## add .gitignore to ignore "Solved" directories for days activities (remove after class)
    createGitIgnore(dayConfig[day].distDir, 'Solved');
    // Activities per day from source class contents.
    copyDailyActivities(
      options.loadedCohort.activities[day],
      options.srcClassContents + pkgFile.paths.activitiesDir,
      options.getDistWeekActivitiesDir(dayConfig[day].distDir)
    );

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
 * @param String startPath 
 * @param RegExp filter 
 * @param Function callback 
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

// Assign cohort curriculum data for the given week.This will be used to pull out the weekly content.
options.loadedCohort = options.curriculum[options.weekKey];

// Create student repo directories and copy source content for day(s) over.
makeDirectories(
  options.loadedCohort.activities
);
