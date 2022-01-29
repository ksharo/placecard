import copy
import random
import csv
import time
import json

########## Main Function ##########
def seatParties(origChart, parties, loves, likes, dislikes, tableNames, perTable):
    '''Creates a seating chart for the parties, given some original seating chart
    and the necessary data'''
    # tables mapped to the list of party ids at that table
    seatingChart = {}
    for x in origChart:
        seatingChart[x] = list(origChart[x])
    for x in tableNames:
        if x not in seatingChart:
            seatingChart[x] = []

    # party ids mapped to the table at which they are sitting
    seatedParties = {}
    for x in seatingChart:
        table = seatingChart[x]
        for y in table:
            seatedParties[y] = x

    # count how many people responded
    respondents = []
    for x in parties:
        if isRespondent(x, loves, likes, dislikes):
            respondents.append(x)

    if len(respondents) <= 2*len(tableNames):
        seatingChart = baseCase(seatingChart, seatedParties, parties, loves, likes, dislikes, perTable, respondents)
    else:
        # try different algorithms and choose the highest scoring one
        chart1 = baseCase(seatingChart, seatedParties, parties, loves, likes, dislikes, perTable, respondents)
        chart2 = placecardFastAlgorithm(seatingChart, seatedParties, parties, loves, likes, dislikes, perTable)
        chart3 = recursionCaller(seatingChart, parties, seatedParties, loves, likes, dislikes, perTable)
        score1 = scoreChart(chart1, parties, loves, likes, dislikes)
        score2 = scoreChart(chart2, parties, loves, likes, dislikes)
        score3 = scoreChart(chart3, parties, loves, likes, dislikes)
        charts = [chart1, chart2, chart3]
        scores = [score1, score2, score3]
        # check charts 1-3 to see if any of them found 0 dislikes. If so, we don't need any more charts
        found = False
        for x in scores:
            if x['disCount'] == 0:
                found = True
                break
        if found:
            return chooseBestScore(charts, scores)
        # if they couldn't find 0 dislikes, check the other routes
        idGroups = findAllGroupings(parties, loves, likes, dislikes)
        chart4 = placecardSlowGroupingAlgorithm(seatingChart, copy.deepcopy(idGroups), parties, loves, likes, dislikes, perTable, spaces=0)
        chart5 = placecardSlowGroupingAlgorithm(seatingChart, copy.deepcopy(idGroups), parties, loves, likes, dislikes, perTable, spaces=1)
        chart6 = placecardSlowGroupingAlgorithm(seatingChart, copy.deepcopy(idGroups), parties, loves, likes, dislikes, perTable, spaces=2)
        score4 = scoreChart(chart4, parties, loves, likes, dislikes)
        score5 = scoreChart(chart5, parties, loves, likes, dislikes)
        score6 = scoreChart(chart6, parties, loves, likes, dislikes)
        charts = [chart1, chart2, chart3, chart4, chart5, chart6]
        scores = [score1, score2, score3, score4, score5, score6]
        return chooseBestScore(charts, scores)
    return seatingChart

########## General Functions ##########
def chooseBestScore(charts, scores):
    '''Given a  list of charts and a list of scores, returns the chart
    with the best score.'''
    fewestDislikes = -1
    chartsWith = [] # keeps track of the indexes of the charts that have the fewest dislikes
    for x in range(len(scores)):
        if scores[x]['disCount'] == fewestDislikes:
            chartsWith.append(x)
        elif scores[x]['disCount'] < fewestDislikes or fewestDislikes == -1:
            fewestDislikes = scores[x]['disCount']
            chartsWith = [x]
    if len(chartsWith) == 1:
        return charts[chartsWith[0]]
    else:
        bestScore = 0
        bestChart = {}
        for x in chartsWith:
            if scores[x]['score'] > bestScore:
                bestScore = scores[x]['score']
                bestChart = charts[x]
    return bestChart

def isRespondent(partyID, loves, likes, dislikes):
    '''Returns true if the party has responded, false otherwise.'''
    return len(loves[partyID]) + len(likes[partyID]) + len(dislikes[partyID]) != 0

def getIndScore(id, table, parties, loves, likes, dislikes):
    '''Calculates the score for an individual party at this table.
    Does not take into account dislikes'''
    score = 0
    pSize = parties[id]
    dislikeCount = 0
    for x in table:
        if x in loves[id] and id in loves[x]:
            score += 6 * pSize
        elif (x in likes[id] and id in loves[x]) or (x in loves[id] and id in likes[x]):
            score += 5 * pSize
        elif x in likes[id] and id in likes[x]:
            score += 4 * pSize
        elif not isRespondent(x, loves, likes, dislikes) and x in loves[id]:
            score += 3 * pSize
        elif not isRespondent(x, loves, likes, dislikes) and x in likes[id]:
            score += 2 * pSize
        elif isRespondent(x, loves, likes, dislikes) and x in loves[id]:
            score += 2 * pSize
        elif isRespondent(x, loves, likes, dislikes) and x in likes[id]:
            score += 1 * pSize
        elif x in dislikes[id]:
            dislikeCount += 1
    return {'score': score, 'dislikes': dislikeCount}
    
def bestIndScore(id, parties, loves, likes, dislikes, perTable):
    '''Calculates the best possible score for an individual party'''
    # 6 points for mutual love
    # 5 points for loveLike/likeLove
    # 4 points for mutual like
    # 3 for loveNoResponse
    # 2 for likeNoResponse
    # 2 for oneLove
    # 1 for oneLike
    # 0 for dislike/love love/dislike
    # -1 for like/dislike dislike/like
    # -3 dislikeNoResponse
    pSize = parties[id]
    if not isRespondent(id, loves, likes, dislikes):
        return (0, 0)
    else:
        # start with the size of the party
        scoresAdded = pSize
        topScore = 0
        partiesCounted = []
        # first, look for mutual loves
        for x in loves[id]:
            if x in parties and id in loves[x] and x not in partiesCounted:
                topScore += 6 * pSize
                partiesCounted.append(x)
                scoresAdded = addScore(scoresAdded, parties[x], perTable)
                if scoresAdded == perTable:
                    return (topScore, 0)
        # then, loveLike
        if scoresAdded < perTable:
            for x in loves[id]:
                if x in parties and id in likes[x] and id not in loves[x] and x not in partiesCounted:
                    topScore += 5 * pSize
                    partiesCounted.append(x)
                    scoresAdded = addScore(scoresAdded, parties[x], perTable)
                    if scoresAdded == perTable:
                        return (topScore, 0)
        # then, likeLove
        if scoresAdded < perTable:
            for x in likes[id]:
                if x in parties and id in loves[x] and x not in loves[id] and x not in partiesCounted:
                    topScore += 5 * pSize
                    partiesCounted.append(x)
                    scoresAdded = addScore(scoresAdded, parties[x], perTable)
                    if scoresAdded == perTable:
                        return (topScore, 0)
        # then, mutual likes
        if scoresAdded < perTable:
            for x in likes[id]:
                if x in parties and id in likes[x] and x not in partiesCounted:
                    topScore += 4 * pSize
                    partiesCounted.append(x)
                    scoresAdded = addScore(scoresAdded, parties[x], perTable)
                    if scoresAdded == perTable:
                        return (topScore, 0)
        # then, loveNoResponse
        if scoresAdded < perTable:
            for x in loves[id]:
                if x in parties and not isRespondent(x, loves, likes, dislikes) and x not in partiesCounted:
                    topScore += 3 * pSize
                    partiesCounted.append(x)
                    scoresAdded = addScore(scoresAdded, parties[x], perTable)
                    if scoresAdded == perTable:
                        return (topScore, 0)
        # then, likeNoResponse
        if scoresAdded < perTable:
            for x in likes[id]:
                if x in parties and not isRespondent(x, loves, likes, dislikes) and x not in partiesCounted:
                    topScore += 2 * pSize
                    partiesCounted.append(x)
                    scoresAdded = addScore(scoresAdded, parties[x], perTable)
                    if scoresAdded == perTable:
                        return (topScore, 0)
        # then, justLove
        if scoresAdded < perTable:
            for x in loves[id]:
                if x in parties and isRespondent(x, loves, likes, dislikes):
                    if id not in loves[x] and id not in likes[x] and id not in dislikes[x] and x not in partiesCounted:
                        topScore += 2 * pSize
                        partiesCounted.append(x)
                        scoresAdded = addScore(scoresAdded, parties[x], perTable)
                        if scoresAdded == perTable:
                            return (topScore, 0)
        # then, justLike
        if scoresAdded < perTable:
            for x in likes[id]:
                if x in parties and isRespondent(x, loves, likes, dislikes):
                    if id not in loves[x] and id not in likes[x] and id not in dislikes[x] and x not in partiesCounted:
                        topScore += 1 * pSize
                        partiesCounted.append(x)
                        scoresAdded = addScore(scoresAdded, parties[x], perTable)
                        if scoresAdded == perTable:
                            return (topScore, 0)
        # check to see if there are enough people that this
        # individual doesn't dislike everyone else and those people don't dislike person x
        if scoresAdded < perTable:
            for x in parties:
                if x not in dislikes[id] and id not in dislikes[x] and x not in partiesCounted:
                    scoresAdded = addScore(scoresAdded, parties[x], perTable)
                    if scoresAdded == perTable:
                        return (topScore, 0)
        # if they dislike everyone else, return the negative
        return (-topScore, perTable-scoresAdded)

def addScore(numScores, partySize, perTable):
    '''Takes numScores and adds 1 for each person
    in the party until perTable has been added'''
    i = 0
    while (numScores < perTable and i < partySize):
        numScores += 1
        i += 1
    return numScores

def scoreTable(table, parties, loves, likes, dislikes):
    '''Table is a group of ids belonging to parties.
    Parties is the dictionary of parties who were invited,
    mapping id to size of party.
    Loves is the dictionary of parties' ids mapped to the people
    with whom they really want to sit.
    Likes is the dictionary of parties' ids mapped to the people 
    with whom they want to sit.
    Dislikes is the dictionary of parties' ids mapped to the people
    with whom they do not want to sit.

    Returns an object filled with data on the table
    '''
    mutualLoves = 0
    mutualLikes = 0
    mutualDislikes = 0
    loveLike = 0
    likeLove = 0
    loveDislike = 0
    dislikeLove = 0
    likeDislike = 0
    dislikeLike = 0
    oneLove = 0
    oneLike = 0
    oneDislike = 0
    loveNoResponse = 0
    likeNoResponse = 0
    dislikeNoResponse = 0
    respondents = 0
    for id in table:
        if isRespondent(id, loves, likes, dislikes):
            respondents += 1
            for id2 in table:
                if id != id2:
                    # if the other person responded, check for mutual things
                    if isRespondent(id2, loves, likes, dislikes):
                        if id2 in loves[id] and id in loves[id2]:
                            mutualLoves += 1 * parties[id]
                        elif id2 in loves[id] and id in likes[id2]:
                            loveLike += 1 * parties[id]
                        elif id in loves[id2] and id2 in likes[id]:
                            likeLove += 1 * parties[id]
                        elif id2 in likes[id] and id in likes[id2]:
                            mutualLikes += 1 * parties[id]
                        elif id2 in dislikes[id] and id in dislikes[id2]:
                            mutualDislikes += 1 * parties[id]
                        # if nothing mutual found, look for mixed
                        elif id2 in loves[id] and id in dislikes[id2]:
                            loveDislike += 1 * parties[id]
                        elif id in loves[id2] and id2 in dislikes[id]:
                            dislikeLove += 1 * parties[id]
                        elif id2 in likes[id] and id in dislikes[id2]:
                            likeDislike += 1 * parties[id]
                        elif id in likes[id2] and id2 in dislikes[id]:
                            dislikeLike += 1 * parties[id]
                        # if still nothing, look for one sided
                        elif id2 in loves[id]:
                            oneLove += 1
                        elif id2 in likes[id]:
                            oneLike += 1
                        elif id2 in dislikes[id]:
                            oneDislike += 1
                    # check no response
                    else:
                        if id2 in loves[id]:
                            loveNoResponse += 1
                        elif id2 in likes[id]:
                            likeNoResponse += 1
                        elif id2 in dislikes[id]:
                            dislikeNoResponse += 1
    score = 6*mutualLoves + 4*mutualLikes + (-4)*mutualDislikes + 5*(loveLike + likeLove) + 0*(loveDislike + dislikeLove) + (-1)*(likeDislike + dislikeLike) + 3*loveNoResponse + 2*likeNoResponse + 2*oneLove + 1*oneLike - 1*oneDislike - 3*dislikeNoResponse
    return {'mLoves': mutualLoves, 'mLikes': mutualLikes, 'mDis': mutualDislikes, 'loveLike': loveLike, 'likeLove': likeLove,
     'loveDis': loveDislike, 'disLove': dislikeLove, 'likeDis': likeDislike, 'disLike': dislikeLike, 'justLove': oneLove, 'justLike': oneLike, 'justDis': oneDislike, 'nrLove': loveNoResponse,
     'nrLike': likeNoResponse, 'nrDis':dislikeNoResponse, 'respondents': respondents, 'score':score}

def scoreChart(seatingChart, parties, loves, likes, dislikes):
    '''Calculates the final score of the seating chart, the best score
    that the chart could have achieved, and the number of people who responded.'''
    totalScore = 0
    totalRespondents = 0
    mDis = 0
    loveDis = 0
    disLove = 0
    disLike = 0
    likeDis = 0
    justDis = 0
    nrDis = 0
    dislikeScore = 0
    sat = 0
    for tableName in seatingChart:
        table = seatingChart[tableName]
        sat += len(table)
        indScore = scoreTable(table, parties, loves, likes, dislikes)
        totalScore += indScore['score']
        totalRespondents += indScore['respondents']
        mDis += indScore['mDis']
        loveDis += indScore['loveDis']
        disLove += indScore['disLove']
        disLike += indScore['disLike']
        likeDis += indScore['likeDis']
        justDis += indScore['justDis']
        nrDis += indScore['nrDis']
        dislikeScore += indScore['loveDis'] + 4*indScore['mDis'] + 3*indScore['disLike'] + 3*indScore['justDis'] + 2*indScore['nrDis']
    # only mutual dislike should be counted as 2 people disliking each other
    disCount = mDis + loveDis/2 + disLove/2 + disLike/2 + likeDis/2 + justDis + nrDis
    return {'score': totalScore, 'respondents': totalRespondents, 'dislikes': dislikeScore, 'mutual dislikes': mDis, \
        'loveDis/disLove': loveDis+disLove, 'disLike/likeDis': disLike + likeDis, 'just dislike': justDis, \
        'nrDis': nrDis, 'totalDis': disCount, 'disCount': countDislikes(seatingChart, dislikes), 'peopleSat': sat, 'partyLength': len(parties)}

def findBestGroupScore(partyID, group, parties, perTable, loves, likes, dislikes):
    '''Returns the best score for perTable people in a group
    surrounding person with id partyID'''
    # if partyID did not respond, their best score will be 0
    if not isRespondent(partyID, loves, likes, dislikes):
        return 0
    # if the group is <= perTable, just return the individual's score
    elif len(group) <= perTable:
        return getIndScore(partyID, group, parties, loves, likes, dislikes)['score']
    # if the group is bigger than perTable, try to fill it with people
    # this person loves/likes only up until perTable 
    else:
        # use bestIndScore, replacing parties with a dictionary
        # of those in the table
        people = {}
        for x in group:
            people[x] = parties[x]
        return bestIndScore(partyID, people, loves, likes, dislikes, perTable)[0]

def bestChartScoreFast(people, parties, loves, likes, dislikes, perTable):
    '''Calculates the best score for the seating chart based on the best
    score for each individual person, not taking into account the groups 
    that person could be in.'''
    topScore = 0
    problemPeople = []
    for x in people:
        indScore = bestIndScore(x, parties, loves, likes, dislikes, perTable)
        if indScore[0] >= 0:
            topScore += indScore[0]
        else:
            topScore += -indScore[0]
            problemPeople.append(x) 
    return (topScore, problemPeople)

def bestChartScoreAccurate(people, parties, idGroups, loves, likes, dislikes, perTable):
    '''Calculates the best score for the seating chart based on the best
    score for each individual person taking into account the group that person is in.'''
    topScore = 0
    problemPeople = []
    for x in people:
        indScore = bestIndScore(x, parties, loves, likes, dislikes, perTable)
        possibleGroups = list(idGroups[x])
        if indScore[0] >= 0:
            # make sure that this is really their best score
            # put the biggest group first
            possibleGroups.sort(key=(lambda k: len(k)), reverse=True)
            bestScore = 0
            found = False
            for g in possibleGroups:
                groupScore = findBestGroupScore(x, g, parties, perTable, loves, likes, dislikes)
                # if the group score is as high as the individual's best
                # score, then we're good. keep this score.
                if groupScore == indScore[0]:
                    topScore += indScore[0]
                    found = True
                    break
                # otherwise, keep looking
                elif groupScore > bestScore:
                    bestScore = groupScore
            if not found:
                topScore += bestScore
                problemPeople.append(x)
            
        else:
            problemPeople.append((x, indScore[1]))
            iScore = -indScore[0]
            # put the biggest group first
            possibleGroups.sort(key=(lambda k: len(k)), reverse=True)
            bestScore = 0
            found = False
            for g in possibleGroups:
                groupScore = findBestGroupScore(x, g, parties, perTable, loves, likes, dislikes)
                # if the group score is as high as the individual's best
                # score, then we're good. keep this score.
                if groupScore == iScore:
                    topScore += iScore
                    found = True
                    break
                # otherwise, keep looking
                elif groupScore > bestScore:
                    bestScore = groupScore
            if not found:
                topScore += bestScore

    return (topScore, problemPeople)

def prepData(fileName):
    '''Prepare the data from the given file name'''
    file = open(fileName)
    csvReader = csv.reader(file, delimiter=',')
    header = next(csvReader)

    for x in range(0, len(header)):
        header[x] = header[x].replace("Do you want to sit next to this person? Ignore your own name and know that you are not required to say \"no\" for those you don't know, though you may choose to, if you wish. Note that if you leave a name without an answer, this means you are indifferent to sitting with this person. We will seat you first with those you answer \"yes\" for, then those who you are indifferent towards, and we will try our best to keep you from sitting with those for whom you answer \"no\". Choose as many for each answer as you want. The more you answer, the greater the chance of us seating you correctly! Don't know anyone? Leave it blank!", '')
        header[x] = header[x].replace("If each table could sit 10 people, choose up to 9 you would sit with to create your \"ideal\" table. (Note: This question has been created based off of the feedback of those who initially took this survey. Let us know what you think in the feedback section!)", '2')
        # note: in form, make sure numbers/symbols can't be in names!!!!
        header[x] = header[x].replace(' [', '').replace(']', '')

    partyDict = {}
    likesDict = {}
    superLikesDict = {}
    dislikesDict = {}

    # initialize dictionaries
    for x in header[1:]:
        if x[0] == '2':
            break
        if fileName == 'SCS4.csv' and (x == 'Dana Faustino' or x == 'President Farvardin'):
            pass
        else:
            partyDict[x] = 1
            likesDict[x] = []
            superLikesDict[x] = []
            dislikesDict[x] = []
    for line in csvReader:
        party = line[0]
        for x in range(1, len(line)):
            if fileName == 'SCS4.csv' and (party == 'Dana Faustino' or party == 'President Farvardin' or header[x] == 'Dana Faustino' or header[x] == 'President Farvardin' or header[x] == '2Dana Faustino' or header[x] == '2President Farvardin'):
                pass
            else:
                if line[x] == 'Yes' and party != header[x]:
                    if header[x][0] != '2':
                        likesDict[party].append(header[x])
                    else:
                        # add the person to the superLikes dict
                        superLikesDict[party].append(header[x][1:])
                if line[x] == 'No' and party != header[x]:
                    dislikesDict[party].append(header[x])

    return {'parties': partyDict, 'likes': likesDict, 'dislikes': dislikesDict, 'superLikes': superLikesDict}

def tableSize(table, parties):
    '''Returns the size of a table'''
    size = 0
    counted = []
    for x in table:
        if x not in counted:
            size += parties[x]
            counted.append(x)
    return size

def countDislikes(seatingChart, dislikes):
    '''Returns the number of people who are unhappy
    at their table.'''
    people = 0
    for tableName in seatingChart:
        table = seatingChart[tableName]
        for x in table:
            for y in table:
                if y in dislikes[x]:
                    people += 1
                    break
    return people

########## Shared Functions to Facilitate Seating ##########
def seatResponseParty(id, seatingChart, seatedParties, unseated, parties, loves, likes, dislikes, perTable):
    '''Returns the table the party (id) should be sat at along with
    any friends that should/can be seated with them'''
    # find the greatest amount of spaces open at a table
    mostSpaces = 0
    for x in seatingChart:
        table = seatingChart[x]
        spaces = perTable - tableSize(table, parties)
        if spaces > mostSpaces:
            mostSpaces = spaces
        
    # find the group of people that gives id the highest score
    bestGroup = findBestGroup(id, loves, likes, dislikes, unseated, mostSpaces)
    
    # find the table where the group fits best
    (table, friends, bestWorstTable) = findBestTable(id, seatingChart, parties, loves, likes, dislikes, bestGroup, perTable)
    if table != '':
        # check to make sure they are not at a table by themselves
        if tableSize(seatingChart[table], parties) <= (0.2 * perTable) and len(friends) <= (0.1 * perTable):
            # if they are, go steal some friends!
            # look through the people they love and test out which group gives them the highest score
            seated = list(seatedParties.keys())
            bestGroup = findBestGroup(id, loves, likes, dislikes, seated, mostSpaces)
            friendTables = {}
            for x in bestGroup:
                if x != id:
                    if seatedParties[x] in friendTables:
                        friendTables[seatedParties[x]].append(x)
                    else:
                        friendTables[seatedParties[x]] = [x]
            # split up the group evenly between tables
            if len(friendTables) == 0:
                return (table, friends)  
            if len(friendTables) == 1:
                numFriends = len(bestGroup)
                curCount = len(friends)
                stolenGroup = friends
                while curCount < numFriends//2:
                    i = random.randint(0, len(bestGroup)-1)
                    stolenGroup.append(bestGroup[i])
                    bestGroup.remove(bestGroup[i])
                    curCount += 1
                return(table, stolenGroup)
            else:
                numFriends = len(bestGroup)
                curCount = len(friends)
                stolenGroup = friends
                while curCount < numFriends // 2:
                    # find table with most people to steal
                    biggestTable = ''
                    size = 0
                    for x in friendTables:
                        if len(friendTables[x]) > size:
                            size = len(friendTables[x])
                            biggestTable = x
                    i = random.randint(0, len(friendTables[biggestTable])-1)
                    stolenGroup.append(friendTables[biggestTable][i])
                    friendTables[biggestTable].remove(friendTables[biggestTable][i])
                    curCount += 1
                return(table, stolenGroup)
        else:
            return (table, friends)
    
    # good table not found, return the best worst table
    else:  
        return (bestWorstTable, [])

def findBestGroup(id, loves, likes, dislikes, includedGroup, mostSpaces):
    '''look through the people id loves and test out which group gives them the highest score'''
    bestGroup = []
    bestScore = -1
    bestFriends = list(loves[id])
    if len(bestFriends) == 0:
        bestFriends = list(likes[id])
    random.shuffle(bestFriends)
    shuffledLikes = list(likes[id])
    shuffledLoves = list(loves[id])
    random.shuffle(shuffledLoves)
    random.shuffle(shuffledLikes)
    for x in bestFriends:
        if id not in dislikes[x]:
            if x in includedGroup:
                curGroup = [x, id]
            else:
                curGroup = [id]
            random.shuffle(shuffledLikes)
            random.shuffle(shuffledLoves)
            for y in shuffledLoves + shuffledLikes:
                if y not in curGroup and y in includedGroup:
                    tmpTable = list(curGroup)
                    tmpTable.append(y)
                    if tableSize(tmpTable, parties) <= mostSpaces:
                        fits = True
                        for z in curGroup:
                            if y in dislikes[z] or z in dislikes[y]:
                                fits = False
                        if fits:
                            curGroup.append(y)
                            if tableSize(curGroup, parties) == mostSpaces:
                                break
            groupScore = scoreTable(curGroup, parties, loves, likes, dislikes)['score']
            if groupScore > bestScore:
                bestGroup = curGroup
                bestScore = groupScore
    return bestGroup

def findBestTable(id, seatingChart, parties, loves, likes, dislikes, bestGroup, perTable, noResponse=False):
    '''Finds the best table for the best group. Returns the friends
    that can be at the table, the table, and the backup table if no table 
    with 0 dislikes is available'''
    table = ''
    friends = []
    bestScore = -1
    # keep track of backup tables
    lowestDislikes = -1
    bestWorstTable = ''
    # after the best group is found, look to see which table would be the best fit for it
    for tableName in seatingChart:
        t = list(seatingChart[tableName])
        if len(t) + parties[id] <= perTable:
            t.append(id)
            tableData = scoreTable(t, parties, loves, likes, dislikes)
            tableScore = tableData['score']
            dislikeCount = tableData['loveDis'] + tableData['disLove'] + 4*tableData['mDis'] + 2*tableData['disLike'] + 2*tableData['likeDis'] + 3*tableData['justDis'] + 3*tableData['nrDis']
            if dislikeCount == 0:
                # see if any friends can be added to the table to increase the score
                bestFriends = []
                bestTmpScore = tableScore
                # go through the bestGroup one at a time, taking subsets to find
                # the best score that can be made
                random.shuffle(bestGroup)
                for x in bestGroup:
                    tmpTable = list(t)
                    if x != id:
                        tmpTable.append(x)
                        if (tableSize(tmpTable, parties) <= perTable):
                            tmpFriends = [x]
                            for y in bestGroup:
                                if x != y and y not in tmpTable:
                                    tmpTable.append(y)
                                    tmpFriends.append(y)
                                    if tableSize(tmpTable, parties) <= perTable:
                                        tmpTableData = scoreTable(tmpTable, parties, loves, likes, dislikes)
                                        tmpTableScore = tmpTableData['score']
                                        tmpDisCount = tmpTableData['loveDis'] + tmpTableData['disLove'] + tmpTableData['mDis'] + tmpTableData['disLike'] + tmpTableData['likeDis'] + tmpTableData['justDis'] + tmpTableData['nrDis']
                                        if tmpDisCount > 0:
                                            # table is invalid, skip y
                                            tmpTable.remove(y)
                                            tmpFriends.remove(y)
                                        elif tableSize(tmpTable, parties) <= perTable:
                                            if tmpTableScore > bestTmpScore or (noResponse and tmpTableScore == bestTmpScore):
                                                bestFriends = list(tmpFriends)
                                                bestTmpScore = tmpTableScore
                                        if tableSize(tmpTable, parties) == perTable:
                                            break
                                    else:
                                        tmpTable.remove(y)
                                        tmpFriends.remove(y)
                if bestTmpScore > bestScore:
                    table = tableName
                    bestScore = bestTmpScore
                    friends = bestFriends
            else:
                if dislikeCount < lowestDislikes or lowestDislikes == -1:
                    lowestDislikes = dislikeCount
                    bestWorstTable = tableName
    return(table, friends, bestWorstTable)

def seatNoResponseParty(id, seatingChart, unseated, parties, loves, likes, dislikes, perTable):
    '''Finds a table and group of people for those who didn't respond to be sat with based
    on people who like/love them'''
    # first, find the people who love/like this person.
    # keep track of the people who are also loved/liked by the same people
    lovedBy = []
    likedBy = []
    others = []
    for x in parties:
        if id in loves[x]:
            lovedBy.append(x)
            others += loves[x]
            others.remove(id)
        if id in likes[x]:
            likedBy.append(x)
            others += likes[x]
            others.remove(id)

    # find the best group based on the unseated people who are loved/liked by the greatest number of the same people
    otherDict = {}
    for x in others:
        if x in unseated and not isRespondent(x, loves, likes, dislikes):
            if x in otherDict:
                otherDict[x] += 1
            else:
                otherDict[x] = 1

    # sort the list by the number of times the person was mentioned
    potentialFriends = list(otherDict.keys())
    potentialFriends.sort(key=lambda k: otherDict[k], reverse=True)
    
    # find the best table for the group
    (bestTable, friends, bestWorstTable) = findBestTable(id, seatingChart, parties, loves, likes, dislikes, potentialFriends, perTable, True)

    if bestTable != '':
        # don't steal friends, because they didn't respond so that's on them
        return (bestTable, friends)
    else:
        return (bestWorstTable, [])

def seatingHelper(table, partyID, unseatedFriends, seatingChart, unseated, seatedParties):
    '''Seats the party and their friends at the table.
    Returns the updated seating chart, list of unseated parties, 
    and dictionary of seated parties'''
    if partyID in unseated:
        unseated.remove(partyID)
        for _ in range(parties[partyID]):
            seatingChart[table].append(partyID)
        seatedParties[partyID] = table
    for y in unseatedFriends:
        # make sure if friends were stolen, they are removed from their previous tables
        if y in seatedParties:
            t = seatedParties[y]
            for _ in range(parties[y]):
                seatingChart[t].remove(y)
            unseated.append(y)
        # add them to the correct table
        if y in unseated:
            unseated.remove(y)
            for _ in range(parties[y]):
                seatingChart[table].append(y)
            seatedParties[y] = table
    return (seatingChart, unseated, seatedParties)

def refreshVariables(origChart):
    '''For functions that iterate to find the best chart,
    this refreshes their main variables (seating chart, unseated,
    and seatedParties) to follow origChart'''
    seatingChart = {}
    for x in origChart:
        seatingChart[x] = list(origChart[x])
    seatedParties = {}
    for x in seatingChart:
        for y in seatingChart[x]:
            seatedParties[y] = x
    unseated = list(parties.keys())
    for x in seatedParties:
        if x in unseated:
            unseated.remove(x)
    return (seatingChart, unseated, seatedParties)

def findAllGroupings(parties, loves, likes, dislikes):
    '''Finds all the different combinations of individuals who
    will not be unhappy together.'''
    # get all possible groups of people who will not be unhappy together
    groups = []
    partyNames = list(parties.keys())
    peopleInGroups = []
    idGroups = {}
    for x in partyNames:
        for y in loves[x] + likes[x] + partyNames:
            if y != x and x not in dislikes[y] and y not in dislikes[x]:
                tmpGroup = [x, y]
                for z in loves[x] + likes[x] + partyNames:
                    disliked = False
                    if z not in tmpGroup:
                        for p in tmpGroup:
                            if z in dislikes[p] or p in dislikes[z]:
                                disliked = True
                                break
                        if not disliked:
                            tmpGroup.append(z)                    
                tmpGroup.sort()
                if tmpGroup not in groups:
                    groups.append(tmpGroup)
                    for p in tmpGroup:
                        # keep track of the groups for each person
                        if p in idGroups:
                            idGroups[p].append(tmpGroup)
                        else:
                            idGroups[p] = [tmpGroup]
                        if p not in peopleInGroups:
                            peopleInGroups.append(p)

    # find all the people who aren't in any groups and try to find a group for them!
    unloved = []
    for x in partyNames:
        if x not in peopleInGroups:
            unloved.append(x)

    for x in unloved:
        found = False
        for g in groups:
            disliked = False
            for p in g:
                if x in dislikes[p] or p in dislikes[x]:
                    disliked = True
                    break
            if not disliked:
                g.append(x)
                if x in idGroups:
                    idGroups[x].append(g)
                else:
                    idGroups[x] = [g]
                found = True
        if found == False:
            # this person does not have a suitable group.
            # add them to a new group
            idGroups[x] = [[x]]
    return idGroups

########## Cases For Few Respondents ##########
def justRandom(origChart, parties, perTable, tableNames):
    '''Finds everyone who is unseated and places them 
    randomly in the seating chart'''
    seatingChart = {}
    for x in origChart:
        seatingChart[x] = list(origChart[x])
    seatedParties = {}
    for x in seatingChart:
        for y in seatingChart[x]:
            seatedParties[y] = x
    unseated = list(parties.keys())
    for x in seatedParties:
        if x in unseated:
            unseated.remove(x)
    random.shuffle(unseated)
    for x in unseated:
        for t in tableNames:
            if tableSize(seatingChart[t]) + parties[x] <= perTable:
                for _ in range(parties[x]):
                    seatingChart[t].append(x)
                break
    return seatingChart

def baseCase(origChart, seatedParties, parties, loves, likes, dislikes, perTable, respondents):
    '''This is the base case, for when very few people have responded.'''
    # speed up the process by just placing people at random tables if nobody has responded
    if len(respondents) == 0:
        return justRandom(origChart, parties, perTable, list(origChart.keys()))
    
    # go through a few iterations and save the best one
    bestChart = copy.deepcopy(origChart)
    bestScore = scoreChart(origChart, parties, loves, likes, dislikes)['score']
    leastDislikes = -1

    start = time.time()
    while time.time() - start < 1:

        # refresh variables each time
        (seatingChart, unseated, seatedParties) = refreshVariables(origChart)

        # start with those parties which have responded
        for x in respondents:
            if x not in seatedParties:
                (table, unseatedFriends) = seatResponseParty(x, seatingChart, seatedParties, unseated, parties, loves, likes, dislikes, perTable)
                (seatingChart, unseated, seatedParties) = seatingHelper(table, x, unseatedFriends, seatingChart, unseated, seatedParties)

        thisScore = scoreChart(seatingChart, parties, loves, likes, dislikes)
        if thisScore['score'] >= bestScore and (leastDislikes == -1 or thisScore['disCount'] <= leastDislikes) :
            bestScore = thisScore['score']
            bestChart = copy.deepcopy(seatingChart)
            leastDislikes = thisScore['disCount']

    # NOTICE: seating those who did not respond DOES NOT AFFECT THE SCORE!
    # refresh variables based on bestChart
    (bestChart, unseated, seatedParties) = refreshVariables(bestChart)

    # after the bestChart base is found, place those who did not respond
    random.shuffle(unseated)
    tmpUnseated = list(unseated)
    for x in tmpUnseated:
        if x not in seatedParties:
            (table, possibleFriends) = seatNoResponseParty(x, bestChart, unseated, parties, loves, likes, dislikes, perTable)
            (bestChart, unseated, seatedParties) = seatingHelper(table, x, possibleFriends, bestChart, unseated, seatedParties)

    return bestChart

########## Cases For Many Respondents ##########
def placecardFastAlgorithm(origChart, seatedParties, parties, loves, likes, dislikes, perTable):
    '''Generates a seating chart that seats many people'''
    bestChart = copy.deepcopy(origChart)
    tmp = bestChartScoreFast(list(seatedParties.keys()), parties, loves, likes, dislikes, perTable)[0]
    if tmp != 0:
        bestScore = scoreChart(origChart, parties, loves, likes, dislikes)['score']/tmp
    else:
        bestScore = 0
    leastDislikes = -1

    start = time.time()
    while time.time() - start < 2:
        # refresh variables each time
        (seatingChart, unseated, seatedParties) = refreshVariables(origChart)
        # start by choosing a few people with whom to create base tables
        partyNames = list(parties.keys())
        partyNames.sort(key = lambda k : len(dislikes[k]), reverse=True)
        unseated = list(partyNames)
        for x in seatedParties:
            unseated.remove(x)
        # create base tables for numTables people
        for x in partyNames:
            if x not in seatedParties:
                (table, unseatedFriends) = seatResponseParty(x, seatingChart, seatedParties, unseated, parties, loves, likes, dislikes, perTable)
                (seatingChart, unseated, seatedParties) = seatingHelper(table, x, unseatedFriends, seatingChart, unseated, seatedParties)

            # seat the people who are disliked by this person
            # TODO: for each person, sit the people who they dislike
            # RECURSIVE!
            nextPeople = list(dislikes[x])
            random.shuffle(nextPeople)
            for d in nextPeople:
                if d not in seatedParties:
                    (table, unseatedFriends) = seatResponseParty(d, seatingChart, seatedParties, unseated, parties, loves, likes, dislikes, perTable)
                    (seatingChart, unseated, seatedParties) = seatingHelper(table, d, unseatedFriends, seatingChart, unseated, seatedParties)

        bestPossible = bestChartScoreFast(list(seatedParties.keys()), parties, loves, likes, dislikes, perTable)[0]
        thisScoreData = scoreChart(seatingChart, parties, loves, likes, dislikes)
        if bestPossible != 0:
            thisScore = thisScoreData['score']/bestPossible
        else:
            thisScore = 0
        if thisScore >= bestScore and (leastDislikes == -1 or thisScoreData['disCount'] <= leastDislikes):
            bestScore = thisScore
            bestChart = copy.deepcopy(seatingChart)
            leastDislikes = thisScoreData['disCount']

    # build off of those tables
    # fill in with those who are unseated

    return bestChart

def placecardRecursion(partyID, seatingChart, parties, unseated, seatedParties, loves, likes, dislikes, perTable):
    '''Seat id. For each person id dislikes, seat them using the recursive method.'''
    if partyID in unseated:
        # if the party is a respondent, use the response party function
        if isRespondent(partyID, loves, likes, dislikes):
            (table, friends) = seatResponseParty(partyID, seatingChart, seatedParties, unseated, parties, loves, likes, dislikes, perTable)
            if len(friends) > 1:
                friends = friends[:(len(friends)//2)]
            (seatingChart, unseated, seatedParties) = seatingHelper(table, partyID, friends, seatingChart, unseated, seatedParties)
        # otherwise use the no response party function
        else:
            (table, friends) = seatNoResponseParty(partyID, seatingChart, unseated, parties, loves, likes, dislikes, perTable)
            (seatingChart, unseated, seatedParties) = seatingHelper(table, partyID, friends, seatingChart, unseated, seatedParties)
    # for each person they dislike, seat that person using this recursive method 
    # and update the seating chart accordingly
    for x in dislikes[partyID]:
        if x in unseated:
            (unseated, seatingChart) = placecardRecursion(x, seatingChart, parties, unseated, seatedParties, loves, likes, dislikes, perTable)
    return (unseated, seatingChart)

def recursionCaller(origChart, parties, seatedParties, loves, likes, dislikes, perTable):
    '''Calls the recursion method with a random party to start off'''
    (seatingChart, unseated, seatedParties) = refreshVariables(origChart)
    unseated.sort(key=lambda k: len(dislikes[k]), reverse=True)
    while unseated != []:
        (unseated, seatingChart) = placecardRecursion(unseated[0], seatingChart, parties, unseated, seatedParties, loves, likes, dislikes, perTable)
    return seatingChart

def placecardSlowGroupingAlgorithm(origChart, allGroups, parties, loves, likes, dislikes, perTable, spaces=0):
    '''Hopefully the final attempt at solving the seating chart problem.'''
    (seatingChart, unseated, seatedParties) = refreshVariables(origChart)
    idGroups = copy.deepcopy(allGroups)
    # start by seating groups of 'perTable' people
    while True:
        bestTable = []
        for x in idGroups:
            groups = idGroups[x]
            for g in groups:
                # remove the people in seatedParties from all groups
                tmpG = list(g)
                for p in tmpG:
                    if p in seatedParties:
                        g.remove(p)
            if idGroups[x].count(g) >= 2: 
                while g in idGroups[x]:
                    # make sure there are not repeat groups
                    idGroups[x].remove(g)
                    if idGroups[x].count(g) == 1:
                        break
            # find the group with perTable people that has the
            # 1. people that affect the least number of total groups if spaces = 0
            # 2. greatest score if spaces > 0
            perTableGroups = list(filter(lambda k: len(k)==perTable or (len(k) < perTable and len(k) > perTable-spaces), groups))
            if len(perTableGroups) > 0:
                bestTable = []
                if spaces == 0:
                    bestSum = -1
                    for x in perTableGroups:
                        thisSum = 0
                        for person in x:
                            thisSum += len(idGroups[person])
                        if thisSum < bestSum or bestSum == -1:
                            bestSum = thisSum
                            bestTable = x
                else:
                    bestScore = -1
                    for x in perTableGroups:
                        thisScore = scoreTable(x, parties, loves, likes, dislikes)['score']
                        if thisScore < bestScore or bestScore == -1:
                            bestScore = thisScore
                            bestTable = x
        if bestTable == []:
            biggest = bestTable
            size = 0
            # find the next biggest group
            for x in idGroups:
                groups = idGroups[x]
                for g in groups:
                    if len(g) > size:
                        biggest = g
                        size = len(g)
                # take up to perTable people who have the least committment to other groups
                biggest.sort(key = lambda k: len(idGroups[k]))
                bestTable = biggest[:perTable]
        if bestTable == []:
            break

        # try to find a table for the group
        tableFound = False
        for tableName in seatingChart:
            table = seatingChart[tableName]
            if len(table) == 0:
                seatingChart[tableName] = list(bestTable)
                tableFound = True
                # for each person in the group, remove their lists and
                # add them to seatedParties
                for i in bestTable:
                    seatedParties[i] = tableName
                    unseated.remove(i)
                    idGroups[i] = []
                break
        if tableFound == False:
            # no empty tables left. break out of the loop
            break
    
    # seat the rest of the people!
    tmpUnseated = list(unseated)
    random.shuffle(tmpUnseated)
    for x in tmpUnseated:
        # use seatNoResponse because we don't want to steal friends
        (table, friends) = seatNoResponseParty(x, seatingChart, unseated, parties, loves, likes, dislikes, perTable)
        (seatingChart, unseated, seatedParties) = seatingHelper(table, x, friends, seatingChart, unseated, seatedParties)
    start = time.time()
    groupsChanged = []
    while True:
        # swap people around until there's no one else to swap or the tables are all good sizes
        (seatingChart, changed, group) = refineChart(seatingChart, parties, seatedParties, dislikes, perTable)
        groupsChanged.append(group)
        if not changed or group in groupsChanged:
            break
    return seatingChart


def refineChart(seatingChart, parties, seatedParties, dislikes, perTable):
    '''Swaps some people around in the chart to try to even out the table sizes'''
    changed = False
    group = []
    # first, find the minimum size the table should be
    numPeople = len(parties)
    numTables = len(seatingChart)
    # if the tables are already forced even, just return, no swapping.
    if numPeople/numTables == perTable:
        return (seatingChart, changed, group)
    minSize = numPeople//numTables
    for tableName in seatingChart:
        table = seatingChart[tableName]
        # find too-small tables
        if len(table) < minSize:
            # first, find all people who could fit at the table
            couldFit = []
            for x in parties:
                if x not in table:
                    broken = False
                    for p in table:
                        if x in dislikes[p] or p in dislikes[x]:
                            broken = True
                            break
                    if not broken:
                        couldFit.append(x)
            # find the people who are unhappy at this table
            unhappy = {}
            mutualDislikes = []
            for p1 in table:
                for p2 in table:
                    if p1 in dislikes[p2] and p2 in dislikes[p1]:
                        mutualDislikes.append((p1, p2))
                    if p1 in dislikes[p2]:
                        if p1 in unhappy:
                            unhappy[p1] += 1
                        else:
                            unhappy[p1] = 1                    
                    if p2 in dislikes[p2]:
                        if p2 in unhappy:
                            unhappy[p2] += 1
                        else:
                            unhappy[p2] = 1       
            # sort by the most unhappy people
            mostUnhappy = list(unhappy.keys())
            mostUnhappy.sort(key=lambda k: unhappy[k], reverse=True)        
            if couldFit != []:
                # see if we can swap out any unhappy people 
                swapPairs = {}
                for x in couldFit:
                    swapPairs[x] = []
                    for y in mostUnhappy:
                        # get the table where this individual that's moving currently resides
                        table = seatingChart[seatedParties[x]]
                        # see if anyone in the unhappy table can move there
                        broken = False
                        count = 0
                        for t in table:
                            if t in dislikes[y]:
                                count += 1
                            if count >= unhappy[y] or y in dislikes[t]:
                                broken = True
                                break
                        if not broken:
                            swapPairs[x].append(y)
                # clean swapPairs to see if there's anyone with more than one who can be swapped
                popular = []
                for pair in swapPairs:
                    if len(swapPairs[pair]) > 1:
                        popular.append(pair)
                # TODO: add case where popular != []
                # swap people!
                if popular == []:
                    for pair in swapPairs:
                        toSwap = swapPairs[pair]
                        if len(toSwap) > 0:
                            toSwap = toSwap[0]
                            table1 = seatedParties[pair]
                            table2 = seatedParties[toSwap]
                            seatingChart[table2].append(pair)
                            seatingChart[table1].remove(pair)
                            seatingChart[table1].append(toSwap)
                            seatingChart[table2].remove(toSwap)
                            seatedParties[pair] = table2
                            seatedParties[toSwap] = table1
                            couldFit.remove(pair)
                            group.append([toSwap, pair])
                            changed = True
                # then just add the rest where they best fit
                for x in couldFit:
                    if len(seatingChart[tableName]) == minSize:
                        break
                    seatingChart[tableName].append(x)
                    seatingChart[seatedParties[x]].remove(x)
                    seatedParties[x] = tableName
                    changed = True
                    group.append(x)
    return (seatingChart, changed, group)


if __name__ == '__main__':
    for _ in range(1):
        data = prepData('SCS.csv')
        parties = data['parties']
        loves = data['superLikes']
        likes = data['likes']
        dislikes = data['dislikes']
        tableNames = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8', 'Table 9', 'Table 10', 'Table 11']
        perTable = 10
        seatingChart = seatParties({}, parties, loves, likes, dislikes, tableNames, perTable)
        people = []
        for x in seatingChart:
            for y in seatingChart[x]:
                people.append(y)
        print(json.dumps(seatingChart, indent = 4))
        print(scoreChart(seatingChart, parties, loves, likes, dislikes))
    # for x in seatingChart:
    #     print(x)
    #     print(json.dumps(scoreTable(seatingChart[x], parties, loves, likes, dislikes), indent=4))


# TODO: 
# even out tables at the end of placecardSecondary and see if swapping can be achieved
# maybe one more algorithm that takes the problem people found in bestChart and
# seats the groups that have the most of them first?
# make sure that reaaaally big parties get split up! - in front end!!!