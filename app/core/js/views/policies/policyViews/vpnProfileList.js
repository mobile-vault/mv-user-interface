define(['jquery', 'underscore', 'backbone', 'app', 'views/templateView', 'views/policies/policyViews/innerVPNView',
    'text!template/PPTPL2TP.html', 'text!template/IPSec.html', 'text!template/policy-vpn.html', 'backbone.relational'],
    function ($, _, Backbone, App, TemplateView, InnerVPNView, PPTPL2TPTemplate, IPSecTemplate, VPNPolicyTemplate) {

        var exports = {};
        exports.Model = Backbone.RelationalModel.extend({
            validate: function (attributes) {
                var vpnForm = $('#vpnForm'),
                    vpnNameRegex = /^[A-Za-z0-9]+$/,
                    /*validIpAddressRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
                    validHostnameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/,*/
                    serverNameRegex = /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/;

                if (!vpnNameRegex.test(attributes.vpn_name)) {
                    vpnForm.find('#vpnNameDiv').addClass('has-error');
                    vpnForm.find('#vpnNameError').text('Invalid VPN Name.').css({color: '#a94442'}).removeClass('display-none');
                    return true;
                }
                else if (vpnNameRegex.test(attributes.vpn_name)) {
                    vpnForm.find('#vpnNameDiv').removeClass('has-error');
                    vpnForm.find('#vpnNameError').addClass('display-none');
                }
                if (!serverNameRegex.test(attributes.server_address)) {
                    vpnForm.find('#serverAddressDiv').addClass('has-error');
                    vpnForm.find('#serverAddressError').text('Invalid Server Address.').css({color: '#a94442'}).removeClass('display-none');
                    return true;
                }
                else if (serverNameRegex.test(attributes.server_address)) {
                    vpnForm.find('#serverAddressDiv').removeClass('has-error');
                    vpnForm.find('#serverAddressError').addClass('display-none');
                }
                if (attributes.vpn_type === 'L2TP/IPSecPSK' || attributes.vpn_type === 'L2TP/IPSecRSA') {
                    if (!attributes.l2tp_secret.length) {
                        vpnForm.find('.l2TPSecretDiv').addClass('has-error');
                        vpnForm.find('.l2tpError').text('Invalid Password.').css({color: '#a94442'}).removeClass('display-none');
                        return true;
                    }
                    else if (attributes.l2tp_secret.length) {
                        vpnForm.find('.l2TPSecretDiv').removeClass('has-error');
                        vpnForm.find('.l2tpError').addClass('display-none');
                    }
                }
                if (attributes.vpn_type === 'L2TP/IPSecPSK' || attributes.vpn_type === 'IPSecXauthPSK') {
                    if (!attributes.ipsec_key.length) {
                        vpnForm.find('#preSharedKeyDiv').addClass('has-error');
                        vpnForm.find('#preSharedKeyError').text('Invalid Key.').css({color: '#a94442'}).removeClass('display-none');
                        return true;
                    }
                    else if (attributes.ipsec_key.length) {
                        vpnForm.find('#preSharedKeyDiv').removeClass('has-error');
                        vpnForm.find('#preSharedKeyError').addClass('display-none');
                    }
                }
            }
        });

        exports.View = TemplateView.extend({
            tagName: 'div',
            template: _.template(VPNPolicyTemplate),
            initialize: function (options) {
                this.options = options;
                this.model = new exports.Model();
                this.model.urlRoot = '/policies/company/' + App.companyID + '/vpn';
            },
            events: {
                'change #vpnType'               :   'filterByVPNType',
                'change #showAdvancedOptions'   :   'showAdvancedOptions'
            },
            pptpl2tpTemplate: _.template(PPTPL2TPTemplate),
            ipSecTemplate: _.template(IPSecTemplate),
            filterByVPNType: function (event) {
                var selectedOption = $(event.currentTarget).val();
                this.$el.find('#selectDependentDiv').empty();

                if (selectedOption === 'PPTP') {
                    this.innerVPNView = new InnerVPNView.View();
                    this.$el.find('#selectDependentDiv').append(this.innerVPNView.$el);
                    this.innerVPNView.render(this.pptpl2tpTemplate({PPTP: true, IPSecPSK: false, IPSecRSA: false}));
                }
                else if (selectedOption === 'L2TP_IPSEC_PSK') {
                    this.innerVPNView = new InnerVPNView.View();
                    this.$el.find('#selectDependentDiv').append(this.innerVPNView.$el);
                    this.innerVPNView.render(this.pptpl2tpTemplate({PPTP: false, IPSecPSK: true, IPSecRSA: false}));
                }
                else if (selectedOption === 'L2TP_IPSEC') {
                    this.innerVPNView = new InnerVPNView.View();
                    this.$el.find('#selectDependentDiv').append(this.innerVPNView.$el);
                    this.innerVPNView.render(this.pptpl2tpTemplate({PPTP: false, IPSecPSK: false, IPSecRSA: true}));
                }
                else if (selectedOption === 'IPSEC_XAUTH_PSK') {
                    this.innerVPNView = new InnerVPNView.View();
                    this.$el.find('#selectDependentDiv').append(this.innerVPNView.$el);
                    this.innerVPNView.render(this.ipSecTemplate({IPSecXauthPSK: true, IPSecXauthRSA: false, IPSecHybridRSA: false}));
                }
                else if (selectedOption === 'IPSEC_XAUTH_RSA') {
                    this.innerVPNView = new InnerVPNView.View();
                    this.$el.find('#selectDependentDiv').append(this.innerVPNView.$el);
                    this.innerVPNView.render(this.ipSecTemplate({IPSecXauthPSK: false, IPSecXauthRSA: true, IPSecHybridRSA: false}));
                }
                else if (selectedOption === 'IPSEC_HYBRID_RSA') {
                    this.innerVPNView = new InnerVPNView.View();
                    this.$el.find('#selectDependentDiv').append(this.innerVPNView.$el);
                    this.innerVPNView.render(this.ipSecTemplate({IPSecXauthPSK: false, IPSecXauthRSA: false, IPSecHybridRSA: true}));
                }
            },
            showAdvancedOptions: function (event) {
                $('.advancedOptions').toggleClass('display-none', !event.target.checked);
            },
            render: function () {
                var template = this.template;
                this.$el.html(template);
                this.innerVPNView = new InnerVPNView.View();
                this.$el.find('#selectDependentDiv').append(this.innerVPNView.$el);
                this.innerVPNView.render(this.pptpl2tpTemplate({PPTP: true, IPSecPSK: false, IPSecRSA: false}));
                return this;
            }
        })

        return exports;

    }
);
