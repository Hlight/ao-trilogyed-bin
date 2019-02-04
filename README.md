# Class Repo

Creates weekly class content by copying from source lesson plans; adds git ignore files to hide solutions and solved and copies configured activities into their respective class day folders.

## Usage:

Options:

`--week`,`-w` - Required, number, the week to copy contents for.
`--day`,`-d` - _(optional)_ number representing the class-day within the week to copy contents for. Script copies content for all days if this is ommitted.
`--cohort`,`-c` - Required, string, cohort ID to copy curriculum contents for (configured in package.json)

```shell
node class_repo.js --week 10 --day 1 --cohort UWASEA201811fsf5 -v
```

## Options Object

- `week` - Required, number, the week to copy contents for.
- `day` - _(optional)_ number representing the class-day within the week to copy contents for. Script copies content for all days if this is ommitted.
- `cohort` - Required, string, cohort ID to copy curriculum contents for (configured in package.json)

*Properties*

- `dayFixed` - day number with padding e.g. 1 becomes 01.
- `weekFixed` - week number with padding e.g. 1 becomes 01.
- `dayHandle` - name of the class-day content source directory.
- `weekHandle` - name of the class-week content source directory.

Source Paths:

- `srcWeekDir` - curriculum week directory name.
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
    // Cohort ID
    "UWASEA201811FSF5": {
      "week01": {
        "content_dir": "01-html-git-css/",
        "activities": {
          "day01": [
            // ... daily activity folders here
          ],
          "day02": [
            // ... daily activity folders here
          ],
          "day03": [
            // ... daily activity folders here
          ]
        }
      }
      // ... additional weeks here
    }
  }
}
```