import random
import csv
import time
import json

file = open('SCS3.csv')
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
    partyDict[x] = 1
    likesDict[x] = []
    superLikesDict[x] = []
    dislikesDict[x] = []


for line in csvReader:
    party = line[0]
    for x in range(1, len(line)):
        if line[x] == 'Yes' and party != header[x]:
            if header[x][0] != '2':
                likesDict[party].append(header[x])
            else:
                # add the person to the superLikes dict
                superLikesDict[party].append(header[x][1:])
        if line[x] == 'No' and party != header[x]:
            dislikesDict[party].append(header[x])
'''
    Author: Kaitlyn Sharo
    Date: 11/11/2021
'''

##parties = {'a':3, 'b':1, 'c':2, 'd':4, 'z':1}
##likes = {'a':['b','c','d'], 'b':['c','d'], 'c':['z','a'], 'd': [], 'z':['a','b','c']}
##dislikes = {'a':['z'], 'b':['a'], 'c':[], 'd':[], 'z':[]}
##parties = {'a': 3, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 4, 'g':2}
##likes = {'a': ['g', 'd', 'f'], 'b': ['g'], 'c': ['e', 'b'], 'd': ['e', 'c', 'f', 'b', 'g'], 'e': ['c', 'd'], 'f':['e', 'd', 'b'], 'g':[]}
##dislikes = {'a': ['c', 'b'], 'b': ['e', 'c', 'a', 'd'], 'c': ['g', 'a', 'd', 'f'], 'd': ['a'], 'e': ['g'], 'f': ['g', 'c', 'a'], 'g':[]}

# parties = {'a': 2, 'b': 1, 'c': 2, 'd': 3, 'e': 2, 'f': 2, 'g': 5, 'h': 2, 'i': 2, 'j': 4, 'k': 3, 'l': 3, 'm': 3, 'n': 5, 'o': 2, 'p': 1, 'q': 2}
# likes = {'a': ['f', 'k', 'g', 'c', 'm'], 'b': ['q', 'm', 'k', 'd'], 'c': ['q', 'f'], 'd': ['k', 'b', 'h', 'e', 'n'], 'e': ['g', 'i', 'j', 'c'], 'f': ['g', 'e', 'm', 'h'], 'g': ['e'], 'h': ['f', 'e', 'o', 'd', 'i'], 'i': ['a', 'k', 'b', 'j', 'd'], 'j': ['f', 'g', 'e', 'l', 'd'], 'k': ['f', 'b', 'g', 'e', 'd'], 'l': ['g', 'e'], 'm': ['a', 'k', 'h'], 'n': ['d', 'f', 'j'], 'o': ['n'], 'p': ['k', 'g', 'h', 'd', 'i'], 'q':['k','c','d']}
# dislikes = {'a': ['o'], 'b': ['a', 'j', 'n', 'h'], 'c': ['d', 'o'], 'd': ['p', 'c'], 'e': ['f', 'a', 'h'], 'f': ['q', 'o', 'i', 'b'], 'g': ['j'], 'h': ['g', 'j'], 'i': ['g', 'e', 'h'], 'j': ['p', 'o', 'n', 'm', 'i'], 'k': ['q', 'a', 'c', 'h'], 'l': ['p', 'h'], 'm': ['q', 'n'], 'n': ['b', 'c'], 'o': ['m', 'i', 'j'], 'p': ['q', 'l', 'c', 'b'], 'q':['a']}

parties = partyDict
likes = likesDict
dislikes = dislikesDict
superLikes = superLikesDict

tableNames = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8', 'Table 9', 'Table 10']


def generateChart3(parties, superLikes, likes, dislikes, perTable, tableNames):
    '''A third iteration of the seating chart. yay'''
    seatedParties = {}
    seatingChart = {}
    badNames = [] # list of individuals who could not be sat happily in the previous iteration
    for x in tableNames:
        seatingChart[x] = []

    # for each party name, go through all the parties and see if they are liked by them. Create a new dictionary like this.
    likedBy = mutualDicts(likes)

    # do the same for superLikes
    lovedBy = mutualDicts(superLikes)

    # and dislikes
    dislikedBy = mutualDicts(dislikes)

    # randomize the parties
    partyNames = list(parties.keys())
    # random.shuffle(partyNames)
    leastLoves = sorted(partyNames, key = lambda k: len(superLikes[k]), reverse = False)
    noResponse = []
    sortedParties = []
    for x in leastLoves:
        if len(superLikes[x]) + len(likes[x]) + len(dislikes[x]) == 0:
            noResponse.append(x)
        else:
            sortedParties.append(x)
    for x in noResponse:
        sortedParties.append(x)

    for x in sortedParties:
        # find all people loved/liked who have not been seated yet
        people = []
        # mutual loves are most important
        for p in superLikes[x]:
            if p not in seatedParties and p not in people:
                if x in superLikes[p]:
                    people.append(p)
        # mutual likes are next important
        for p in likes[x]:
            if p not in seatedParties and p not in people:
                if x in likes[p]:
                    people.append(p)
        for p in superLikes[x]:
            if p not in seatedParties and p not in people:
                # add people who didn't answer
                if len(likes[p]) + len(superLikes[p]) + len(dislikes[p]) == 0:
                    people.append(p)
        for p in likes[x]:
            if p not in seatedParties and p not in people:
                # add people who didn't answer
                if len(likes[p]) + len(superLikes[p]) + len(dislikes[p]) == 0:
                    people.append(p)
        # look for the best table for party x
        # try to seat this individual with those who like them
        possibleTables = {} # keeps track of table name and number of loved/liked/disliked people in each table option
        badTables = {} # this table has dislikes
        emptyTables = [] # this table is empty
        unfitTables = [] # party does not fit at this table
        for t in tableNames:
            if t not in possibleTables:
                # if the table is already there, ignore, otherwise count
                if len(seatingChart[t]) == 0:
                    emptyTables.append(t)
                else:
                    groupToCheck = []
                    for k in seatingChart[t]:
                        groupToCheck.append(k)
                    for p in people:
                        if fineTable(groupToCheck, p, parties, dislikes, perTable) and len(seatingChart[t]) < perTable - 1:
                            groupToCheck.append(p)
                    count = countTable(groupToCheck, x, lovedBy, likedBy, dislikes, parties, perTable)
                    if count[2] > 0:
                        # somebody dislikes them at this table! Bad table!!
                        badTables[t] = count
                    elif count[0] == -1:
                        # ignore this table! can't fit the party!
                        unfitTables.append(t)
                    else:
                        possibleTables[t] = count
        
        # look through possible tables to see what is best
        bestTable = (-1, '')
        if len(possibleTables) == 0:
            if len(emptyTables) == 0:
                print('No good table found! Skipping... (' + x + ")")
                badNames.append(x)
                bestTable = 'invalid'
            else:
                # empty table is found, sit x here
                seatingChart[emptyTables[0]].append(x)
                seatedParties[x] = emptyTables[0]
                bestTable = 'empty'
        else:
            # calculate the best table
            for pT in possibleTables:
                # weight based on loves/likes
                count = possibleTables[pT][0]*2 + possibleTables[pT][1]
                if count > bestTable[0]:
                    bestTable = (count, pT)
            # see if there are any empty tables that would be better
            if len(emptyTables) > 0:
                count = countTable(people[:(perTable-1)], x, lovedBy, likedBy, dislikes, parties, perTable)
                print('empty count: ' + str(count))
                print('best count: ' + str(bestTable[0]))
                if (count[0]*2 + count[1]) > bestTable[0]:
                    bestTable = 'empty'
                    if x not in seatedParties:
                        seatingChart[emptyTables[0]].append(x)
                        seatedParties[x] = emptyTables[0]

        if bestTable == 'empty':
            # add people who love/like x mutually
            table = emptyTables[0]
            for y in lovedBy[x]:
                if y[0] == '*':
                    if y[1:] not in seatedParties:
                        # make sure nobody dislikes party y too much
                        if fineTable(seatingChart[table], y[1:], parties, dislikes, perTable):
                            # TODO: add sizes of parties and checks to make sure they fit
                            seatedParties[y[1:]] = table
                            seatingChart[table].append(y[1:])
            for y in likedBy[x]:
                if y[0] == '*':
                    if y[1:] not in seatedParties:
                        # make sure nobody dislikes party y too much
                        if fineTable(seatingChart[table], y[1:], parties, dislikes, perTable):
                            # TODO: add sizes of parties and checks to make sure they fit
                            seatedParties[y[1:]] = table
                            seatingChart[table].append(y[1:])
            # add people who x loves/likes but didn't respond
            for y in superLikes[x]:
                if y not in seatedParties and len(likes[y]) + len(dislikes[y]) + len(superLikes[y]) == 0:
                    # make sure nobody dislikes party y too much
                    if fineTable(seatingChart[table], y, parties, dislikes, perTable):
                        # TODO: add sizes of parties and checks to make sure they fit
                        seatedParties[y] = table
                        seatingChart[table].append(y)
            for y in likes[x]:
                if y not in seatedParties and len(likes[y]) + len(dislikes[y]) + len(superLikes[y]) == 0:
                    # make sure nobody dislikes party y too much
                    if fineTable(seatingChart[table], y, parties, dislikes, perTable):
                        # TODO: add sizes of parties and checks to make sure they fit
                        seatedParties[y] = table
                        seatingChart[table].append(y)          
        elif bestTable == 'invalid':
            print('Uh oh...')
        else:
            # seat the party at the best table found for them
            if x not in seatedParties:
                seatingChart[bestTable[1]].append(x)
                seatedParties[x] = bestTable[1]  
                for y in lovedBy[x]:
                    if y[0] == '*':
                        if y[1:] not in seatedParties:
                            # make sure nobody dislikes party y too much
                            if fineTable(seatingChart[table], y[1:], parties, dislikes, perTable):
                                # TODO: add sizes of parties and checks to make sure they fit
                                seatedParties[y[1:]] = table
                                seatingChart[table].append(y[1:])
                # for y in likedBy[x]:
                #     if y[0] == '*':
                #         if y[1:] not in seatedParties:
                #             # make sure nobody dislikes party y too much
                #             if fineTable(seatingChart[table], y[1:], parties, dislikes, perTable):
                #                 # TODO: add sizes of parties and checks to make sure they fit
                #                 seatedParties[y[1:]] = table
                #                 seatingChart[table].append(y[1:])
                # add people who x loves/likes but didn't respond
                for y in superLikes[x]:
                    if y not in seatedParties and len(likes[y]) + len(dislikes[y]) + len(superLikes[y]) == 0:
                        # make sure nobody dislikes party y too much
                        if fineTable(seatingChart[table], y, parties, dislikes, perTable):
                            # TODO: add sizes of parties and checks to make sure they fit
                            seatedParties[y] = table
                            seatingChart[table].append(y)
                # for y in likes[x]:
                #     if y not in seatedParties and len(likes[y]) + len(dislikes[y]) + len(superLikes[y]) == 0:
                #         # make sure nobody dislikes party y too much
                #         if fineTable(seatingChart[table], y, parties, dislikes, perTable):
                #             # TODO: add sizes of parties and checks to make sure they fit
                #             seatedParties[y] = table
                #             seatingChart[table].append(y) 

    # leastLoves = sorted(partyNames, key = lambda k: len(loves[k]), reverse = False)
    # for x in leastLoves:
    #     # only pay attention if they love at least 1 person
    #     if len(loves[x]) > 0:
    #         for t in tableNames:
    #             if seatingChart[t] == []:
    #                 if x not in seatedParties:
    #                     seatingChart[t].append(x)
    #                     seatedParties[x] = t
    #                 for y in loves[x]:
    #                     if y not in seatedParties:
    #                         seatingChart[t].append(y)
    #                         seatedParties[y] = t
    #                 break
    return seatingChart


def generateChart2(parties, superLikes, likes, dislikes, perTable, tableNames):
    '''Some new ideas on how to generate the seating chart'''
    seatedParties = {}
    badNames = []
    bestBad = []
    bestChart = {}
    seatingChart = {}
    # for _ in range(2):
    i = 0
    highest = 0
    start = time.time()
    while len(seatedParties) != len(parties):
        print("New round!")
        if len(seatedParties) > highest:
            highest = max(highest, len(seatedParties))
            print("New highest found!")
            print("HIGHEST: " + str(highest))
            bestChart = seatingChart
            numNames = len(parties) - highest
            bestBad = badNames[(len(badNames) - numNames):]
            print(bestBad)
            input('ready?')
    
        # run for 10 seconds
        if time.time() - start > 10:

            # # bests = []
            # for x in bestBad:
            #     bestT = 'empty'
            #     leastDislikes = 100000000000
            #     for t in tableNames:
            #         (like, love, dislike) = countTable(bestChart[t], x, lovedBy, likedBy, dislikes, parties, perTable)
            #         if dislike < leastDislikes and dislike != -1 and tableFits(bestChart[t], x, parties, perTable):
            #             leastDislikes = dislike
            #             bestT = t
            #     for guest in bestChart[table]:
            #         if guest in dislikes[x] or x in dislikes[guest]:
            #             # move guest!
            #             for t2 in tableNames:
            #                 c = countTable(bestChart[t2], guest, lovedBy, likedBy, dislikes, parties, perTable)
            #                 if c[2] == 0 and tableFits(bestChart[t2], x, parties, perTable):
            #                     print('yay!')
            #                     newTable = []
            #                     for y in bestChart[t2]:
            #                         if y != guest:
            #                             newTable.append(y)
            #                     newTable.append(x)
            #                     bestChart[bestT] = newTable
            #                     bestChart[t2].append(guest)
            #                     break
                        
                        
                # bests.append(x, bestT, leastDislikes)
            break

        i += 1
        # initialize the seating chart with each table name pointing to
        # an empty list that will eventually be filled with the people sitting
        # at that table
        seatingChart = {}
        for x in tableNames:
            seatingChart[x] = []

        # for each party name, go through all the parties and see if they are liked by them. Create a new dictionary like this.
        likedBy = mutualDicts(likes)

        # do the same for superLikes
        lovedBy = mutualDicts(superLikes)

        # and dislikes
        dislikedBy = mutualDicts(dislikes)

        # keep track of parties that are already seated
        seatedParties = {}

        # find those who are disliked by the greatest amount of people
        partyNames = list(dislikedBy.keys())
        mostDisliked = sorted(partyNames, key = lambda k: len(dislikedBy[k]), reverse = True)

        for name in badNames:
            ind = mostDisliked.index(name)
            mostDisliked = [name] + mostDisliked[0:ind] + mostDisliked[ind+1:]
        # reset the bad names every other time
        if i % 2 == 0:
            badNames = []

        # start by seating those who are disliked the most
        for x in mostDisliked:
            if x not in seatedParties:
                # randomize the order in which the tables will be checked
                random.shuffle(tableNames)
                # try to seat this individual with those who like them
                possibleTables = {} # keeps track of table name and number of loved/liked/disliked people in each table option
                badTables = {}
                emptyTables = []
                unfitTables = []
                for t in tableNames:
                    if t not in possibleTables:
                        # if the table is already there, ignore, otherwise count
                        if len(seatingChart[t]) == 0:
                            emptyTables.append(t)
                        else:
                            count = countTable(seatingChart[t], x, lovedBy, likedBy, dislikes, parties, perTable)
                            if count[2] > 0:
                                badTables[t] = count
                            elif count[0] == -1:
                                # ignore this table! can't fit the party!
                                unfitTables.append(t)
                            else:
                                possibleTables[t] = count
                # look through possible tables to see what is best
                bestTable = (-1, '')
                if len(possibleTables) == 0:
                    if len(emptyTables) == 0:
                        print('No good table found! Skipping... (' + x + ")")
                        badNames.append(x)
                        bestTable = 'invalid'
                    else:
                        # empty table is found, sit x here
                        seatingChart[emptyTables[0]].append(x)
                        seatedParties[x] = emptyTables[0]
                        bestTable = 'empty'
                else:
                    # calculate the best table
                    for pT in possibleTables:
                        # weight based on loves/likes
                        count = possibleTables[pT][0]*2 + possibleTables[pT][1]
                        if count > bestTable[0]:
                            bestTable = (count, pT)
                    # see if there are any empty tables that would be better
                    if len(emptyTables) > 0:
                        # find all people loved/liked who have not been seated yet
                        # people = []
                        # for p in lovedBy[x]:
                        #     if p not in seatedParties and p not in people:
                        #         people.append(p)
                        # for p in likedBy[x]:
                        #     if p not in seatedParties and p not in people:
                        #         people.append(p)
                        # for p in superLikes[x]:
                        #     if p not in seatedParties and p not in people:
                        #         people.append(p)
                        # for p in likes[x]:
                        #     if p not in seatedParties and p not in people:
                        #         people.append(p)
                        # count = countTable(people, x, lovedBy, likedBy, dislikes, parties, perTable)
                        # find all people loved/liked who have not been seated yet
                        people = []
                        # mutual loves are most important
                        for p in superLikes[x]:
                            if p not in seatedParties and p not in people:
                                if x in superLikes[p]:
                                    people.append(p)
                        # mutual likes are next important
                        for p in likes[x]:
                            if p not in seatedParties and p not in people:
                                if x in likes[p]:
                                    people.append(p)
                        if len(people) < perTable - 1:
                            for p in superLikes[x]:
                                # add people who didn't answer
                                if len(likes[p]) + len(superLikes[p]) + len(dislikes[p]) == 0:
                                    people.append(p)
                        if len(people) < perTable - 1:
                            for p in likes[x]:
                                # add people who didn't answer
                                if len(likes[p]) + len(superLikes[p]) + len(dislikes[p]) == 0:
                                    people.append(p)
                        count = countTable(people[:(perTable-1)], x, lovedBy, likedBy, dislikes, parties, perTable)
                        if (count[0]*2 + count[1]) > bestTable[0]:
                            bestTable = 'empty'
                            seatingChart[emptyTables[0]].append(x)
                            seatedParties[x] = emptyTables[0]
                            # if not happinessPossible(seatingChart, tableNames, parties, dislikes, perTable):
                            #     print("After seating " + x + ", it is no longer possible for everyone to be seated happily")

                if bestTable == 'empty':
                    # add people who love/like x mutually
                    table = emptyTables[0]
                    for y in lovedBy[x]:
                        if y[0] == '*':
                            if y[1:] not in seatedParties:
                                # make sure nobody dislikes party y too much
                                if fineTable(seatingChart[table], y[1:], parties, dislikes, perTable):
                                    # TODO: add sizes of parties and checks to make sure they fit
                                    seatedParties[y[1:]] = table
                                    seatingChart[table].append(y[1:])
                                    # if not happinessPossible(seatingChart, tableNames, parties, dislikes, perTable):
                                    #     print("After seating " + x + ", it is no longer possible for everyone to be seated happily")
                    # TODO: refactor!!! to get rid of copy/paste code
                    for y in likedBy[x]:
                        if y[0] == '*':
                            if y[1:] not in seatedParties:
                                # make sure nobody dislikes party y too much
                                if fineTable(seatingChart[table], y[1:], parties, dislikes, perTable):
                                    # TODO: add sizes of parties and checks to make sure they fit
                                    seatedParties[y[1:]] = table
                                    seatingChart[table].append(y[1:])
                                    # if not happinessPossible(seatingChart, tableNames, parties, dislikes, perTable):
                                    #     print("After seating " + x + ", it is no longer possible for everyone to be seated happily")
                    
                elif bestTable == 'invalid':
                    print('Uh oh...')
                else:
                    # seat the party at the best table found for them
                    seatingChart[bestTable[1]].append(x)
                    seatedParties[x] = bestTable[1]  
                    # if not happinessPossible(seatingChart, tableNames, parties, dislikes, perTable):
                    #     print("After seating " + x + ", it is no longer possible for everyone to be seated happily")

                # if len(dislikes[x]) > 0:
                #     # first, place x at a table, see if there are any good ones, then only fine
                #     if x not in seatedParties:
                #         (seatingChart, t) = seatParty(x, parties, likes, dislikes, tableNames, perTable, seatingChart)  
                #         seatedParties[x] = t
                #     # seat the disliked party
                #     for y in dislikes[x]:
                #         if y not in seatedParties:
                #             (seatingChart, t) = seatParty(y, parties, likes, dislikes, tableNames, perTable, seatingChart)  
                #             seatedParties[y] = t

        # sort by those who are liked by the least amount of people
        partyNames = list(likedBy.keys())
        leastLiked = sorted(partyNames, key = lambda k: len(likedBy[k]), reverse = False)



        # for the first least liked people, seat them at tables one by one
        # once you run out of tables, see if any can be combined
        # continue

        # t = 0
        # for partyA in leastLiked:
        #     if t == len(tableNames):
        #         break
        #     if partyA not in seatedParties:
        #         for partyB in likedBy[partyA]:
        #             if partyB[0] == '*':
        #                 if partyB[1:] not in seatedParties:
        #                     # if it's a mutual like, add to table
        #                     if partyA not in seatedParties:
        #                         for _ in range(0, parties[partyA]):
        #                             seatingChart[tableNames[t]].append(partyA)
        #                         seatedParties[partyA] = tableNames[t]
        #                     for _ in range(0, parties[partyB[1:]]):
        #                         seatingChart[tableNames[t]].append(partyB[1:])
        #                     seatedParties[partyB[1:]] = tableNames[t]
        #     t += 1

    if bestChart == {}:
        return seatingChart
    return bestChart

def happinessPossible(seatingChart, tableNames, parties, dislikes, perTable):
    '''check with the current seatings if we can find a place where people
        will not be unhappy'''
    for partyID in parties:
        good = False
        for table in tableNames:
            if fineTable(seatingChart[table], partyID, parties, dislikes, perTable):
                good = True
                break
        if not good:
            return False
    return True

def countTable(group, partyID, lovedBy, likedBy, dislikes, parties, perTable):
    '''Counts the number of people who like/love an individual within a group of people,
        and those who dislike them.
        3 points for a mutual like/love, two points for partyID liking/loving them,
        1 point for them liking/loving partyID.
        3 points for mutual dislike, 2 for partyID disliking others, 1 for others
        disliking partyID'''
    liked = 0
    loved = 0
    disliked = 0
    if not tableFits(group, partyID, parties, perTable):
        return (-1, -1, -1)
    else:
        for x in group:
            if x[0] == '*':
                x = x[1:]
            if '*'+x in lovedBy[partyID]:
                loved += 3
            elif x in lovedBy[partyID]:
                loved += 1
            elif partyID in lovedBy[x]:
                loved += 2
            elif '*'+x in likedBy[partyID]:
                liked += 3
            elif x in likedBy[partyID]:
                liked += 1
            elif partyID in likedBy[x]:
                liked+= 2
            elif x in dislikes[partyID] and partyID in dislikes[x]:
                disliked += 3
            elif x in dislikes[partyID]:
                disliked += 2
            elif partyID in dislikes[x]:
                disliked += 1
    return (loved, liked, disliked)

def mutualDicts(likes):
    '''Finds parties who are mutually in the same dictionary (likes) 
        and returns a new dictionary of those who are mutually liked
        by others.'''
    # start by initializing the new dict
    likedBy = {}
    for x in parties:
        likedBy[x] = []
    
    # start filling the dict
    for partyA in parties:
        for likedParty in likes[partyA]:
            # don't include if one dislikes the other
            if partyA not in dislikes[likedParty]:
                # keep track of mutual likes early on
                if partyA in likes[likedParty]:
                    likedBy[likedParty].append("*" + partyA)
                else:
                    # add normal likes with no *
                    likedBy[likedParty].append(partyA)
    return likedBy


def generateChart(parties, likes, dislikes, perTable, tableNames):
    ''' Generates the seating chart based on the given information '''
    # initialize the seating chart with each table name pointing to
    # an empty list that will eventually be filled with the people sitting
    # at that table
    seatingChart = {}
    for x in tableNames:
        seatingChart[x] = []

    # keep track of parties that are already seated
    seatedParties = {}

    # get the people who like the fewest people first and try to seat them together 
    #partyList = list(parties.keys())
    #partyList = sorted(partyList, key = lambda k: len(likes[k]), reverse = False) ## take away dislikes portion, avg violations: 64

    # ## # randomize the order of the parties that are going to be investigated
    # order the parties to be investigated by how many people they dislike
    partyList = list(parties.keys()) ## ignore all sorting and randomization, take away dislikes portion, avg violations: 32-33. With dislikes, avg v: 34-35
    # partyList = sorted(partyList, key=lambda k: len(dislikes[k]), reverse=True) ## avg violations: 34-35
    # random.shuffle(partyList) ## avg violations: 33-35

    # make sure those who dislike each other are separated    
    for x in dislikes:
        # randomize the order in which the tables will be checked
        random.shuffle(tableNames)
        if len(dislikes[x]) > 0:
            # first, place x at a table, see if there are any good ones, then only fine
            if x not in seatedParties:
                (seatingChart, t) = seatParty(x, parties, likes, dislikes, tableNames, perTable, seatingChart)  
                seatedParties[x] = t
            # seat the disliked party
            for y in dislikes[x]:
                if y not in seatedParties:
                    (seatingChart, t) = seatParty(y, parties, likes, dislikes, tableNames, perTable, seatingChart)  
                    seatedParties[y] = t

    # now that we've sat those who dislike each other at different tables, make people happy!
    for partyID in partyList:
        if partyID not in seatedParties:
            # seat the party!
            random.shuffle(tableNames)
            (seatingChart, t)= seatParty(partyID, parties, likes, dislikes, tableNames, perTable, seatingChart)  
            seatedParties[partyID] = t
            # find people who want to sit with the party mutually!
            for x in likes[partyID]:
                if x not in seatedParties:
                    if partyID in likes[x]:
                        if tableFits(seatingChart[t], x, parties, perTable):
                            # good match! let's seat this party :)
                            for _ in range(0, parties[x]):
                                seatingChart[t].append(x)
                            seatedParties[x] = t

    # return the created seating chart
    return seatingChart

#### REFACTOR SO NOT AS MUCH REPEATED CODE
def seatParty(partyID, parties, likes, dislikes, tableNames, perTable, seatingChart):
    ''' returns an updated seating chart with the party inside '''
    found = False
    table = ''
    # look for a perfect table
    for t in tableNames:
        if perfectTable(seatingChart[t], partyID, parties, dislikes, likes, perTable):
            # found one! sit the party here, accounting for size
            for _ in range(0, parties[partyID]):
                seatingChart[t].append(partyID)
            found = True
            table = t
            break
    # look for a good table
    if not found:
        for t in tableNames:
            if goodTable(seatingChart[t], partyID, parties, dislikes, likes, perTable):
                # found one! sit the party here, accounting for size
                for _ in range(0, parties[partyID]):
                    seatingChart[t].append(partyID)
                found = True
                table = t
                break
    # good table not found, look for a 'fine' one
    if not found:
        for t in tableNames:
            if fineTable(seatingChart[t], partyID, parties, dislikes, perTable):
                # found one! sit the party here, accounting for size
                for _ in range(0, parties[partyID]):
                    seatingChart[t].append(partyID)
                found = True
                table = t
                break
    # no table found, print error and sit at a random table where the party fits
    if not found:
        print("cannot keep all dislikes apart! :(")
        for t in tableNames:
            if tableFits(seatingChart[t], partyID, parties, perTable):
                # found a table that fits: consolation prize
                for _ in range(0, parties[partyID]):
                    seatingChart[t].append(partyID)
                found = True
                table = t
                print(partyID, "sat at table", t)
                for x in seatingChart[t]:
                    if x in dislikes[partyID]:
                        print(partyID, "does not like", x, "at table", t)
                    if partyID in dislikes[x]:
                        print(partyID, "is not liked by", x, "at table", t)
                break

    # add code later for a party who doesn't fit (sizewise) at any table!
    while not found:
        print("ERRORRRRRRRR")
        found = True  

    return (seatingChart, table)

def tableFits(table, partyID, parties, perTable):
    # check if the party can fit at the table
    if len(table) + parties[partyID] > perTable:
        return False
    return True


def fineTable(table, partyID, parties, dislikes, perTable):
    ''' Checks the table to make sure nobody dislikes partyID.
    Returns false if the condition fails, true otherwise '''
    # check that the party can fit at the table
    if not tableFits(table, partyID, parties, perTable):
        return False
    
    # check if anyone at the table dislikes partyID
    for x in table:
        if partyID in dislikes[x] or x in dislikes[partyID]:
            return False

    return True

def goodTable(table, partyID, parties, dislikes, likes, perTable):
    ''' Checks the table to see if there is a one-sided friendship '''
    if fineTable(table, partyID, parties, dislikes, perTable):
        for x in table:
            if partyID in likes[x]:
                return True
    return False

def perfectTable(table, partyID, parties, dislikes, likes, perTable):
    ''' Checks the table to see if there is a mutual friendship '''
    if fineTable(table, partyID, parties, dislikes, perTable):
        for x in table:
            if partyID in likes[x] and x in likes[partyID]:
                return True
    return False


def checkWrongPlacements(seatingChart, superLikes, likes, dislikes):
    ''' Searches through the seating chart to find how many
        tables have disliked individuals at them. Also counts
        the number of likes. '''
    wrongPerTable = {}
    wrong = {}
    right = {}
    total = 0
    sat = 0
    for x in seatingChart:
        wrongPerTable[x] = 0
        for party1 in seatingChart[x]:
            if len(likes[party1]) > 0 or len(superLikes[party1]) > 0:
                right[party1] = 0
            wrong[party1] = 0
            sat += 1
            for party2 in seatingChart[x]:
                if party2 in dislikes[party1]:
                    wrongPerTable[x] += 1
                    wrong[party1] += 1
                    total += 1
                if party2 in likes[party1] or party2 in superLikes[party1]:
                    right[party1] += 1
    return (sat, total, wrongPerTable, wrong, right)

def scoreChart(seatingChart, loves, likes, dislikes, perTable):
    '''Calculates the score of the chart based on who people like/dislike
    at their table.'''
    highestScore = topScore(loves, likes, perTable)
    currScore = 0
    for t in seatingChart:
        table = seatingChart[t]
        for x in table:
            for y in table:
                # if x has responded, calculate the score
                if x != y and ((len(loves[x]) + len(likes[x]) + len(dislikes[x])) != 0):
                    # print(x, y)
                    # # if y has responded, top score is +5
                    # if len(loves[y]) + len(likes[y]) + len(dislikes[y]) != 0:
                    #     topScore += 5
                    # # otherwise, top score is +3
                    # else:
                    #     topScore += 3
                    # mutual love is + 5 points
                    if x in loves[y] and y in loves[x]:
                        # print('love*')
                        currScore += 5
                    # mutual like is + 4 points
                    elif x in likes[y] and y in likes[x]:
                        # print('like*')
                        currScore += 4
                    # mutual dislike is - 5 points
                    elif x in dislikes[y] and y in dislikes[x]:
                        # print('dislike*')
                        currScore -= 5
                    # one-sided love is + 3 points
                    elif y in loves[x]:
                        # print('love')
                        currScore += 3
                    # one-sided like is + 2 points
                    elif y in likes[x]:
                        # print('like')
                        currScore += 2
                    # one-sided dislike is - 3 points
                    elif y in dislikes[x]:
                        # print('dislike')
                        currScore -= 3

    return (highestScore, currScore)

def topScore(loves, likes, perTable):
    '''Calculates the top possible score for the chart'''
    topScore = 0
    for person in loves:
        indScore = 0
        scores = []
        loved = loves[person]
        liked = likes[person]
        # go through the list of all the people they love
        for x in loved:
            # if the person they love has responded, look for a mutual love
            if len(loves[x]) + len(likes[x]) != 0:
                if person in loves[x]:
                    scores.append(5)
                else:
                    # look for mutual like
                    if person in likes[x]:
                        scores.append(4)
                    # no mutual like/love; just add 3 for the love
                    else:
                        scores.append(3)
            # if the person they love has not responded, the top score is +3
            else:
                scores.append(3)
        for x in liked:
            if x not in loved:
                # if the person they like has responded, look for a mutual like
                if len(loves[x]) + len(likes[x]) != 0:
                    if person in likes[x]:
                        scores.append(4)
                    # no mutual like, just + 2 for like
                    else:
                        scores.append(2)
                # if the person they like has not responded, the top score is + 2
                else:
                    scores.append(2)
        sorted(scores).reverse()
        scores = scores[:(perTable-1)]
        for x in scores:
            indScore += x
        topScore += indScore
    return topScore

def topTable(group, loves, likes, perTable):
    '''Calculates the top possible score for the chart'''
    topScore = 0
    for person in group:
        indScore = 0
        scores = []
        loved = loves[person]
        liked = likes[person]
        # go through the list of all the people they love
        for x in loved:
            # if the person they love has responded, look for a mutual love
            if len(loves[x]) + len(likes[x]) != 0:
                if person in loves[x]:
                    scores.append(5)
                else:
                    # look for mutual like
                    if person in likes[x]:
                        scores.append(4)
                    # no mutual like/love; just add 3 for the love
                    else:
                        scores.append(3)
            # if the person they love has not responded, the top score is +3
            else:
                scores.append(3)
        for x in liked:
            if x not in loved:
                # if the person they like has responded, look for a mutual like
                if len(loves[x]) + len(likes[x]) != 0:
                    if person in likes[x]:
                        scores.append(4)
                    # no mutual like, just + 2 for like
                    else:
                        scores.append(2)
                # if the person they like has not responded, the top score is + 2
                else:
                    scores.append(2)
        sorted(scores).reverse()
        scores = scores[:(perTable-1)]
        for x in scores:
            indScore += x
        topScore += indScore
    return topScore

def scoreTable(table, loves, likes, dislikes, perTable):
    '''Calculates the score of the table based on who people like/dislike
    at their table.'''
    highestScore = topTable(table, loves, likes, perTable)
    currScore = 0
    for x in table:
        for y in table:
            # if x has responded, calculate the score
            if x != y and ((len(loves[x]) + len(likes[x]) + len(dislikes[x])) != 0):
                # print(x, y)
                # # if y has responded, top score is +5
                # if len(loves[y]) + len(likes[y]) + len(dislikes[y]) != 0:
                #     topScore += 5
                # # otherwise, top score is +3
                # else:
                #     topScore += 3
                # mutual love is + 5 points
                if x in loves[y] and y in loves[x]:
                    # print('love*')
                    currScore += 5
                # mutual like is + 4 points
                elif x in likes[y] and y in likes[x]:
                    # print('like*')
                    currScore += 4
                # mutual dislike is - 5 points
                elif x in dislikes[y] and y in dislikes[x]:
                    # print('dislike*')
                    currScore -= 5
                # one-sided love is + 3 points
                elif y in loves[x]:
                    # print('love')
                    currScore += 3
                # one-sided like is + 2 points
                elif y in likes[x]:
                    # print('like')
                    currScore += 2
                # one-sided dislike is - 3 points
                elif y in dislikes[x]:
                    # print('dislike')
                    currScore -= 3

    return (highestScore, currScore)

def intermediateStep(seatingChart, loves, likes, dislikes, perTable):
    newChart = {}
    problemPeople = []
    for x in seatingChart:
        newChart[x] = []
        table = seatingChart[x]
        (perfectScore, actualScore) = scoreTable(seatingChart[x], loves, likes, dislikes, perTable)
        print(perfectScore, actualScore)
        if perfectScore == actualScore:
            print(x + " is perfect!")
            newChart[x] = seatingChart[x]
    
    return (newChart, problemPeople)



if __name__ == '__main__':
    # violations = 0
    # for _ in range(0, 100):
    #     seatingChart = generateChart(parties, likes, dislikes, 10, tableNames)
    #     # for x in seatingChart:
    #     #     print(x, seatingChart[x])
    #     (totalSat, totalWrong, wrongPerTable, wrong, right) = checkWrongPlacements(seatingChart, likes, dislikes)
    #     if totalSat != 102:
    #         print("Error! TotalSat:", totalSat)
    #     violations += totalWrong
    # print("Average violations:", violations/100)

    # timesViolated = 0
    # for _ in range(0, 100):
    #     seatingChart = generateChart2(parties, superLikes, likes, dislikes, 10, tableNames)
    #     wrong = checkWrongPlacements(seatingChart, likes, dislikes)[1]
    #     if wrong > 0:
    #         timesViolated += 1
    # print(timesViolated)
    PERTABLE = 10
    seatingChart = generateChart3(parties, superLikes, likes, dislikes, PERTABLE, tableNames)
    print(json.dumps(seatingChart, indent = 4))
    (sat, total, wrongPerTable, wrong, right) = checkWrongPlacements(seatingChart, superLikes, likes, dislikes)
    print(sat, total)
    (best, ours) = scoreChart(seatingChart, superLikes, likes, dislikes, PERTABLE)
    print(best, ours)
    print(ours/best)
    intermediateStep(seatingChart, superLikes, likes, dislikes, PERTABLE)
        # print("Total Sat:", totalSat)
        # print("Total Violations:", totalWrong)
        # for x in wrongPerTable:
        #     print(x, wrongPerTable[x])
        # for x in right:
        #     print(x, ":", right[x], "/", len(likes[x]))
        # print("********************************************************************************************************")
        # for x in wrong:
        #     print(x, ":", wrong[x], "/", len(dislikes[x]))
