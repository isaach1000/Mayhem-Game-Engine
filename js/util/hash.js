var _ = require('underscore');

/**
   Hash class used to generate hashcodes for JavaScript objects. The hashcode
   is stored as a property of the object, but it is set to non-enumerable and
   cannot be changed, thereby guaranteeing the consistency of hashcodes.

   @module util/hash
   @class Hash
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////
var currentHash = 0,
    INIT_CAPACITY = 16,
    LOAD_FACTOR = 0.5;
var thisModule = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
       Return a hashcode for this object. Does not conform to the Java
       standard that two objects that are structurally identical should
       yield the same hashcode.

       @param   {Object} object Object to get hashcode for
       @return  {integer} Hashcode for object
     */
    hashcode: function(object) {
        if (object._hashId === undefined) {
            Object.defineProperty(object, '_hashId', {
                value: currentHash,
                enumerable: false
            });
            currentHash++;
        }
        return object._hashId;
    },

    /**
        Hashset data structure used to store unique objects without
        duplicates. The hashset will add identical items of the same type,
        as long as they are not the exact same object (or the hashcode
        property is identical). For more info, see the {{#crossLink Hash}}
        {{/crossLink}}.

       @class Hashset
    */

    /**
       @class Hashset
       @constructor
     */
    Hashset: function() {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var bucket = new Array(INIT_CAPACITY),
            size = 0,
            capacity = INIT_CAPACITY,
            indicesTaken = [];

        /**
           Resolve a collision in the hashset.

           @method resolveCollision
           @private
           @param  {Object} object
           @param  {integer} index Index where collision occurred
           @return {boolean} Whether or not the item was added to the set
         */
        function resolveCollision(object, index) {
            var location = bucket[index];
            if (_.isArray(location)) {
                if (_.contains(location, object)) {
                    return false;
                } else {
                    location.push(object);
                    return true;
                }
            } else {
                bucket[index] = [location, object];
                return true;
            }
        }
        /**
           Add the index of a location that is currently occupied in the
           array

           @method addIndex
           @private
           @param  {integer} idx Index of occupied location
         */
        function addIndex(idx) {
            // Add idx to the sorted indicesTaken array
            var spot = _.sortedIndex(indicesTaken, idx);
            if (indicesTaken[spot] !== idx) {
                indicesTaken.splice(spot, 0, idx);
            }
        }

        /**
           Helper method to rehash the array when the objects inserted
           exceeds half of the total capacity

           @method rehash
           @private
           @return {void}
         */
        function rehash() {
            // Create new bucket that is double the size
            var
            oldBucket = bucket,
                oldIndices = indicesTaken,
                hashTarget;

            capacity *= 2;
            bucket = new Array(capacity);
            indicesTaken = [];
            // Transfer all elements to new array
            var idxLen = oldIndices.length;
            for (var i = 0; i < idxLen; i++) {
                var object = oldBucket[oldIndices[i]];
                if (_.isArray(object)) {
                    var subArray = object,
                        subArrayLen = subArray.length;
                    for (var j = 0; j < subArrayLen; j++) {
                        var element = subArray[j];
                        hashTarget = element.key || element;
                        insert(element, hashTarget);
                    }
                } else {
                    hashTarget = object.key || object;
                    insert(object, hashTarget);
                }
            }
        }

        /**
           Insert an object into the internal array.

           @method insert
           @private
           @param  {Object} object An object to insert into the array
           @param  {Object} [hashTarget=`object`] An object used to generate
           a hashcode
           @return {boolean} Whether or not the object was inserted into the
           array
         */
        function insert(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            var index = thisModule.hashcode(hashTarget) % capacity,
                location = bucket[index];
            var locKey;
            if (location) {
                locKey = location.key;
            }
            if (location === undefined) {
                bucket[index] = object;
                addIndex(index);
                return true;
            } else if (location === object || originalTarget === locKey) {
                return false;
            } else {
                return resolveCollision(object, index);
            }
        }

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        Object.defineProperties(this, {
            /**
               The size of the Hashset

               @property length
               @type {integer}
             */
            length: {
                get: function() {
                    return size;
                }
            }
        });
        /**
           Add an object

           @method add
           @param   {Object} object Object to add
           @param   {Object} [hashTarget] Object to hash
           @return  {boolean} Whether or not the insertion was successful
         */
        this.add = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                object)) {
                return false;
            }
            var inserted = insert(object, hashTarget);
            if (inserted) {
                size++;
                if (size / capacity > LOAD_FACTOR) {
                    rehash();
                }
                return true;
            }
            return false;
        };

        /**
            Get the union of this set with another set

            @method union
            @param  {Hashset} otherSet Other set
            @return {Hashset} Union of both set
         */
        this.union = function(otherSet) {
            var unionSet = new Hash.Hashset();
            _this.forEach(function(elem) {
                unionSet.add(elem);
            });
            otherSet.forEach(function(elem) {
                unionSet.add(elem);
            });
            return unionSet;
        };

        /**
           Clear the Hashset instance of all elements

           @method clear
           @return  {void}
         */
        this.clear = function() {
            bucket = new Array(INIT_CAPACITY);
            size = 0;
            capacity = INIT_CAPACITY;
            indicesTaken = [];
        };

        /**
           Check if an object is an element of this set

           @method contains
           @param   {Object} object An object that may be an element
           @return  {boolean} Whether or not the object is an element
         */
        this.contains = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                object)) {
                return false;
            }
            var index = thisModule.hashcode(hashTarget) % capacity,
                location = bucket[index];
            var locKey;
            if (location) {
                locKey = location.key;
            }
            if (location === object || originalTarget === locKey) {
                return true;
            } else if (_.isArray(location)) {
                for (var i = 0; i < location.length; i++) {
                    var elem = location[i];
                    var elemKey;
                    if (elem) {
                        elemKey = elem.key;
                    }
                    if (elem === object || originalTarget === elemKey) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
            Check if this Hashset instance is the same as another
            @method equals
            @param  {Hashset} otherSet Other set to compare with
            @return {boolean} True if equal, false otherwise
         */
        this.equals = function(otherSet) {
            if (this.length !== otherSet.length) {
                return false;
            }

            var result = true;
            this.forEach(function(elem) {
                if (!otherSet.contains(elem)) {
                    result = false;
                    // Terminate iteration
                    return true;
                }
            });
            return result;
        };

        /**
           Remove an object

           @method remove
           @param {Object} object An object
           @return {boolean} True if removed object from set, false if
           object could not be removed from set
         */
        this.remove = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            if (!_.isObject(object) || _.isArray(object) || _.isFunction(
                object)) {
                return false;
            }
            var contained = _this.contains(object, originalTarget);
            if (contained) {
                var index = thisModule.hashcode(hashTarget) % capacity,
                    location = bucket[index];
                var locKey;
                if (location) {
                    locKey = location.key;
                }
                if (location === object || locKey === originalTarget) {
                    // Set bucket at index to undefined
                    delete bucket[index];
                    indicesTaken = _.without(indicesTaken, index);
                    size--;
                    return true;
                } else {
                    for (var i = 0; i < location.length; i++) {
                        if (location[i] === object) {
                            // Set location at i to undefined
                            delete location[i];
                            size--;
                            return true;
                        }
                    }
                }
            }
            return false;
        };

        /**
            Get the object from the set
            @method get

            @param  {Object} object Object to get
            @param  {Object} hashTarget Object to hash
            @return {Object} Object from set if it exists, null otherwise.
         */
        this.get = function(object, hashTarget) {
            var originalTarget = hashTarget || null;
            hashTarget = hashTarget || object;
            var index = thisModule.hashcode(hashTarget) % capacity,
                location = bucket[index];
            var locKey;
            if (location) {
                locKey = location.key;
            }
            if (location === undefined) {
                return null;
            } else if (location === object || locKey === originalTarget) {
                return location;
            } else {
                var arrLen = location.length;
                for (var i = 0; i < arrLen; i++) {
                    var element = location[i],
                        elemKey = element.key;
                    if (element === object || elemKey ===
                        originalTarget) {
                        return element;
                    }
                }
                return null;
            }
        };

        /**
            Apply function to each object in Hashset instance

            @method forEach
            @param  {Function} f Function that takes an element of the
            Hashset as a parameter. Function can terminate forEach method by
            returning true.
            @return {void}
         */
        this.forEach = function(f) {
            var numIndices = indicesTaken.length,
                result;

            for (var i = 0; i < numIndices; i++) {
                var idx = indicesTaken[i],
                    current = bucket[idx];
                if (_.isArray(current)) {
                    var arrLen = current.length;
                    for (var j = 0; j < arrLen; j++) {
                        var element = current[j];
                        result = f(element);
                        if (result === true) {
                            return;
                        }
                    }
                } else {
                    result = f(current);
                    if (result === true) {
                        return;
                    }
                }
            }
        };

        /**
            Get the elements in the Hashset instance in an array

            @method toArray
            @return {Array} Array of elements
         */
        this.toArray = function() {
            var arr = [];
            this.forEach(function(elem) {
                arr.push(elem);
            });
            return arr;
        };
    },

    /**
        Hashtable implementation to map objects to other objects.

        @class Hashtable
     */

    /**
        @class Hashtable
        @constructor
     */
    Hashtable: function() {
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var hashset = new thisModule.Hashset();

        ////////////////////////////////////
        // Public instance methods/fields //
        ////////////////////////////////////

        /**
            Put new entry in Hashtable

            @method put
            @param  {Object} key Entry key
            @param  {Object} value Entry value
            @return {boolean} True if successfully added new entry, false
            otherwise
         */
        this.put = function(key, value) {
            var entry = {
                key: key,
                value: value
            };
            return hashset.add(entry, key);
        };

        /**
            Get value of entry with given key.

            @method get
            @param  {Object} key Key for entry
            @return {Object} Value of entry
         */
        this.get = function(key) {
            return hashset.get(key, key).value;
        };

        /**
            Check whether or not Hashtable contains a given key

            @method containsKey
            @param  {Object} key The key to check for
            @return {boolean} Whether or not key is in Hashtable
         */
        this.containsKey = function(key) {
            return hashset.contains(key, key);
        };

        /**
            Remove an entry from Hashtable instance
            @method remove
            @param  {Object} key Key of entry to remove
            @return {boolean} Whether or not entry was successfully removed
         */
        this.remove = function(key) {
            return hashset.remove(key, key);
        };

        /**
            Clear all entries from Hashtable instance
            @method clear
            @return {void}
         */
        this.clear = function() {
            hashset.clear();
        };

        /**
            Apply function to each entry in Hashtable instance

            @method forEach
            @param  {Function} f Function that takes entry as parameter.
            Entry has key and value properties.
            @return {void}
         */
        this.forEach = function(f) {
            hashset.forEach(function(entry) {
                f(entry.key, entry.value);
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
module.exports = thisModule;
