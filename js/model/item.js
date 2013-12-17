define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////


    /**
     * @module model/item
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
            var _this = this;

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            this.getWeight = function() {
                return weight;
            };

            this.getName = function() {
                return name;
            };

            this.getDescription = function() {
                return description;
            };

            this.isCookie = function() {
                return isCookie;
            };
        }
    };

    return module;
});
