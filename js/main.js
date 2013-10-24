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
        'util/quadTree'
    ],
    function(
        $,
        Factory,
        BoundingBox,
        QuadTree
    ) {
    $(document).ready(function() {
        Factory.createCanvas('mainCanvas');
        qt = new QuadTree.QuadTree(new BoundingBox.BoundingBox(100, 100, 200, 200))
    });
});

