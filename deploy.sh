#!/bin/sh
tar -cvf tmp.tar ./*
mkdir -p ./build
tar -xvf tmp.tar -C ./build
