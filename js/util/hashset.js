// @formatter:off
define(['util/hash'], function(Hash) {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    // TODO

    /**
     * @exports util/hashset
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        // TODO

        /**
         * Hashset
         * @constructor
         */
        Hashset : function() {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var _this = this;
            // TODO


            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            Object.defineProperties(this, {
                /**
                 * The size of the Hashset
                 * @type {integer}
                 * @memberOf module:util/hashset.Hashset
                 * @instance
                 */
                length: {
                    get: function() {
                        // TODO
                    }
                } 
            });

            /**
             * Add an object
             * @param   {Object} object     -   Object to add
             * @return  {boolean}           Whether or not the insertion was successful
             */
            this.add = function(object) {
                // TODO
            };
            
            /**
             * Clear the Hashset instance of all elements
             * @return  {void}
             */
            this.clear = function() {
                // TODO
            };
            
            /**
             * Check if an object is an element of this set
             * @param   {Object} object     -   An object _this may be an element
             * @return  {boolean}           Whether or not the object is an element
             */
            this.contains = function(object) {
                // TODO
            };
            
            /**
             * Remove an object 
             * @param {Object} object       - An object
             * @return {boolean}            True if removed object from set, false if object could not be removed from set
             */
            this.remove = function(object) {
                // TODO  
            };
        }
    };

    return module;
});
