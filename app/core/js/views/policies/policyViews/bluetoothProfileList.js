define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'text!template/policy-bluetooth.html', 'backbone.relational'],
    function($, _, Backbone, crel, App, TemplateView, BluetoothPolicyTemplate) {
        var exports = {};
        exports.Model = Backbone.RelationalModel.extend({
            defaults: {
                bluetooth_name: '',
                bluetooth_cod: -1,
                bluetooth_uuid: '',
                bluetooth_pairing: '',
                iOS:true,
                android: true
            },
            validate: function(attributes) {
                var deviceNameRegex = /[A-Za-z0-9]+/,
                    uuidRegex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/,
                    bluetoothForm = $('#bluetoothForm');
                if(!deviceNameRegex.test(attributes.bluetooth_name))
                {
                    bluetoothForm.find('#deviceNameDiv').addClass('has-error');
                    bluetoothForm.find('#deviceNameError').text('Invalid Device Name.').css({color: '#a94442'}).removeClass('display-none');
                    return true;
                }
                else if(deviceNameRegex.test(attributes.bluetooth_name))
                {
                    bluetoothForm.find('#deviceNameDiv').removeClass('has-error');
                    bluetoothForm.find('#deviceNameError').addClass('display-none');
                }
                /* if(!regex.test(attributes.bluetooth_cod))
                 {
                 bluetoothForm.find('#codDiv').addClass('has-error');
                 bluetoothForm.find('#codError').text('Invalid COD.').css({color: '#a94442'}).removeClass('display-none');
                 return true;
                 }
                 else if(regex.test(attributes.bluetooth_cod))
                 {
                 bluetoothForm.find('#codDiv').removeClass('has-error');
                 bluetoothForm.find('#codError').addClass('display-none');
                 }*/
                if(!uuidRegex.test(attributes.bluetooth_uuid))
                {
                    bluetoothForm.find('#uuidDiv').addClass('has-error');
                    bluetoothForm.find('#uuidError').text('Invalid UUID .').css({color: '#a94442'}).removeClass('display-none');
                    return true;
                }
                else if(uuidRegex.test(attributes.bluetooth_uuid))
                {
                    bluetoothForm.find('#uuidDiv').removeClass('has-error');
                    bluetoothForm.find('#uuidError').addClass('display-none');
                }
            }
        });

        exports.View = TemplateView.extend({
            tagName: 'div',
            initialize: function(options) {
                this.options = options;
                this.model = new exports.Model();
                this.model.urlRoot = '/policies/bluetooth';
            },
            template: _.template(BluetoothPolicyTemplate),
            render: function () {
                var template = this.template;
                this.$el.html(template);
                return this;
            }
        })

        return exports;

    }
);