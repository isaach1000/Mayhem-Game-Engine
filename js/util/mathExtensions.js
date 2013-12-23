/**
   Math extensions

   @class MathExtensions
 */
define([], function() {
    "use strict";

    //////////////////////////////////
    // Private class methods/fields //
    //////////////////////////////////


    /**
       @module util/mathExtensions
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
           Generate a random integer.

           @method  randomInt
           @static
           @param   {int} [minimum=0]       -   The minimum for the random integer (inclusive).
           @param   {int} maximum           -   The maximum for the random integer (not inclusive).
           @return  {int}                   A random integer within the specified range.
         */
        randomInt: function(minimum, maximum) {
            return Math.floor(module.randomFloat(minimum, maximum));
        },

        /**
           Generate a random float.

           @method randomFloat
           @static
           @param   {float} [minimum=0]     -   The minimum for the random float (inclusive).
           @param   {float} maximum         -   The maximum for the random float (not inclusive).
           @return  {float}                 A random float within the specified range.
         */
        randomFloat: function(minimum, maximum) {
            var min, max, range;
            switch (arguments.length) {
                case 1:
                    min = 0;
                    max = minimum;
                    break;
                case 2:
                    min = minimum;
                    max = maximum;
                    break;
            }
            range = max - min;
            return Math.random() * range + min;
        },

        /**
            Get the dot product of two vectors.

            @method dotProduct
            @static
            @param  {Array} vector1 A vector of numbers
            @param  {Array} vector2 A vector of numbers (same length as vector1)
            @return {float} The dot product of the two vectors.
         */
        dotProduct: function(vector1, vector2) {
            var total = 0;

            if (vector1.length !== vector2.length) {
                return null;
            }

            for (var i = 0; i < vector1.length; i += 1) {
                total += vector1[i] * vector2[i];
            }
            return total;
        },

        /**
            A matrix to represent transformations, etc.

            @class Matrix
            @constructor
            @param {Array} entriesArray An array with all of the values in the
            matrix
            @param {number} numRows Number of rows in the matrix
            @param {number} numRows Number of column in the matrix
        */
        Matrix: function(entriesArray, numRows, numColumns) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var _this = this,
                rows;

            function forEach(f) {
                for (var i = 0; i < numRows; i += 1) {
                    for (var j = 0; j < numColumns; j += 1) {
                        f(entriesArray[i][j], i, j);
                    }
                }
            }

            function addAll(matrix, coefficient) {
                var newEntries = [];

                if (_this.numRows !== matrix.numRows ||
                    _this.numColumns !== matrix.numColumns) {
                    return null;
                }

                forEach(function(entry, row, column) {
                    var sum = entry + coefficient * matrix.get(row,
                        column);
                    newEntries.push(sum);
                });

                return new module.Matrix(newEntries, _this.numRows,
                    _this.numColumns);
            }

            function generateRows() {
                // Store the matrix in a 2d array.
                var row;
                rows = [];
                for (var i = 0; i < _this.numRows; i += 1) {
                    row = [];
                    for (var j = 0; j < _this.numColumns; j += 1) {
                        row.push(entriesArray[i * _this.numColumns + j]);
                    }
                    rows.push(row);
                }
            }

            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////

            _this.numRows = numRows;

            _this.numColumns = numColumns;

            this.get = function(row, column) {
                return _this.rows[row][column];
            };

            this.set = function(row, column, value) {
                rows[row][column] = value;
            };

            this.getRow = function(rowIndex) {
                // Return a clone of the row.
                return rows[rowIndex].slice(0);
            };

            this.getColumn = function(columnIndex) {
                var column = [],
                    i;
                for (i = 0; i < _this.numRows; i += 1) {
                    column.push(rows[i][columnIndex]);
                }
                return column;
            };

            this.add = function(matrix) {
                return addAll(matrix, 1);
            };

            this.subtract = function(matrix) {
                return addAll(matrix, -1);
            };

            this.multiply = function(matrix) {
                var newEntries = [],
                    i, j, vector1, vector2, dotProduct;

                if (_this.numColumns !== _this.numRows) {
                    return null;
                }

                for (i = 0; i < _this.numRows; i += 1) {
                    vector1 = _this.getRow(i);
                    for (j = 0; j < matrix.numColumns; j += 1) {
                        vector2 = matrix.getColumn(j);
                        dotProduct = module.dotProduct(vector1, vector2);
                        newEntries.push(dotProduct);
                    }
                }
                return new module.Matrix(newEntries, _this.numRows,
                    matrix.numColumns);
            };

            // Make the instance immutable.
            Object.freeze(_this);
        }
    };

    return module;
});
