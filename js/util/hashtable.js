// @formatter:off
define(['util/hash', 'util/hashset'], function(Hash, Hashset) {
    "use strict";
    // @formatter:on

    /**
     * @module util/hashtable
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Hashtable
         * @constructor
         */
        Hashtable: function() {
            var _this = this;

            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

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

            this.get = function(key) {
                return hashset.get(key, key).value;
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

            this.forEach = function(f) {
                hashset.forEach(function(entry) {
                    var doneSearching = f(entry.key, entry.value);
                    if (doneSearching === true) {
                        return;
                    }
                });
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
