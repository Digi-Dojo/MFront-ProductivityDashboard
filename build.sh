#!/bin/bash

cd productivity-graph
npm i
npm run build:webpack

cd ..
cd ProductivityDashboard
npm i
npm run build:webpack

cp ../productivity-graph/dist/* dist

