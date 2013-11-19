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

            this.getExitString = function() {
                var returnString = "Exits:";
                for (var i = 0; i < exits.length; i++) {
                    returnString += " " + exits[i];
                }
            };

            this.getExit = function(direction) {
                return exits[direction];
            };

            this.addItem = function(item) {
                items.push(item);
            };

            this.getItemString = function() {
                var returnString = "Items: \n";
                for (var i = 0; i < items.length; i++) {
                    returnString += item.getName() + ": " + item.getDescription() + "\n";
                }
                return returnString;
            };

            this.removeItem = function(item) {
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

            this.searchItems = function(item) {
                var result = null;
                for (var i = 0; i < items.size; i++) {
                    if (items[i].getName() === item.getName()) {
                        result = items[i].getName();
                        break;
                    }
                }
                return result;
            };

            this.getExitList = function() {
                var exitList = [];
                for (var i = 0; i < exits.length; i++) {
                    exitList.push(exits[i]);
                }
                return exitList;
            };

            this.setExit = function(direction, neighbor) {
                exits[direction] = neighbor;
            };

            this.getShortDescription = function() {
                return description;
            };

            this.getLongDescription = function() {
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
