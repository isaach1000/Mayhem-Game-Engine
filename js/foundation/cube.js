define(['foundation/polygon', 'util/mathExtensions'
    ], function(Polygon, MathExt) {
    "use strict";

    // Private class methods/fields

    var grayCode = function(number) {
    	var bitStr = number.toString(2);
    	var bitLen = bitStr.length;
    	if (bitLen < 3) {
    		var missing = 3 - bitLen,
    			extraZeroes = [];
    		for (var i = 0; i < missing; i++) {
    			extraZeroes.push('0')
    		}
    		bitStr = extraZeroes.join('') + bitStr;
    	}

    	var result = [];
    	for (var i = 1; i >= 0; i--) {
    		var smallBit = parseInt(bitStr.charAt(i + 1));
    		var bigBit = parseInt(bitStr.charAt(i));
    		result.push(smallBit ^ bigBit ? '1' : '0');
    	}
    	result.push(bitStr.charAt(0));

    	return result.reverse().join('');
    };
    
    /**
     * @exports foundation/cube
     */
    var module = {
        // Public class methods/fields
        
        /**
         * Make a cube.
         * @param {[type]} x               [description]
         * @param {[type]} y               [description]
         * @param {[type]} z               [description]
         * @param {[type]} width           [description]
         * @param {[type]} height          [description]
         * @param {[type]} length          [description]
         * @param {[type]} drawer          [description]
         * @param {[type]} drawingSettings [description]
         */
        Cube: function(x, y, z, width, height, length, drawer, drawingSettings) {
            // Private instance methods/fields
            
            var points2d;
            var _this = this;

            var projectIsometric = function() {
                points2d = [];
                for (var ptIdx = 0; ptIdx < 8; ptIdx++) {
                    var point = _this.points[ptIdx];
                    points2d.push(MathExt.projectIsometric(point));
                }
            };

            var drawFace = function(faceArray) {
                var facePoints = [];
                for (var i = 0; i < 4; i++) {
                    var index = faceArray[i];
                    facePoints.push(points2d[index]);
                }
                var faceRect = new Polygon.Polygon(facePoints, drawer, drawingSettings);
                faceRect.draw();
                return faceRect;
            };


            // Public instance methods/fields

            this.faces = [];

            // Generate the points of the cube.
            this.points = [];
            var counter = 8;
            while (counter--) {
            	// Use Gray codes to generate the points in order.
            	var gray = parseInt(grayCode(counter), 2);
    			var ptX = x + ((gray & 1) ? length : 0),
                    ptY = y + ((gray & 2) ? width : 0),
                    ptZ = z + ((gray & 4) ? height : 0);
    			this.points.push({x: ptX, y: ptY, z: ptZ});
    		}

            this.draw = function() {
                projectIsometric();

                // Faces
                var bottom = [6, 7, 0, 1],
                    back = [0, 1, 2, 3],
                    top = [2, 3, 4, 5],
                    front = [4, 5, 6, 7],
                    left = [0, 3, 4, 7],
                    right = [1, 2, 5, 6],
                    indexFaces = [left, back, bottom, right, front, top];

                this.faces = [];
                for (var i = 0; i < 6; i++) {
                    var face = drawFace(indexFaces[i]);
                    this.faces.push(face);
                }
            };

            this.clear = function() {
                for (var i = 0; i < 6; i++) {
                    var face = this.faces[i];
                    face.clear();
                }
            };
        }
    };

    return module; 
});

