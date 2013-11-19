define(['util/mathExtensions'], function(MathExtensions) {
    "use strict";
    
    /**
     * @exports util/matrix
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
            
            var that = this,
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

                if (that.numRows !== matrix.numRows ||
                    that.numColumns !== matrix.numColumns) {
                    return null;
                }

                forEach(function(entry, row, column) {
                    var sum = entry + coefficient * matrix.get(row, column);
                    newEntries.push(sum);
                });

                return new module.Matrix(newEntries, that.numRows, that.numColumns);
            }

            function generateRows() {
                // Store the matrix in a 2d array.
                var row, i, j;
                rows = [];
                for (i = 0; i < that.numRows; i += 1) {
                    row = [];
                    for (j = 0; j < that.numColumns; j += 1) {
                        row.push(entriesArray[i * that.numColumns + j]);
                    }
                    rows.push(row);
                }
            }
            
            ////////////////////////////////////
            // Public instance methods/fields //
            ////////////////////////////////////
            
            that.numRows = numRows;
            
            that.numColumns = numColumns;

            this.get = function(row, column) {
                return that.rows[row][column];
            };

            this.set = function(row, column, value) {
                rows[row][column] = value;
            };

            this.getRow = function(rowIndex) {
                // Return a clone of the row.
                return rows[rowIndex].slice(0);
            };

            this.getColumn = function(columnIndex) {
                var column = [], i;
                for (i = 0; i < that.numRows; i += 1) {
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
                var newEntries = [], i, j, vector1, vector2, dotProduct;

                if (that.numColumns !== that.numRows) {
                    return null;
                }

                for (i = 0; i < that.numRows; i += 1) {
                    vector1 = that.getRow(i);
                    for (j = 0; j < matrix.numColumns; j += 1) {
                        vector2 = matrix.getColumn(j);
                        dotProduct = MathExtensions.dotProduct(vector1, vector2);
                        newEntries.push(dotProduct);
                    }
                }
                return new module.Matrix(newEntries, that.numRows, matrix.numColumns);
            };

            // Make the instance immutable.
            Object.freeze(that);
        }
    };

    return module; 
});
