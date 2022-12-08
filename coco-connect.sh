#! /bin/bash

export GAME_ID=`coco lobby | grep roshambo | cut -b 3-16 | head -n1`
echo $GAME_ID
coco connect --name mario $GAME_ID -- ./data/rock-paper-scissor 10 1
 