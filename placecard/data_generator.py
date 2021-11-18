import string
import random

MIN_NUM_PARTIES = 1
MAX_NUM_PARTIES = 17

MIN_PARTY_SIZE = 1
MAX_PARTY_SIZE = 6


alphabet_string = string.ascii_lowercase

alphabet_list = list(alphabet_string)



parties = {}
likes = {}
dislikes = {}

num_parties = random.randint(MIN_NUM_PARTIES, MAX_NUM_PARTIES)
alphabet_list = alphabet_list[0:num_parties]
print(f"{num_parties=}, {alphabet_list=}")

# for l in alphabet_list:
# 	likes[l] = []
# 	dislikes[l] = []

for i in range(num_parties):
	print(f"{i=} {alphabet_list=}")
	current_letter = alphabet_list[i]
	remaining_members = list(alphabet_list)
	remaining_members.remove(current_letter)
	print(f"{remaining_members=}")

	parties[current_letter] = random.randint(MIN_PARTY_SIZE, MAX_PARTY_SIZE)

	temp_like_arr = set()
	num_likes = random.randint(1,5)
	for k in range(num_likes):
		if remaining_members:
			index = random.randrange(0, len(remaining_members))
			index_letter = remaining_members[index]
			remaining_members.remove(index_letter)
			temp_like_arr.add(index_letter)

	likes[current_letter] = list(temp_like_arr)

	temp_dislike_arr = set()
	num_dislikes = random.randint(1,5)
	for k in range(num_dislikes):
		if remaining_members:
			index = random.randrange(0, len(remaining_members))
			index_letter = remaining_members[index]
			remaining_members.remove(index_letter)
			if index_letter in likes[current_letter]:
				print(f"collision {index_letter}")
			else:
				temp_dislike_arr.add(index_letter)

	dislikes[current_letter] = list(temp_dislike_arr)

	print(f"\n\nparties= {parties}")
	print(f"likes= {likes}")
	print(f"dislikes= {dislikes}")
