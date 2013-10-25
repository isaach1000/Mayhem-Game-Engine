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
        'sprites/tileMap'
    ],
    function($,
        Factory,
        CanvasDrawer,
        TileMap) {
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
           
            var tileMap = new TileMap.TileMap(200, 100, 100, 100, 4, 4, drawer, [
                                                                    {fillStyle: 'green'},
                                                                    {fillStyle: 'blue'}
                                                                ]);
            tileMap.draw();

        });
});
