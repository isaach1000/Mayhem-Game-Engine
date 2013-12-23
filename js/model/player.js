define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////


    /**
       @module model/player
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
           Player
           @constructor
         */
        Player: function(initialRoom) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var _this = this,
                currentRoom = initialRoom,
                bag = [],
                maxWeight = 100;


            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            this.getRoom = function() {
                return currentRoom;
            };

            this.setRoom = function(newRoom) {
                currentRoom = newRoom;
            };

            this.getBag = function() {
                return bag;
            };

            this.addToBag = function(newItem) {
                bag.push(newItem);
            };

            this.removeFromBag = function(item) {
                var index = bag.indexOf(item);
                if (index !== -1) {
                    // TODO: use UnderscoreJS for this
                    var itemArr = bag.splice(index, 1);
                    return itemArr[0];
                } else {
                    return null;
                }
            };

            this.getMaxWeight = function() {
                return maxWeight;
            };

            this.increaseMaxWeight = function() {
                maxWeight += 50;
            };

            this.getInventory = function() {
                var ret,
                    i;
                if (bag.length === 0) {
                    ret = "You are not carrying anything";
                } else {
                    for (i = 0; i < bag.length; i += 1) {
                        ret += bag[i].getName() + ": " + bag[i].getDescription() +
                            "\n";
                    }
                }
                return ret;
            };

            this.searchBag = function(item) {
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

            this.currentBagWeight = function() {
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
