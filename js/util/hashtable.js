// @formatter:off
define(['util/hash', 'util/hashset'], function(Hash, Hashset) {
    "use strict";
    // @formatter:on

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    // TODO


    /**
     * @exports util/hashtable
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        // TODO


        /**
         * Hashtable
         * @constructor
         */
        Hashtable: function() {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var _this = this;
            
            var hashset = new Hashset.Hashset();

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            this.put = function(key, value) {
                var entry = {
                    key: key,
                    value: value
                };
                return hashset.add(entry, key);
            };
            
            this.containsKey = function(key) {
                return hashset.contains(key, key);
            };
            
            this.remove = function(key) {
                return hashset.remove(key, key);
            };
            
            this.clear = function() {
                hashset.clear();
            };
            
            Object.defineProperties(this, {
                length: {
                    get: function() {
                        return hashset.length;
                    }
                } 
            });
        }
    };

    return module;
});
