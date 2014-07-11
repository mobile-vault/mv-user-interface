define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'text!template/vpnOSTypes.html'],
    function($, _, Backbone, crel, App, TemplateView, VPNOSTypesTemplate) {
        var exports = {};
        exports.Model = Backbone.Model.extend({

        });

        exports.View = TemplateView.extend({
            tagName: 'div',
            initialize: function(options) {
                this.options = options;
                this.model = new exports.Model();
//                this.model.urlRoot = '/policies/company/' + App.companyID + '/vpn';
//                this.listenTo(this.model, 'sync', this.renderModel);
            },
            template: _.template(VPNOSTypesTemplate),
            render: function () {
//                this.model.fetch();
                var template = this.template;
                this.$el.append(template);
                return this;
            },
            renderModel: function(model) {
//                var template = this.template;
//                this.$el.append(template);
                return this;
            }

        })

        return exports;

    }
);