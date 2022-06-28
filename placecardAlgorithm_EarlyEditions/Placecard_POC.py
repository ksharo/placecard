import random
import csv
import time
import json
import itertools

file = open('SCS.csv')
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

tableNames = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8', 'Table 9', 'Table 10', 'Table 11']


def generateChart3(parties, superLikes, likes, dislikes, perTable, tableNames, origChart):
    '''A third iteration of the seating chart. yay'''
    seatedParties = {}
    seatingChart = {}
    badNames = [] # list of individuals who could not be sat happily in the previous iteration
    for x in tableNames:
        seatingChart[x] = origChart[x][:]

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


def generateChart4(parties, superLikes, likes, dislikes, perTable, tableNames, origSeat, problemPeople):
    '''Some new ideas on how to generate the seating chart'''
    seatedParties = {}
    badNames = []
    bestBad = []
    bestChart = {}
    seatingChart = origSeat
    for x in seatingChart:
        for y in seatingChart[x]:
            seatedParties[y] = x
    origParties = seatedParties
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
        if i > 25:
        # if time.time() - start > 10:

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
        seatingChart = origSeat

        # for each party name, go through all the parties and see if they are liked by them. Create a new dictionary like this.
        likedBy = mutualDicts(likes)

        # do the same for superLikes
        lovedBy = mutualDicts(superLikes)

        # and dislikes
        dislikedBy = mutualDicts(dislikes)

        # keep track of parties that are already seated
        seatedParties = origParties

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
            if x in problemPeople and x not in seatedParties:
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
                        print(json.dumps(seatingChart, indent = 4))
                        print('seated ' + x + ' at table ' + emptyTables[0])
                        input("continue?")
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
                            print(json.dumps(seatingChart, indent = 4))
                            print('seated ' + x + ' at table ' + emptyTables[0])
                            input("continue?")
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
                                    print(json.dumps(seatingChart, indent = 4))
                                    print('seated ' + y[1:] + ' at table ' + table)
                                    input("continue?")
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
                                    print(json.dumps(seatingChart, indent = 4))
                                    print('seated ' + y[1:] + ' at table ' + table)
                                    input("continue?")
                                    # if not happinessPossible(seatingChart, tableNames, parties, dislikes, perTable):
                                    #     print("After seating " + x + ", it is no longer possible for everyone to be seated happily")
                    
                elif bestTable == 'invalid':
                    print('Uh oh...')
                else:
                    # seat the party at the best table found for them
                    seatingChart[bestTable[1]].append(x)
                    seatedParties[x] = bestTable[1]
                    print(json.dumps(seatingChart, indent = 4))
                    print('seated ' + x + ' at table ' + bestTable[1])
                    input("continue?")
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

def topScoreForGroup(group, loves, likes, perTable):
    '''Calculates the top possible score for the group of people'''
    topScore = 0
    for person in group:
        indScore = 0
        scores = []
        loved1 = loves[person]
        liked1 = likes[person]
        loved = []
        liked = []
        for x in loved1:
            if x in group:
                loved.append(x)
        for x in liked1:
            if x in group:
                liked.append(x)
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

def topPersonScore(person, loves, likes, perTable):
    '''Calculate the maximum score a person can have'''
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
    return indScore

def topTable(group, loves, likes, perTable):
    '''Calculates the top possible score for the chart'''
    topScore = 0
    for person in group:
        topScore += topPersonScore(person, loves, likes, perTable)
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
        # for each table, go through each person and see if they are contributing to someone else's score. if so, keep them there. Otherwise, don't
        if perfectScore * .75 <= actualScore:
            # table is pretty good, just remove problem people
            print(x + " is okay I guess")
            for partyA in table:
                for partyB in table:
                    if partyA != partyB:
                        if partyA in likes[partyB] or partyB in likes[partyA]:
                            if partyB not in newChart[x]:
                                newChart[x].append(partyB)
            for partyA in table:
                if partyA not in newChart[x]:
                    problemPeople.append(partyA)
        else:
            # otherwise, table is too bad. Just recycle
            newChart[x] = []
            for person in table:
                problemPeople.append(person)
    print(problemPeople)
    print(json.dumps(newChart, indent = 4))
    return (newChart, problemPeople)

def getStrongGroups(parties, superLikes):
    '''Find groups of everyone who likes each other. Might make multiple
    groups with a duplicate person because they belong to many friend groups'''
    groups = []
    # look through all of the parties
    for x in parties:
        # for everyone who x loves...
        for y in superLikes[x]:
            # if y also loves x, add to a group!
            if x in superLikes[y]:
                found = False
                if x != y:
                    for z in groups:
                        # add y to x's group if everyone in z loves y
                        if x in z and y not in z:
                            loved = True
                            for i in z:
                                if y not in superLikes[i]:
                                    loved = False
                                    break
                            if loved:
                                z.append(y)
                                found = True
                                break
                        # add x to y's group
                        elif y in z and x not in z:
                            loved = True
                            for i in z:
                                if x not in superLikes[i]:
                                    loved = False
                                    break
                            if loved:
                                z.append(x)
                                found = True
                                break
                        # if they are already both in a group, ignore
                        elif x in z and y in z:
                            found = True
                            break
                    if not found:
                        groups.append([x, y])
    groups.sort(key=len, reverse=True)
    return groups
                    
def getWeakGroups(parties, likes):
    '''Find groups of everyone who likes each other. Might make multiple
    groups with a duplicate person because they belong to many friend groups'''
    groups = []
    # look through all of the parties
    for x in parties:
        # for everyone who x likes...
        for y in likes[x]:
            # if y also likes x, add to a group!
            if x in likes[y]:
                found = False
                if x != y:
                    for z in groups:
                        # add y to x's group if everyone in z likes y
                        if x in z and y not in z:
                            loved = True
                            for i in z:
                                if y not in likes[i]:
                                    loved = False
                                    break
                            if loved:
                                z.append(y)
                                found = True
                                break
                        # add x to y's group
                        elif y in z and x not in z:
                            loved = True
                            for i in z:
                                if x not in likes[i]:
                                    loved = False
                                    break
                            if loved:
                                z.append(x)
                                found = True
                                break
                        # if they are already both in a group, ignore
                        elif x in z and y in z:
                            found = True
                            break
                    if not found:
                        groups.append([x, y])
    groups.sort(key=len, reverse=True)
    return groups


def useGroups(parties, loves, likes, dislikes, perTable, tableNames, strongGroups, weakGroups, origChart):
    '''Use the groups to make a new seating chart.'''
    bestChart = {}
    bestScore = 0
    # origChart = dict(seatingChart1.copy())
    start = time.time()
    while time.time() - start < 15:
        # print(origChart)
        # initialize seatingChart
        seatingChart = {}
        for x in tableNames:
            seatingChart[x] = origChart[x][:]
        # seatingChart = dict(origChart.copy())
        # print(seatingChart)
        # initialize seatedParties
        seatedParties = {}
        for x in seatingChart:
            people = seatingChart[x]
            for p in people:
                seatedParties[p] = x
        random.shuffle(weakGroups)
        # start using the groups to seat people at tables, with the biggest strong groups first
        for sG in (strongGroups + weakGroups):
            group = []
            # go through each person in the group to see if they've already been sat
            for person in sG:
                if person not in list(seatedParties.keys()):
                    group.append(person)     
            # find the best table for this group
            bestTable = findBestTable(group, parties, loves, likes, dislikes, perTable, tableNames, seatingChart)
            if bestTable != 'none':
                # seat each person in the group
                for x in group:
                    seatingChart[bestTable].append(x)
                    seatedParties[x] = bestTable     
        score = scoreChart(seatingChart, loves, likes, dislikes, perTable)[1]
        if score > bestScore:
            bestScore = score
            print(len(list(seatedParties.keys())))
            print(bestScore, topScoreForGroup(list(seatedParties.keys()), loves, likes, perTable))
            bestChart = seatingChart
    return bestChart
        
def findBestTable(group, parties, loves, likes, dislikes, perTable, tableNames, seatingChart):
    '''Returns the table name of the best table for the group'''
    table = 'none'
    bestScore = -1
    # shuffle tableNames to partially randomize seating chart each time
    random.shuffle(tableNames)
    for t in tableNames:
        score = -1
        # make sure the group would fit in the table
        if len(group) + len(seatingChart[t]) <= perTable:
            possibleTable = True
            # make sure nobody dislikes anyone in the group
            for x in group:
                for y in seatingChart[t]:
                    if x in dislikes[y] or y in dislikes[x]:
                        possibleTable = False
                        break
            if possibleTable:
                score = 0
                # calculate the score of this possible table by calculating the 
                # individual score for each person at the table
                for x in group:
                    for y in seatingChart[t]:
                        if x in loves[y] and y in loves[x]:
                            score += 5
                        elif x in likes[y] and y in likes[x]:
                            score += 4
                        elif x in loves[y] or y in loves[x]:
                            score += 3
                        elif x in likes[y] or y in likes[x]:
                            score += 2
                # TODO: Add score for emptiness??
        # if this table is better than the others, update bestTable!
        if score > bestScore:
            bestScore = score
            table = t
    return table

def finalStep(parties, loves, likes, dislikes, perTable, tableNames, strongGroups, weakGroups, origChart):
    '''Seat the rest of the people'''
    seatingChart = {}
    for x in tableNames:
        seatingChart[x] = origChart[x][:]
    # seatingChart = dict(origChart.copy())
    # print(seatingChart)
    # initialize seatedParties
    seatedParties = {}
    for x in seatingChart:
        people = seatingChart[x]
        for p in people:
            seatedParties[p] = x
    leftover = []
    for x in parties:
        if x not in list(seatedParties.keys()):
            leftover.append(x)
    for x in leftover:
        table = findBestTable([x], parties, loves, likes, dislikes, perTable, tableNames, seatingChart)
        if table != 'none':
            seatingChart[table].append(x)
            seatedParties[x] = table
        else:
            print('uh oh...', x)
    return seatingChart


def generateChart5(parties, loves, likes, dislikes, perTable, tableNames):
    '''here we go again.'''
    # basic idea: make good groups with everyone, then combine groups
    strongGroups = getStrongGroups(parties, loves)
    weakGroups = getWeakGroups(parties, likes)
    preTables = []
    mutualTables = []
    i = 0
    # start by making tables with the strong groups
    for x in strongGroups:
        mutualTables.append([])
        for y in x:
            mutualTables[i].append(y)
        i += 1

    # make tables with liked people
    # start with small groups
    weakGroups.reverse()
    i = len(mutualTables)
    for x in weakGroups:
        mutualTables.append([])
        for y in x:
            mutualTables[i].append(y)
        i += 1
        
    # make groups where people are very happy (i.e. snow white)
    loveTables = []
    i = 0
    for x in parties:
        loveTables.append([x])
        for y in loves[x]:
            if x not in dislikes[y]:
                loveTables[i].append(y)
        i += 1

    likeTables = []
    i = 0
    for x in parties:
        likeTables.append([x])
        for y in likes[x]:
            if x not in dislikes[y]:
                likeTables[i].append(y)
        i += 1

    # # try to create bigger good groups based on the opinions of many
    # gettingThere = []
    # for x in parties:
    #     pass


    mutualTables = cleanList(mutualTables)
    loveTables = cleanList(loveTables)
    likeTables = cleanList(likeTables)

    # see if any tables can be combined
    biggerTables = []
    for x in range(len(mutualTables)):
        for y in range(len(mutualTables)):
            if x != y:
                table1 = mutualTables[x]
                table2 = mutualTables[y]
                tmpTable = []
                badTable = False
                for p1 in table1:
                    for p2 in table2:
                        if p1 in dislikes[p2] or p2 in dislikes[p1]:
                            badTable = True
                            break
                        elif p1 in likes[p2] or p2 in likes[p1]:
                            if p1 not in tmpTable:
                                tmpTable.append(p1)
                            if p2 not in tmpTable:
                                tmpTable.append(p2)
                if not badTable:
                    biggerTables.append(tmpTable)

    # work on people who didn't respond (hardddd)
    # first find people who didn't respond
    noResponse = []
    for x in parties:
        if len(likes[x]) + len(loves[x]) + len(dislikes[x]) == 0:
            noResponse.append(x)

    # update the biggerTables that have already been created by adding
    # guests that didn't respond but multiple people like
    for x in biggerTables:
        # go through each person in each table
        for y in x:
            # go through all the people they love
            for z in loves[y]:
                # only look at those who didn't respond
                if z in noResponse and z not in x:
                    count = 0
                    for y1 in x:
                        # if someone likes them, update the count
                        if z in likes[y1]:
                            count += 1
                        # if someone dislikes them, don't add them!
                        elif z in dislikes[y1]:
                            count = -1
                            break
                    # only add guest if more than half of the people at the table like them
                    if count > len(x)/2:
                        x.append(z)

    # add new tables if someone loves a lot of people who didn't respond
    for x in parties:
        count = 0
        tmpTable = [x]
        for y in loves[x]:
            if y in noResponse and y not in tmpTable:
                count += 1
                tmpTable.append(y)
        if count > len(loves[x])/2:
            biggerTables.append(tmpTable)


    # count how many tables each party can be sat at
    tablesPerParty = {}
    onlyOne = []
    for x in parties:
        count = 0
        for t in biggerTables:
            if x in t:
                count += 1
        if count == 0:
            for t in (mutualTables + loveTables + likeTables):
                if x in t and t not in biggerTables:
                    biggerTables.append(t)
                    count += 1
            if count == 0:
                print('ugh') 
        tablesPerParty[x] = count
        # keep track of parties that only have one possible table
        if count == 1:
            onlyOne.append(x)
    
    # print(tablesPerParty)
    # print(biggerTables)
    # for x in biggerTables:
    #     print(len(x))
    #     print(scoreTable(x, loves, likes, dislikes, perTable))

    # make sure everything is unique
    unique = []
    for x in biggerTables:
        unique.append(list(dict.fromkeys(x)))
    biggerTables = unique

    # finally start creating final seating tables
    seated = []
    unseated = list(parties.keys())
    # start with parties that only have one possible table
    tables = []
    for x in onlyOne:
        for y in biggerTables:
            if x in y:
                tables.append(y)

    final = []
    # use the tables collected in the previous code
    for t in tables:
        tmpTable = []
        for x in t:
            if x in unseated:
                tmpTable.append(x)
                unseated.remove(x)
                seated.append(x)
        i = 0
        while len(tmpTable) > perTable and i < len(tmpTable):
            if tmpTable[i] not in onlyOne:
                unseated.append(tmpTable[i])
                seated.remove(tmpTable[i])
                tmpTable.remove(tmpTable[i])
            i += 1
        final.append(tmpTable)
    
    # remove people who have been seated from the list
    for x in biggerTables:
        for y in x:
            if y in seated:
                x.remove(y)

    has10 = True
    while has10 == True:
        # get the table with 10 that has the best score
        bestScorePerc = 0
        bestTable = []
        for x in biggerTables:
            if len(x) == perTable:
                (perf, curr) = scoreTable(x, loves, likes, dislikes, perTable)
                if curr/perf > bestScorePerc:
                    bestScorePerc = curr/perf
                    bestTable = x
        final.append(bestTable[:])
        for x in bestTable:
            unseated.remove(x)
            seated.append(x)

        has10 = False
        # remove people who have been seated from the lists
        newTables = []
        for x in biggerTables:
            newX = x[:]
            for y in x:
                if y in seated:
                    newX.remove(y)
            newTables.append(newX)
            if len(newX) == perTable:
                has10 = True
        biggerTables = newTables

    has10 = True
    start = time.time()
    while has10 and len(final) < len(tableNames) and (time.time() - start) < 30:
        # find the next table that has the smallest size above 10
        smallestSize = len(unseated) + 1
        smallestTable = []
        for x in biggerTables:
            if len(x) >= perTable and len(x) < smallestSize:
                smallestSize = len(x)
                smallestTable = x
        print(smallestSize)

        # go through each permutation of the table and find the best score or the first with .85 score
        bestTable = []
        bestScore = 0
        for x in itertools.combinations(smallestTable, perTable):
            if time.time() - start > 30:
                break
            (perf, curr) = scoreTable(x, loves, likes, dislikes, perTable)
            if perf == 0 and bestScore == 0:
                bestScore = 0.01
                bestTable = x
            elif perf != 0 and curr/perf > bestScore:
                bestScore = curr/perf
                bestTable = x
                if bestScore > .85:
                    break
        final.append(bestTable[:])
        print(bestTable)
        for x in bestTable:
            seated.append(x)
            if x in unseated:
                unseated.remove(x)
        if bestTable == []:
            break
        has10 = False
        # remove people who have been seated from the lists
        newTables2 = []
        for x in biggerTables:
            newX = x[:]
            for y in x:
                if y in seated:
                    newX.remove(y)
            newTables2.append(newX)
            if len(newX) >= perTable:
                has10 = True
        biggerTables = cleanList(newTables2)

    final = cleanList(final)

    while len(final) != len(tableNames) and unseated != []:
        biggestSize = 0
        biggestTable = []
        for x in biggerTables:
            if len(x) > biggestSize and len(x) <= perTable:
                biggestTable = x
                biggestSize = len(x)
        for x in biggestTable:
            unseated.remove(x)
            seated.append(x)
        final.append(biggestTable)
        # remove people who have been seated from the lists
        newTables3 = []
        for x in biggerTables:
            newX = x[:]
            for y in x:
                if y in seated:
                    newX.remove(y)
            newTables3.append(newX)
            if len(newX) >= perTable:
                has10 = True
        biggerTables = cleanList(newTables3)

    if unseated != []:
        # find all tables with < perTable people in them
        possibleTables = []
        problemPeople = []
        for x in final:
            if len(x) < perTable:
                possibleTables.append(x)
        # see if x can fit in any tables
        tableDict = {}
        for x in unseated:
            tableDict[x] = []
            for i in range(len(possibleTables)):
                possible = True
                for y in possibleTables[i]:
                    if x in dislikes[y] or y in dislikes[x]:
                        possible = False
                        break
                if possible == True:
                    tableDict[x].append(i)
            if tableDict[x] == []:
                # no table found
                problemPeople.append(x)
        for x in unseated:
            for y in unseated:
                if x in dislikes[y] or y in dislikes[x]:
                    if y not in problemPeople:
                        problemPeople.append(y)
        replaced = []
        # random.shuffle(final)
        for x in problemPeople:
            for y in range(len(final)):
                disCount = 0
                dis = ''
                for z in final[y]:
                    if x in dislikes[z] or z in dislikes[x]:
                        disCount += 1
                        if disCount == 1:
                            dis = z
                        print(z, 'dislikes', x)
                bestScore = -1
                bestReplacement = ''
                if disCount == 0:
                    for z in final[y]:
                        tmp = final[y][:]
                        score = scoreTable(tmp.remove(z).append(x))
                        if score > bestScore:
                            bestScore = score
                            bestReplacement = z
                if bestReplacement != '' or disCount == 1:
                    if disCount == 1:
                        bestReplacement = dis
                    replaced = bestReplacement
                    final[y] = final[y].remove(replaced).append(x)
                    problemPeople.remove(x)
                    print('found a place')
        print(replaced, problemPeople)

    # disband bad tables, regroup and fix starting with problem people


    # TODO: check for i > len(tmpTable)
    for x in range(min(len(tableNames), len(final))):
        if len(final[x]) <= 10:
            seatingChart[tableNames[x]] = final[x]

    print(unseated)
    #TODO: keep the people in the onlyOne resulting lists who are onlyOne and who like them, remove others and find better lists, if possible
    # gettingThere = cleanList(gettingThere)
    preTables.append(mutualTables)
    preTables.append(loveTables)
    preTables.append(likeTables)
    # preTables.append(gettingThere)
    return seatingChart

def cleanList(preTables):
    '''Clean up the list'''
    # remove all the tables with only one person
    empty = 0
    for i in range(len(preTables)):
        if len(preTables[i]) <= 1:
            if len(preTables[i]) == 1:
                preTables[i] = []
            empty += 1
    for _ in range(empty):
        preTables.remove([])
    return (preTables)

if __name__ == '__main__':
    seatingChart = {}
    for x in tableNames:
        seatingChart[x] = []
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
    # seatingChart = generateChart3(parties, superLikes, likes, dislikes, PERTABLE, tableNames, seatingChart)
    # print(json.dumps(seatingChart, indent = 4))
    # (sat, total, wrongPerTable, wrong, right) = checkWrongPlacements(seatingChart, superLikes, likes, dislikes)
    # print(sat, total)
    # (best, ours) = scoreChart(seatingChart, superLikes, likes, dislikes, PERTABLE)
    # print(best, ours)
    # print(ours/best)
    # (newChart, problemPeople) = intermediateStep(seatingChart, superLikes, likes, dislikes, PERTABLE)
    # seatingChart = generateChart4(parties, superLikes, likes, dislikes, PERTABLE, tableNames, newChart, problemPeople)
    # (best, ours) = scoreChart(seatingChart, superLikes, likes, dislikes, PERTABLE)
    # print(best, ours)
    # print(ours/best)
    # print(json.dumps(seatingChart, indent = 4))
        # print("Total Sat:", totalSat)
        # print("Total Violations:", totalWrong)
        # for x in wrongPerTable:
        #     print(x, wrongPerTable[x])
        # for x in right:
        #     print(x, ":", right[x], "/", len(likes[x]))
        # print("********************************************************************************************************")
        # for x in wrong:
        #     print(x, ":", wrong[x], "/", len(dislikes[x]))

    # strongGroups = getStrongGroups(parties, superLikes)
    # weakGroups = getWeakGroups(parties, likes)

    # lst = list(range(len(strongGroups)))
    # a = itertools.combinations(lst*len(strongGroups), len(strongGroups))
    # for i in a:
    #     print(i)
    # seatingChart = useGroups(parties, superLikes, likes, dislikes, PERTABLE, tableNames, strongGroups, weakGroups, seatingChart)
    # (newChart, problemPeople) = intermediateStep(seatingChart, superLikes, likes, dislikes, PERTABLE)
    # seatingChart = generateChart3(parties, superLikes, likes, dislikes, PERTABLE, tableNames, newChart)
    # seatingChart = finalStep(parties, superLikes, likes, dislikes, PERTABLE, tableNames, strongGroups, weakGroups, seatingChart)
    # print(json.dumps(seatingChart, indent = 4))
    seatingChart = generateChart5(parties, superLikes, likes, dislikes, PERTABLE, tableNames)
    for x in seatingChart:
        print(scoreTable(seatingChart[x], superLikes, likes, dislikes, PERTABLE))
    print(json.dumps(seatingChart, indent = 4))