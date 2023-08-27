#!/bin/bash

cd productivity-graph
npm run build:webpack

cd ..
cd ProductivityDashboard
npm run build:webpack

cp ../productivity-graph/dist/* dist

