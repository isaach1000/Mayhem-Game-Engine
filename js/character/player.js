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
        Room: function(about) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var that = this,
                description = about,
                exits = [],
                items = [],
            
                getExitString = function() {
                    var returnString = "Exits:",
                    for (var i = 0; i < keys.length; i++) {
                        returnString += " " + exits[i];
                    }   
                },
                
                getExit = function(direction) {
                    return exits.get(direction);
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
                        if (items[i][1] === )
                },
                
                searchItems = function(item) {
                    var result = null;
                    for (var i = 0; i < items.size; i++) {
                        if (items[i].getName() === item.getName()) {
                            result = items[i].getName();
                            break;
                        }
                    }
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
                exits.push(direction, neightbor);
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
                    getExitString() + "\n" + getItemString() + profSentence;
            };
        }
    };

    return module; 
});
