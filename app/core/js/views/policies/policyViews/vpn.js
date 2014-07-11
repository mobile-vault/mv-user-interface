define(['jquery', 'underscore', 'backbone', 'app', 'crel', 'views/view', 'views/policies/policyViews/saveChanges', 'views/policies/policyViews/vpnOSControls',
        'views/policies/policyViews/inneriOSVPNView', 'views/policies/policyViews/iOSVPN', 'views/policies/policyViews/innerVPNView',
        'views/policies/policyViews/vpnProfileList', 'lists/list', 'text!template/vpnOSTypes.html', 'text!template/vpnProfile.html',
        'text!template/vpnList.html','text!template/iOSPPTP.html', 'text!template/iOSProxySetup.html', 'core/js/API/policies/vpn',
        'core/js/API/policies/vpn-save', 'backbone.relational'],
    function ($, _, Backbone, App, crel, View, SaveChangesView, VPNOSControlsView, InneriOSVPNView, iOSVPNView, InnerVPNView, VPNProfileListView, List, VPNOSTypesTemplate, VPNProfileTemplate, VPNListTemplate, iOSPPTPTemplate, iOSProxySetupTemplate) {

        var exports = {
            Model:Backbone.RelationalModel.extend({
                urlRoot: '',
                idAttribute: '_id',
                relations: [
                    {
                        type: Backbone.HasMany,
                        key: 'installed_vpns',
                        relatedModel: 'VPN',
                        collectionType: 'VPNCollection',
                        reverseRelation: {
                            key: 'appSettings',
                            includeInJSON:false
                        }
                    }
                ],
                parse: function (response) {
                    if (response.pass) {
                        this.recordCount = response.count;
                        return response.data;
                    }
                    return response;
                }
            }),
            VPN: Backbone.RelationalModel.extend({
                defaults: {
              /*      vpn_name: '',
                    vpn_type: '',
                    server_address:'',
                    advanced_options: '',
                    dns_search_domains: '',
                    dns_servers: '',
                    forwarding_routes: ''*/
                }
            }),
            VPNCollection: Backbone.Collection.extend({
                model: this.VPN
            })
        };

        _.extend(exports, {
            View: View.extend({
                iOSpptpTemplate: _.template(iOSPPTPTemplate),
                iOSproxysetupTemplate: _.template(iOSProxySetupTemplate),
                initialize: function (options) {
                    this.options = options;
                    this.template = _.template(VPNProfileTemplate);
                    this.model = new exports.Model();
                    this.listenTo(this.model, 'request', this.showLoading);
                    this.listenTo(this.model, 'sync', this.fetchSuccess);
                    this.listenTo(this.model, 'error', this.fetchError);
                    this.collection = this.model.get('installed_vpns');
                    var that= this,
                        ListView = List.View.extend({
                        collection: this.collection,
                        vpnListTemplate: VPNListTemplate,
                        causeNavigation: false,
                        initialize: function (options) {
                            if (options) {
                                _.extend(this, _.pick(options, ['showHeader', 'showLegend', 'showFooter', 'itemKeys']));
                            }
                        },
                        renderModel: function (model) {
                            var template = _.template(this.vpnListTemplate),
                                payload = {
                                    object: that.options.object,
                                    objectId: that.options.objectId,
                                    params: that.collection.params,
                                    model: this.viewHelpers.modelAttributes(model)
                                };

                            return template(payload);
                        },
                        viewHelpers: {
                            modelAttributes: function (model) {
                                var modelJSON = model.toJSON(),
                                    vpnName = modelJSON.android?modelJSON.vpn_name:modelJSON.UserDefinedName,
                                    vpnType = modelJSON.android?modelJSON.vpn_type:modelJSON.VpnType,
                                    isAndroid = modelJSON.android,
                                    vpnId = model.cid
                                return {
                                    vpnName:vpnName,
                                    vpnType:vpnType,
                                    isAndroid:isAndroid,
                                    vpnId:vpnId
,                                }
                            }
                        },
                        layoutHeader: function ($header) {
                            var headerTemplate = _.template(VPNProfileTemplate);
                            $header.append(headerTemplate({header: true, legend: false, query: this.collection.params}));
                            return this;
                        },
                        layoutLegend: function ($legend) {
                            var legendTemplate = _.template(VPNProfileTemplate);
                            $legend.append(legendTemplate({header: false, legend: true, query: this.collection.params}));
                            return this;
                        },
                        render: function () {
                            if (this.beforeRender !== $.noop) { this.beforeRender(); }
                            var $el = this.$el.empty().html(this.layout()),
                                $header = $el.find('header'),
                                $legend = $el.find('.legend'),
                                $footer = $el.find('footer'),
                                $items = $el.find('.items');
                            if (!this._baseItem) {
                                //this._baseItem = _.clone($items.find('.item')).empty();
                            }

                            if (this.showHeader) { this.layoutHeader($header); }
                            if (this.showLegend) { this.layoutLegend($legend); }
                            if (this.showFooter) { this.layoutFooter($footer); }
                            this.updateList();
                            if (this.onRender !== $.noop) { this.onRender(); }
                            return this;
                        },
                        updateList: function () {
                            if (this.beforeUpdateList !== $.noop) { this.beforeUpdateList(); }
                            var that = this,
                                $el = this.$el,
                                $items = $el.find('.items'),
                                $item = this._baseItem,
                                models = this.collection.models;
                            // empty item list
                            $items.empty();

                            if (models.length > 0) {
                                _.each(models, function (model) {
                                    $items.append(that.renderModel(model));
                                });
                            } else {
                                $items.html(
                                    /* _.clone($item).empty().html(*/
                                    this.string_emptyData
                                    /*)*/
                                );
                            }


                            if (this.afterUpdateList !== $.noop) { this.afterUpdateList(); }

                            return this;
                        }
                    });
                    this.list = new ListView();
                },
                events: {
                    'click #saveChanges'                    :   'saveChanges',
                    'click #discardChanges'                 :   'discardChanges',
                    'submit #vpnForm'                       :   'updateVPNForm',
                    'click #backToVPNList'                  :   'backToVPNList',
                    'click #addVPN'                         :   'addNewVPN',
                    'click a[data-action=user_edit]'        :   'editVPNProfile',
                    'change select[name=advancedSearch]'    :   'filterSearchBy',
                    'keyup input[name=search]'              :   'debouncedSearch',
                    'change select[name=sortBy]'            :   'sortBy',
                    'change select[name=sortType]'          :   'orderBy',
                    'change select[name=filterKey]'         :   'filterKey',
                    'change select[name=filterValue]'       :   'filterValue',
                    'change select[name=vpn-os-types]'      :   'selectFormByOSType',
                    'click input[data-toggle=all]'          :   'selectAll',
                    'change input[name=checkbox]'           :   'toggleDeleteButton',
                    'click #deleteVPN'                      :   'deleteVPN',
                    'submit #iOSVPNForm'                    :   'saveiOSVPNProfile'
                },
                deleteVPN: function(event) {
                    var itemID = $(event.currentTarget).parents('.item').attr('data-modelid'),
                        trashModel = this.collection.get(itemID);

                    this.collection.remove(trashModel);
                    this.renderContent();
                    return this;
                },
                showLoading: function () {
                    var $el = this.$el;
                    this._loading = this._loading || new App.loading();
                    $el.empty().append(this._loading.render().el);
                    return this;
                },

                hideLoading: function () {
                    if (this._loading) { this._loading.close(); }
                    return this;
                },

                fetchSuccess: function (model, response, options) {
                    this.hideLoading();
                    this.createClones();
                    this.renderTemplate(model);
                    return this;
                },

                fetchError: function (collection, response, options) {
                    var $el = this.$el;
                    this.hideLoading();
                    $el.empty().html(
                        response.responseText
                    );
                    return this;
                },
                createClones: function () {
                    this.clonedOriginalModel = _.clone(this.model.toJSON(),true);

                    this.clonedVPNCollection = _.clone(this.collection.toJSON(), true);
                    this.listenTo(this.collection, 'add', this.toggleVPNProfilesView);
                    this.listenTo(this.collection, 'remove', this.toggleVPNProfilesView);
                    this.listenTo(this.collection, 'change', this.toggleVPNProfilesView);

                    return this;
                },
                toggleVPNProfilesView: function () {
                    var toggle = _.isEqual(this.clonedVPNCollection, this.collection.toJSON());
                    this.$('.vpn-list-container').toggleClass('model-changed',!toggle);
                    if(!toggle)
                    {
                        if(!this.saveChangesView) {
                            this.saveChangesView = new SaveChangesView.View();
                            this.$el.append(this.saveChangesView.$el);
                            this.saveChangesView.render();
                        }
                    }
                    else
                    {
                        if(this.saveChangesView) {
                            this.saveChangesView.close();
                            delete this.saveChangesView;
                        }
                    }
                    return this;
                },
                backToVPNList: function() {
                    this.$el.find('#vpn-select').addClass('display-none');
                    this.$el.find('#vpn-form').addClass('display-none');
                    this.$el.find('.vpnList').removeClass('display-none');
                    return this;
                },
                saveiOSVPNProfile: function (event) {
                    event.preventDefault();
                    var $form = $(this.el).find('#iOSVPNForm'),
                        modelID = $form.find('#model-cid').val(),
                        selectedProxySetup = $form.find('#proxySetup').val();

                    if(modelID.trim()) {
                        if ($form.find('#vpnType').val() === 'PPTP') {
                            if (selectedProxySetup === 'manual') {
                                this.collection.get(modelID).set({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#pptpRSAID').is(':checked'),
                                    EncryptionLevel: $form.find('#encryptionLevel').val(),
                                    OverridePrimary: $form.find('#pptpTraffic').is(':checked'),
                                    ManualProxy: {
                                        HTTPProxy: $form.find('#proxyServer').val(),
                                        ProxyPassword: $form.find('#password').val(),
                                        ProxyUsername: $form.find('#authentication').val(),
                                        PortNumber: $form.find('#port').val()
                                    },
                                    android: false,
                                    iOS: true
                                }).unset("AutomaticProxy", {silent: true});
                            }
                            else if(selectedProxySetup === 'automatic') {
                                this.collection.get(modelID).set({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#pptpRSAID').is(':checked'),
                                    EncryptionLevel: $form.find('#encryptionLevel').val(),
                                    OverridePrimary: $form.find('#pptpTraffic').is(':checked'),
                                    AutomaticProxy: {
                                        ProxyServerUrl: $form.find('#proxyServerURL').val()
                                    },
                                    android: false,
                                    iOS: true
                                }).unset("MaunalProxy", {silent: true});

                            }
                            else
                            {
                                this.collection.get(modelID).set({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#pptpRSAID').is(':checked'),
                                    EncryptionLevel: $form.find('#encryptionLevel').val(),
                                    OverridePrimary: $form.find('#pptpTraffic').is(':checked'),
                                    android: false,
                                    iOS: true
                                }).unset("AutomaticProxy", {silent: true}).unset("MaunalProxy", {silent: true});
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'L2TP') {
                            if (selectedProxySetup === 'manual') {
                                this.collection.get(modelID).set({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#l2tpRSAID').is(':checked'),
                                    SharedSecret: $form.find('#sharedSecret').val(),
                                    OverridePrimary: $form.find('#l2tpTraffic').is(':checked'),
                                    ManualProxy: {
                                        HTTPProxy: $form.find('#proxyServer').val(),
                                        ProxyPassword: $form.find('#password').val(),
                                        ProxyUsername: $form.find('#authentication').val(),
                                        PortNumber: $form.find('#port').val()
                                    },
                                    android: false,
                                    iOS: true
                                }).unset("AutomaticProxy", {silent: true});
                            }
                            else if(selectedProxySetup === 'automatic') {
                                this.collection.get(modelID).set({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#l2tpRSAID').is(':checked'),
                                    SharedSecret: $form.find('#sharedSecret').val(),
                                    OverridePrimary: $form.find('#l2tpTraffic').is(':checked'),
                                    AutomaticProxy: {
                                        ProxyServerUrl: $form.find('#proxyServerURL').val()
                                    },
                                    android: false,
                                    iOS: true
                                }).unset("MaunalProxy", {silent: true});
                            }
                            else
                            {
                                this.collection.get(modelID).set({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#l2tpRSAID').is(':checked'),
                                    SharedSecret: $form.find('#sharedSecret').val(),
                                    OverridePrimary: $form.find('#l2tpTraffic').is(':checked'),
                                    android: false,
                                    iOS: true
                                }).unset("AutomaticProxy", {silent: true}).unset("MaunalProxy", {silent: true});
                            }
                        }
                       /* else if ($form.find('#vpnType').val() === 'L2TP_IPSEC') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    l2tp_secret: $form.find('#l2tpSecretRSA').val(),
                                    ipsec_user_certificate: $form.find('#ipSecUserCertificate').val(),
                                    ipsec_ca_certificate: $form.find('#ipSecCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#ipSecServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val()
                                });
                            }
                            else {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    l2tp_secret: $form.find('#l2tpSecretRSA').val(),
                                    ipsec_user_certificate: $form.find('#ipSecUserCertificate').val(),
                                    ipsec_ca_certificate: $form.find('#ipSecCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#ipSecServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked')
                                });
                            }
                        }*/
                    }
                    else
                    {
                        if ($form.find('#vpnType').val() === 'PPTP') {
                            if (selectedProxySetup === 'manual') {
                                this.collection.add({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#pptpRSAID').is(':checked'),
                                    EncryptionLevel: $form.find('#encryptionLevel').val(),
                                    OverridePrimary: $form.find('#pptpTraffic').is(':checked'),
                                    ManualProxy: {
                                        HTTPProxy: $form.find('#proxyServer').val(),
                                        ProxyPassword: $form.find('#password').val(),
                                        ProxyUsername: $form.find('#authentication').val(),
                                        PortNumber: $form.find('#port').val()
                                    },
                                    android: false,
                                    iOS: true
                                });
                            }
                            else if(selectedProxySetup === 'automatic') {
                                this.collection.add({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#pptpRSAID').is(':checked'),
                                    EncryptionLevel: $form.find('#encryptionLevel').val(),
                                    OverridePrimary: $form.find('#pptpTraffic').is(':checked'),
                                    AutomaticProxy: {
                                        ProxyServerUrl: $form.find('#proxyServerURL').val()
                                    },
                                    android: false,
                                    iOS: true
                                });
                            }
                            else
                            {
                                this.collection.add({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#pptpRSAID').is('checked'),
                                    EncryptionLevel: $form.find('#encryptionLevel').val(),
                                    OverridePrimary: $form.find('#pptpTraffic').is(':checked'),
                                    android: false,
                                    iOS: true
                                });
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'L2TP') {
                            if (selectedProxySetup === 'manual') {
                                this.collection.add({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#l2tpRSAID').is(':checked'),
                                    SharedSecret: $form.find('#sharedSecret').val(),
                                    OverridePrimary: $form.find('#l2tpTraffic').is(':checked'),
                                    ManualProxy: {
                                        HTTPProxy: $form.find('#proxyServer').val(),
                                        ProxyPassword: $form.find('#password').val(),
                                        ProxyUsername: $form.find('#authentication').val(),
                                        PortNumber: $form.find('#port').val()
                                    },
                                    android: false,
                                    iOS: true
                                });
                            }
                            else if(selectedProxySetup === 'automatic') {
                                this.collection.add({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#l2tpRSAID').is(':checked'),
                                    SharedSecret: $form.find('#sharedSecret').val(),
                                    OverridePrimary: $form.find('#l2tpTraffic').is(':checked'),
                                    AutomaticProxy: {
                                        ProxyServerUrl: $form.find('#proxyServerURL').val()
                                    },
                                    android: false,
                                    iOS: true
                                });
                            }
                            else
                            {
                                this.collection.add({
                                    UserDefinedName: $form.find('#connectionName').val(),
                                    VpnType: $form.find('#vpnType').val(),
                                    Server: $form.find('#server').val(),
                                    Account: $form.find('#accountAuth').val(),
                                    RSASecure: $form.find('#l2tpRSAID').is(':checked'),
                                    SharedSecret: $form.find('#sharedSecret').val(),
                                    OverridePrimary: $form.find('#l2tpTraffic').is(':checked'),
                                    android: false,
                                    iOS: true
                                });
                            }
                        }
                        /* else if ($form.find('#vpnType').val() === 'L2TP_IPSEC') {
                         if ($form.find('#showAdvancedOptions').is(':checked')) {
                         this.collection.add({
                         vpn_name: $form.find('#vpnName').val(),
                         vpn_type: $form.find('#vpnType').val(),
                         server_address: $form.find('#serverAddress').val(),
                         l2tp_secret: $form.find('#l2tpSecretRSA').val(),
                         ipsec_user_certificate: $form.find('#ipSecUserCertificate').val(),
                         ipsec_ca_certificate: $form.find('#ipSecCACertificate').val(),
                         ipsec_server_certificate: $form.find('#ipSecServerCertificate').val(),
                         advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                         dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                         dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                         forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val()
                         });
                         }
                         else {
                         this.collection.add({
                         vpn_name: $form.find('#vpnName').val(),
                         vpn_type: $form.find('#vpnType').val(),
                         server_address: $form.find('#serverAddress').val(),
                         l2tp_secret: $form.find('#l2tpSecretRSA').val(),
                         ipsec_user_certificate: $form.find('#ipSecUserCertificate').val(),
                         ipsec_ca_certificate: $form.find('#ipSecCACertificate').val(),
                         ipsec_server_certificate: $form.find('#ipSecServerCertificate').val(),
                         advanced_options: $form.find('#showAdvancedOptions').prop('checked')
                         });
                         }
                         }*/
                    }
                    this.iosVPNView.close();
                    this.renderContent();
                    this.$el.find('#vpn-select').addClass('display-none');
                    this.$el.find('.vpnList').removeClass('display-none');
                    return this;
                },
                updateVPNForm: function (event) {
                    event.preventDefault();
                    //this.vpnProfileListView = new VPNProfileListView.View();
                    //this.vpnProfileListView.model = new VPNProfileListView.Model();
                    //this.vpnProfileListView.model.urlRoot = '/policies/company/' + App.companyID + '/vpn';
                    var $form = $(this.el).find('#vpnForm'),
                        modelID = $form.find('#model-cid').val();
                    if(modelID.trim()) {
                        if ($form.find('#vpnType').val() === 'PPTP') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#pptp_username').val(),
                                    password: $form.find('#pptp_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ppp_encryption: $form.find('#pppEncryption').prop('checked'),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#pptp_username').val(),
                                    password: $form.find('#pptp_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ppp_encryption: $form.find('#pppEncryption').prop('checked'),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'L2TP_IPSEC_PSK') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#l2tp_psk_username').val(),
                                    password: $form.find('#l2tp_psk_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    l2tp_secret: $form.find('#l2tpSecretPSK').val(),
                                    ipsec_id: $form.find('#ipSecID').val(),
                                    ipsec_key: $form.find('#ipSecKey').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#l2tp_psk_username').val(),
                                    password: $form.find('#l2tp_psk_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    l2tp_secret: $form.find('#l2tpSecretPSK').val(),
                                    ipsec_id: $form.find('#ipSecID').val(),
                                    ipsec_key: $form.find('#ipSecKey').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'L2TP_IPSEC') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    l2tp_secret: $form.find('#l2tpSecretRSA').val(),
                                    ipsec_user_certificate: $form.find('#ipSecUserCertificate').val(),
                                    ipsec_ca_certificate: $form.find('#ipSecCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#ipSecServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    l2tp_secret: $form.find('#l2tpSecretRSA').val(),
                                    ipsec_user_certificate: $form.find('#ipSecUserCertificate').val(),
                                    ipsec_ca_certificate: $form.find('#ipSecCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#ipSecServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'IPSEC_XAUTH_PSK') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#ipSecXauth_username').val(),
                                    password: $form.find('#ipSecXauth_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_id: $form.find('#ipSecXauthID').val(),
                                    ipsec_key: $form.find('#ipSecXauthKey').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#ipSecXauth_username').val(),
                                    password: $form.find('#ipSecXauth_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_id: $form.find('#ipSecXauthID').val(),
                                    ipsec_key: $form.find('#ipSecXauthKey').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'IPSEC_XAUTH_RSA') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_user_certificate: $form.find('#xAuthUserCertificate').val(),
                                    ipsec_ca_certificate: $form.find('#xAuthCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#xAuthServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_user_certificate: $form.find('#xAuthUserCertificate').val(),
                                    ipsec_ca_certificate: $form.find('#xAuthCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#xAuthServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'IPSEC_HYBRID_RSA') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_ca_certificate: $form.find('#hybridCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#hybridServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.get(modelID).set({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_ca_certificate: $form.find('#hybridCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#hybridServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                    }
                    else
                    {
                        if ($form.find('#vpnType').val() === 'PPTP') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#pptp_username').val(),
                                    password: $form.find('#pptp_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ppp_encryption: $form.find('#pppEncryption').prop('checked'),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#pptp_username').val(),
                                    password: $form.find('#pptp_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ppp_encryption: $form.find('#pppEncryption').prop('checked'),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'L2TP_IPSEC_PSK') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#l2tp_psk_username').val(),
                                    password: $form.find('#l2tp_psk_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    l2tp_secret: $form.find('#l2tpSecretPSK').val(),
                                    ipsec_id: $form.find('#ipSecID').val(),
                                    ipsec_key: $form.find('#ipSecKey').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#l2tp_psk_username').val(),
                                    password: $form.find('#l2tp_psk_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    l2tp_secret: $form.find('#l2tpSecretPSK').val(),
                                    ipsec_id: $form.find('#ipSecID').val(),
                                    ipsec_key: $form.find('#ipSecKey').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'L2TP_IPSEC') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    l2tp_secret: $form.find('#l2tpSecretRSA').val(),
                                    ipsec_user_certificate: $form.find('#ipSecUserCertificate').val(),
                                    ipsec_ca_certificate: $form.find('#ipSecCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#ipSecServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    l2tp_secret: $form.find('#l2tpSecretRSA').val(),
                                    ipsec_user_certificate: $form.find('#ipSecUserCertificate').val(),
                                    ipsec_ca_certificate: $form.find('#ipSecCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#ipSecServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'IPSEC_XAUTH_PSK') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#ipSecXauth_username').val(),
                                    password: $form.find('#ipSecXauth_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_id: $form.find('#ipSecXauthID').val(),
                                    ipsec_key: $form.find('#ipSecXauthKey').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    username: $form.find('#ipSecXauth_username').val(),
                                    password: $form.find('#ipSecXauth_password').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_id: $form.find('#ipSecXauthID').val(),
                                    ipsec_key: $form.find('#ipSecXauthKey').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'IPSEC_XAUTH_RSA') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_user_certificate: $form.find('#xAuthUserCertificate').val(),
                                    ipsec_ca_certificate: $form.find('#xAuthCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#xAuthServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_user_certificate: $form.find('#xAuthUserCertificate').val(),
                                    ipsec_ca_certificate: $form.find('#xAuthCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#xAuthServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                        else if ($form.find('#vpnType').val() === 'IPSEC_HYBRID_RSA') {
                            if ($form.find('#showAdvancedOptions').is(':checked')) {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_ca_certificate: $form.find('#hybridCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#hybridServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    dns_search_domains: $form.find('#dnsSearchDomains').val() === '' ? null : $form.find('#dnsSearchDomains').val(),
                                    dns_servers: $form.find('#dnsServers').val() === '' ? null : $form.find('#dnsServers').val(),
                                    forwarding_routes: $form.find('#forwardingRoutes').val() === '' ? null : $form.find('#forwardingRoutes').val(),
                                    android: true,
                                    iOS: false
                                });
                            }
                            else {
                                this.collection.add({
                                    vpn_name: $form.find('#vpnName').val(),
                                    vpn_type: $form.find('#vpnType').val(),
                                    server_address: $form.find('#serverAddress').val(),
                                    ipsec_ca_certificate: $form.find('#hybridCACertificate').val(),
                                    ipsec_server_certificate: $form.find('#hybridServerCertificate').val(),
                                    advanced_options: $form.find('#showAdvancedOptions').prop('checked'),
                                    android: true,
                                    iOS: false
                                });
                            }
                        }
                    }
                    this.vpnProfileListView.close();
                    this.renderContent();
                    this.$el.find('#vpn-select').addClass('display-none');
                    this.$el.find('.vpnList').removeClass('display-none');
                    return this;
                },
                saveChanges: function() {
                    this.model.save();
                    this.closeSaveChangesView();
                    return this;
                },
                discardChanges: function() {
                    delete this.model.id;
                    this.render();
                    this.closeSaveChangesView();
                    return this;
                },
                closeSaveChangesView: function() {
                    if(this.saveChangesView) {
                        this.saveChangesView.close();
                        delete this.saveChangesView;
                    }
                    return this;
                },
                createAddVPNView: function () {
                    if (this.vpnProfileListView instanceof Backbone.View)
                    {
                        this.vpnProfileListView.isClosed = false;
                        return this;
                    }
                    else if (this.vpnOSControlsView instanceof Backbone.View)
                    {
                        this.vpnOSControlsView.isClosed = false;
                        return this;
                    }
                    this.vpnProfileListView = new VPNProfileListView.View();
                    this.vpnOSControlsView = new VPNOSControlsView.View();
                    return this;
                },
                addNewVPN: function () {
                    this.createAddVPNView();
                    this.vpnOSControlsView = new VPNOSControlsView.View();
                    this.vpnOSControlsView.render();
                    this.$el.find('#vpn-select').removeClass('display-none').html(this.vpnOSControlsView.$el);
                    this.$el.find('.vpnList').addClass('display-none');
                    return this;
                },
                editVPNProfile: function (event) {
                    event.preventDefault();

                    var editModelID = $(event.currentTarget).parents('.item').attr('data-modelid'),
                        editModel = this.collection.get(editModelID),
                        isAndroid = editModel.get('android');
                    this.$el.find('.vpnList').addClass('display-none');

                    //this.createAddVPNView();
                    if(isAndroid) {
                        if(this.vpnProfileListView && this.vpnProfileListView instanceof Backbone.View) {
                            this.vpnProfileListView.close();
                        }
                        this.vpnProfileListView = new VPNProfileListView.View();
                        //this.$el.empty().append(this.vpnProfileListView.$el);

                        this.$el.find('#vpn-form').removeClass('display-none').html(this.vpnProfileListView.$el);
                        this.vpnProfileListView.render();
                        var href = $(event.currentTarget).attr('href').substring(1);
                        //App.router.navigate(href);

                        var vpnName = editModel.get('vpn_name'),
                            vpnType = editModel.get('vpn_type'),
                            serverAddress = editModel.get('server_address'),
                            modelCid = editModel.cid,
                            form = $(this.el).find('#vpnForm');
                        form.find('#model-cid').val(modelCid);
                        form.find('#vpnName').val(vpnName);
                        form.find('#vpnType').val(vpnType);
                        form.find('#serverAddress').val(serverAddress);
                        this.renderVPNType(editModel);
                        var showAdvancedOptions = editModel.get('advanced_options');
                        if (showAdvancedOptions === true)
                        {
                            form.find('#showAdvancedOptions').prop('checked', showAdvancedOptions);
                            $('.advancedOptions').toggleClass('display-none', !showAdvancedOptions);
                            var dnsSearchDomains = editModel.get('dns_search_domains'),
                                dnsServers = editModel.get('dns_servers'),
                                forwardingRoutes = editModel.get('forwarding_routes');
                            form.find('#dnsSearchDomains').val(dnsSearchDomains);
                            form.find('#dnsServers').val(dnsServers);
                            form.find('#forwardingRoutes').val(forwardingRoutes);
                        }
                        else
                        {
                            form.find('#showAdvancedOptions').prop('checked', showAdvancedOptions);
                            $('.advancedOptions').toggleClass('display-none', !showAdvancedOptions);
                        }
                    } else {
                        if(this.iosVPNView && this.iosVPNView instanceof Backbone.View) {
                            this.iosVPNView.close();
                        }
                        this.iosVPNView = new iOSVPNView.View();
//                        this.$el.find('.vpnList').addClass('display-none');
                        this.iosVPNView.render();
                        this.$el.find('#vpn-form').removeClass('display-none').html(this.iosVPNView.$el);
                        var vpnName = editModel.get('UserDefinedName'),
                            vpnType = editModel.get('VpnType'),
                            serverAddress = editModel.get('Server'),
                            modelCid = editModel.cid,
                            RSASecure = editModel.get('RSASecure'),
                            proxy = editModel.get('ManualProxy')?'manual':editModel.get('AutomaticProxy')?'automatic':'none',
                            form = $(this.el).find('#iOSVPNForm');
                        form.find('#model-cid').val(modelCid);
                        form.find("#connectionName").val(vpnName);
                        form.find("#vpnType").val(vpnType);
                        form.find("#server").val(serverAddress);
                        form.find("#accountAuth").val(editModel.get('Account'));

                        if(vpnType === "PPTP") {
                            form.find("#encryptionLevel").val(editModel.get("EncryptionLevel"));
                            if(RSASecure) {
                                form.find("#pptpRSAID").attr("checked","checked");
                            }  else {
                                form.find("#pptpPassword").attr("checked","checked");
                            }
                            if(editModel.get('OverridePrimary')) {
                                form.find("#pptpTraffic").attr("checked","checked");
                            }

                        } else  {
                            if(this.inneriOSVPNView && this.inneriOSVPNView instanceof Backbone.View) {
                                this.inneriOSVPNView.close();
                            }
                            this.inneriOSVPNView = new InneriOSVPNView.View();
                            this.$el.find('#iOSSelectDependentDiv').html(this.inneriOSVPNView.$el);
                            this.inneriOSVPNView.render(this.iOSpptpTemplate({PPTP: false, L2TP: true}));
                            form.find("#sharedSecret").val(editModel.get("SharedSecret"));
                            if(RSASecure) {
                                form.find("#l2tpRSAID").attr("checked","checked");
                            }  else {
                                form.find("#l2tpPassword").attr("checked","checked");
                            }
                            if(editModel.get('OverridePrimary')) {
                                form.find("#l2tpTraffic").attr("checked","checked");
                            }
                        }
                        form.find("#proxySetup").val(proxy);
                        if(this.inneriOSProxyVPNView && this.inneriOSProxyVPNView instanceof Backbone.View) {
                            this.inneriOSProxyVPNView.close();
                        }
                        if(proxy === 'manual')
                        {
                            this.inneriOSProxyVPNView = new InneriOSVPNView.View();
                            this.$el.find('#proxy-Setup').html(this.inneriOSProxyVPNView.$el);
                            this.inneriOSProxyVPNView.render(this.iOSproxysetupTemplate({manual: true, automatic: false}));
                            form.find('#proxyServer').val(editModel.get('ManualProxy')['HTTPProxy']);
                            form.find('#password').val(editModel.get('ManualProxy')['ProxyPassword']);
                            form.find('#authentication').val(editModel.get('ManualProxy')['ProxyUsername']);
                            form.find('#port').val(editModel.get('ManualProxy')['PortNumber']);
                        }
                        else if(proxy === 'automatic')
                        {
                            this.inneriOSProxyVPNView = new InneriOSVPNView.View();
                            this.$el.find('#proxy-Setup').html(this.inneriOSProxyVPNView.$el);
                            this.inneriOSProxyVPNView.render(this.iOSproxysetupTemplate({manual: false, automatic: true}));
                            form.find('#proxyServerURL').val(editModel.get('AutomaticProxy')['ProxyServerUrl']);
                        }
                    }

                    return this;
                },
                renderVPNType: function(editModel) {
                    var selectedOption = this.$el.find('#vpnType').val();
                    this.$el.find('#selectDependentDiv').empty();
                    var form = $(this.el).find('#vpnForm');

                    if (selectedOption === 'PPTP') {
                        this.vpnProfileListView.innerVPNView = new InnerVPNView.View();
                        this.$el.find('#selectDependentDiv').append(this.vpnProfileListView.innerVPNView.$el);
                        this.vpnProfileListView.innerVPNView.render(this.vpnProfileListView.pptpl2tpTemplate({PPTP: true, IPSecPSK: false, IPSecRSA: false}));
                        var pppEncryption = editModel.get('ppp_encryption');
                        form.find('#pppEncryption').prop('checked', pppEncryption);
                        console.log(editModel.toJSON());
                        form.find('#pptp_username').val(editModel.get('username'));
                        form.find('#pptp_password').val(editModel.get('password'));
                    }
                    else if (selectedOption === 'L2TP_IPSEC_PSK') {
                        this.vpnProfileListView.innerVPNView = new InnerVPNView.View();
                        this.$el.find('#selectDependentDiv').append(this.vpnProfileListView.innerVPNView.$el);
                        this.vpnProfileListView.innerVPNView.render(this.vpnProfileListView.pptpl2tpTemplate({PPTP: false, IPSecPSK: true, IPSecRSA: false}));
                        var l2tpSecret = editModel.get('l2tp_secret'),
                            ipsecID = editModel.get('ipsec_id'),
                            ipsecKey = editModel.get('ipsec_key');
                        form.find('#l2tpSecretPSK').val(l2tpSecret);
                        form.find('#ipSecID').val(ipsecID);
                        form.find('#ipSecKey').val(ipsecKey);
                        form.find('#l2tp_psk_username').val(editModel.get('username'));
                        form.find('#l2tp_psk_password').val(editModel.get('password'));
                    }
                    else if (selectedOption === 'L2TP_IPSEC') {
                        this.vpnProfileListView.innerVPNView = new InnerVPNView.View();
                        this.$el.find('#selectDependentDiv').append(this.vpnProfileListView.innerVPNView.$el);
                        this.vpnProfileListView.innerVPNView.render(this.vpnProfileListView.pptpl2tpTemplate({PPTP: false, IPSecPSK: false, IPSecRSA: true}));
                        var l2tp_secret = editModel.get('l2tp_secret'),
                            ipsecUserCertificate = editModel.get('ipsec_user_certificate'),
                            ipsecCACertificate = editModel.get('ipsec_ca_certificate'),
                            ipsecServerCertificate = editModel.get('ipsec_server_certificate');
                        form.find('#l2tpSecretRSA').val(l2tp_secret);
                        form.find('#ipSecUserCertificate').val(ipsecUserCertificate);
                        form.find('#ipSecCACertificate').val(ipsecCACertificate);
                        form.find('#ipSecServerCertificate').val(ipsecServerCertificate);
                    }
                    else if (selectedOption === 'IPSEC_XAUTH_PSK') {
                        this.vpnProfileListView.innerVPNView = new InnerVPNView.View();
                        this.$el.find('#selectDependentDiv').append(this.vpnProfileListView.innerVPNView.$el);
                        this.vpnProfileListView.innerVPNView.render(this.vpnProfileListView.ipSecTemplate({IPSecXauthPSK: true, IPSecXauthRSA: false, IPSecHybridRSA: false}));
                        var xAuthID = editModel.get('ipsec_id'),
                            xAuthKey = editModel.get('ipsec_key');
                        form.find('#ipSecXauthID').val(xAuthID);
                        form.find('#ipSecXauthKey').val(xAuthKey);

                        form.find('#ipSecXauth_username').val(editModel.get('username'));
                        form.find('#ipSecXauth_password').val(editModel.get('password'));
                    }
                    else if (selectedOption === 'IPSEC_XAUTH_RSA') {
                        this.vpnProfileListView.innerVPNView = new InnerVPNView.View();
                        this.$el.find('#selectDependentDiv').append(this.vpnProfileListView.innerVPNView.$el);
                        this.vpnProfileListView.innerVPNView.render(this.vpnProfileListView.ipSecTemplate({IPSecXauthPSK: false, IPSecXauthRSA: true, IPSecHybridRSA: false}));
                        var xAuthUserCertificate = editModel.get('ipsec_user_certificate'),
                            xAuthCACertificate = editModel.get('ipsec_ca_certificate'),
                            xAuthServerCertificate = editModel.get('ipsec_server_certificate');
                        form.find('#xAuthUserCertificate').val(xAuthUserCertificate);
                        form.find('#xAuthCACertificate').val(xAuthCACertificate);
                        form.find('#xAuthServerCertificate').val(xAuthServerCertificate);
                    }
                    else if (selectedOption === 'IPSEC_HYBRID_RSA') {
                        this.vpnProfileListView.innerVPNView = new InnerVPNView.View();
                        this.$el.find('#selectDependentDiv').append(this.vpnProfileListView.innerVPNView.$el);
                        this.vpnProfileListView.innerVPNView.render(this.vpnProfileListView.ipSecTemplate({IPSecXauthPSK: false, IPSecXauthRSA: false, IPSecHybridRSA: true}));
                        var hybridCACertificate = editModel.get('ipsec_ca_certificate'),
                            hybridServerCertificate = editModel.get('ipsec_server_certificate');
                        form.find('#hybridCACertificate').val(hybridCACertificate);
                        form.find('#hybridServerCertificate').val(hybridServerCertificate);
                    }
                    return this;
                },
                toggleDeleteButton: function () {
                    var deleteButton = $('#delete'),
                        checkedBoxes = $('input[name=checkbox]:checked');
                    deleteButton.prop('disabled', !checkedBoxes.length);
                    return this;
                },
                selectAll: function (event) {
                    var checked = event.target.checked,
                        $checkboxes = this.$('input[name=checkbox]');
                    $checkboxes.prop('checked', checked);
                    $('#delete').prop('disabled', !$checkboxes.prop('checked'));
                    return this;
                },
                beforeRender: $.noop,
                onRender: $.noop,

                render: function () {
                    if (this.beforeRender !== $.noop) { this.beforeRender(); }

                    this.model.fetch();

                    if (this.onRender !== $.noop) { this.onRender(); }
                    return this;
                },
                renderTemplate: function (model) {
                    this.$el.empty().append(this.template({header: false, legend: false, object_type: this.model.get('object_type'), name: this.model.get('name')}));
                    this.renderContent(model);
                    return this;
                },
                renderContent: function () {
                    this.list.render();
                    this.$el.find('.vpnList').empty().show().append(this.list.delegateEvents().$el);
                    return this;
                },
                selectFormByOSType: function(event) {
                    var selectedOS = $(event.currentTarget).val();
                    if(selectedOS === 'android')
                    {
                        this.vpnProfileListView = new VPNProfileListView.View();
//                        this.$el.find('.vpnList').addClass('display-none');
                        this.vpnProfileListView.render();
                        this.$el.find('#vpn-form').removeClass('display-none').html(this.vpnProfileListView.$el);
                    }
                    else if(selectedOS === 'iOS')
                    {
                        this.iosVPNView = new iOSVPNView.View();
//                        this.$el.find('.vpnList').addClass('display-none');
                        this.iosVPNView.render();
                        this.$el.find('#vpn-form').removeClass('display-none').html(this.iosVPNView.$el);
                    }
                    else
                    {
                        if (this.vpnProfileListView)
                        {
                            this.vpnProfileListView.close();
                            this.vpnProfileListView.isClosed = true;
                            return this;
                        }
                        else if (this.iosVPNView)
                        {
                            this.iosVPNView.close();
                            this.iosVPNView.isClosed = true;
                            return this;
                        }
                    }
                    return this;
                }
            })
        });

        return exports;

    }
);