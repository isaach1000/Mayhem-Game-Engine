#!/bin/bash

scripts=$(dirname $0)

if [ $# -ne 2 ]; then
    echo "usage: $scripts/module.sh [FOLDER] [CLASSNAME]"
    exit 1
fi

folder=$1
folderpath=$scripts/../js/$folder

if [ ! -d $folderpath ]; then
    mkdir $folderpath
fi

class=$2
filename=`echo $(tr A-Z a-z <<< ${class:0:1})${class:1}`

cat > $folderpath/$filename.js << MODULE
/**
    Description of class

    @class $class
 */
define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
        @module $folder/$filename
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
             @class $class
             @constructor
         */
        $class: function() {
            var _this = this;

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////


            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

        }
    };

    return module;
});
MODULE
