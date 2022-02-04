from os import error
import random
import csv
import time
import json
import itertools
'''
    Author: Kaitlyn Sharo
    Date: 1/06/2022
    Description: another attempt at the Placecard Seating Chart Algorithm
'''
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

def findGroupings(parties, loves, likes, dislikes, perTable, tableNames):
    '''Finds all good possible groupings for the parties'''
    strongGroups = getStrongGroups(parties, loves)
    weakGroups = getWeakGroups(parties, likes)
    possibleGroupings = strongGroups + weakGroups
    # TODO: fill in all possible groupings

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

    # see if any tables can be combined
    biggerTables = []
    for x in range(len(possibleGroupings)):
        for y in range(len(possibleGroupings)):
            if x != y:
                table1 = possibleGroupings[x]
                table2 = possibleGroupings[y]
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
    possibleGroupings += biggerTables

    # find those who did not respond
    noResponse = []
    for x in parties:
        if len(likes[x]) + len(loves[x]) + len(dislikes[x]) == 0:
            noResponse.append(x)

    # update the possibleGroupings that have already been created by adding
    # guests that didn't respond but multiple people like
    for x in possibleGroupings:
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
            possibleGroupings.append(tmpTable)

    # make sure everything is unique
    unique = []
    for x in possibleGroupings:
        unique.append(list(dict.fromkeys(x)))
    possibleGroupings = unique

    return possibleGroupings, loveTables, likeTables

def scoreTable(table, loves, likes, dislikes, perTable):
    '''Calculates the score of the table based on who people like/dislike
    at their table.'''
    currScore = 0
    valid = True
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
                    valid = False
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
                    valid = False

    return (currScore, valid)

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

def generateChart(parties, loves, likes, dislikes, perTable, tableNames):
    '''Returns a seating chart where everyone is equally happy (hopefully)'''
    possibleGroupings, loveTables, likeTables = findGroupings(parties, loves, likes, dislikes, perTable, tableNames)
    final = []
    seated = []

    noTables = []
    # count how many tables each party can be sat at
    tablesPerParty = {}
    onlyOne = ['first']
    possibleGroupings.sort(key=len, reverse=True)
    while len(onlyOne) < .05 * len(parties):
        if len(onlyOne) == 0 or (len(onlyOne) >= 1 and onlyOne[0] != 'first'):
            possibleGroupings = possibleGroupings[:len(possibleGroupings)-1]
        onlyOne = []
        onlyOneTables = []
        for x in parties:
            count = 0
            for t in possibleGroupings:
                if x in t:
                    count += 1
            if count == 0 and len(onlyOne) > 0 and onlyOne[0] == 'first':
                for t in (loveTables + likeTables):
                    if x in t and t not in possibleGroupings:
                        possibleGroupings.append(t)
                        count += 1
                if count == 0:
                    print('no table found for', x) 
                    noTables.append(x)
            tablesPerParty[x] = count
            # keep track of parties that only have one possible table
            if count == 1:
                onlyOne.append(x)
    
    random.shuffle(possibleGroupings)
    # get the tables that only fit one person
    for x in onlyOne:
        for t in possibleGroupings:
            if x in t:
                if t not in onlyOneTables:
                    onlyOneTables.append(t)
                    break

    start = time.time()
    saved = []
    for x in range(len(tableNames)):
        saved.append([])
    while time.time() - start < 2:
        best = []
        bestScore = 0
        tables = []
        names = []
        seated = []
        final = []
        # initialize these tables with those who can only be sat at one table
        for t in onlyOneTables:
            tmpTable = []
            for p in t:
                names.append(p)
                if p in onlyOne and p not in seated:
                    tmpTable.append(p)
                    seated.append(p)
                    names.remove(p)
            tables.append(tmpTable)

        unseated = list(parties.keys())
        for x in unseated:
            if x in seated:
                unseated.remove(x)
        random.shuffle(names)
        for n in names + names:
            if n not in seated:
                # find the best table for each leftover name
                bestDiff = 0
                bestTableInd = -1
                smallest = 0
                for x in range(len(tables)):
                    t = tables[x]
                    if len(t) + 1 <= perTable:
                        origScore = scoreTable(t, loves, likes, dislikes, perTable)[0]
                        (newScore, valid) = scoreTable(t + [n], loves, likes, dislikes, perTable)
                        size = len(t)
                        if valid and ((newScore - origScore) > bestDiff and (newScore - origScore) > 2) or ((newScore - origScore) == bestDiff and bestDiff != 0 and size < smallest):
                            bestDiff = newScore - origScore
                            bestTableInd = x
                            smallest = size
                if bestTableInd != -1:
                    tables[bestTableInd] = tables[bestTableInd] + [n]
                    seated.append(n)
                    unseated.remove(n)
        score = 0
        for t in tables:
            if t != []:
                final.append(t)
                score += scoreTable(t, loves, likes, dislikes, perTable)[0]
        
        if score > bestScore:
            bestScore = score
            best = final
            for x in range(min(len(tableNames), len(best))):
                if len(best[x]) >= .5 * perTable and scoreTable(best[x], loves, likes, dislikes, len(best[x]))[0] >= .75 * topTable(best[x], loves, likes, len(best[x])):
                    if scoreTable(saved[x], loves, likes, dislikes, len(saved[x]))[0] < scoreTable(best[x], loves, likes, dislikes, len(best[x]))[0]:
                        saved[x] = (best[x])
        
    people = []
    for t in saved:
        for p in t:
            people.append(p)
    for p in people:
        if people.count(p) > 1:
            # get all the tables where that person is
            tables = []
            for t in saved:
                if p in t:
                    tables.append(t)
            # look through the tables to see where this person is happiest
            bestTable = []
            bestScore = 0
            for t in tables:
                score = 0
                for x in t:
                    if x in loves[p]:
                        score += 5
                    elif x in likes[p]:
                        score += 3
                if score > bestScore:
                    bestScore = score
                    bestTable = t
                elif score == bestScore:
                    # look through the tables to see which one the person makes happier
                    if bestTable == []:
                        bestTable = t
                        bestScore = score
                    else:
                        score1 = 0
                        score2 = 0
                        for x in t:
                            if p in loves[x]:
                                score1 += 5
                            elif p in likes[x]:
                                score1 += 3
                        for x in bestTable:
                            if p in loves[x]:
                                score2 += 5
                            elif p in likes[x]:
                                score2 += 3
                        if score1/len(t) > score2/len(bestTable):
                            bestTable = t
            for t in tables:
                if p in t and t != bestTable:
                    t.remove(p)
    
    finalTables = []
    for x in saved:
        if x != []:
            finalTables.append(x)
    # update arrays
    unseated = list(parties.keys())
    seated = []
    for x in finalTables:
        for y in x:
            seated.append(y)
            unseated.remove(y)
    for _ in range(len(tableNames) - len(finalTables)):
        # add biggest groups of people leftover to the empty places
        # if they don't fit well in another table
        # TODO: check other tables
        for t in possibleGroupings:
            for p in t:
                if p in seated:
                    t.remove(p)
        cleanList(possibleGroupings)
        possibleGroupings.sort(key=len, reverse=True)
        for y in possibleGroupings:
            if len(y) <= perTable:
                tmpTable = []
                for p in y:
                    if p not in seated:
                        seated.append(p)
                        unseated.remove(p)
                        tmpTable.append(p)
                finalTables.append(tmpTable)
                break


    # fill up the table with everyone else
    while len(unseated) >= 1:
        random.shuffle(unseated)
        for n in unseated:
            bestDiff = 0
            bestTableInd = -1
            smallest = perTable
            possible = []
            for x in range(len(finalTables)):
                t = finalTables[x]
                if len(t) + 1 <= perTable:
                    origScore = scoreTable(t, loves, likes, dislikes, perTable)[0]
                    (newScore, valid) = scoreTable(t + [n], loves, likes, dislikes, perTable)
                    size = len(t)
                    if valid:
                        possible.append(x)
                        #and (newScore - origScore) > 2
                    if valid and ((newScore - origScore) > bestDiff ) or ((newScore - origScore) == bestDiff and bestDiff != 0 and size < smallest):
                        bestDiff = newScore - origScore
                        bestTableInd = x
                        smallest = size
            if bestTableInd != -1:
                finalTables[bestTableInd] = finalTables[bestTableInd] + [n]
                print(n)
                seated.append(n)
                unseated.remove(n)
            else:
                if len(possible) > 0:
                    finalTables[possible[0]] = finalTables[possible[0]] + [n]
                    seated.append(n)
                    unseated.remove(n)
        print(unseated)
        if len(unseated) < 1:
            break
        # take the lowest scoring tables (per people who responded) and redistribute
        worstTable = []
        worstAvg = 9999999999
        for t in finalTables:
            respondents = 0
            for x in t:
                if len(likes[x]) + len(dislikes[x]) + len(loves[x]) != 0:
                    respondents += 1
            if respondents == 0:
                score = 0
            else:
                score = scoreTable(t, loves, likes, dislikes, perTable)[0]/respondents
            if score < worstAvg:
                worstTable = t
                worstAvg = score
        for x in worstTable:
            if x in seated:
                seated.remove(x)
                unseated.append(x)
        finalTables.remove(worstTable)
        # for t in possibleGroupings:
        #     for p in t:
        #         if p in seated:
        #             t.remove(p)
        # cleanList(possibleGroupings)
        # possibleGroupings.sort(key=len, reverse=True)
        bestGroup = []
        for u in unseated:
            group = [u]
            for u2 in unseated:
                if u != u2:
                    #(u in likes[u2] or u2 in likes[u]) and
                    if (u not in dislikes[u2] and u2 not in dislikes[u]):
                        yes = True
                        for y in group:
                            if y in dislikes[u2] or u2 in dislikes[y]:
                                yes = False
                                break
                        if yes:
                            group.append(u2)
            if len(group) >= len(bestGroup):
                bestGroup = group
                # refine group
        finalTables.append(bestGroup[:perTable])
        for x in bestGroup[:perTable]:
            unseated.remove(x)
            seated.append(x)
        print('bg', bestGroup)


    # seated = [] 
    # random.shuffle(onlyOne)
    # for x in onlyOne:
    #     if x not in seated:
    #         tmpTable = []
    #         for t in possibleGroupings:
    #             if x in t:
    #                 for y in t:
    #                     if y in onlyOne:
    #                         tmpTable.append(y)
    #                         seated.append(y)
    #                 for y in t:
    #                     if y not in onlyOne and y not in seated:
    #                         score = scoreTable(tmpTable, loves, likes, dislikes, perTable)
    #                         newScore = scoreTable(tmpTable + [y], loves, likes, dislikes, perTable)
    #                         if newScore >= score + score/5:
    #                             tmpTable.append(y)
    #                             seated.append(y)
    #                 break
                    
            # final.append(tmpTable)

    # # finally start creating final seating tables
    # seated = []
    # unseated = list(parties.keys())
    # # start with parties that only have one possible table
    # tables = []
    # for x in onlyOne:
    #     for y in possibleGroupings:
    #         if x in y:
    #             tables.append(y)
    # final = []
    # # use the tables collected in the previous code
    # for t in tables:
    #     tmpTable = []
    #     for x in t:
    #         if x in unseated:
    #             tmpTable.append(x)
    #             unseated.remove(x)
    #             seated.append(x)
    #     i = 0
    #     while len(tmpTable) > perTable and i < len(tmpTable):
    #         if tmpTable[i] not in onlyOne:
    #             unseated.append(tmpTable[i])
    #             seated.remove(tmpTable[i])
    #             tmpTable.remove(tmpTable[i])
    #         i += 1
    #     final.append(tmpTable)
    # final = cleanList(final)
    # # remove people who have been seated from the list
    # for x in possibleGroupings:
    #     for y in x:
    #         if y in seated:
    #             x.remove(y)

    # # find smaller group sizes so two smaller groups might be able to be combined
    # semifinal = []
    # groupSize = [0, 0]
    # if perTable % 2 == 0:
    #     groupSize = [perTable/2, perTable/2]
    # else:
    #     groupSize = [perTable//2, perTable - perTable//2]

    # hasSmallGroup = True
    # while hasSmallGroup:
    #     # find the smaller groups
    #     smallerGroups = []
    #     hasSmallGroup = False
    #     for x in possibleGroupings:
    #         if len(x) == groupSize[0] or len(x) == groupSize[1]:
    #             smallerGroups.append(x[:])
    #             hasSmallGroup = True

    #     bestGroup = []
    #     bestScore = -1
    #     for x in smallerGroups:
    #         score = scoreTable(x, loves, likes, dislikes, perTable)
    #         if score > bestScore:
    #             bestScore = score
    #             bestGroup = x
        
    #     # seat the best-found group
    #     if bestScore > -1:
    #         semifinal.append(bestGroup)
    #         for x in bestGroup:
    #             if x in unseated:
    #                 seated.append(x)
    #                 unseated.remove(x)
    #         # remove people who have been seated from the list
    #         for x in possibleGroupings:
    #             for y in x:
    #                 if y in seated:
    #                     x.remove(y)

    # possibleGroupings = cleanList(possibleGroupings)

    # # work with the lowest scoring group first
    # while semifinal != []:
    #     worstGroup = []
    #     worstScore = 999999999999
    #     for x in semifinal:
    #         score = scoreTable(x, loves, likes, dislikes, perTable)
    #         if score < worstScore:
    #             worstScore = score
    #             worstGroup = x

    #     # try to improve the group's score

    #     # see what improves the score the most
    #     bestCombination = []
    #     bestScore = -1
    #     for t in semifinal + possibleGroupings:
    #         if t != worstGroup and len(t) + len(worstGroup) <= perTable:
    #             points = 0
    #             for p in t:
    #                 for w in worstGroup:
    #                     if p in loves[w] and w in loves[p]:
    #                         points += 5
    #                     elif p in likes[w] and w in likes[p]:
    #                         points += 4
    #                     elif p in loves[w] or w in loves[p]:
    #                         points += 3
    #                     elif p in likes[w] or w in likes[p]:
    #                         points += 2
    #                     elif p in dislikes[w] or w in dislikes[p]:
    #                         points = -1
    #                         break
    #             if points > bestScore:
    #                 bestScore = points
    #                 bestCombination = t
    #     final.append(worstGroup + bestCombination)
    #     if bestCombination not in semifinal:
    #         for x in bestCombination:
    #             if x in unseated:
    #                 seated.append(x)
    #                 unseated.remove(x)
    #     # remove people who have been seated from the list
    #     semifinal.remove(worstGroup)
    #     for x in possibleGroupings + semifinal:
    #         for y in x:
    #             if y in seated:
    #                 x.remove(y)
    #     possibleGroupings = cleanList(possibleGroupings)

    # print(possibleGroupings)

    # initialize seating chart
    seatingChart = {}
    for t in tableNames:
        seatingChart[t] = []

    # TODO: fill seating chart
    for x in range(min(len(tableNames), len(finalTables))):
        if len(finalTables[x]) <= perTable:
            seatingChart[tableNames[x]] = finalTables[x]

    # return seating chart
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

    parties = partyDict
    likes = likesDict
    dislikes = dislikesDict
    superLikes = superLikesDict

    tableNames = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8', 'Table 9', 'Table 10']

    perTable = 10

    seatingChart = generateChart(parties, superLikes, likes, dislikes, perTable, tableNames)
    score = 0
    for x in seatingChart:
        thisScore = scoreTable(seatingChart[x], superLikes, likes, dislikes, perTable)[0]
        score += thisScore
        print(thisScore/topTable(seatingChart[x], superLikes, likes, perTable))
    print(score)
    print(json.dumps(seatingChart, indent = 4))

    # make a base at each table of people who don't associate with each other
    # make tight-knit groups of remaining people (best score wins)
    # find which table they would best fit at