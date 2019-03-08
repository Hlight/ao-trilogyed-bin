# Class Repo

Creates weekly class content by copying from source lesson plans; adds git ignore files to hide solutions and solved and copies configured activities into their respective class day folders.

## Usage:

Commandline Options:

| Option (long) | Option (short) | Description
| :---: | :---: | :---------|
`--week` | `-w` | Required, number, the week to copy contents for. |
`--day` | `-d` | _(optional)_ number representing the class-day within the week to copy contents for. Script copies content for all days if this is ommitted. |
`--cohort` | `-c` | Required, string, cohort ID to copy curriculum contents for (configured in package.json) |
|`--verbose` | `-v`| _(optional)_ turn on extra console logs. |

Command:

```shell
 node class-repo.js --week 10 --cohort UWASEA201811FSF5 -v
```

## Options Object

- `week` - Required, number, the week to copy contents for.
- `day` - _(optional)_ number representing the class-day within the week to copy contents for. Script copies content for all days if this is ommitted.
- `cohort` - Required, string, cohort ID e.g. `UWASEA201811FSF5`to copy curriculum contents for (configured in package.json)

*Properties*

- `dayFixed` - day number with padding e.g. 1 becomes 01.
- `weekFixed` - week number with padding e.g. 1 becomes 01.
- `dayHandle` - name of the class-day content source directory.
- `weekHandle` - name of the class-week content source directory.

Source Paths:

- `srcWeekDirName` - curriculum week directory name.
- `srcLessonPlans` - lesson plan root directory path.
- `srcClassContents` - class contents root directory.
- `srcHomeworkDir` - source homework directory.
- `srcSupplementalDir` - source supplemental directory.

Distribution Paths:

- `dist` - the distribution (class) repo root directory.
- `distWeek` - class repo week directory.
- `distWeekContentDir` - class week content directory.
- `distWeekHomeworkDir` - class week homework directory.
- `distSupplementalDir` - class week supplemental directory.

Curriculum Data

- `loadedCohort` - each cohort has their own repo.
- `curriculum` - the curriculum broken down by weeks.

## Curriculum JSON

The following is an example of the curriculum json with a single cohort and one week.
Each lesson plan lists out which activities for the day. This file must be manually created.


```json
{
  "curriculum": {
    "UWASEA201811FSF5": {
      "week01": {
        "content_dir": "01-html-git-css/",
        "activities": {
          "day01": [
            "01-Activity1"
          ],
          "day02": [
            "02-Activity2"
          ],
          "day03": [
            "03-Activity3"
          ]
        }
      }
    }
  }
}
```

---

## Package.json Paths

The following "paths" object must be in the package.json in oder to configure the script with the local systems source directories and associated cohort class repo directory path. 

```json
  "paths": {
    "sourceRepoDir": "Documents/TrilogyEd/FullStack-Lesson-Plans/",
    "lessonPlanDir": "02-lesson-plans/part-time/",
    "classContentDir": "01-Class-Content/",
    "activitiesDir": "01-Activities/",
    "supplementalDir": "03-Supplemental/",
    "cohorts": {
      "UWASEA201811FSF5": "Code/gitlab/Hlight/UWASEA201811FSF5/"
    }
  },
```


---
---

## Get Weeks Activities by Day

Currently this logic is in a separate script `get-weeks-activities-by-day.js`.

Search for activities mentioned in the `lessonPlan.md` file and output the activities directory names to the terminal.

`node get-weeks-activities-by-day.js <class_contents_week_directory_name>`

Example usage:
```shell
$ node get-weeks-activities-by-day.js 13-express
```

Because the pattern varies between weeks this requires manual testing (at this point) which involves running the script and manually coping the output from the terminal to the curriculum.json config file.