require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery'
    }
});

require(['jquery', 'util/factory'], function($, Factory) {
    $(document).ready(function() {
        Factory.createCanvas('mainCanvas');
    });
});

