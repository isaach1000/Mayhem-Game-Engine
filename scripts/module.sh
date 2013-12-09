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
filename=`echo $class | tr '[:upper:]' '[:lower:]'`

cat > $folderpath/$filename.js << MODULE
// @formatter:off
define([], function() {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
     * @exports $folder/$filename
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * $class
         * @constructor
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
#endif
MODULE
