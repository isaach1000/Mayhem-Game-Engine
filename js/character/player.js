define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    
    /**
     * @exports character/player
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        
        /**
         * Player
         * @constructor
         */
        Player: function(initialRoom) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var that = this, 
                currentRoom = initialRoom, 
                bag = [],
                maxWeight = 100;

            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////                

            that.getRoom = function() {
                return currentRoom;
            };
            
            that.setRoom = function(newRoom) {
                currentRoom = newRoom;
            };
            
            that.getBag = function() {
                return bag;
            };
            
            that.addToBag = function(newItem) {
                bag.push(newItem);
            };
            
            that.removeFromBag = function(item) {
                var index = bag.indexOf(item);
                if (index !== -1) {
                    // TODO: use UnderscoreJS for this
                    var itemArr = bag.splice(index, 1);
                    return itemArr[0];
                }
                else {
                    return null;
                }
            };
            
            that.getMaxWeight = function() {
                return maxWeight;
            };
            
            that.increaseMaxWeight = function() {
                maxWeight  += 50;
            };
            
            that.getInventory = function() {
                var ret,
                    i;
                if (bag.length === 0) {
                    ret = "You are not carrying anything";
                }
                else {
                    for (i = 0; i < bag.length; i += 1) {
                        ret += bag[i].getName() + ": " + bag[i].getDescription() + "\n";
                    }
                }
                return ret;
            };
            
            that.searchBag = function(item) {
                var result = null,
                    i;
                for (i = 0; i < bag.length; i += 1) {
                    if (bag[i].getName() === item) {
                        result = bag[i];
                        break;
                    }
                }
                return result;    
            };
            
            that.currentBagWeight = function() {
                var weight = 0,
                i;
                for (i = 0; i < bag.length; i += 1) {
                    weight += bag[i].getWeight();
                }
                return weight;
            };
        }
    };

    return module; 
});
