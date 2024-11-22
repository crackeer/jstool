#!/bin/sh
# /ElvaZhang163/
# 283334795
tar -cvf tmp.tar ./*
mkdir -p ./build
tar -xvf tmp.tar -C ./build
