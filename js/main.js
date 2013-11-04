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
        'foundation/animation',
        'foundation/circle',
        'foundation/polygon',
        'foundation/rectangle'
    ],
    function($,
        Factory,
        CanvasDrawer,
        Animation,
        Circle,
        Polygon,
        Rectangle) {

        ////////////////////
        // Test functions //
        ////////////////////
        
        var circleTest = function(drawer) {
            var circ = new Circle.Circle(100, 100, 50, drawer, {
                lineWidth: 4,
                strokeStyle: 'black',
                fillStyle: 'green'
            });
            circ.draw();

            var startY = circ.y,
                vx = 1,
                vy = 0,
                g = 0.008,
                maxDur = 10000,
                oldDuration = 0;
                MAX_Y = 500;
            var circAnim = new Animation.Animation(circ, function(durationElapsed) {
                circ.x += vx;
                
                var betweenFrames = durationElapsed - oldDuration;
                vy += g * betweenFrames;
                if (circ.y > MAX_Y && vy > 0) {
                    vy = -vy;
                }
                circ.y += vy;

                oldDuration = durationElapsed;

                return durationElapsed < maxDur;
            });

            circAnim.start();
        };

        var polyTest = function(drawer) {
            var poly = new Polygon.Polygon([
                    {x: 100, y: 200},
                    {x: 300, y: 200},
                    {x: 100, y: 300}
                ], drawer, {
                    lineWidth: 4,
                    strokeStyle: 'black',
                    fillStyle: 'blue'
            });
            poly.draw();
        };

        var rectTest = function(drawer) {
            var rect = new Rectangle.Rectangle(300, 200, 100, 200, drawer, {
                lineWidth: 4,
                strokeStyle: 'black',
                fillStyle: 'red'
            });
            rect.draw()
        };

        ///////////////////
        // Main function //
        ///////////////////
        
        $(document).ready(function() {
            var bgCanvas = Factory.createCanvas({
                id: 'bgCanvas',
                width: '1000px',
                height: '600px'
            }),
                mainCanvas = Factory.createCanvas({
                id: 'mainCanvas',
                width: '1000px',
                height: '600px'
            });

            var mainCtx = mainCanvas[0].getContext('2d');
            var mainDrawer = new CanvasDrawer.CanvasDrawer(mainCtx); 
            circleTest(mainDrawer);

            var bgCtx = bgCanvas[0].getContext('2d');
            var bgDrawer = new CanvasDrawer.CanvasDrawer(bgCtx);
            polyTest(bgDrawer);
            rectTest(bgDrawer);
        });
});
