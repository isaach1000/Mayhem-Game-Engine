define(['util/mathExtensions'], function(MathExtensions) {
    "use strict";

    /**
     * @module util/matrix
     */
    var module = {
        /////////////////////////////////
        // Public class methods/fields //
        /////////////////////////////////

        /**
         * Matrix
         *
         * @constructor
         */
        Matrix: function(entriesArray, numRows, numColumns) {
            /////////////////////////////////////
            // Private instance methods/fields //
            /////////////////////////////////////

            var _this = this,
                rows;

            function forEach(f) {
                var i, j;
                for (i = 0; i < numRows; i += 1) {
                    for (j = 0; j < numColumns; j += 1) {
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
                    var sum = entry + coefficient * matrix.get(row, column);
                    newEntries.push(sum);
                });

                return new module.Matrix(newEntries, _this.numRows, _this.numColumns);
            }

            function generateRows() {
                // Store the matrix in a 2d array.
                var row, i, j;
                rows = [];
                for (i = 0; i < _this.numRows; i += 1) {
                    row = [];
                    for (j = 0; j < _this.numColumns; j += 1) {
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
                        dotProduct = MathExtensions.dotProduct(vector1, vector2);
                        newEntries.push(dotProduct);
                    }
                }
                return new module.Matrix(newEntries, _this.numRows, matrix.numColumns);
            };

            // Make the instance immutable.
            Object.freeze(_this);
        }
    };

    return module;
});
