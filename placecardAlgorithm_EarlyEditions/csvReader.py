import csv

file = open('SCS.csv')
csvReader = csv.reader(file, delimiter=',')
header = next(csvReader)

for x in range(0, len(header)):
    header[x] = header[x].replace("Do you want to sit next to this person? Ignore your own name and know that you are not required to say \"no\" for those you don't know, though you may choose to, if you wish. Note that if you leave a name without an answer, this means you are indifferent to sitting with this person. We will seat you first with those you answer \"yes\" for, then those who you are indifferent towards, and we will try our best to keep you from sitting with those for whom you answer \"no\". Choose as many for each answer as you want. The more you answer, the greater the chance of us seating you correctly! Don't know anyone? Leave it blank!", '')
    header[x] = header[x].replace(' [', '').replace(']', '')

partyDict = {}
likesDict = {}
dislikesDict = {}

# initialize dictionaries
for x in header[1:]:
    partyDict[x] = 1
    likesDict[x] = []
    dislikesDict[x] = []

for line in csvReader:
    party = line[0]
    for x in range(1, len(line)):
        if line[x] == 'Yes':
            likesDict[party].append(header[x])
        if line[x] == 'No':
            dislikesDict[party].append(header[x])