#!/bin/bash

#### Creating Student Git Lessons

### Arguments

# Source: https://stackoverflow.com/a/14203146

# Method #1: Using bash without getopt[s]
# Two common ways to pass key-value-pair arguments are:

# Bash Space-Separated (e.g., --option argument) (without getopt[s])
# Usage   ./myscript.sh -e conf -s /etc -l /usr/lib /etc/hosts 


POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -a|--activitesPath)
    EXTENSION="$2"
    shift # past argument
    shift # past value
    ;;
    -s|--searchpath)
    SEARCHPATH="$2"
    shift # past argument
    shift # past value
    ;;
    -l|--lib)
    LIBPATH="$2"
    shift # past argument
    shift # past value
    ;;
    --default)
    DEFAULT=YES
    shift # past argument
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

echo FILE EXTENSION  = "${EXTENSION}"
echo SEARCH PATH     = "${SEARCHPATH}"
echo LIBRARY PATH    = "${LIBPATH}"
echo DEFAULT         = "${DEFAULT}"
echo "Number files in SEARCH PATH with EXTENSION:" $(ls -1 "${SEARCHPATH}"/*."${EXTENSION}" | wc -l)
if [[ -n $1 ]]; then
    echo "Last line of file specified as non-opt/last argument:"
    tail -1 "$1"
fi

### Copy weekly source lesson plan material into cohort directory.

## Constaints
DIR_COHORT="/Users/aaronostrowsky/Code/gitlab/Hlight/UWASEA201811FSF5/"
DIR_TRILOGY_SRC="/Users/aaronostrowsky/Documents/TrilogyEd/"

DIR_CLASSCONTENT_SRC="${DIR_TRILOGY_SRC}FullStack-Lesson-Plans/01-Class-Content/"
DIR_LESSONPLANS_SRC="${DIR_TRILOGY_SRC}FullStack-Lesson-Plans/02-lesson-plans/part-time/"

DIR_WEEK01="${DIR_COHORT}01-html-git-css/"
DIR_WEEK01_DAY01="${DIR_WEEK01}1-Class-Content/1.1/"
DIR_WEEK01_DAY02="${DIR_WEEK01}1-Class-Content/1.2/"
DIR_WEEK01_DAY03="${DIR_WEEK01}1-Class-Content/1.3/"

## Week XX e.g 01
mkdir $DIR_WEEK01
mkdir -p ${DIR_WEEK01}1-Class-Content/
mkdir -p ${DIR_WEEK01}2-Homework/
mkdir -p ${DIR_WEEK01}Supplemental/

cd "${DIR_LESSONPLANS_SRC}01-Week/"
cp VideoGuide.md ${DIR_WEEK01};
cp StudentGuide.md ${DIR_WEEK01}README.md;
## add .gitignore to ignore 'Solutions' in Homework dir (remove this after 1 week of class passes)
test -e ${DIR_WEEK01}2-Homework/.gitignore || echo "Solutions" > ${DIR_WEEK01}2-Homework/.gitignore

cd ${DIR_CLASSCONTENT_SRC}01-html-git-css/
cp -r 02-Homework/ ${DIR_WEEK01}2-Homework/
cp -r 03-Supplemental/ ${DIR_WEEK01}Supplemental/

### Day 01
mkdir $DIR_WEEK01_DAY01
cd ${DIR_LESSONPLANS_SRC}01-Week/01-Day/
cp -r Images Slide-Shows $DIR_WEEK01_DAY01
mkdir ${DIR_WEEK01_DAY01}Activities/
### add .gitignore to ignore "Solved" directories for days activities (remove after class)
test -e ${DIR_WEEK01_DAY01}.gitignore || echo "Solved" > ${DIR_WEEK01_DAY01}.gitignore

cd ${DIR_CLASSCONTENT_SRC}01-html-git-css/01-Activities/
cp -r 01-ConsoleCommands 02-IntroToConsoleBash 03-MyFirstHTML ${DIR_WEEK01_DAY01}Activities/

### Day 02
mkdir $DIR_WEEK01_DAY02
cd ${DIR_LESSONPLANS_SRC}01-Week/02-Day/
cp -r Images Slide-Shows $DIR_WEEK01_DAY02
mkdir ${DIR_WEEK01_DAY02}Activities/
### add .gitignore to ignore "Solved" directories for days activities (remove after class)
test -e ${DIR_WEEK01_DAY02}.gitignore || echo "Solved" > ${DIR_WEEK01_DAY02}.gitignore
cd ${DIR_CLASSCONTENT_SRC}01-html-git-css/01-Activities/
cp -r 04-HTML_Git 05-BasicCSS 06-HTML_CSS_Layout ${DIR_WEEK01_DAY02}Activities/

### Day 03
mkdir $DIR_WEEK01_DAY03
cd ${DIR_LESSONPLANS_SRC}01-Week/03-Day/
cp -r Images Slide-Shows $DIR_WEEK01_DAY03
mkdir ${DIR_DAY03}Activities/
cd ${DIR_CLASSCONTENT_SRC}01-html-git-css/01-Activities/
cp -r 07-RelativePaths-Activity 08-FloatExamples 09-FloatLayout-Activity 10-CSS_PositionedLayout 11-CSS_Positioned_Activity ${DIR_WEEK01_DAY03}Activities/
### add .gitignore to ignore "Solved" directories for days activities (remove after class)
test -e ${DIR_WEEK01_DAY03}.gitignore || echo "Solved" > ${DIR_WEEK01_DAY03}.gitignore