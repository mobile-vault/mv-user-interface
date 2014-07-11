define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView'],
    function($, _, Backbone, crel, App, TemplateView) {
        var exports = {};
        exports.Model = Backbone.Model.extend({

        });

        exports.View = TemplateView.extend({
            tagName: 'div',
            initialize: function(options) {
                this.options = options;
                this.model = new exports.Model();
            },
            render: function (template) {
                this.$el.append(template);
                return this;
            }
        })

        return exports;

    }
);