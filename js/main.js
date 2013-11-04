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
        'foundation/circle',
        'foundation/animation'
    ],
    function($,
        Factory,
        CanvasDrawer,
        Circle,
        Animation) {
        $(document).ready(function() {
            var canvas = Factory.createCanvas({
                id: 'mainCanvas',
                width: '1000px',
                height: '600px'
            });
            var ctx = canvas[0].getContext('2d');
            var drawer = new CanvasDrawer.CanvasDrawer(ctx); 
           
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
        });
});
