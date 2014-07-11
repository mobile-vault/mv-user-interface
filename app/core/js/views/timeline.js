define(
    ['jquery', 'underscore', 'views/templateView', 'text!template/timeline.html'],
    function ($, _, TemplateView, TimelineTemplate) {
        'use strict';
        var exports = {};
        exports.name = 'timeline';
        exports.models = {
            Main: Backbone.Model.extend({
                defaults: {
                    source: '',
                    keys: []
                }
            })
        };

        exports.views = {
            Main: TemplateView.extend({
                    tagName: 'div',
                    className: [exports.name].join(' ')
            })
        };

    }
);
