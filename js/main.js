require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery'
    }
});

require([
        'jquery',
        'util/factory',
        'foundation/canvasDrawer',
        'foundation/cube',
        'foundation/circle',
        'sprite/tileMap',
        'foundation/animation'
    ],
    function($,
        Factory,
        CanvasDrawer,
        Cube,
        Circle,
        TileMap,
        Animation) {
        $(document).ready(function() {

            var WIDTH = '1000px',
                HEIGHT = '1000px',
                CSS_CANVAS = {
                    position: 'absolute',
                    top: 0,
                    left: 0
                };

            var backgroundCanvas = Factory.createCanvas({
                id:     'backgroundCanvas',
                width:  WIDTH,
                height: HEIGHT
            });
            var bgCSS = $.extend({'z-index': 0}, CSS_CANVAS);
            backgroundCanvas.css(bgCSS);

            var mainCanvas = Factory.createCanvas({
                id:     'mainCanvas',
                width:  WIDTH,
                height: HEIGHT,
                position: 'absolute',
                top: 0,
                left: 0,
                'z-index': 1
            });
            var mainCSS = $.extend({'z-index': 1}, CSS_CANVAS);
            mainCanvas.css(bgCSS);

            var ctxBg = backgroundCanvas[0].getContext('2d');
            var ctx = mainCanvas[0].getContext('2d');

            var bgDrawer = new CanvasDrawer.CanvasDrawer(ctxBg);
            var drawer = new CanvasDrawer.CanvasDrawer(ctx); 


            // Test functions
            
            var circleTest = function() {
                var circ = new Circle.Circle(200, 100, 50, drawer, {
                    lineWidth: 3,
                    fillStyle: 'green',
                    strokeStyle: 'black'
                });
                var MAX_Y = 500, GRAV = 0.001, MAX_DURATION = 4000, oldDuration = 0, vy = 0;
                var anim = new Animation.Animation(circ, function(durationElapsed) {
                    circ.x = 0.2 * durationElapsed;
                    var betweenFrames = durationElapsed - oldDuration;
                    vy += GRAV * Math.pow(betweenFrames, 2);
                    circ.y += vy;
                    if (circ.y > MAX_Y && vy > 0) {
                        vy = -vy;
                    }
                    oldDuration = durationElapsed;

                    return durationElapsed < MAX_DURATION;
                });
                circ.draw();
                anim.start();
            };

            var tilesTest = function() {
                var tiles = new TileMap.TileMap(500, 100, 50, 50, 5, 5, bgDrawer, [{
                    lineWidth: 3,
                    fillStyle: 'green',
                    strokeStyle: 'black'
                }]);
                tiles.projectIsometric();
                tiles.draw();
            };

            var cubeTest = function() {
                var cube = new Cube.Cube(500, 100, 50, 125, 125, 125, drawer, {
                    lineWidth: 3,
                    fillStyle: 'red',
                    strokeStyle: 'black'
                });
                
                var oldDuration = 0;
                var anim = new Animation.Animation(cube, function(durationElapsed) {
                    var betweenFrames = durationElapsed - oldDuration;
                    for (var i = 0; i < 8; i++) {
                        var point = cube.points[i];
                        point.y -= betweenFrames / 5;
                    }
                    oldDuration = durationElapsed;

                    return durationElapsed < 1000;
                });

                cube.draw();
                anim.start();
            };


            // Perform test
            
            tilesTest();
            cubeTest(); 
        });
});
