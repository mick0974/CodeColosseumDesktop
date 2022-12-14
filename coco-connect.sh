#! /bin/bash

export GAME_ID=`coco lobby | grep roshambo | cut -b 3-16 | head -n1`
export SUFFIX=`echo $RANDOM | md5sum | head -c 5`
echo $GAME_ID
coco connect --name mario_$SUFFIX $GAME_ID -- ./data/rock-paper-scissor 10 1
 