# Code samples for ilexius GmbH
#
# Date: 05.12.2017
# python_version: 3.4.3
#
# Ivan Vucetic
# ivan_vucetic@ymail.com


# Task 1:

def countVowels(string):
    count = 0
    li = list(string)
    for letter in li:
        if letter in ['a','e','i','o','u']:
            count += 1
    return count


# first  = countVowels("ilexius")
# print(first)
# second = countVowels("i really want this job")
# print(second)

# ---------------------------

# Task 2:

def getMiddleIndex(triplet):
    indices = {}
    for el in triplet:
        indices[el] = triplet.index(el)
    return indices[sorted(triplet)[1]]


# third = getMiddleIndex([2,3,1])
# print(third)
# fourth = getMiddleIndex([5,10,14])
# print(fourth)

# ---------------------------

# Task 3:

def likes(people):
    l = len(people)
    if l == 0:
        print('no one likes this')
    elif l == 1:
        print('{} likes this'.format(people[0]))
    elif l == 2:
        print('{} and {} like this'.format(people[0], people[1]))
    elif l == 3:
        print('{}, {} and {} like this'.format(people[0], people[1], people[2]))
    else:
        print('{}, {} and {} others like this'.format(people[0], people[1], l-2))


# likes([])
# likes(['Peter'])
# likes(["Jacob", "Alex"])
# likes(["Max", "John", "Mark"])
# likes(["Alex", "Jacob", "Mark", "Max"])
# likes(["Alex", "Jacob", "Mark", "Max", "Peter", "Paul"])
