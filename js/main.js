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
        'foundation/rectangle',
        'foundation/animation'
    ],
    function($,
        Factory,
        CanvasDrawer,
        Rectangle,
        Animation) {
        $(document).ready(function() {

            var canvas = Factory.createCanvas({
                id:     'mainCanvas',
                width:  '1000px',
                height: '600px'
            });
            var ctx = canvas[0].getContext('2d');
            var drawer = new CanvasDrawer.CanvasDrawer(ctx); 
        
            var rect = new Rectangle.Rectangle(100, 200, 50, 50, drawer, {
                lineWidth: 3,
                fillStyle: 'green',
                strokeStyle: 'black'
            });
            rect.draw();
        });
});
