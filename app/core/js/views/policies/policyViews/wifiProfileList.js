define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'text!template/policy-wifi.html', 'backbone.relational'],
    function($, _, Backbone, crel, App, TemplateView, WiFiPolicyTemplate) {
        var exports = {};
        exports.Model = Backbone.RelationalModel.extend({
            defaults: {
                ssid: "",
                wifi_security: "PSK",
                password: "",
                auto_join: false,
                hidden_network: false,
                iOS:true,
                android: true
            },
            validate: function(attributes) {
                var regex = /^[A-Za-z0-9]+$/,
                    wifiForm = $('#wifiForm');
                if(!regex.test(attributes.ssid))
                {
                    wifiForm.find('#networkDiv').addClass('has-error');
                    wifiForm.find('#networkError').text('Invalid Network Name.').css({color: '#a94442'}).removeClass('display-none');
                    return true;
                }
                else if(regex.test(attributes.ssid))
                {
                    wifiForm.find('#networkDiv').removeClass('has-error');
                    wifiForm.find('#networkError').addClass('display-none');
                }
                if (attributes.wifi_security === "WEP")
                {
                    if(!attributes.password.length)
                    {
                        wifiForm.find('#passwordDiv').addClass('has-error');
                        wifiForm.find('#passwordError').text('Invalid Password.').css({color: '#a94442'}).removeClass('display-none');
                        return true;
                    }
                    else
                    {
                        wifiForm.find('#passwordDiv').removeClass('has-error');
                        wifiForm.find('#passwordError').addClass('display-none');
                    }
                }
                else if(attributes.wifi_security === "PSK")
                {
                    if(attributes.password.length < 8)
                    {
                        wifiForm.find('#passwordDiv').addClass('has-error');
                        wifiForm.find('#passwordError').text('Invalid Password.').css({color: '#a94442'}).removeClass('display-none');
                        return true;
                    }
                    else
                    {
                        wifiForm.find('#passwordDiv').removeClass('has-error');
                        wifiForm.find('#passwordError').addClass('display-none');
                    }
                }

            }
        });

        exports.View = TemplateView.extend({
            tagName: 'div',
            initialize: function(options) {
                this.options = options;
                this.model = new exports.Model();
                this.model.urlRoot = '/policies/company/' + App.companyID + '/wifi';
            },
            template: _.template(WiFiPolicyTemplate),
            render: function () {
                var template = this.template;
                this.$el.html(template);
                return this;
            }
        })

        return exports;

    }
);