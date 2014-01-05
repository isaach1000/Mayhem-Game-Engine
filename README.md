# Mayhem Game Engine

## Introduction
This project demostrates the use of HTML5 Canvas in game development.

## Libraries
jQuery, UnderscoreJS, Browserify, Jasmine

## Structure
Directory structure:

* build/ --- Minified, concatenated files
* docs/ --- Documentation
* js/ --- All Javascripts:
	* enum/ --- Enums
	* events/ --- Event handlers
	* foundation/ --- Basic shapes and drawing
	* level/ --- Levels
	* lib/ --- Libraries
	* spec/ --- Tests
	* sprite/ --- Multi-shape structures
	* util/ --- Data structures and math
	* intro.js --- Intro for built files
	* main.js --- Main entry point
	* task.js --- Web Worker entry point
	* outro.js --- Outro for built files
* scripts/ --- Useful scripts (e.g. generate new module, commit new files)
* Gruntfile.js --- Grunt tasks
* README.md --- You are here
* bundle.js --- Built JS file for js/main.js and its dependencies (not minified)
* index.html --- Game page
* package.json --- NodeJS data
* specs.html --- Testing page (Jasmine)
* specs.js --- Built JS file for js/spec/specRunner.js and its dependencies
* style.css --- Stylesheet for index.html
* worker.js --- Built JS file for js/task.js and its dependencies
