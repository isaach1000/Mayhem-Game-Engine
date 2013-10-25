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
        'foundation/polygon'
    ],
    function($,
        Factory,
        CanvasDrawer,
        Polygon) {
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
           
            var poly = new Polygon.Polygon([
                {x: 100, y: 100},
                {x: 100, y: 200},
                {x: 200, y: 300},
                {x: 150, y: 70}
            ], drawer, {});
            poly.draw();

        });
});

