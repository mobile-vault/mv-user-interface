define(['jquery', 'underscore', 'backbone', 'app', 'crel', 'views/view', 'views/policies/policyViews/wifiProfileList', 'views/policies/policyViews/saveChanges',
        'lists/list', 'text!template/policy-wifi.html', 'text!template/wifiProfile.html', 'text!template/wifiList.html','backbone.relational', 'core/js/API/policies/wifi', 'core/js/API/policies/wifi-save'],
    function ($, _, Backbone, App, crel, View, WiFiProfileListView, SaveChangesView, List, WiFiPolicyTemplate, WiFiProfileTemplate, WiFiListTemplate) {

        var exports = {
            Model:Backbone.RelationalModel.extend({
                urlRoot: '',
                idAttribute: '_id',
                relations: [
                    {
                        type: Backbone.HasMany,
                        key: 'installed_wifis',
                        relatedModel: 'Wifi',
                        collectionType: 'WifiCollection',
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
            Wifi: Backbone.RelationalModel.extend({
                defaults: {
                    ssid: "",
                    wifi_security: "PSK",
                    password: "",
                    auto_join: false,
                    hidden_network: false,
                    android: true,
                    iOS: true
                }
            }),
            WifiCollection: Backbone.Collection.extend({
                model: this.Wifi
            })
        };

        _.extend(exports, {
            View: View.extend({
                initialize: function (options) {
                    this.options = options;
                    this.template = _.template(WiFiProfileTemplate);
                    this.model = new exports.Model();
                    this.wifiProfileListView = new WiFiProfileListView.View();
                    this.listenTo(this.model, 'request', this.showLoading);
                    this.listenTo(this.model, 'sync', this.fetchSuccess);
                    this.listenTo(this.model, 'error', this.fetchError);
                    this.collection = this.model.get('installed_wifis');


                    var ListView = List.View.extend({
                        collection:this.collection,
                        wifiListTemplate: WiFiListTemplate,
                        causeNavigation: false,
                        initialize: function (options) {
                            if (options) {
                                _.extend(this, _.pick(options, ['showHeader', 'showLegend', 'showFooter', 'itemKeys']));
                            }
                        },
                        renderModel: function (model) {
                            var template = _.template(this.wifiListTemplate),
                                payload = {
                                    company_id: App.companyID,
                                    params: this.collection.params,
                                    model: model
                                };
                            return template(payload);
                        },
                        layoutHeader: function ($header) {
                            var headerTemplate = _.template(WiFiProfileTemplate);
                            $header.append(headerTemplate({header: true, legend: false}));
                            return this;
                        },
                        layoutLegend: function ($legend) {
                            var legendTemplate = _.template(WiFiProfileTemplate);
                            $legend.append(legendTemplate({header: false, legend: true}));
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
                    this.list =  new ListView(options);
                },
                events: {
                    'submit #wifiForm'                      :   'updateWiFiForm',
                    'change #security'                      :   'filterBySecurity',
                    'click #saveChanges'                    :   'saveChanges',
                    'click #discardChanges'                 :   'discardChanges',
                    'click #backToWifiList'                 :   'backToWifiList',
                    'click #addWiFi'                        :   'addWiFiProfile',
                    'click a[data-action=user_edit]'        :   'editWiFiProfile',
                    'click input[data-toggle=all]'          :   'selectAll',
                    'change input[name=checkbox]'           :   'toggleDeleteButton',
                    'click #deleteWifi'                     :   'deleteWifi'
                },
                deleteWifi: function(event) {
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
                    this.renderTemplate(model.toJSON());
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

                    this.clonedWifiCollection = _.clone(this.collection.toJSON(), true);
                    this.listenTo(this.collection, 'add', this.toggleWifiProfilesView);
                    this.listenTo(this.collection, 'remove', this.toggleWifiProfilesView);
                    this.listenTo(this.collection, 'change', this.toggleWifiProfilesView);

                    return this;
                },
                toggleWifiProfilesView: function () {
                    var toggle = _.isEqual(this.clonedWifiCollection, this.collection.toJSON());
                    this.$('.wifi-list-container').toggleClass('model-changed', !toggle);
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
                updateWiFiForm: function(event) {
                    event.preventDefault();
                    var $form = $(this.el).find('#wifiForm'),
                        modelID = $form.find('#model-cid').val();
                    if(modelID.trim()) {
                        if($form.find('#security') === 'None')
                        {
                            this.collection.get(modelID).set({
                                ssid: $form.find('#networkName').val(),
                                wifi_security: $form.find('#security').val(),
                                auto_join: $form.find('#autoJoin').prop('checked'),
                                hidden_network: $form.find('#hiddenNetwork').prop('checked')
                            }, {validate: true});
                        }
                        else
                        {
                            this.collection.get(modelID).set({
                                ssid: $form.find('#networkName').val(),
                                wifi_security: $form.find('#security').val(),
                                password: $form.find('#password').val(),
                                auto_join: $form.find('#autoJoin').prop('checked'),
                                hidden_network: $form.find('#hiddenNetwork').prop('checked')
                            }, {validate: true});
                        }
                    }
                    else
                    {
                        if($form.find('#security') === 'None')
                        {
                            this.collection.add({
                                ssid: $form.find('#networkName').val(),
                                wifi_security: $form.find('#security').val(),
                                auto_join: $form.find('#autoJoin').prop('checked'),
                                hidden_network: $form.find('#hiddenNetwork').prop('checked')
                            }, {validate: true});
                        }
                        else
                        {
                            this.collection.add({
                                ssid: $form.find('#networkName').val(),
                                wifi_security: $form.find('#security').val(),
                                password: $form.find('#password').val(),
                                auto_join: $form.find('#autoJoin').prop('checked'),
                                hidden_network: $form.find('#hiddenNetwork').prop('checked')
                            }, {validate: true});
                        }
                    }
                    this.wifiProfileListView.close();
                    this.renderContent();
                    this.$el.find('.wifiList').removeClass('display-none');
                    return this;
                },
                filterBySecurity: function(event) {
                    var wifiForm = $('#wifiForm'),
                        password = wifiForm.find('#password'),
                        selectedOption = $(event.currentTarget).val();
                    if(selectedOption === 'WEP')
                    {
                        this.$el.find('#passwordDiv').removeClass('display-none');
                        password.attr({placeholder: 'WEP Password'});
                    }
                    else if(selectedOption === 'PSK')
                    {
                        this.$el.find('#passwordDiv').removeClass('display-none');
                        password.attr({placeholder: 'PSK Password'});
                    }
                    else
                    {
                        this.$el.find('#passwordDiv').addClass('display-none');
                    }
                },
                backToWifiList: function() {
                    this.$el.find('#wifi-form').addClass('display-none');
                    this.$el.find('.wifiList').removeClass('display-none');
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
                createAddWifiView: function () {
                    if (this.wifiProfileListView instanceof Backbone.View) {
                        this.wifiProfileListView.isClosed = false;
                        return this;
                    }
                    this.wifiProfileListView = new WiFiProfileListView.View();
                    return this;
                },
                addWiFiProfile:function() {
                    this.createAddWifiView();
                    this.$el.find('.wifiList').addClass('display-none');
                    this.$el.find('#wifi-form').removeClass('display-none').html(this.wifiProfileListView.$el);
                    this.wifiProfileListView.render();
                    return this;
                },
                editWiFiProfile: function(event) {
                    event.preventDefault();
                    this.createAddWifiView();
                    this.$el.find('.wifiList').addClass('display-none');
                    this.$el.find('#wifi-form').removeClass('display-none').html(this.wifiProfileListView.$el);
                    this.wifiProfileListView.render();
                    var href = $(event.currentTarget).attr('href').substring(1);
                    //App.router.navigate(href);
                    var editModelID = $(event.currentTarget).parents('.item').attr('data-modelid'),
                        editModel = this.collection.get(editModelID);
                    var wifiName = editModel.get('ssid'),
                        wifiSecurity = editModel.get('wifi_security'),
                        wifiPassword = editModel.get('password'),
                        autoJoin = editModel.get('auto_join'),
                        hiddenNetwork = editModel.get('hidden_network'),
                        modelCid = editModel.cid,
                        form = $(this.el).find('#wifiForm');
                    form.find('#networkName').val(wifiName);
                    form.find('#security').val(wifiSecurity);
                    form.find('#password').val(wifiPassword);
                    form.find('#model-cid').val(modelCid);
                    form.find('#autoJoin').prop('checked', autoJoin);
                    form.find('#hiddenNetwork').prop('checked', hiddenNetwork);
                    this.renderWifiSecurity(editModel);
                    return this;
                },
                renderWifiSecurity: function(editModel) {
                    var wifiForm = $('#wifiForm'),
                        password = wifiForm.find('#password'),
                        selectedOption = this.$el.find('#security').val();
                    if(selectedOption === 'WEP')
                    {
                        this.$el.find('#passwordDiv').removeClass('display-none');
                        password.attr({placeholder: 'WEP Password'});
                        var wepPassword = editModel.get('password');
                        wifiForm.find('#password').val(wepPassword);
                    }
                    else if(selectedOption === 'PSK')
                    {
                        this.$el.find('#passwordDiv').removeClass('display-none');
                        password.attr({placeholder: 'PSK Password'});
                        var pskPassword = editModel.get('password');
                        wifiForm.find('#password').val(pskPassword);
                    }
                    else
                    {
                        this.$el.find('#passwordDiv').addClass('display-none');
                    }
                },
                toggleDeleteButton: function() {
                    var deleteButton = $('#delete'),
                        checkedBoxes = $('input[name=checkbox]:checked');
                    deleteButton.prop('disabled', !checkedBoxes.length);
                },
                selectAll: function (event) {
                    var checked = event.target.checked,
                        $checkboxes = this.$('input[name=checkbox]');
                    $checkboxes.prop('checked', checked);
                    $('#delete').prop('disabled', !$checkboxes.prop('checked'));
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
                    this.$el.find('.wifiList').empty().show().append(this.list.delegateEvents().$el);
                    return this;
                }
            })
        });

        return exports;

    }
);