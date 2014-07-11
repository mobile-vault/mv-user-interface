define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/view', 'views/policies/policyViews/saveChanges', 'views/policies/policyViews/bluetoothControls',
    'views/policies/policyViews/bluetoothProfileList', 'text!template/policy-bluetooth.html', 'text!template/bluetoothControls.html',
    'text!template/bluetoothProfile.html', 'text!template/bluetoothList.html', 'backbone.relational', 'core/js/API/policies/bluetooth', 'core/js/API/policies/bluetooth-save'],
    function($, _, Backbone, crel, App, View, SaveChangesView, BluetoothControlsView, BluetoothProfileListView, BluetoothPolicyTemplate,
             BluetoothControlsTemplate, BluetoothProfileTemplate, BluetoothListTemplate) {

        var exports = {
            Model:Backbone.RelationalModel.extend({
                urlRoot: '',
                idAttribute: '_id',
                relations: [
                    {
                        type: Backbone.HasOne,
                        key: 'bluetooth_status',
                        relatedModel: 'BluetoothStatusModel',
                        reverseRelation: {
                            key: 'appSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasMany,
                        key: 'white_listed_pairings',
                        relatedModel: 'BluetoothModel',
                        collectionType: 'WhiteListedAppsCollection',
                        reverseRelation: {
                            key: 'appSettings1',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasMany,
                        key: 'black_listed_pairings',
                        relatedModel: 'BluetoothModel',
                        collectionType: 'BlackListedAppsCollection',
                        reverseRelation: {
                            key: 'appSettings2',
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
            BluetoothModel: Backbone.RelationalModel.extend({
                defaults: {
                    bluetooth_name: '',
                    bluetooth_cod: '',
                    bluetooth_uuid: '',
                    bluetooth_pairing: '',
                    android: true,
                    iOS: true
                }
            }),
            WhiteListedAppsCollection: Backbone.Collection.extend({
                model: this.BluetoothModel
            }),
            BlackListedAppsCollection: Backbone.Collection.extend({
                model: this.BluetoothModel
            }),
            BluetoothStatusModel: Backbone.RelationalModel.extend({
                defaults: {
                    enable_bluetooth: true,
                    power_status: true,
                    android: true,
                    iOS: true
                }
            }),

            View: View.extend({
                tagName: 'div',
                initialize: function(options) {
                    this.options = options;
                    this.template = _.template(BluetoothProfileTemplate);
                    this.model = new exports.Model();
                    this.listenTo(this.model, 'request', this.showLoading);
                    this.listenTo(this.model, 'sync', this.fetchSuccess);
                    this.listenTo(this.model, 'error', this.fetchError);
                },
                events: {
                    'click #saveChanges'                                :   'saveChanges',
                    'click #discardChanges'                             :   'discardChanges',
                    'submit #bluetoothForm'                             :   'updateBluetoothForm',
                    'click #backToBluetoothList'                        :   'backToBluetoothList',
                    'click #addToWhitelist'                             :   'addToWhitelist',
                    'click #addToBlacklist'                             :   'addToBlacklist',
                    'click a[data-action=bluetooth_edit]'               :   'editBluetoothProfile',
                    'click button[data-action=bluetooth_blacklist]'     :   'blacklistingDevice',
                    'click button[data-action=bluetooth_whitelist]'     :   'whitelistingDevice',
                    'click #selectAllWhitelist'                         :   'onSelectWhitelist',
                    'click #selectAllBlacklist'                         :   'onSelectBlacklist',
                    'change input[name=whitelistCheckbox]'              :   'toggleWhitelistDeleteButton',
                    'change input[name=blacklistCheckbox]'              :   'toggleBlacklistDeleteButton' ,
                    'click .bluetooth-settings input[type=checkbox]'    :   'toggleBluetoothStatusModel',
                    'click #whitelistDelete'                            :   'deleteWhiteList',
                    'click #blacklistDelete'                            :   'deleteBlackList'
                },
                bluetoothListTemplate: BluetoothListTemplate,
                bluetoothControlsTemplate: BluetoothControlsTemplate,
                updateBluetoothForm: function(event) {
                    event.preventDefault();
                    this.bluetoothProfileListView = new BluetoothProfileListView.View();
                    var $form = $(this.el).find('#bluetoothForm'),
                        modelID = $form.find('#model-cid').val();
                    if(modelID.trim()) {
                        if(this.whiteListedAppsCollection.get(modelID))
                        {
                            this.whiteListedAppsCollection.get(modelID).set({
                                bluetooth_name: $form.find('#deviceName').val(),
                                bluetooth_cod: $form.find('#cod').val(),
                                bluetooth_uuid: $form.find('#uuid').val(),
                                bluetooth_pairing: $form.find('#enablePairing').prop('checked')
                            }, {validate: true});
                        }
                        else if(this.blacklistedAppsCollection.get(modelID))
                        {
                            this.blacklistedAppsCollection.get(modelID).set({
                                bluetooth_name: $form.find('#deviceName').val(),
                                bluetooth_cod: $form.find('#cod').val(),
                                bluetooth_uuid: $form.find('#uuid').val(),
                                bluetooth_pairing: $form.find('#enablePairing').prop('checked')
                            }, {validate: true});
                        }

                    }
                    else
                    {
                        if($form.hasClass('whitelistForm'))
                        {
                            this.whiteListedAppsCollection.add({
                                bluetooth_name: $form.find('#deviceName').val(),
                                bluetooth_cod: $form.find('#cod').val(),
                                bluetooth_uuid: $form.find('#uuid').val(),
                                bluetooth_pairing: $form.find('#enablePairing').prop('checked')
                            }, {validate: true});
                        }
                        else if($form.hasClass('blacklistForm'))
                        {
                            this.blacklistedAppsCollection.add({
                                bluetooth_name: $form.find('#deviceName').val(),
                                bluetooth_cod: $form.find('#cod').val(),
                                bluetooth_uuid: $form.find('#uuid').val(),
                                bluetooth_pairing: $form.find('#enablePairing').prop('checked')
                            }, {validate: true});
                        }

                    }
                    this.renderAfterAction();
                    this.$el.find('#bluetoothList').removeClass('display-none');
                    this.$el.find('#bluetooth-form').addClass('display-none');
                    this.$el.find('#saveAndDiscard').removeClass('display-none');
                    return this;
                },
                createClones: function () {
                    this.clonedOriginalModel = _.clone(this.model.toJSON(),true);

                    this.clonedBluetoothStatusModel = _.clone(this.bluetoothStatusModel.toJSON(), true);

                    this.clonedWhitelistedAppsCollection = _.clone(this.whiteListedAppsCollection.toJSON(), true);

                    this.clonedBlacklistedAppsCollection = _.clone(this.blacklistedAppsCollection.toJSON(), true);

                    this.listenTo(this.whiteListedAppsCollection, 'add', this.toggleWhiteListedAppsView);
                    this.listenTo(this.whiteListedAppsCollection, 'remove', this.toggleWhiteListedAppsView);
                    this.listenTo(this.whiteListedAppsCollection, 'change', this.toggleWhiteListedAppsView);


                    this.listenTo(this.blacklistedAppsCollection, 'add', this.toggleBlackListedAppsView);
                    this.listenTo(this.blacklistedAppsCollection, 'remove', this.toggleBlackListedAppsView);
                    this.listenTo(this.blacklistedAppsCollection, 'change', this.toggleBlackListedAppsView);

                    return this;
                },
                toggleBluetoothStatusModel: function (event) {
                    var toggleAttr = $(event.currentTarget).attr('data-attr'),
                        toggleValue = event.target.checked,
                        temp = {};
                    temp[toggleAttr] = toggleValue;
                    this.bluetoothStatusModel.set(temp);
                    this.toggleBluetoothSettingsView();
                    return this;
                },
                toggleBluetoothSettingsView: function() {
                    var toggle = _.isEqual(this.clonedBluetoothStatusModel, this.bluetoothStatusModel.toJSON());
                    this.$('.bluetooth-settings').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                toggleWhiteListedAppsView: function () {
                    var toggle = _.isEqual(this.clonedWhitelistedAppsCollection, this.whiteListedAppsCollection.toJSON());
                    this.$('.white-listed-pairings').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                toggleBlackListedAppsView: function () {
                    var toggle = _.isEqual(this.clonedBlacklistedAppsCollection, this.blacklistedAppsCollection.toJSON());
                    this.$('.black-listed-pairings').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                toggleSaveChangesView: function(toggle) {
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
                addToWhitelist:function() {
                    this.bluetoothProfileListView = new BluetoothProfileListView.View();
                    this.$el.find('#bluetoothList').addClass('display-none');
                    this.$el.find('#saveAndDiscard').addClass('display-none');
                    this.$el.find('#bluetooth-form').removeClass('display-none').html(this.bluetoothProfileListView.$el);
                    this.bluetoothProfileListView.render();
                    this.$el.find('#bluetoothForm').removeClass('blacklistForm');
                    this.$el.find('#bluetoothForm').addClass('whitelistForm');
                    return this;
                },
                addToBlacklist:function() {
                    this.bluetoothProfileListView = new BluetoothProfileListView.View();
                    this.$el.find('#bluetoothList').addClass('display-none');
                    this.$el.find('#saveAndDiscard').addClass('display-none');
                    this.$el.find('#bluetooth-form').removeClass('display-none').html(this.bluetoothProfileListView.$el);
                    this.bluetoothProfileListView.render();
                    this.$el.find('#bluetoothForm').removeClass('whitelistForm');
                    this.$el.find('#bluetoothForm').addClass('blacklistForm');
                    return this;
                },
                deleteWhiteList: function(event) {
                    var itemID = $(event.currentTarget).parents('.item').attr('data-modelid'),
                        trashModel = this.whiteListedAppsCollection.get(itemID);

                    this.whiteListedAppsCollection.remove(trashModel);
                    this.renderAfterAction();
                    return this;
                },
                deleteBlackList: function(event){
                    var itemID = $(event.currentTarget).parents('.item').attr('data-modelid'),

                        trashModel = this.blacklistedAppsCollection.get(itemID);

                    this.blacklistedAppsCollection.remove(trashModel);
                    this.renderAfterAction();
                    return this;
                },
                editBluetoothProfile: function(event) {
                    event.preventDefault();
                    this.bluetoothProfileListView = new BluetoothProfileListView.View();
                    this.$el.find('#bluetoothList').addClass('display-none');
                    this.$el.find('#saveAndDiscard').addClass('display-none');
                    this.$el.find('#bluetooth-form').removeClass('display-none').html(this.bluetoothProfileListView.$el);
                    this.bluetoothProfileListView.render();
                    var editModelID, editModel;
                    if($(event.currentTarget).parents('.item').attr('id') === 'whitelistItems')
                    {
                        editModelID = $(event.currentTarget).parents('.item').attr('data-modelid');
                        editModel = this.whiteListedAppsCollection.get(editModelID);
                    }
                    else if($(event.currentTarget).parents('.item').attr('id') === 'blacklistItems')
                    {
                        editModelID = $(event.currentTarget).parents('.item').attr('data-modelid');
                        editModel = this.blacklistedAppsCollection.get(editModelID);
                    }
                    var bluetoothName = editModel.get('bluetooth_name'),
                        bluetoothCOD = editModel.get('bluetooth_cod'),
                        bluetoothUUID = editModel.get('bluetooth_uuid'),
                        bluetoothPairing = editModel.get('bluetooth_pairing'),
                        modelCid = editModel.cid,
                        form = $(this.el).find('#bluetoothForm');
                    form.find('#model-cid').val(modelCid);
                    form.find('#deviceName').val(bluetoothName);
                    form.find('#cod').val(bluetoothCOD);
                    form.find('#uuid').val(bluetoothUUID);
                    form.find('#enablePairing').prop('checked', bluetoothPairing);
                    return this;
                },
                blacklistingDevice: function(event) {
                    var blacklistedModelID = $(event.currentTarget).parents('.item').attr('data-modelid'),
                        blacklistedModel = this.whiteListedAppsCollection.get(blacklistedModelID);
                    this.blacklistedAppsCollection.add(blacklistedModel);
                    this.whiteListedAppsCollection.remove(blacklistedModel);
                    this.renderAfterAction();
                    return this;
                },
                whitelistingDevice: function(event) {
                    var whitelistedModelID = $(event.currentTarget).parents('.item').attr('data-modelid'),
                        whitelistedModel = this.blacklistedAppsCollection.get(whitelistedModelID);
                    this.whiteListedAppsCollection.add(whitelistedModel);
                    this.blacklistedAppsCollection.remove(whitelistedModel);
                    this.renderAfterAction();
                    return this;
                },
                backToBluetoothList: function() {
                    this.$el.find('#bluetooth-form').addClass('display-none');
                    this.$el.find('#bluetoothList').removeClass('display-none');
                    return this;
                },
                toggleBlacklistDeleteButton: function() {
                    var deleteButton = $('#blacklistDelete'),
                        checkedBoxes = $('input[name=blacklistCheckbox]:checked');
                    deleteButton.prop('disabled', !checkedBoxes.length);
                    return this;
                },
                toggleWhitelistDeleteButton: function() {
                    var deleteButton = $('#whitelistDelete'),
                        checkedBoxes = $('input[name=whitelistCheckbox]:checked');
                    deleteButton.prop('disabled', !checkedBoxes.length);
                    return this;
                },
                onSelectWhitelist: function (event) {
                    var checked = event.target.checked,
                        $checkboxes = this.$('input[name=whitelistCheckbox]');
                    $checkboxes.prop('checked', checked);
                    $('#whitelistDelete').prop('disabled', !$checkboxes.prop('checked'));
                    return this;
                },
                onSelectBlacklist: function (event) {
                    var checked = event.target.checked,
                        $checkboxes = this.$('input[name=blacklistCheckbox]');
                    $checkboxes.prop('checked', checked);
                    $('#blacklistDelete').prop('disabled', !$checkboxes.prop('checked'));
                    return this;
                },
                saveChanges: function() {
                    this.model.save();
                    this.closeSaveChangesView();
                    return this;
                },
                discardChanges: function() {
                    Backbone.history.loadUrl(Backbone.history.fragment);
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
                    this.extractModelData();
                    this.createClones();
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
                extractModelData: function () {
                    var that = this;
                    this.bluetoothStatusModel = this.model.get('bluetooth_status');
                    this.renderBlutoothStatusTemplate(this.bluetoothStatusModel);
                    this.renderBluetoothProfileTemplate();
                    this.whiteListedAppsCollection = this.model.get('white_listed_pairings');
                    this.blacklistedAppsCollection = this.model.get('black_listed_pairings');
                    if (this.whiteListedAppsCollection.models.length > 0) {
                        _.each(this.whiteListedAppsCollection.models, function(model) {
                            that.$el.find('.whiteListedPairings').append(that.renderWhiteListModel(model));
                        });
                    }
                    else {
                        that.$el.find('.whiteListedPairings').append('No data available').css('textAlign', 'center');
                    }

                    if (  this.blacklistedAppsCollection.models.length > 0) {
                        _.each(this.blacklistedAppsCollection.models, function(model) {
                            that.$el.find('.blackListedPairings').append(that.renderBlackListModel(model));
                        });
                    }
                    else {
                        that.$el.find('.blackListedPairings').append('No data available').css('textAlign', 'center');
                    }
                    return this;
                },
                renderBluetoothProfileTemplate: function() {
                    this.$el.append(this.template({whiteListPairings: false, blackListPairings: false}));
                    this.$el.find('#bluetoothList').prepend(this.template({whiteListPairings: false, blackListPairings: true}));
                    this.$el.find('#bluetoothList').prepend(this.template({whiteListPairings: true, blackListPairings: false}));
                    return this;
                },
                renderBlutoothStatusTemplate: function(model) {
                    var template = _.template(this.bluetoothControlsTemplate),
                        payloadModel = {
                            model: model,
                            object_type: this.model.get('object_type'),
                            name: this.model.get('name')
                        };
                    this.$el.append(template(payloadModel));
                    return this;
                },
                renderWhiteListModel: function(model) {
                    var template = _.template(this.bluetoothListTemplate),
                        payload = {
                            whiteListPairings: true,
                            blackListPairings: false,
                            model: model
                        };
                    return template(payload);
                },
                renderBlackListModel: function(model) {
                    var template = _.template(this.bluetoothListTemplate),
                        payload = {
                            whiteListPairings: false,
                            blackListPairings: true,
                            model: model
                        };
                    return template(payload);
                },
                render: function () {
                    this.model.fetch();
                    return this;
                },
                renderAfterAction: function(){
                    this.$el.find('.whiteListedPairings').empty();
                    this.$el.find('.blackListedPairings').empty();
                    var whiteListModels = this.whiteListedAppsCollection.models,
                        blackListModels = this.blacklistedAppsCollection.models,
                        that = this;
                    if (whiteListModels.length > 0) {
                        _.each(whiteListModels, function(model) {
                            that.$el.find('.whiteListedPairings').append(that.renderWhiteListModel(model)).css('textAlign', 'left');
                        });
                    }
                    else {
                        that.$el.find('.whiteListedPairings').append('No data available').css('textAlign', 'center');
                    }
                    if (blackListModels.length > 0) {
                        _.each(blackListModels, function(model) {
                            that.$el.find('.blackListedPairings').append(that.renderBlackListModel(model)).css('textAlign', 'left');
                        });
                    }
                    else {
                        that.$el.find('.blackListedPairings').append('No data available').css('textAlign', 'center');
                    }
                    return this;
                }
            })
        };
        return exports;

    }
);