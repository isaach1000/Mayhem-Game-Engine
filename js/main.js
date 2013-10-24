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
        'foundation/canvasDrawer'
    ],
    function(
        $,
        Factory,
        BoundingBox,
        QuadTree,
        CanvasDrawer
    ) {
    $(document).ready(function() {
        var canvas = Factory.createCanvas({
            id: 'mainCanvas',
            width: '1000px',
            height: '600px'
        });
        var ctx = canvas[0].getContext('2d');
        var drawer = new CanvasDrawer.CanvasDrawer(ctx); 
        
        // TODO: var qt = new QuadTree.QuadTree(new BoundingBox.BoundingBox(100, 100, 200, 200));

        // TODO: put this in CanvasDrawer class.
        ctx.strokeStyle = 'black';
        drawer.drawLine({x: 100, y: 100}, {x: 200, y: 200});
        drawer.stroke();
    });
});

