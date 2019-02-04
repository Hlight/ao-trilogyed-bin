#!/bin/bash
# TODO: function for creating day directories and copying cotents.
# TODO: create configuration for daily activites, until then, copy over manually.  
# After this script runs the distribution repo should have the correct folder structure and git ignore files in place for hiding solutions and solved activites.

#### Creating Student Git Lessons

### Usage:
## Update 
#   VAR_SRC_TRILOGY = [absolute path to Trilogy SRC repo root]
#   VAR_SRC_LESSONPLAN_DIR = [relative path to lesson plans directory (found in SRC)]
# 
## Update VAR_WEEK, VAR_WEEK_DIR, VAR_CONTENT_DIR variables at top of script with correct folder names for week (DIR corresponds to FullStack Lesson Plans src repo)
# $ cd [path to dir with sh script] 
# $ bash create_student_gitlab_weekly_days.sh
#
## Then, update README.md's for custom pathnames:
### Update activity links:
#  Original: * [5.1 - WordGuess](../../../01-Class-Content/05-timers/01-Activities/01-WordGuess)
#  Updated: * [5.1 - WordGuess](1-Class-Content/Activities/5.1/01-WordGuess)
# Note, '1-Class-Content/Activities/X.X/' where X. represents week # and .X represents day #.
#
### Add/Update link to Homework Instructions:
# [Instructions](2-Homework/Instructions/homework_instructions.md)
#
### Update link on class syllabus:
# Original:   **Week 5** 
# Updated:   [**Week 5**](05-timers/README.md)
## Add link in README.md to weekly video guide:
# [Video Guide](VideoGuide.md)


### Copy weekly source lesson plan material into cohort directory.

# Variables
# @TODO use scipt args to capture these as options.
# @TODO use configuration json for defining all weeks with activities
# ~/Documents/TrilogyEd/FullStack-Lesson-Plans/01-Class-Content]
# [20:08:12] $ ls
# 01-html-git-css/
# 02-css-bootstrap/
# 03-javascript/
# 04-jquery/
# 05-timers/
# 06-ajax/
# 07-firebase/
# 08-project-1/
# 09-portfolio-update/
# 10-nodejs/
# 11-js-constructors/
# 12-mysql/
# 13-express/
# 14-handlebars/
# 15-sequelize/
# 16-project-2/
# 17-project-2/
# 18-mongo-mongoose/
# 19-react/
# 20-react/
# 21-regionalized-content/
# 22-computer-science/
# 23-other-languages/
VAR_WEEK='10'
VAR_WEEK_DIR="10-Week" # dir in 02-lesson-plans
VAR_CONTENT_DIR="10-nodejs" # dir in 01-Class-Content

## Constants
# 
# 'DIST_...' for distribution (intended for students) paths
# 'SRC_...' for source material (intended for instructors) paths
#
# Source constants
#
VAR_SRC_TRILOGY="/Users/aaronostrowsky/Documents/TrilogyEd/FullStack-Lesson-Plans/"
VAR_SRC_LESSONPLAN_DIR="02-lesson-plans/part-time/"
VAR_SRC_CLASSCONTENT_DIR="01-Class-Content/"
# Distribution directory (this becomees the "class repo" pushed to gitlab)
VAR_DIST_COHORT="/Users/aaronostrowsky/Code/gitlab/Hlight/UWASEA201811FSF5/"

SRC_LESSONPLANS="${VAR_SRC_TRILOGY}${VAR_SRC_LESSONPLAN_DIR}/"
SRC_CLASSCONTENTS="${VAR_SRC_TRILOGY}${VAR_SRC_CLASSCONTENT_DIR}/"
# full path to weekly lesson plan
SRC_WEEK_LESSONPLAN="${SRC_LESSONPLANS}${VAR_WEEK_DIR}/"
# full path to weekly class content
SRC_WEEK_CLASSCONTENT="${SRC_CLASSCONTENTS}${VAR_CONTENT_DIR}/"

# Distribution constants:
#
# DIST_WEEK="${VAR_DIST_COHORT}01-html-git-css/"
DIST_WEEK="${VAR_DIST_COHORT}${VAR_CONTENT_DIR}/"
DIST_WEEK_DAY01="${DIST_WEEK}1-Class-Content/${VAR_WEEK}.1/"
DIST_WEEK_DAY02="${DIST_WEEK}1-Class-Content/${VAR_WEEK}.2/"
DIST_WEEK_DAY03="${DIST_WEEK}1-Class-Content/${VAR_WEEK}.3/"

## Make week's directory in our dist location (class repo)
mkdir $DIST_WEEK
mkdir ${DIST_WEEK}1-Class-Content/
    mkdir $DIST_WEEK_DAY01
    mkdir $DIST_WEEK_DAY02
    mkdir $DIST_WEEK_DAY03
mkdir ${DIST_WEEK}2-Homework/

# add .gitignore to ignore 'Solutions' in Homework dir (remove this after 1 week of class passes)
test -e ${DIST_WEEK}2-Homework/.gitignore || echo "Solutions" > ${DIST_WEEK}2-Homework/.gitignore
### add .gitignore to ignore "Solved" directories for days activities (remove after class)
test -e ${DIST_WEEK_DAY01}.gitignore || echo "Solved" > ${DIST_WEEK_DAY01}.gitignore
test -e ${DIST_WEEK_DAY02}.gitignore || echo "Solved" > ${DIST_WEEK_DAY02}.gitignore
test -e ${DIST_WEEK_DAY03}.gitignore || echo "Solved" > ${DIST_WEEK_DAY03}.gitignore

# Copy src lesson plan material for week.
cd $SRC_WEEK_LESSONPLAN # "${SRC_LESSONPLANS}01-Week/"
cp VideoGuide.md ${DIST_WEEK};
cp StudentGuide.md ${DIST_WEEK}README.md;
## Copy home dir to dist
cd $SRC_WEEK_CLASSCONTENT # ${SRC_CLASSCONTENTS}01-html-git-css/
if [ -d '02-Homework' ] 
    then
    echo 'Copying 02-Homework'
    cp -r 02-Homework/ ${DIST_WEEK}2-Homework/
fi
## Copy Supplemental directory to dist (if exists)
if [ -d '03-Supplemental' ] 
    then
    echo "Creating ${DIST_WEEK}Supplemental"
    mkdir -p ${DIST_WEEK}Supplemental/
    echo 'Copying 03-Supplemental'
    cp -r 03-Supplemental/ ${DIST_WEEK}Supplemental/
fi


### Day 01
echo ${SRC_WEEK_LESSONPLAN}01-Day/ && cd ${SRC_WEEK_LESSONPLAN}01-Day/
cp -r Images Slide-Shows Supplemental $DIST_WEEK_DAY01
mkdir ${DIST_WEEK_DAY01}Activities/
cd ${SRC_WEEK_CLASSCONTENT}01-Activities/
# week 1 activites
# cp -r 01-ConsoleCommands 02-IntroToConsoleBash 03-MyFirstHTML ${DIST_WEEK_DAY01}Activities/

### Day 02
echo ${SRC_WEEK_LESSONPLAN}02-Day/ && cd ${SRC_WEEK_LESSONPLAN}02-Day/
cp -r Images Slide-Shows Supplemental $DIST_WEEK_DAY02
mkdir ${DIST_WEEK_DAY02}Activities/
cd ${SRC_WEEK_CLASSCONTENT}01-Activities/
# week 1 activites
# cp -r 04-HTML_Git 05-BasicCSS 06-HTML_CSS_Layout ${DIST_WEEK_DAY02}Activities/

### Day 03
echo ${SRC_WEEK_LESSONPLAN}03-Day/ && cd ${SRC_WEEK_LESSONPLAN}03-Day/
cp -r Images Slide-Shows Supplemental $DIST_WEEK_DAY03
mkdir ${DIST_WEEK_DAY03}Activities/
cd ${SRC_WEEK_CLASSCONTENT}01-Activities/
# week 1 activites 
# cp -r 07-RelativePaths-Activity 08-FloatExamples 09-FloatLayout-Activity 10-CSS_PositionedLayout 11-CSS_Positioned_Activity ${DIST_WEEK_DAY03}Activities/
