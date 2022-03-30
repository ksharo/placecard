import csv
from ntpath import realpath
import random

########## Helper Functions ##########
def isRespondent(indId, ideals, likes, dislikes):
    '''Returns true if the party has responded to the survey, false otherwise.'''
    return len(ideals[indId]) + len(likes[indId]) + len(dislikes[indId]) != 0

def refreshVariables(origChart, people):
    '''Refreshes & deep copies the main variables used to
    follow origChart. '''
    seatingChart = {}
    seated = {}
    for x in origChart:
        seatingChart[x] = list(origChart[x])
        for y in seatingChart[x]:
            seated[y] = x
    unseated = list(people.keys())
    for x in seated:
        if x in unseated:
            unseated.remove(x)
    return (seatingChart, unseated, seated)

########## Helper Functions ##########
def scoreGroup(group, people, ideals, likes, dislikes):
    '''Group is the list of ids in the group to score.
    
    People is the dictionary of invitees, mapping the id
    of each person to the list of ids of people in their group.
    
    Ideals is the dictionary of people's ids mapped to the people
    with whom they really want to sit.

    Likes is the dictionary of people's ids mapped to the people 
    with whom they feel comfortable sitting.

    Dislikes is the dicionary of parties' ids mapped to the people
    with whom they do not want to sit.

    Returns the score of the group with other data
    '''
    mutualIdeal = 0
    mutualLikes = 0
    mutualDislikes = 0
    idealLike = 0
    idealDislike = 0
    likeDislike = 0
    oneIdeal = 0
    oneLike = 0
    oneDislike = 0
    idealNoResponse = 0
    likeNoResponse = 0
    dislikeNoResponse = 0
    # respondents = 0
    for id1 in group:
        if isRespondent(id1, ideals, likes, dislikes):
            # respondents += 1
            for id2 in group:
                if id1 != id2:
                    # if the person is in the same group, count as mutualIdeal
                    if id1 in people[id2]:
                        mutualIdeal += 1
                    # otherwise, if the other person responded, check for mutual feelings
                    elif isRespondent(id2, ideals, likes, dislikes):
                        if id2 in ideals[id1] and id1 in ideals[id2]:
                            mutualIdeal += 1
                        elif (id2 in ideals[id1] and id1 in likes[id2]) or (id1 in ideals[id2] and id2 in likes[id1]):
                            idealLike += 1
                        elif id2 in likes[id1] and id1 in likes[id2]:
                            mutualLikes += 1
                        elif id2 in dislikes[id1] and id1 in dislikes[id2]:
                            mutualDislikes += 1 
                        # if nothing mutual is found, look for mixed
                        elif (id2 in ideals[id1] and id1 in dislikes[id2]) or (id1 in ideals[id2] and id2 in dislikes[id1]):
                            idealDislike += 1
                        elif (id2 in likes[id1] and id1 in dislikes[id2]) or (id1 in likes[id2] and id2 in dislikes[id1]):
                            likeDislike += 1
                        # if still nothing, look for one-sided
                        elif id2 in ideals[id1]:
                            oneIdeal += 1
                        elif id2 in likes[id1]:
                            oneLike += 1
                        elif id2 in dislikes[id1]:
                            oneDislike += 1
                    # check no response
                    else:
                        if id2 in ideals[id1]:
                            idealNoResponse += 1
                        elif id2 in likes[id1]:
                            likeNoResponse += 1
                        elif id2 in dislikes[id1]:
                            dislikeNoResponse += 1
    score = 6*mutualIdeal + 4*mutualLikes + (-4)*mutualDislikes + 5*idealLike + 0*idealDislike + (-1)*likeDislike + 3*idealNoResponse + 2*oneIdeal + 1*oneLike - 2*oneDislike - 3*dislikeNoResponse
    return {
        'score': score,
        'mIdeal': mutualIdeal,
        'mLikes': mutualLikes,
        'mDis': mutualDislikes,
        'idealLike': idealLike,
        'idealDis': idealDislike,
        'likeDis': likeDislike,
        'justIdeal': oneIdeal,
        'justLike': oneLike,
        'justDis': oneDislike,
        'nrIdeal': idealNoResponse,
        'nrLike': likeNoResponse,
        'nrDis': dislikeNoResponse
    }


########## Data Preparation Functions ##########
def prepCSVdata(fileName):
    '''Prepare the data from the given file name'''
    # open the file and begin reading
    file = open(fileName)
    csvReader = csv.reader(file, delimiter=',')
    header = next(csvReader)

    # clean up the header from the form to just get names
    for x in range(0, len(header)):
        header[x] = header[x].replace("Do you want to sit next to this person? Ignore your own name and know that you are not required to say \"no\" for those you don't know, though you may choose to, if you wish. Note that if you leave a name without an answer, this means you are indifferent to sitting with this person. We will seat you first with those you answer \"yes\" for, then those who you are indifferent towards, and we will try our best to keep you from sitting with those for whom you answer \"no\". Choose as many for each answer as you want. The more you answer, the greater the chance of us seating you correctly! Don't know anyone? Leave it blank!", '')
        header[x] = header[x].replace("If each table could sit 10 people, choose up to 9 you would sit with to create your \"ideal\" table. (Note: This question has been created based off of the feedback of those who initially took this survey. Let us know what you think in the feedback section!)", '2')
        header[x] = header[x].replace(' [', '').replace(']', '')

    peopleDict = {}
    idealDict = {}
    likesDict = {}
    dislikesDict = {}

    # initialize the dictionaries
    for x in header[1:]:
        # 2 is added for ideal groups, don't add the same name twice!
        if x[0] == '2':
            break
        else:
            peopleDict[x] = [x]
            idealDict[x] = []
            likesDict[x] = []
            dislikesDict[x] = []

    # fill dicts with proper info
    for line in csvReader:
        person = line[0]
        for x in range(1, len(line)):
            if line[x] == 'Yes' and person != header[x]:
                # just a like, not an ideal
                if header[x][0] != '2':
                    likesDict[person].append(header[x])
                else:
                    # if the name starts with '2', ideal!
                    idealDict[person].append(header[x][1:])
            if line[x] == 'No' and person != header[x]:
                dislikesDict[person].append(header[x])

    return {
        'people': peopleDict, 
        'likes': likesDict, 
        'dislikes': dislikesDict, 
        'ideals': idealDict
        }

def prepDBdata(data):
    '''Prepare the data from the given database data'''
    peopleDict = {}
    idealDict = {}
    likesDict = {}
    dislikesDict = {}
    groups = {}

    # initialize dictionaries
    for x in data['algorithmData']:
        groupSize = x['party_size']
        
        # should not happen, but if there is a db error, it might
        if 'survey_response' not in x:
            responses = {'liked': [], 'disliked': [], 'ideal': []}
        else:
            responses = x['survey_response']
        indId = x['guestId']
        
        # if it is a group...
        if groupSize > 1:
            groupId = x['group_id']
            # if the group exists in the groupDict, add the individual to the group
            if groupId in groups:
                groups[groupId].append(indId)
                # the individual should point to an array of its group
                peopleDict[indId] = groups[groupId]
            else:
                # start a new group
                groups[groupId] = [indId]
                peopleDict[indId] = groups[groupId]
        
        # if it is an individual...
        else:
            peopleDict[indId] = [indId]
        
        # fill in dicts
        ideals = responses['ideal']
        idealIds = []
        for x in ideals:
            idealIds.append(x['id'])
        likes = responses['liked']
        likedIds = []
        for x in likes:
            likedIds.append(x['id'])
        dislikes = responses['disliked']
        dislikedIds = []
        for x in dislikes:
            dislikedIds.append(x['id'])
        idealDict[indId] = idealIds
        likesDict[indId] = likedIds
        dislikesDict[indId] = dislikedIds

        # get initial table data
        perTable = data['tableSize']
        seatingChart = {}
        tables = []
        for x in data['tables']:
            tables.append(x['id'])
            seatingChart[x['id']] = list(x['guests'])

    return {
        'people': peopleDict, 
        'likes': likesDict, 
        'dislikes': dislikesDict, 
        'ideals': idealDict,
        'seatingChart': seatingChart,
        'tables': tables,
        'perTable': perTable
        }

########## Shared Functions to Facilitate Seating ##########
def seatRespondent(id, seatingChart, unseated, people, ideals, likes, dislikes, perTable, limitSpaces=True):
    '''Returns the table the person with id should be sat at along with any 
    friends that should/can be seated with them.'''
    # find the greatest amount of spaces open at a table
    mostSpaces = 0
    for x in seatingChart:
        spaces = perTable - len(seatingChart[x])
        if spaces > mostSpaces:
            mostSpaces = spaces
    mostSpaces -= len(people[id])        

    # find the group of people that gives this person the highest score
    if limitSpaces:
        bestFriends = findBestFriends(id, ideals, likes, dislikes, unseated, mostSpaces, people)
    else:
        bestFriends = findBestFriends(id, ideals, likes, dislikes, unseated, mostSpaces*3, people)

    # find the table where the person, their group (if applicable), and their friends best fit
    table, friends, bestWorstTable = findBestTable(id, seatingChart, people, ideals, likes, dislikes, bestFriends, perTable)
    if table != '':
        # TODO: friend stealing
        return (table, friends)
    # good table not found, return the best alternative
    else:
        return (bestWorstTable, [])

def seatNonRespondent(id, seatingChart, unseated, people, ideals, likes, dislikes, perTable):
    '''Finds a table and group of peple for those who didn't respond based
    on people who want to sit with them.'''
    # first, find people who want to sit with this person
    # keep track of the people who are also idealized by the same people
    idealBy = []
    likedBy = []
    others = []
    for x in people:
        # ignore here if they dislike others in the group for now
        # TODO: fix this later? ^ or keep this way???
        for y in people[id]:
            if y in ideals[x]:
                idealBy.append(x)
                others += ideals[x]
                others.remove(y)
            if y in likes[x]:
                likedBy.append(x)
                others += likes[x]
                others.remove(y)

    # find the best group based on the unseated people who are idealized
    # by the greatest number of the same people
    otherDict = {}
    for x in others:
        if x in unseated and not isRespondent(x, ideals, likes, dislikes):
            if x in otherDict:
                otherDict[x] += 1
            else:
                otherDict[x] = 1
    
    # sort the list by the number of times the person was mentioned
    potentialFriends = list(otherDict.keys())
    potentialFriends.sort(key=lambda k: otherDict[k], reverse=True)

    # put the people who idealize this party first!
    for x in idealBy + likedBy:
        if x in unseated:
            potentialFriends = [x] + potentialFriends

    # find the best table for the group
    bestTable, friends, bestWorstTable = findBestTable(id, seatingChart, people, ideals, likes, dislikes, potentialFriends, perTable, True)

    if bestTable != '':
        # TODO: steal friends IF that friend would be happier here AND the 
        # other table wouldn't suffer terribly
        return (bestTable, friends)

    else:
        return (bestWorstTable, [])
    
def findBestFriends(id, ideals, likes, dislikes, includedGroup, mostSpaces, people):
    '''look through the people id loves & likes and find the people who fit 
    best with their group'''
    # no space (or at least extra space) left at any table
    if mostSpaces <= 0:
        return []
    # adjust spaces so that we can just subtract length of curGroup later
    mostSpaces += len(people[id])
    bestGroup = []
    bestScore = -1
    bestFriends = list(ideals[id])
    if len(bestFriends) == 0:
        bestFriends = list(likes[id])
    random.shuffle(bestFriends)
    shuffledLikes = list(likes[id])
    shuffledIdeals = list(ideals[id])
    for group1 in bestFriends:
        safe = True
        # make sure the whole group is okay to be sat with this group
        for x in people[group1]:
            if id in dislikes[x] or x in dislikes[id] or x not in includedGroup:
                safe = False
                break
        if safe:
            curGroup = [id] + people[group1]
        else:
            curGroup = [id]

        # check size of group to see if table is now full
        if mostSpaces - len(curGroup) == 0:
            # check for best score
            groupScore = scoreGroup(curGroup, people, ideals, likes, dislikes)
            if groupScore > bestScore:
                bestGroup = curGroup 
                bestScore = groupScore 

        else:
            # there is still table space, keep searching
            random.shuffle(shuffledLikes)
            random.shuffle(shuffledIdeals)
            for group2 in shuffledIdeals + shuffledLikes:
                # first check if sizes are compatible
                if len(curGroup) + len(people[group2]) <= mostSpaces:
                    safe = True
                    # then see if likes/dislikes are compatible
                    for x in people[group2]:
                        for z in curGroup:
                            if z in dislikes[x] or x in dislikes[z] or x not in includedGroup:
                                safe = False
                                break
                    # add group2 to curGroup
                    if safe:
                        for x in people[group2]:
                            curGroup.append(x)
                            if mostSpaces -len(curGroup) == 0:
                                break 
            # check for best score using the current group
            groupScore = scoreGroup(curGroup, people, ideals, likes, dislikes)
            if groupScore > bestScore:
                bestGroup = curGroup 
                bestScore = groupScore            
    return bestGroup

def findBestTable(id, seatingChart, people, ideals, likes, dislikes, possibleFriends, perTable, noResponse=False):
    '''Finds the best table for the best group. Returns the friends that can
    be seated at the table, the table, and a backup table if no table with sufficient
    space or 0 dislikes is available.'''
    bestTable = ''
    friends = []
    bestScore = -1
    # keep track of backup tables
    leastDislikes = -1
    bestDislikeTable = '' # for the table with fewest dislikes
    leastOver = -1
    bestSmallTable = '' # for the table that can't fit the group but is closest

    # look to see which table is best for which subset of the group and their friends
    for tableId in seatingChart:
        t = list(seatingChart[tableId])
        size = (len(t)) + len(people[id])
        # if the base group is too big, save as a last resort
        if size > perTable:
            if leastOver == -1 or (size - perTable) < leastOver:
                # TODO: check for dislikes first?
                leastOver = size - perTable 
                bestSmallTable = tableId 
        else:
            t += people[id]
            groupData = scoreGroup(t, people, ideals, likes, dislikes)
            groupScore = groupData['score']
            dislikeCount = groupData['idealDis'] + 4*groupData['mDis'] + 2*groupData['likeDis'] + 3*groupData['justDis'] + 3*groupData['nrDis']
            if dislikeCount == 0 and size < perTable:
                # see if any friends can be added to the table to increase the score
                bestFriends = []
                bestTmpScore = groupScore
                # go through possibleFriends one at a time, taking subsets to find
                # the best score that can be made
                random.shuffle(possibleFriends)
                for x in possibleFriends:
                    tmpTable = list(t)
                    tmpFriends = []
                    ###### WORK HERE ##########
                    # make sure sizes are compatible
                    if x != id and len(people[x]) + len(tmpTable) <= perTable:
                        # make sure people are compatible
                        tmpTableData = scoreGroup(tmpTable + people[x], people, ideals, likes, dislikes)
                        tmpTableScore = tmpTableData['score']
                        tmpDisCount = tmpTableData['loveDis'] + tmpTableData['disLove'] + tmpTableData['mDis'] + tmpTableData['disLike'] + tmpTableData['likeDis'] + tmpTableData['justDis'] + tmpTableData['nrDis']
                        if tmpDisCount == 0:
                            tmpTable += people[x]
                            tmpFriends += people[x]
                            if len(tmpTable) <= perTable:
                                if tmpTableScore > bestTmpScore or (noResponse and tmpTableScore == bestTmpScore):
                                    bestFriends = list(tmpFriends)
                                    bestTmpScore = tmpTableScore 
                                if len(tmpTable) == perTable:
                                    break 
                


def seatingHelper(table, indId, friends, seatingChart, unseated, seated, people):
    '''Seats the individual, their group (if applicable), and their friends 
    at the supplied table. Returns the updated seating chart, unseated, and seated'''
    # seat the individual and their group
    for x in people[indId]:
        if x in seated and x in seatingChart[seated[x]]:
            # make sure if anyone was seated accidentally that
            # they are removed and seated with their party instead
            seatingChart[seated[x]].remove(x)
        seatingChart[table].append(x)
        seated[x] = table
        if x in unseated:
            unseated.remove(x)
    
    # seat their friends and friends' groups
    for y in friends:
        # make sure if friends were 'stolen', they are removed from their previous table
        for z in people[y]:
            if z in seated and z in seatingChart[seated[z]]:
                seatingChart[seated[z]].remove(z)
            seatingChart[table].append(z)
            seated[z] = table 
            if z in unseated:
                unseated.remove(z)

    return (seatingChart, unseated, seated)


########## Cases for Few Respondents ##########
def justRandom(origChart, people, perTable, tables):
    '''Finds everyone who is unseated and randomizes them in the seating chart.'''
    seatingChart, unseated, _ = refreshVariables(origChart, people)
    # keep track of seated people
    nowSeated = []
    random.shuffle(unseated)
    # seat the biggest groups first
    orderedUnseated = list(unseated)
    orderedUnseated.sort(key = lambda k: len(people[k]), reverse=True)        
    for x in orderedUnseated:
        # could be part of seated group but still in unseated. Make sure!
        if x not in nowSeated:
            for t in tables:
                if len(seatingChart[t]) + len(people[x]) <= perTable:
                    # seat every member of the group
                    for y in people[x]:
                        seatingChart[t].append(y)
                        nowSeated.append(y)
                    # since we've found a table, we can stop now
                    break
    # this means there are not enough seats left!
    # seat people wherever they cause the smallest negative impact
    if len(nowSeated) != len(orderedUnseated):
        emptiestTables = list(tables)
        emptiestTables.sort(key = lambda t: len(seatingChart[t]))
        i = 0 # keep track of table to fill
        for x in orderedUnseated:
            if x not in nowSeated:
                if i >= len(emptiestTables):
                    emptiestTables.sort(key = lambda t: len(seatingChart[t]))
                    i = 0
                t = emptiestTables[i]
                for y in people[x]:
                    seatingChart[t].append(y)
                    nowSeated.append(y)
                i += 1
    return seatingChart

def baseCase(origChart, seated, people, ideals, likes, dislikes, perTable, respondents):
    '''This is the base case, for when very few people have responded.
    It works by seating respondents first.'''
    # speed up the process by just placing people at random tables if nobody has responded
    if len(respondents) == 0:
        return justRandom(origChart, people, perTable, list(origChart.keys()))

    # refresh the variables to get copies
    seatingChart, unseated, seated = refreshVariables(origChart, people)
    random.shuffle(unseated)

    # start with large groups (> 50% of the table space)
    orderedGroups = list(unseated)
    orderedGroups.sort(key = lambda k: len(people[k]), reverse=True)
    for x in orderedGroups:
        if x not in seated:
            if len(people[x]) > perTable // 2:
                if x in respondents:
                    table, unseatedFriends = seatRespondent(x, seatingChart, unseated, people, ideals, likes, dislikes, perTable)
                    seatingChart, unseated, seated = seatingHelper(table, x, unseatedFriends, seatingChart, unseated, seated, people)
                else:
                    table, possibleFriends = seatNonRespondent(x, seatingChart, unseated, people, ideals, likes, dislikes, perTable)
                    seatingChart, unseated, seated = seatingHelper(table, x, possibleFriends, seatingChart, unseated, seated, people)
            # all big enough groups have been seated 
            else:
                break

    # move to people who have responded next, starting with biggest groups first
    random.shuffle(respondents)
    orderedRespondents = list(respondents)
    orderedRespondents.sort(key = lambda r: len(people[r]), reverse=True)
    for x in orderedRespondents:
        if x not in seated:
            table, unseatedFriends = seatRespondent(x, seatingChart, unseated, people, ideals, likes, dislikes, perTable)
            seatingChart, unseated, seated = seatingHelper(table, x, unseatedFriends, seatingChart, unseated, seated, people)

    # finish with the rest of the people
    random.shuffle(unseated)
    orderedGroups = list(unseated)
    orderedGroups.sort(key = lambda k: len(people[k]), reverse=True)
    for x in orderedGroups:
        if x not in seated:
            table, possibleFriends = seatNonRespondent(x, seatingChart, unseated, people, ideals, likes, dislikes, perTable)
            seatingChart, unseated, seated = seatingHelper(table, x, possibleFriends, seatingChart, unseated, seated, people)

    return seatingChart

########## Main Functions ##########
def seatPeople(origChart, people, ideals, likes, dislikes, perTable):
    '''Creates a seating chart based on the given data.'''
    # tables mapped to the list of individual ids at that table
    # and individual ids mapped to the table at which they are sitting
    seatingChart, _, seated = refreshVariables(origChart, people)
    
    # organize the respondents
    respondents = []
    for x in people:
        if isRespondent(x, ideals, likes, dislikes):
            respondents.append(x)

    seatingChart = baseCase(seatingChart, seated, people, ideals, likes, dislikes, perTable, respondents)
    return seatingChart

def main(dbData):
    '''This is the main function which prepares the data and 
    sends that data to the seating function. Returns the created
    seating chart.'''
    # if no dbData, use csv for testing
    if dbData == None:
        data = prepCSVdata('SCS3.csv')
        tableNames = []
        for x in range(1, 11):
            tableNames.append('Table ' + str(x))
        perTable = 10
        origChart = {}
        for x in tableNames:
            origChart[x] = []

    # prep data from database
    else:
        data = prepDBdata(dbData)
        tableNames = data['tables']
        perTable = data['perTable']
        origChart = data['seatingChart']
    
    # same for db data and csv data
    people = data['people']
    ideals = data['ideals']
    likes = data['likes']
    dislikes = data['dislikes']

    seatingChart = seatPeople(origChart, people, ideals, likes, dislikes, perTable)
    return seatingChart

# TODO: finish findBestTable