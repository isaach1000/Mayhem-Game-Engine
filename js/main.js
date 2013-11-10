require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery'
    }
});

require([
        'jquery',
        'util/objectUtility',
        'util/factory',
        'util/physics',
        'util/boundingBox',
        'util/quadTree',
        'foundation/canvasDrawer',
        'foundation/animation',
        'foundation/circle',
        'foundation/polygon',
        'foundation/rectangle',
        'sprite/tileMap'
    ],
    function($,
    	ObjUtil,
        Factory,
        Physics,
        BoundingBox,
        QuadTree,
        CanvasDrawer,
        Animation,
        Circle,
        Polygon,
        Rectangle,
        TileMap) {
        "use strict";

        ////////////////////
        // Test functions //
        ////////////////////
        
        var circleTest = function(drawer, quadTree) {
            var circ = new Circle.Circle(100, 100, 50, drawer, {
                lineWidth: 4,
                strokeStyle: 'black',
                fillStyle: 'green'
            });
            quadTree.insert(circ);
            circ.draw();

            var startY = circ.y,
                vx = 1,
                vy = 0,
                FRAME_DURATION = 1000 / 60,
                MAX_Y = 300;
            var circAnim = new Animation.Animation(circ, function(durationElapsed) {
                circ.x += vx;
                
                vy += Physics.GRAVITY * FRAME_DURATION;
                if (circ.y > MAX_Y && vy > 0) {
                    vy = -vy * Physics.ENERGY_LOSS_RATIO;
                }
                circ.y += vy;

                return circ.x < 1000;
            });

            circAnim.start();
        };

        var polyTest = function(drawer, quadTree) {
            var poly = new Polygon.Polygon([
                    {x: 100, y: 200},
                    {x: 300, y: 200},
                    {x: 100, y: 600}
                ], drawer, {
                    lineWidth: 4,
                    strokeStyle: 'black',
                    fillStyle: 'blue'
            });
            quadTree.insert(poly);
            poly.draw();
        };

        var rectTest = function(drawer, quadTree) {
            var rect = new Rectangle.Rectangle(300, 200, 100, 100, drawer, {
                lineWidth: 4,
                strokeStyle: 'black',
                fillStyle: 'red'
            });
            quadTree.insert(rect);
            rect.draw();
        };
        
        var tileTest = function(drawer, quadTree) {
        	var tiles = new TileMap.TileMap(100, 100, 50, 75, 3, 4, drawer, [{
        		lineWidth: 3,
        		fillStyle: 'purple'
        	}]);
        	tiles.draw();
        };
        
        var mouseTime = new Date(),
        	MOUSE_WAIT = 50;
        var mouseTest = function(quadTree) {
        	var mouseX, mouseY;
        	
        	$('body').mousemove(function(e) {
        		mouseX = e.pageX;
        		mouseY = e.pageY;
        	});
        			
    		var mouseCollision = function() {
    			// Set the current time.
	    		var currentTime = new Date();
	    		// If the time is greater than MOUSE_WAIT and coordinates are set, perform hit testing.
	    		if (currentTime - mouseTime >= MOUSE_WAIT && mouseX != null && mouseY != null) { 
	    			var box = new BoundingBox.BoundingBox(mouseX, mouseY, 1, 1),
	    				hitShapes = quadTree.queryRange(box),
	    				numShapes = hitShapes.length;
	    			
	    			for (var i = 0; i < numShapes; i++) {
	    				var shape = hitShapes[i];
	    				if (shape.collisionTest({x: mouseX, y: mouseY})) {
	        				var newSettings = ObjUtil.shallowClone(shape.drawingSettings);
	        				newSettings.strokeStyle = 'yellow';
	        				shape.drawingSettings = newSettings;
	    				}
	    			}
	    				        				
	    			mouseTime = currentTime;
	    		}
	    		
    			setTimeout(mouseCollision, MOUSE_WAIT);
   			};
   			
   			mouseCollision();
        };
        

        ///////////////////
        // Main function //
        ///////////////////
        
        $(document).ready(function() {
        	var WIDTH = 1000, HEIGHT = 600;
        	
            var bgCanvas = Factory.createCanvas({
                id: 'bgCanvas',
                width: WIDTH + 'px',
                height: HEIGHT + 'px'
            }), 
            mainCanvas = Factory.createCanvas({
                id: 'mainCanvas',
                width: WIDTH + 'px',
                height: HEIGHT + 'px'
            });
            
            var qBox = new BoundingBox.BoundingBox(0, 0, WIDTH, HEIGHT),
            	qTree = new QuadTree.QuadTree(qBox);

            var bgCtx = bgCanvas[0].getContext('2d');
            var bgDrawer = new CanvasDrawer.CanvasDrawer(bgCtx, bgCanvas.width(), bgCanvas.height());
            polyTest(bgDrawer, qTree);
            rectTest(bgDrawer, qTree);

            var mainCtx = mainCanvas[0].getContext('2d');
            var mainDrawer = new CanvasDrawer.CanvasDrawer(mainCtx, mainCanvas.width(), mainCanvas.height());
            circleTest(mainDrawer, qTree);
            
            tileTest(bgDrawer, qTree);
            
            mouseTest(qTree);
        });
});
