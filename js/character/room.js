define([], function() {
    "use strict";

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
        Room: function(description) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var that = this,
                exits = [],
                items = [],
                Directions = {
                    NORTH: 0,
                    EAST: 1,
                    SOUTH: 2,
                    WEST: 2
                },
            
                getExitString = function() {
                    var returnString = "Exits:",
                    for (var i = 0; i < exits.length; i++) {
                        returnString += " " + exits[i];
                    }   
                },
                
                getExit = function(direction) {
                    return exits[direction];
                },
                
                
                addItem = function(item) {
                    items.push(item);
                },
                
                getItemString = function() {
                    var returnString = "Items: \n";
                    for (var i = 0; i < items.length; i++) {
                        returnString += item.getName() + ": " + item.getDescription() + "\n";
                    }
                    return returnString;
                },
                
                removeItem = function(item) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i] === item) {
                            items.splice(i, 1);
                            return item;
                        }
                        else {
                            return null;
                        }
                    }
                },
                
                searchItems = function(item) {
                    var result = null;
                    for (var i = 0; i < items.size; i++) {
                        if (items[i].getName() === item.getNmae()) {
                            result = items[i].getName();
                            break;
                        }
                    }
                    return result;
                },                
                
                getExitList = function () {
                    var exitList = [];
                    for (var i = 0; i < exits.length; i++) {
                        exitList.push(exits[i]);
                    }
                    return exitList;
                };
                
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            that.setExit = function(direction, neighbor) {
                exits[direction] = neightbor;
            };
            
            that.getShortDescription = function() {
                return description;
            };
            
            that.getLongDescription = function() {
                var profSentence;
                /*if (professor.getRoom() === room) {
                    profSentence += "\n" + professor.toString();
                }*/
                return "You are " + description + " .\n" + 
                    getExitString() + "\n" + getItemString();
            };
        }
    };

    return module; 
});
