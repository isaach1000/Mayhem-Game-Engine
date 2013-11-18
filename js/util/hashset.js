// @formatter:off
define(['util/hash'], function(Hash) {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    // TODO

    /**
     * @exports modulePath // TODO: replace modulePath
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        // TODO

        /**
         * Hashset // TODO: replace Hashset here and below
         * @constructor
         */
        Hashset : function() {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var that = this;
            // TODO


            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            Object.defineProperties(that, {
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
            that.add = function(object) {
                // TODO
            };
            
            /**
             * Clear the Hashset instance of all elements
             * @return  {void}
             */
            that.clear = function() {
                // TODO
            };
            
            /**
             * Check if an object is an element of this set
             * @param   {Object} object     -   An object that may be an element
             * @return  {boolean}           Whether or not the object is an element
             */
            that.contains = function(object) {
                // TODO
            };
            
            /**
             * Remove an object 
             * @param {Object} object       - An object
             * @return {boolean}            True if removed object from set, false if object could not be removed from set
             */
            that.remove = function(object) {
                // TODO  
            };
        }
    };

    return module;
});
