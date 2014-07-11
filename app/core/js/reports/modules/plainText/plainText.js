define(
    ['jquery', 'underscore', 'backbone', 'views/view'],
    function ($, _, Backbone, View) {
        'use strict';
        var exports = {};

        exports.name = 'plainText';

        exports.models = {
            Main: Backbone.Model.extend({ defaults: { text: '' } })
        };

        exports.views = {
            Main: View.extend({
                tagName: 'div',
                className: [exports.name].join(' '),
                initialize: function () { _.bindAll(this); },
                render: function () {
                    this.$el.text(this.model.get('text'));
                    return this;
                }
            })
        };
        return exports;
    }
);