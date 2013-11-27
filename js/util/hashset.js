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

            var _this = this,
                bucket,
                capacity = 101,
                loadFactor,
                size = 0;
                


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
                var index = Hash.hashcode(object),
                n = bucket[index];
                
                if (contains(object)) {
                    return false;
                }
                size += 1;
                if ( size/capacity > loadFactor ) {
                     rehash();
                 }
                int index = hash(elt);
                bucket[index] = new Node(elt, bucket[index]);
                 return true;
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
                var index = hash.hashcode(object),
                n = bucket[index];
                
                while (n !== null) {
                    if (n.data === object) {
                        return true;
                    }
                    n = n.next;
                }
                return false;
            };
            
            /**
             * Remove an object 
             * @param {Object} object       - An object
             * @return {boolean}            True if removed object from set, false if object could not be removed from set
             */
            this.remove = function(object) {
                var index = hash.hashcode(object),
                n = bucket[index];
                
                
            };
        }
    };

    return module;
});
