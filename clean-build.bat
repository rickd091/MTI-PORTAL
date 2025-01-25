@echo off
echo Cleaning TypeScript cache...
rmdir /s /q node_modules\.cache\typescript

echo Removing build files...
rmdir /s /q build

echo Cleaning npm cache...
npm cache clean --force

echo Removing node_modules...
rmdir /s /q node_modules

echo Removing package-lock.json...
del package-lock.json

echo Installing dependencies...
npm install

echo Running TypeScript check...
npm run typecheck

echo Done!
pause

//The batch file will:

//Clear all caches
//Remove old builds
//Do a fresh installation
//Run type checking