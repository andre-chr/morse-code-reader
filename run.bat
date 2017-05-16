@echo off
cd server
start node server.js test

timeout /t 10

cd ../client
start firebase serve
