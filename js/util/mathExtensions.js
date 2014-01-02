var _ = require('underscore'),
    BoundingBox = require('./boundingBox');

/**
   Math extensions

   @class MathExtensions
 */

//////////////////////////////////
// Private class methods/fields //
//////////////////////////////////
/**
   @module util/mathExtensions
 */
var thisModule = {
    /////////////////////////////////
    // Public class methods/fields //
    /////////////////////////////////

    /**
       Generate a random integer.

       @method  randomInt
       @static
       @param   {integer} [minimum=0] The minimum for the random integer
       (inclusive)
       @param   {integer} maximum The maximum for the random integer
       (not inclusive)
       @return  {integer} A random integer within the specified range.
     */
    randomInt: function(minimum, maximum) {
        return Math.floor(thisModule.randomFloat.apply(this, arguments));
    },

    /**
       Generate a random float.

       @method randomFloat
       @static
       @param   {float} [minimum=0] The minimum for the random float
       (inclusive)
       @param   {float} maximum The maximum for the random float
       (not inclusive)
       @return  {float} A random float within the specified range.
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
        Iterate randomly from 0 to a given maximum. Stores the range of
        numbers internally inside an array, so do not use with large
        numbers.

        @method randomIterator
        @param  {number} max Maximum (not inclusive)
        @param  {Function} f Function to apply to index. Takes a number as a
        parameter. Function can exit iteration by returning true.
        @return {void}
     */
    randomIterator: function(max, f) {
        var range = [];
        for (var i = 0; i < max; i++) {
            range.push(i);
        }
        while (range.length > 0) {
            var randomIdx = thisModule.randomInt(range.length),
                done = f(range[randomIdx]);
            if (done === true) {
                return;
            }
            range.splice(randomIdx, 1);
        }
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
        Rotation matrix

        @method rotationMatrix
        @param  {number}    angle Counterclockwise angle in radian
        @return {Matrix}    Rotation matrix
     */
    rotationMatrix: function(angle) {
        return new thisModule.Matrix([
            Math.cos(angle), -Math.sin(angle), 0,
            Math.sin(angle), Math.cos(angle), 0,
            0, 0, 1
        ], 3, 3);
    },

    /**
        Build a matrix from a 2d array

        @method buildMatrix
        @static
        @param  {Array}     rows 2d array
        @return {Matrix}    Matrix from 2d array
     */
    buildMatrix: function(rows) {
        var
        numRows = rows.length,
            numColumns = rows[0].length;

        return new thisModule.Matrix(_.flatten(rows), numRows, numColumns);
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
        var _this = this;

        /////////////////////////////////////
        // Private instance methods/fields //
        /////////////////////////////////////

        var rows;

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
            _this.forEachEntry(function(entry, row, column) {
                var sum = entry + coefficient * matrix.get(row,
                    column);
                newEntries.push(sum);
            });
            return new thisModule.Matrix(newEntries, _this.numRows,
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

        this.numRows = numRows;
        this.numColumns = numColumns;

        /**
            Apply a function to each element in the matrix (in order)

            @method forEachEntry
            @param  {Function} f Function that takes element as parameter
            @return {void}
         */
        this.forEachEntry = function(f) {
            for (var i = 0; i < numRows; i += 1) {
                for (var j = 0; j < numColumns; j += 1) {
                    f(rows[i][j], i, j);
                }
            }
        };

        /**
            Get an element from the matrix

            @method get
            @param  {integer} row Index of the row to select
            @param  {integer} column Index of the column to select
            @return {number} Number at row and column
         */
        this.get = function(row, column) {
            return rows[row][column];
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
            var column = [];
            for (var i = 0; i < _this.numRows; i += 1) {
                column.push(rows[i][columnIndex]);
            }
            return column;
        };

        /**
            Get a 2d array representing the matrix

            @method toArray2D
            @return {Array} 2d array of matrix
         */
        this.toArray2D = function() {
            var arr = [];
            this.forEachEntry(function(entry, i, j) {
                while (i >= arr.length) {
                    arr.push([]);
                }
                arr[i].push(entry);
            });
            return arr;
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
                vector1, vector2, dotProduct;
            if (_this.numColumns !== matrix.numRows) {
                return null;
            }
            for (var i = 0; i < _this.numRows; i += 1) {
                vector1 = _this.getRow(i);
                for (var j = 0; j < matrix.numColumns; j += 1) {
                    vector2 = matrix.getColumn(j);
                    dotProduct = thisModule.dotProduct(vector1, vector2);
                    newEntries.push(dotProduct);
                }
            }
            return new thisModule.Matrix(newEntries, this.numRows,
                matrix.numColumns);
        };

        /**
            Multiply the matrix by a coefficient

            @method multiplyCoefficient
            @param  {number} k Coefficient
            @return {Matrix} New matrix multiplied by coefficient
         */
        this.multiplyCoefficient = function(k) {
            var newEntries = [];
            this.forEachEntry(function(entry, i, j) {
                newEntries.push(entry * k);
            });
            return new thisModule.Matrix(newEntries, this.numRows,
                this.numRows);
        };

        /**
            LU Decomposition (only for square matrices). Based on
            <a href="http://rosettacode.org/wiki/LU_decomposition#Python">
            this</a> article.

            @method luDecomposition
            @return {Object} Lower, upper, and pivot matrices in hash with
            keys l, u, and p respectively
         */
        this.luDecomposition = function() {
            // Inner helper functio
            function pivotize() {
                var
                n = _this.numRows,
                    id = [],
                    maxIter = function(i) {
                        return _this.get(i, j);
                    };

                for (var j = 0; j < n; j++) {
                    id.push([]);
                    for (var i = 0; i < n; i++) {
                        id[j].push((i === j ? 1 : 0));
                    }
                }
                for (j = 0; j < n; j++) {
                    var row = _.max(_.range(j, n), maxIter);
                    if (j !== row) {
                        var tmp = id[j];
                        id[j] = id[row];
                        id[row] = tmp;
                    }
                }
                return thisModule.buildMatrix(id);
            }

            // Main function
            var n = _this.numRows,
                l = [],
                u = [],
                p = pivotize(),
                i, j, k;
            var a2 = p.multiply(_this).toArray2D();
            for (i = 0; i < n; i++) {
                l.push([]);
                u.push([]);
                for (j = 0; j < n; j++) {
                    l[i].push(0);
                    u[i].push(0);
                }
            }
            for (j = 0; j < n; j++) {
                l[j][j] = 1;
                for (i = 0; i <= j; i++) {
                    var s1 = 0;
                    for (k = 0; k < i; k++) {
                        s1 += u[k][j] * l[i][k];
                    }
                    u[i][j] = a2[i][j] - s1;
                }
                for (i = j; i < n; i++) {
                    var s2 = 0;
                    for (k = 0; k < j; k++) {
                        s2 += u[k][j] * l[i][k];
                    }
                    l[i][j] = (a2[i][j] - s2) / u[j][j];
                }
            }
            return {
                l: thisModule.buildMatrix(l),
                u: thisModule.buildMatrix(u),
                p: p
            };
        };

        /**
            Get the determinant of the matrix (must be a square matrix)

            @method determinant
            @return {number}    The determinant
         */
        this.determinant = function() {
            var luDec = this.luDecomposition(),
                l = luDec.l,
                u = luDec.u,
                p = luDec.p,
                det = 1;

            for (var i = 0; i < this.numRows; i++) {
                det *= l.get(i, i) * u.get(i, i) * p.get(i, i);
            }

            return det;
        };

        /**
            Get the inverse of the matrix (must be a square matrix)

            @method inverse
            @return {Matrix}    The inverse matrix
         */
        this.inverse = function() {
            if (this.numRows === 3) {
                var
                a = this.get(0, 0),
                    b = this.get(0, 1),
                    c = this.get(0, 2),
                    d = this.get(1, 0),
                    e = this.get(1, 1),
                    f = this.get(1, 2),
                    g = this.get(2, 0),
                    h = this.get(2, 1),
                    i = this.get(2, 2),
                    det = a * (e * i - f * h) - b * (i * d - f * g) +
                        c * (d * h - e * g),
                    inv = new thisModule.Matrix([
                        (e * i - f * h), -(b * i - c * h), (b * f -
                            c * e),
                        -(d * i - f * g), (a * i - c * g), -(a * f - c * d),
                        (d * h - e * g), -(a * h - b * g), (a * e -
                            b * d)
                    ], 3, 3);
                return inv.multiplyCoefficient(1 / det);
            } else {
                // TODO: n by n matrix inverse
            }
        };

        // Call generateRows to do setup
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
        matrix = new thisModule.Matrix([
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
                Shear in x

                @property x
                @type {number}
             */
            shx: {
                get: function() {
                    return matrix.get(0, 1);
                },
                set: function(value) {
                    matrix.set(0, 1, value);
                }
            },

            /**
                Shear in y

                @property y
                @type {number}
             */
            shy: {
                get: function() {
                    return matrix.get(1, 0);
                },
                set: function(value) {
                    matrix.set(1, 0, value);
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
                    // Subtract current angle to reset and add new angle
                    this.rotate(-angle + newAngle);
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
            @param  {number} rotateAngle Counterclockwise angle in radian
            @return {void}
         */
        this.rotate = function(rotateAngle) {
            angle = (angle + rotateAngle) % (Math.PI * 2);
            var rotationMatrix = thisModule.rotationMatrix(rotateAngle);
            matrix = matrix.multiply(rotationMatrix);
        };

        /**
            Apply this transformation to a point

            @method applyToPoint
            @param  {Point}     point Point to apply transformation to
            @return {Point}     New point with transformation applied
         */
        this.applyToPoint = function(point) {
            var
            coords = new thisModule.Matrix([point.x, point.y, 1], 3, 1),
                newCoords = matrix.multiply(coords),
                x = newCoords.get(0, 0),
                y = newCoords.get(1, 0);
            return {
                x: x,
                y: y
            };
        };

        /**
            Apply the inverse of the transformation to a point to do
            collision detection

            @method adjustPoint
            @param  {Point}    point Point to apply transformation to
            @return {Point}    A new point with the transformation
         */
        this.adjustPoint = function(point) {
            var
            coords = new thisModule.Matrix([point.x, point.y, 1], 3, 1),
                newCoords = matrix.inverse().multiply(coords),
                x = newCoords.get(0, 0),
                y = newCoords.get(1, 0);
            return {
                x: x,
                y: y
            };
        };
    }
};
module.exports = thisModule;
