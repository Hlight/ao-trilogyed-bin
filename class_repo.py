# [22:16:05] 1 $ python class_repo.py - -week = 10 - -day = 1

import json
import sys
import getopt

from pprint import pprint

cohort='UWASEA201811FSF5'
week=''
day=''


def buildDailyActivities(classDayActivities):
  print classDayActivities


def usage(week, day):
  weekFixed = str(week).zfill(2)
  dayFixed = str(day).zfill(2)
  # print 'usage ' + msg
  print week + '.' + day
  print '/' + weekFixed + '-week/' + dayFixed + '-day/'
  curriculum = loadJson()[cohort];

  weekHandle = 'week' + weekFixed;
  weekData = [value for key, value in curriculum.items() if weekHandle in key.lower()];

  weekData = weekData[0]
  # print weekData

  contentDir = weekData["content_dir"];
  activities = weekData["activities"];

  # TODO if no day passed in then loop over all days
  # print(day)
  if (day is None):
    for classDay in activities:
      buildDailyActivities(activities[classDay])
  else:
      print buildDailyActivities(activities['day' + dayFixed])
      print ('===')



# f = {
#   "test": "example"
# }
# data = f

def loadJson():
    with open('config.json') as f:
        data = json.load(f)
        # pprint(data)
        return data

def getOptions():
  day=''
  try:
    opts, args = getopt.getopt(sys.argv[1:],'w:d',[ 'week=', 'day=', 'cohort='])
    # print opts #, args;
  except getopt.GetoptError:
    print 'error'
    sys.exit(2)
  for opt, arg in opts:
    if opt in ('-w', '--week'):
      week = arg;
    elif opt in ('-d', '--day'):
      day = arg;
    elif opt in ('-c', '--cohort'):
      cohort = arg;
    else:
      usage()

  usage(week, day)

getOptions();

print day




