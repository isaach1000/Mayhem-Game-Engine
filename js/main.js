requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery'
    }
});

require(['jquery'], function($) {
    $(document).ready(function() {
    });
});

