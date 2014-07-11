define(['jquery', 'underscore', 'backbone', 'app', 'views/templateView', 'views/policies/policyViews/inneriOSVPNView',
    'text!template/iOSPPTP.html', 'text!template/iOSProxySetup.html', 'text!template/policy-vpn-iOS.html', 'backbone.relational'],
    function ($, _, Backbone, App, TemplateView, InneriOSVPNView, iOSPPTPTemplate, iOSProxySetupTemplate, iOSVPNPolicyTemplate) {

        var exports = {};
        exports.Model = Backbone.RelationalModel.extend({
            validate: function (attributes) {
                var vpnForm = $('#vpnForm'),
                    vpnNameRegex = /^[A-Za-z0-9]+$/,
                    /*validIpAddressRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
                    validHostnameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/,*/
                    serverNameRegex = /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/;

                if (!vpnNameRegex.test(attributes.UserDefinedName)) {
                    vpnForm.find('#vpnNameDiv').addClass('has-error');
                    vpnForm.find('#vpnNameError').text('Invalid VPN Name.').css({color: '#a94442'}).removeClass('display-none');
                    return true;
                }
                else if (vpnNameRegex.test(attributes.UserDefinedName)) {
                    vpnForm.find('#vpnNameDiv').removeClass('has-error');
                    vpnForm.find('#vpnNameError').addClass('display-none');
                }
                if (!serverNameRegex.test(attributes.Server)) {
                    vpnForm.find('#serverAddressDiv').addClass('has-error');
                    vpnForm.find('#serverAddressError').text('Invalid Server Address.').css({color: '#a94442'}).removeClass('display-none');
                    return true;
                }
                else if (serverNameRegex.test(attributes.Server)) {
                    vpnForm.find('#serverAddressDiv').removeClass('has-error');
                    vpnForm.find('#serverAddressError').addClass('display-none');
                }
                return true;
            }
        });

        exports.View = TemplateView.extend({
            tagName: 'div',
            template: _.template(iOSVPNPolicyTemplate),
            initialize: function (options) {
                this.options = options;
                this.model = new exports.Model();
                this.model.urlRoot = '/policies/company/' + App.companyID + '/vpn';
            },
            events: {
                'change #vpnType'        :   'filterByVPNType',
                'change #proxySetup'            :   'chooseProxySetupType',
                'submit #vpnForm'               :   'updateVPNForm'
            },
            iOSpptpTemplate: _.template(iOSPPTPTemplate),
            iOSproxysetupTemplate: _.template(iOSProxySetupTemplate),
            filterByVPNType: function (event) {
                var selectedOption = $(event.currentTarget).val();
                this.$el.find('#iOSSelectDependentDiv').empty();

                if (selectedOption === 'PPTP') {
                    this.inneriOSVPNView = new InneriOSVPNView.View();
                    this.$el.find('#iOSSelectDependentDiv').append(this.inneriOSVPNView.$el);
                    this.inneriOSVPNView.render(this.iOSpptpTemplate({PPTP: true, L2TP: false}));
                }
                else if (selectedOption === 'L2TP') {
                    this.inneriOSVPNView = new InneriOSVPNView.View();
                    this.$el.find('#iOSSelectDependentDiv').append(this.inneriOSVPNView.$el);
                    this.inneriOSVPNView.render(this.iOSpptpTemplate({PPTP: false, L2TP: true}));
                }
                else if (selectedOption === 'IPSecCisco') {
                    this.inneriOSVPNView = new InneriOSVPNView.View();
                    this.$el.find('#iOSSelectDependentDiv').append(this.inneriOSVPNView.$el);
                    this.inneriOSVPNView.render(this.iOSpptpTemplate({PPTP: false, L2TP: false}));
                }
            },
            chooseProxySetupType: function (event) {
                var selectedOption = $(event.currentTarget).val();
                if(selectedOption === 'manual')
                {
                    this.inneriOSVPNView = new InneriOSVPNView.View();
                    this.$el.find('#proxy-Setup').html(this.inneriOSVPNView.$el);
                    this.inneriOSVPNView.render(this.iOSproxysetupTemplate({manual: true, automatic: false}));
                }
                else if(selectedOption === 'automatic')
                {
                    this.inneriOSVPNView = new InneriOSVPNView.View();
                    this.$el.find('#proxy-Setup').html(this.inneriOSVPNView.$el);
                    this.inneriOSVPNView.render(this.iOSproxysetupTemplate({manual: false, automatic: true}));
                }
                else
                {
                    if(this.inneriOSVPNView)
                    {
                        this.inneriOSVPNView.close();
                    }
                }
                return this;
            },
            render: function () {
                var template = this.template;
                this.$el.html(template);
                this.inneriOSVPNView = new InneriOSVPNView.View();
                this.$el.find('#iOSSelectDependentDiv').append(this.inneriOSVPNView.$el);
                this.inneriOSVPNView.render(this.iOSpptpTemplate({PPTP: true, L2TP: false}));
                return this;
            }
        })

        return exports;

    }
);
