define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////

    var DEFAULT_SIZE = 10;

    /**
       @module modulePath
       @module modulePath
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
           @constructor
         */
        MinHeap: function() {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var
            size = DEFAULT_SIZE,
                comparator = function(data1, data2) {
                    return data1 - data2;
                };
            if (arguments.length === 2) {
                // parameters are size then comparator
                size = arguments[0];
                comparator = arguments[1];
            } else if (arguments.length === 1) {
                comparator = arguments[0];
            } else if (arguments.length > 2) {
                throw new Error(
                    'Invalid parameters for MinHeap constructor');
            }

            var
            _this = this,
                data = new Array(size),
                heapSize = 0;

            function getLeftChildIndex(nodeIndex) {
                return 2 * nodeIndex + 1;
            }

            function getRightChildIndex(nodeIndex) {
                return 2 * nodeIndex + 2;
            }

            function getParentIndex(nodeIndex) {
                return Math.floor((nodeIndex + 1) / 2) - 1;
            }

            function bubbleUp(nodeIndex) {
                if (nodeIndex === 0) {
                    return;
                }
                var parentIndex = getParentIndex(nodeIndex);
                if (comparator(data[parentIndex], data[nodeIndex]) > 0 &&
                    parentIndex >= 0) {
                    var newNodeIndex = data[parentIndex];
                    data[parentIndex] = data[nodeIndex];
                    data[nodeIndex] = newNodeIndex;
                    nodeIndex = parentIndex;
                    bubbleUp(nodeIndex);
                } else {
                    return;
                }
            }

            function removeMin() {
                if (heapSize === 0) {
                    return;
                }
                data[0] = data[heapSize - 1];
                heapSize--;
                if (heapSize > 0) {
                    bubbleDown(0);
                }
            }

            function bubbleDown(nodeIndex) {
                var
                leftChildIndex = getLeftChildIndex(nodeIndex),
                    rightChildIndex = getRightChildIndex(nodeIndex),
                    smallerValueIndex;
                // This long if else assigns the smaller child
                if (leftChildIndex < heapSize && rightChildIndex < heapSize) {
                    if (comparator(data[leftChildIndex],
                        data[rightChildIndex]) < 0) {
                        smallerValueIndex = leftChildIndex;
                    } else {
                        smallerValueIndex = rightChildIndex;
                    }
                } else if (leftChildIndex < heapSize) {
                    smallerValueIndex = leftChildIndex;
                } else if (rightChildIndex < heapSize) {
                    smallerValueIndex = rightChildIndex;
                } else {
                    return;
                }

                if (smallerValueIndex >= 0 &&
                    comparator(data[smallerValueIndex], data[nodeIndex]) <
                    0) {
                    var temp = data[nodeIndex];
                    data[nodeIndex] = data[smallerValueIndex];
                    data[smallerValueIndex] = temp;
                    nodeIndex = smallerValueIndex;
                    bubbleDown(nodeIndex);
                }
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            this.add = function(object) {
                heapSize++;
                var currentIndex = heapSize - 1;
                data[currentIndex] = object;
                bubbleUp(currentIndex);
            };

            this.poll = function() {
                var min = data[0];
                removeMin();
                return min;
            };

            this.peek = function() {
                return data[0];
            };

            this.clear = function() {
                heapSize = 0;
                data.forEach(function(element, index) {
                    delete data[index];
                });
            };

            Object.defineProperties(this, {
                length: {
                    get: function() {
                        return heapSize;
                    }
                }
            });
        }
    };

    return module;
});
