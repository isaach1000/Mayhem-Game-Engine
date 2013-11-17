// @formatter:off
define([], function() {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    /**
     * @exports character/room
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Room
         * @constructor
         */
        Room : function(description) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var that = this, exits = [], items = [], Directions = {
                NORTH : 0,
                EAST : 1,
                SOUTH : 2,
                WEST : 3
            };

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            that.getExitString = function() {
                var returnString = "Exits:";
                for (var i = 0; i < exits.length; i++) {
                    returnString += " " + exits[i];
                }
            };

            that.getExit = function(direction) {
                return exits[direction];
            };

            that.addItem = function(item) {
                items.push(item);
            };

            that.getItemString = function() {
                var returnString = "Items: \n";
                for (var i = 0; i < items.length; i++) {
                    returnString += item.getName() + ": " + item.getDescription() + "\n";
                }
                return returnString;
            };

            that.removeItem = function(item) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i] === item) {
                        items.splice(i, 1);
                        return item;
                    }
                    else {
                        return null;
                    }
                }
            };

            that.searchItems = function(item) {
                var result = null;
                for (var i = 0; i < items.size; i++) {
                    if (items[i].getName() === item.getName()) {
                        result = items[i].getName();
                        break;
                    }
                }
                return result;
            };

            that.getExitList = function() {
                var exitList = [];
                for (var i = 0; i < exits.length; i++) {
                    exitList.push(exits[i]);
                }
                return exitList;
            };

            that.setExit = function(direction, neighbor) {
                exits[direction] = neighbor;
            };

            that.getShortDescription = function() {
                return description;
            };

            that.getLongDescription = function() {
                var profSentence;
                // TODO
                /*if (professor.getRoom() === room) {
                 profSentence += "\n" + professor.toString();
                 }*/
                return "You are " + description + " .\n" + getExitString() + "\n" + getItemString();
            };
        }
    };

    return module;
});
