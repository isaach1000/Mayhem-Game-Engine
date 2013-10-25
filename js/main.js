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
        'foundation/circle'
    ],
    function($,
        Factory,
        CanvasDrawer,
        Circle) {
        $(document).ready(function() {

            var canvas = Factory.createCanvas({
                id: 'mainCanvas',
                width: '1000px',
                height: '600px'
            });
            var ctx = canvas[0].getContext('2d');
            var drawer = new CanvasDrawer.CanvasDrawer(ctx); 

            drawer.setContextSettings({
                lineWidth: 4,
                strokeStyle: 'black',
                fillStyle: 'green'
            });
           
            var circ = new Circle.Circle(100, 200, 50, drawer, {});
            circ.draw();

        });
});
