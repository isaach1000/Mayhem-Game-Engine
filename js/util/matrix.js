define(['util/mathExtensions'], function(MathExtensions) {
    "use strict";

    // Private class methods/fields
    
    var ISO_MATRIX;

    
    /**
     * @exports util/matrix
     */
    var module = {
        // Public class methods/fields

        /**
         * Matrix
         *
         * @constructor
         */
        Matrix: function(entriesArray, numRows, numColumns) {           
            // Private instance methods/fields
            
            var forEach = function(f) {
                for (var i = 0; i < numRows; i++) {
                    for (var j = 0; j < numColumns; j++) {
                        f(entriesArray[i][j], i, j);
                    }
                }
            };

            var addAll = function(matrix, coefficient) {
                if (this.numRows !== matrix.numRows ||
                    this.numColumns !== matrix.numColumns) {
                    return null;
                }

                var newEntries = [];
                forEach(function(entry, row, column) {
                    var sum = entry + coefficient * matrix.get(row, column);
                    newEntries.push(sum);
                });

                return new module.Matrix(newEntries, this.numRows, this.numColumns);
            };

            
            // Public instance methods/fields
            
            this.numRows = numRows;
            this.numColumns = numColumns;

            // Store the matrix in a 2d array.
            var rows = [];
            for (var i = 0; i < this.numRows; i++) {
                var row = [];
                for (var j = 0; j < this.numColumns; j++) {
                    row.push(entriesArray[i * this.numColumns + j]);
                }
                rows.push(row);
            }

            this.get = function(row, column) {
                return rows[row][column];
            };

            this.set = function(row, column, value) {
                rows[row][column] = value;
            }

            this.getRow = function(rowIndex) {
                // Return a clone of the row.
                return rows[rowIndex].slice(0);
            };

            this.getColumn = function(columnIndex) {
                var column = [];
                for (var i = 0; i < this.numRows; i++) {
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
                if (this.numColumns !== this.numRows) {
                    return null;
                }

                var newEntries = [];
                for (var i = 0; i < this.numRows; i++) {
                    var vector1 = this.getRow(i);
                    for (var j = 0; j < matrix.numColumns; j++) {
                        var vector2 = matrix.getColumn(j),
                            dotProduct = MathExtensions.dotProduct(vector1, vector2);
                        newEntries.push(dotProduct);
                    }
                }
                return new module.Matrix(newEntries, this.numRows, matrix.numColumns);
            }

            // Make the instance immutable.
            Object.freeze(this);
        },

        identity: function() {
            return new module.Matrix
        }
    };

    Object.defineProperty(module, 'ISOMETRIC_MATRIX', {get: function() {
        if (ISO_MATRIX == null) {
            var root2 = Math.sqrt(2),
                root3 = Math.sqrt(3),
                root6 = Math.sqrt(6),
                isoArray = [root3, 0, -root3, 1, 2, 1, root2, -root2, root2];
            for (var i = 0; i < 9; i++) {
                isoArray[i] /= root6;
            }
            ISO_MATRIX = new module.Matrix(isoArray, 3, 3);
        }

        return ISO_MATRIX;
    }});

    return module; 
});
