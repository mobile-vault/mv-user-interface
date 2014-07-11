define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'text!template/bluetoothControls.html'],
    function($, _, Backbone, crel, App, TemplateView, BluetoothControlsTemplate) {
        var exports = {};
        exports.Model = Backbone.Model.extend({

        });

        exports.View = TemplateView.extend({
            tagName: 'div',
            initialize: function(options) {
                this.options = options;
                this.model = new exports.Model();
                this.model.urlRoot = '/policies/company/' + App.companyID + '/bluetooth';
                this.listenTo(this.model, 'sync', this.renderModel);
            },
            template: _.template(BluetoothControlsTemplate),
            render: function () {
                this.model.fetch();
                return this;
            },
            renderModel: function(model) {
                var template = this.template,
                    payloadModel = {
                    model: model
                };
                this.$el.append(template(payloadModel));
                return this;
            }

        })

        return exports;

    }
);