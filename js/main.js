require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery'
    }
});

require([
        'jquery',
        'util/factory',
        'util/boundingBox',
        'util/quadTree',
        'foundation/canvasDrawer',
        'foundation/rectangle'
    ],
    function($,
        Factory,
        BoundingBox,
        QuadTree,
        CanvasDrawer,
        Rectangle) {
        $(document).ready(function() {
            var canvas = Factory.createCanvas({
                id: 'mainCanvas',
                width: '1000px',
                height: '600px'
            });
            var ctx = canvas[0].getContext('2d');
            var drawer = new CanvasDrawer.CanvasDrawer(ctx); 
            
            // TODO: var qt = new QuadTree.QuadTree(new BoundingBox.BoundingBox(100, 100, 200, 200));

            drawer.setContextSettings({
                lineWidth: 9,
                strokeStyle: 'black',
                fillStyle: 'green'
            });

            var rect = new Rectangle.Rectangle(100, 100, 200, 200, drawer, {});
            rect.draw();
        });
});

