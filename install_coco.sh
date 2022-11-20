#! /bin/bash

PROJECT_FOLDER="CodeColosseum"
CURRENT_DIR=`pwd`

sudo apt install cargo

git clone https://github.com/dariost/CodeColosseum.git ./$PROJECT_FOLDER


export COCO_HOME="$CURRENT_DIR/$PROJECT_FOLDER"

if ! grep -i "export COCO_HOME" ~/.bashrc; then
    echo "Adding paths to ~/.bashrc"
    echo "export COCO_HOME=$COCO_HOME" >> ~/.bashrc
    echo "export PATH=\"\$PATH:$COCO_HOME/target/debug\"" >> ~/.bashrc
    echo "export PATH=\"\$PATH:$COCO_HOME/target/release\"" >> ~/.bashrc   
fi

export PATH="$PATH:$COCO_HOME/target/debug"
export PATH="$PATH:$COCO_HOME/target/release"

cd $PROJECT_FOLDER
cargo build
cargo build --release





