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

            /**
                Apply a function to each element in the matrix (in order)

                @method forEach
                @private
                @param  {Function} f Function that takes element as parameter
                @return {void}
             */
            function forEach(f) {
                for (var i = 0; i < numRows; i += 1) {
                    for (var j = 0; j < numColumns; j += 1) {
                        f(entriesArray[i][j], i, j);
                    }
                }
            }

            /**
                Add the elements of a matrix to this matrix

                @method addAll
                @private
                @param  {Matrix} matrix      Other matrix
                @param  {number} coefficient Coefficient to multiply elements of
                other matrix before addition
                @return {Matrix} Result of addition
             */
            function addAll(matrix, coefficient) {
                var newEntries = [];
                if (_this.numRows !== matrix.numRows || _this.numColumns !==
                    matrix.numColumns) {
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

            /**
                Generate rows of the matrix

                @method generateRows
                @private
                @return {void}
             */
            function generateRows() {
                // Store the matrix in a 2d array.
                rows = [];
                for (var i = 0; i < _this.numRows; i += 1) {
                    var row = [];
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

            /**
                Get an element from the matrix

                @method get
                @param  {integer} row Index of the row to select
                @param  {integer} column Index of the column to select
                @return {number} Number at row and column
             */
            this.get = function(row, column) {
                return _this.rows[row][column];
            };

            /**
                Get an element from the matrix

                @method set
                @param  {integer} row Index of the row to select
                @param  {integer} column Index of the column to select
                @param  {number}  value Number at row and column
                @return {void}
             */
            this.set = function(row, column, value) {
                rows[row][column] = value;
            };

            /**
                Get a row from the matrix

                @method getRow
                @param  {integer}  rowIndex Index of row
                @return {Array} Row as array
             */
            this.getRow = function(rowIndex) {
                // Return a clone of the row.
                return rows[rowIndex].slice(0);
            };

            /**
                Get a column from the matrix

                @method getColumn
                @param  {integer} columnIndex Index of column
                @return {Array} Column as array
             */
            this.getColumn = function(columnIndex) {
                var column = [],
                    i;
                for (i = 0; i < _this.numRows; i += 1) {
                    column.push(rows[i][columnIndex]);
                }
                return column;
            };

            /**
                Add this matrix with another matrix

                @method add
                @param  {Matrix} matrix Another matrix
                @return {Matrix} The resulting matrix
             */
            this.add = function(matrix) {
                return addAll(matrix, 1);
            };

            /**
                Subtract another matrix from this matrix

                @method subtract
                @param  {Matrix} matrix Another matrix
                @return {Matrix} The resulting matrix
             */
            this.subtract = function(matrix) {
                return addAll(matrix, -1);
            };

            /**
                Multiply this matrix with another matrix

                @method multiply
                @param  {Matrix} matrix Another matrix
                @return {Matrix} The resulting matrix
             */
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
                return new module.Matrix(newEntries, _this.numRows, matrix.numColumns);
            };

            // Call generateRows
            generateRows();
        },

        /**
            Transformation matrix class

            @class Transformation
            @constructor
         */
        Transformation: function() {
            var _this = this;

            ////////////////////////////
            // Private fields/methods //
            ////////////////////////////

            var
            matrix = new module.Matrix([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            ], 3, 3),
                angle = 0;

            ///////////////////////////
            // Public fields/methods //
            ///////////////////////////

            Object.defineProperties(this, {
                /**
                    Translation in x

                    @property tx
                    @type {number}
                 */
                tx: {
                    get: function() {
                        return matrix.get(0, 2);
                    },
                    set: function(value) {
                        matrix.set(0, 2, value);
                    }
                },

                /**
                    Translation in y

                    @property ty
                    @type {number}
                 */
                ty: {
                    get: function() {
                        return matrix.get(1, 2);
                    },
                    set: function(value) {
                        matrix.set(1, 2, value);
                    }
                },

                /**
                    Scale in x

                    @property sx
                    @type {number}
                 */
                sx: {
                    get: function() {
                        return matrix.get(0, 0);
                    },
                    set: function(value) {
                        matrix.set(0, 0, value);
                    }
                },

                /**
                    Scale in y

                    @property sy
                    @type {number}
                 */
                sy: {
                    get: function() {
                        return matrix.get(1, 1);
                    },
                    set: function(value) {
                        matrix.set(1, 1, value);
                    }
                },

                /**
                    Angle of rotation (counterclockwise in radian)

                    @property angle
                    @type {number}
                 */
                angle: {
                    get: function() {
                        return angle;
                    },
                    set: function(newAngle) {
                        angle = newAngle;
                        // TODO: non-relative rotation
                    }
                }
            });

            /**
                Translate matrix from its current position

                @method translate
                @param  {number}  dx x offset
                @param  {number}  dy y offset
                @return {void}
             */
            this.translate = function(dx, dy) {
                matrix.set(0, 2, dx);
                matrix.set(1, 2, dy);
            };

            /**
                Rotate matrix

                @method rotate
                @param  {number} angle Counterclockwise angle in radian
                @return {void}
             */
            this.rotate = function(angle) {
                var rotationMatrix = new module.Matrix([
                    Math.cos(angle), Math.sin(angle), 0,
                    -Math.sin(angle), Math.cos(angle), 0,
                    0, 0, 1
                ], 3, 3);
                matrix = matrix.multiply(rotationMatrix);
            };
        }
    };
    return module;
});
