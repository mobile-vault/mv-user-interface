define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'text!template/policy-save-changes.html'],
    function($, _, Backbone, crel, App, TemplateView, SaveChangesTemplate) {
        var exports = {};

        exports.View = TemplateView.extend({
            tagName: 'div',
            initialize: function(options) {
                this.options = options;
                this.template = _.template(SaveChangesTemplate);
            },
            render: function () {
                this.renderTemplate();
                return this;
            },
            renderTemplate: function () {
                this.$el.html(this.template);
                return this;
            }
        });
        return exports;
    }
);