#! /bin/bash

killall -9 -q cocod
cocod &
watch -n1 coco lobby
killall -9 -q cocod