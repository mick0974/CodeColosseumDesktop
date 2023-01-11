#! /bin/bash
cd "$(dirname "$0")"
rm -f ./rock-paper-scissor
gcc rock-paper-scissor.c -o rock-paper-scissor
chmod +x ./rock-paper-scissor
./rock-paper-scissor 3
echo 