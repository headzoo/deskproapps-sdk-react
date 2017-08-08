# deskproapps-sdk-react &middot; [![Build Status](https://travis-ci.org/deskpro/deskproapps-sdk-react.svg?branch=master)](https://travis-ci.org/deskpro/deskproapps-sdk-react)

A javascript SDK for building Deskpro Apps based on React.Js


## Contents
- [Installation](#installation)
- [Building](#building)
- [Running tests](#running-tests)
- [Publishing a release](release.md)
- [API reference](https://deskpro.github.io/deskproapps-sdk-react/reference)
    
## Installation
    
To install, run:
    
    npm install    
    
## Building

The recommended way to build this project is to use [Deskpro Apps Tool] (https://github.com/deskpro/deskproapps-dpat), known on the command line as *dpat*

Dpat is main tool to build and package apps at Deskpro and comes bundled with all the dependencies like Babel and Webpack and many more and it is constantly updated.

Chances are, if you need to build this sdk project, that you would also need to build other sdk projects so it is 
best to install it globally:
 
    npm install -g @deskproapps/dpat 

If you want to have installed locally, run:

    npm install -g @deskproapps/dpat 
     
If you have a previous version of dpat installed, it is **important** that you update to the lastest version     

To compile the sdk run:

    npm run make-clean && npm run make-lib      
    
To package the sdk run:
    
    npm run make-clean && npm run make-lib && npm run make-dist

## Running tests

You must have [Deskpro Apps Tool](https://github.com/deskpro/deskproapps-dpat) installed to run the tests. After you install it, run 
 
    npm run test 

