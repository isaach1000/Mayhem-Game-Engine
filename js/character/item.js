define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////
    
    
    /**
     * @exports character/item
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////
        
        /**
         * Item
         * @constructor
         */
        Item: function(name, description, weight, isCookie) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////
            var that = this;
            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            that.getWeight = function() {
                return weight;
            };
            
            that.getName = function() {
                return name;
            };
            
            that.getDescription = function() {
                return description;
            };
            
            that.isCookie = function() {
                return isCookie;
            };
        }
    };

    return module; 
});
