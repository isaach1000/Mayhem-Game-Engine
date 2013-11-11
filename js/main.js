/*jslint nomen: true*/
require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore'
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});

require([
        'jquery',
        'underscore',
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
        _,
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
        var mouseTime = new Date(),
            MOUSE_WAIT = 50;
        
        function circleTest(drawer, quadTree) {
            var circ = new Circle.Circle(100, 100, 50, drawer, {
                lineWidth: 4,
                strokeStyle: 'black',
                fillStyle: 'green'
            }),
            startY = circ.y,
            vx = 1,
            vy = 0,
            FRAME_DURATION = 1000 / 60,
            MAX_Y = 300,
            circAnim = new Animation.Animation(circ, function(durationElapsed) {
                circ.x += vx;
                
                vy += Physics.GRAVITY * FRAME_DURATION;
                if (circ.y > MAX_Y && vy > 0) {
                    vy = -vy * Physics.ENERGY_LOSS_RATIO;
                }
                circ.y += vy;

                return circ.x < 1000;
            });
            
            quadTree.insert(circ);
            circ.draw();

            circAnim.start();
        }
        
        function polyTest(drawer, quadTree) {
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
        }

        function rectTest(drawer, quadTree) {
            var rect = new Rectangle.Rectangle(300, 200, 100, 100, drawer, {
                lineWidth: 4,
                strokeStyle: 'black',
                fillStyle: 'red'
            });
            quadTree.insert(rect);
            rect.draw();
        }
        
        function tileTest(drawer, quadTree) {
            var tileMap = new TileMap.TileMap(100, 100, 50, 75, 3, 4, drawer, [{
                lineWidth: 3,
                fillStyle: 'purple'
            }]);
            quadTree.insert(tileMap);
            tileMap.draw();
        }
        
        function mouseTest(quadTree) {
            var mouseX, mouseY;
            
            $('body').mousemove(function(e) {
                mouseX = e.pageX;
                mouseY = e.pageY;
            });
                    
            function mouseCollision() {
                // Set the current time.
                var currentTime = new Date(), i, box, hitShapes, numShapes,
                    shape, newSettings;
                // If the time is greater than MOUSE_WAIT and coordinates are set, perform hit testing.
                if (currentTime - mouseTime >= MOUSE_WAIT && mouseX !== undefined && mouseY !== undefined) {
                    box = new BoundingBox.BoundingBox(mouseX, mouseY, 1, 1);
                    hitShapes = quadTree.queryRange(box);
                    numShapes = hitShapes.length;
                    
                    for (i = 0; i < numShapes; i += 1) {
                        shape = hitShapes[i];
                        if (shape.collisionTest({x: mouseX, y: mouseY})) {
                            shape.drawingSettings.strokeStyle = 'yellow';
                            shape.update();
                        }
                    }
                                                
                    mouseTime = currentTime;
                }
                
                setTimeout(mouseCollision, MOUSE_WAIT);
            }
            
            mouseCollision();
        }
        

        ///////////////////
        // Main function //
        ///////////////////
        
        $(document).ready(function() {
            var WIDTH = 1000, HEIGHT = 600,
            
            bgCanvas = Factory.createCanvas({
                id: 'bgCanvas',
                width: WIDTH + 'px',
                height: HEIGHT + 'px'
            }),
             
            mainCanvas = Factory.createCanvas({
                id: 'mainCanvas',
                width: WIDTH + 'px',
                height: HEIGHT + 'px'
            }),
            
            qBox = new BoundingBox.BoundingBox(0, 0, WIDTH, HEIGHT),
            qTree = new QuadTree.QuadTree(qBox),
            
            bgCtx = bgCanvas[0].getContext('2d'),
            bgDrawer = new CanvasDrawer.CanvasDrawer(bgCtx, bgCanvas.width(), bgCanvas.height()),
            mainCtx = mainCanvas[0].getContext('2d'),
            mainDrawer = new CanvasDrawer.CanvasDrawer(mainCtx, mainCanvas.width(), mainCanvas.height());
                        
            polyTest(bgDrawer, qTree);
            rectTest(bgDrawer, qTree);

            circleTest(mainDrawer, qTree);
            
            tileTest(bgDrawer, qTree);
            
            mouseTest(qTree);
        });
});
