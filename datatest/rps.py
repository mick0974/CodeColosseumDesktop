#! /usr/bin/python3

import random
import sys


args = sys.argv

rounds = int(args[1])

for i in range(rounds):
  move = random.randint(0, 2)
  choice = ""
  
  if move == 0:
    choice = "PAPER"
  elif move == 1:
    choice = "ROCK"
  else:
    choice = "SCISSORS"
  
  print(choice)
  
  response = str(input())
  
