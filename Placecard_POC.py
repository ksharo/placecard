import random
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
        if line[x] == 'Yes' and party != header[x]:
            likesDict[party].append(header[x])
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

tableNames = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8', 'Table 9', 'Table 10']

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


    # randomize the order of the parties that are going to be investigated
    partyList = list(parties.keys())
    random.shuffle(partyList)

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
                                print(x, "seated", parties[x])
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
            for s in range(0, parties[partyID]):
                seatingChart[t].append(partyID)
            found = True
            table = t
            break
    # look for a good table
    for t in tableNames:
        if goodTable(seatingChart[t], partyID, parties, dislikes, likes, perTable):
            # found one! sit the party here, accounting for size
            for s in range(0, parties[partyID]):
                seatingChart[t].append(partyID)
            found = True
            table = t
            break
    # good table not found, look for a 'fine' one
    if not found:
        for t in tableNames:
            if fineTable(seatingChart[t], partyID, parties, dislikes, perTable):
                # found one! sit the party here, accounting for size
                for s in range(0, parties[partyID]):
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
                for s in range(0, parties[partyID]):
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

    return (seatingChart, t)

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


if __name__ == '__main__':
    seatingChart = generateChart(parties, likes, dislikes, 10, tableNames)
    print(likes['Sophia Zuo'])
    for x in seatingChart:
        print(x, seatingChart[x])
