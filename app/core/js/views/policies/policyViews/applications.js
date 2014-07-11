/**
 * Created by Ankit on 2/2/14.
 */
define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'sly', 'views/templateView', 'views/policies/policyViews/saveChanges', 'lists/list',
        'text!template/policy-applications.html', 'text!template/search-result-list-item.html', 'text!template/selected-search-item.html',
        'text!template/install-item.html', 'text!template/remove-app-item.html', 'text!template/blacklist-app-item.html', 'backbone.relational',
        'core/js/API/policies/applications', 'core/js/API/policies/applications-save'],
    function($, _, Backbone, crel, App, Sly, TemplateView, SaveChangesView, List, policiesTemplate, searchResultListItemTemplate, selectedItemTemplate, installedAppTemplate, removedAppTemplate, blacklistedAppTemplate) {
        var exports = {
            Model:Backbone.RelationalModel.extend({
                urlRoot: '',
                idAttribute: '_id',
                relations: [
                    {
                        type: Backbone.HasMany,
                        key: 'installed_apps',
                        relatedModel: 'AppModel',
                        collectionType: 'InstalledAppsCollection',
                        reverseRelation: {
                            key: 'appSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasMany,
                        key: 'removed_apps',
                        relatedModel: 'AppModel',
                        collectionType: 'RemovedAppsCollection',
                        reverseRelation: {
                            key: 'appSettings1',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasMany,
                        key: 'blacklisted_apps',
                        relatedModel: 'AppModel',
                        collectionType: 'BlacklistedAppsCollection',
                        reverseRelation: {
                            key: 'appSettings2',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'youtube_enable',
                        relatedModel: 'YouTubeModel',
                        reverseRelation: {
                            key: 'appSettings3',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'playstore_enable',
                        relatedModel: 'PlayStore',
                        reverseRelation: {
                            key: 'appSettings4',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'browser_settings',
                        relatedModel: 'BrowserModel',
                        reverseRelation: {
                            key: 'appSettings5',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_recording',
                        relatedModel: 'RecordingModel',
                        reverseRelation: {
                            key: 'appSettings6',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_app_installation',
                        relatedModel: 'AppInstallation',
                        reverseRelation: {
                            key: 'appSettings7',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_in_app_purchases',
                        relatedModel: 'InAppPurchases',
                        reverseRelation: {
                            key: 'appSettings8',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'itunes_enable',
                        relatedModel: 'iTunes',
                        reverseRelation: {
                            key: 'appSettings9',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'siri_enable',
                        relatedModel: 'Siri',
                        reverseRelation: {
                            key: 'appSettings10',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'safari_enable',
                        relatedModel: 'Safari',
                        reverseRelation: {
                            key: 'appSettings11',
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
            AppModel: Backbone.RelationalModel.extend({
                defaults: {
                    description: "",
                    url: "https://play.google.com/",
                    id: "",
                    source: "play-store",
                    artistName: "",
                    thumbnail: "",
                    name: "",
                    android: true,
                    iOS: false
                }
            }),
            InstalledAppsCollection: Backbone.Collection.extend({
                model: this.AppModel
            }),
            RemovedAppsCollection: Backbone.Collection.extend({
                model: this.AppModel
            }),
            BlacklistedAppsCollection: Backbone.Collection.extend({
                model: this.AppModel
            }),
            YouTubeModel: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            PlayStore: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: true
                }
            }),
            BrowserModel: Backbone.RelationalModel.extend({
                defaults: {
                    enable_autofill: true,
                    enable_javascript: false,
                    enable_cookies: false,
                    enable_popups:true,
                    force_fraud_warnings: true,
                    enable_http_proxy:false,
                    http_proxy_value:"127.0.0.1",
                    android:true,
                    iOS:true
                }
            }),
            RecordingModel: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            AppInstallation: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            InAppPurchases: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: true
                }
            }),
            iTunes: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            Siri: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            Safari: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            Collection: Backbone.Collection.extend({

            }),
            SearchCollection: List.Collection.extend({
                baseUrl:'https://scrapper.toppatch.com',
                params: {
                    keyword:''
                },
                parse: function (response) {
                    if (response.resultCount) {
                        this.recordCount = response.resultCount;
                        return response.data;
                    }
                    return response;
                }
            }),
            View: TemplateView.extend({
                tagName: 'div',
                initialize: function(options) {
                    this.options = options;
                    this.model = new exports.Model();
                    this.searchCollection = new exports.SearchCollection();
                    this.selectedAppsCollection = new exports.Collection();
                    this.listenTo(this.searchCollection, 'request', this.showSearchLoading);
                    this.listenTo(this.searchCollection, 'sync', this.fetchSearchSuccess);
                    this.listenTo(this.searchCollection, 'error', this.fetchSearchError);
                    this.listenTo(this.model, 'request', this.showLoading);
                    this.listenTo(this.model, 'sync', this.fetchSuccess);
                    this.listenTo(this.model, 'error', this.fetchError);
                    this.listenTo(this.selectedAppsCollection, 'add', this.appendSelectedApp);
                    this.listenTo(this.selectedAppsCollection, 'remove', this.removeFromSelectedAppsView);
                },
                events: {
                    'keyup input[name=applications-search]'                 :   'debouncedSearch',
                    'focusout input[name=applications-search]'              :   'closeSearchResult',
                    'click #search-items li'                                :   'addToSelectedApps',
                    'click .selected-applications-container a.remove'       :   'removeSelectedApp',
                    'click .recording_enable input[type=checkbox]'          :   'toggleRecordingModel',
                    'click .browser-settings input[type=checkbox]'          :   'toggleBrowserSettingsModel',
                    'click .playstore-enable input[type=checkbox]'          :   'togglePlaystoreEnableModel',
                    'click .youtube-enable input[type=checkbox]'            :   'toggleYoutubeEnableModel',
                    'click .iTunes input[type=checkbox]'                    :   'toggleiTunesEnableModel',
                    'click .siri input[type=checkbox]'                      :   'toggleSiriEnableModel',
                    'click .safari input[type=checkbox]'                    :   'toggleSafariEnableModel',
                    'click .app-installation input[type=checkbox]'          :   'toggleAppInstallationModel',
                    'click .in-app-purchases input[type=checkbox]'          :   'toggleInAppPurchasesModel',
                    'focusout input[name=http_proxy_value]'                 :   'changeHTTPProxy',
                    'click .selected-applications-container .btn'           :   'updateSelectedApps',
                    'click .installed-applications-container .btn'          :   'updateInstalledApps',
                    'click .removed-applications-container .btn'            :   'updateRemovedApps',
                    'click .blacklisted-applications-container .btn'        :   'updateBlacklistedApps',
                    'click .installed-applications-container a.remove'      :   'removeSelectedInstalledApp',
                    'click .removed-applications-container a.remove'        :   'removeSelectedRemovedApp',
                    'click .blacklisted-applications-container a.remove'    :   'removeSelectedBlacklistedApp',
                    'click #saveChanges'                                    :   'saveChanges',
                    'click #discardChanges'                                 :   'discardChanges'
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

                    this.recordingEnableModel = this.model.get('enable_recording');
                    this.clonedRecordingOriginalModel = _.clone(this.recordingEnableModel.toJSON(), true);

                    this.youtubeEnableModel = this.model.get('youtube_enable');
                    this.clonedYoutubeEnableModel = _.clone(this.youtubeEnableModel.toJSON(), true);

                    this.playstoreEnableModel = this.model.get('playstore_enable');
                    this.clonedPlaystoreEnableModel = _.clone(this.playstoreEnableModel.toJSON(), true);

                    this.browserSettingsModel = this.model.get('browser_settings');
                    this.clonedBrowserSettingsModel = _.clone(this.browserSettingsModel.toJSON(), true);

                    this.appInstallationModel = this.model.get('allow_app_installation');
                    this.clonedAppInstallationModel = _.clone(this.appInstallationModel.toJSON(), true);

                    this.inAppPurchasesModel = this.model.get('allow_in_app_purchases');
                    this.clonedInAppPurchasesModel = _.clone(this.inAppPurchasesModel.toJSON(), true);

                    this.iTunesEnableModel = this.model.get('itunes_enable');
                    this.clonediTunesEnableModel = _.clone(this.iTunesEnableModel.toJSON(), true);

                    this.siriEnableModel = this.model.get('siri_enable');
                    this.clonedSiriEnableModel = _.clone(this.siriEnableModel.toJSON(), true);

                    this.safariEnableModel = this.model.get('safari_enable');
                    this.clonedSafariEnableModel = _.clone(this.safariEnableModel.toJSON(), true);

                    this.installedAppsCollection = this.model.get('installed_apps');
                    this.clonedInstalledAppsCollection = _.clone(this.installedAppsCollection.toJSON(), true);
                    this.listenTo(this.installedAppsCollection, 'add', this.addToInstalledAppsView);
                    this.listenTo(this.installedAppsCollection, 'remove', this.removeFromInstalledAppsView);

                    this.removedAppsCollection = this.model.get('removed_apps');
                    this.clonedRemovedAppsCollection = _.clone(this.removedAppsCollection.toJSON(), true);
                    this.listenTo(this.removedAppsCollection, 'add', this.addToRemovedAppsView);
                    this.listenTo(this.removedAppsCollection, 'remove', this.removeFromRemovedAppsView);

                    this.blacklistedAppsCollection = this.model.get('blacklisted_apps');
                    this.clonedBlacklistedAppsCollection = _.clone(this.blacklistedAppsCollection.toJSON(), true);
                    this.listenTo(this.blacklistedAppsCollection, 'add', this.addToBlacklistedAppsView);
                    this.listenTo(this.blacklistedAppsCollection, 'remove', this.removeFromBlacklistedAppsView);

                    return this;
                },
                debouncedSearch: _.debounce(function (event) {
                    if(event.keyCode === 40 || event.keyCode === 38) {
                        return;
                    }
                    var query = $(event.currentTarget).val().trim();
                    this.searchBy(query);
                }, 400),
                searchBy: function (query) {
                    if(query) {
                        this.searchCollection.params.keyword = query;
                        this.searchCollection.fetch(/*{dataType: 'jsonp'}*/{aysnc: true});
                    } else {
                        this.$("#search-items").empty();
                        this.$("#search-frame").slideUp();
                    }
                    return this;
                },
                closeSearchResult: function() {
                    this.$("#search-frame").slideUp();
                },
                showSearchLoading: function () {
                    this._searchLoading = this._searchLoading || new App.loading();
                    this.$("#search-frame").sly(false);
                    this.$("#search-items").empty().append(this._searchLoading.render().el);
                    this.$("#search-frame").slideDown();
                    this.$("#search-frame .search-scrollbar").hide();
                    return this;
                },
                fetchSearchSuccess: function (collection, response, options) {

                    var model,
                        i = 0,
                        androidModels = this.searchCollection.where({ source: 'play-store'}),
                        iOSModels = this.searchCollection.where({ source: 'app-store'}),
                        searchResultTemplate = _.template(searchResultListItemTemplate),
                        searchResultFragment = crel("div",""),
                        $searchResultFragment = $(searchResultFragment);
                    this.hideSearchLoading();
                    while(i < (androidModels.length > iOSModels.length ? androidModels.length:iOSModels.length))
                    {
                        if(androidModels[i]) {
                            model =  androidModels[i].toJSON();
                            $searchResultFragment.append(searchResultTemplate({id: model.id, name: model.name.length > 30 ? model.name.substring(0,30)+"&hellip;":model.name, description: model.description.length > 150 ? model.description.substring(0,150)+"&hellip;":model.description, source: model.source, thumbnail: model.thumbnail }));
                        }
                        if(iOSModels[i]) {
                            model =  iOSModels[i].toJSON();
                            $searchResultFragment.append(searchResultTemplate({id: model.id, name: model.name.length > 30 ? model.name.substring(0,30)+"&hellip;":model.name, description: model.description.length > 150 ? model.description.substring(0,150)+"&hellip;":model.description, source: model.source, thumbnail: model.thumbnail }));
                        }
                        i++;
                    }
                    /*_.each(models, function(model) {
                     console.log(model);
                     this.$("#search-items").append(searchResultTemplate({id: model.id, name: model.name, description: model.description, source: model.source, thumbnail: model.thumbnail }));
                     });*/
                    this.$("#search-items").append($searchResultFragment.html());
                    var $frame  = this.$('#search-frame');
                    var $slidee = this.$('#search-items');
                    var $wrap   = $frame.parent();

                    // Call Sly on frame
                    var sly = $frame.sly({
                        itemNav: 'basic',
                        smart: 0,
                        activateOn: 'mouseenter',
                        mouseDragging: 0,
                        touchDragging: 0,
                        releaseSwing: 0,
                        startAt: 0,
                        scrollBar: $wrap.find('.search-scrollbar'),
                        scrollBy: 1,
                        speed: 300,
                        activeClass:'search-list-item-active',
                        elasticBounds: 0,
                        keyboardNavBy: 'items',
                        dragHandle: 1,
                        dynamicHandle: 1,
                        clickBar: 1
                    });
                    this.$("#search-frame .search-scrollbar").show();
                    this.model.get('browser_settings').set({http_proxy_value:'192.168.2.75'});
                    return this;
                },
                hideSearchLoading: function () {
                    if (this._searchLoading) { this._searchLoading.close(); }
                    return this;
                },
                fetchSearchError: function (collection, response, options) {

                    this.hideSearchLoading();
                    this.$("#search-items").empty().html(
                        response.responseText
                    );
                    return this;
                },
                addToSelectedApps: function(event) {
                    var selectedAppListItem = $(event.currentTarget),
                        selectedAppID = selectedAppListItem.data('id').toString(),
                        selectedAppSource = selectedAppListItem.data('source'),
                        selectedAppModel = this.searchCollection.where({id:selectedAppID,source: selectedAppSource});
                    this.selectedAppsCollection.add(selectedAppModel);
                    return this;
                },
                appendSelectedApp: function (model, collection) {
                    //console.log(selectedItemTemplate);
                    var appModel = model.toJSON(),
                        selectedItem = _.template(selectedItemTemplate);
                    model.set({android: appModel.source === 'play-store', iOS: appModel.source === 'app-store'});
                    //console.log(selectedItem({id: model.id, name: model.name, description: model.description, source: model.source, thumbnail: model.thumbnail }));
                    this.$('.selected-applications-container').append(selectedItem({id: appModel.id, name: appModel.name, url: appModel.url, description: appModel.description, source: appModel.source, thumbnail: appModel.thumbnail }));
                    return this;
                },
                removeFromSelectedAppsView: function (model, collection) {
                    var appId = model.get('id');
                    this.$('.selected-applications-container div[data-id="'+ appId +'"]').remove();
                    return this;
                },
                removeSelectedApp: function(event) {
                    var removeItemElement = $(event.currentTarget).parent(),
                        removeItemId = removeItemElement.data('id').toString(),
                        removeItemSource = removeItemElement.data('source'),
                        removeItemModel =  this.selectedAppsCollection.where({id:removeItemId,source: removeItemSource});
                    event.preventDefault();
                    removeItemElement.remove();
                    this.selectedAppsCollection.remove(removeItemModel);
                    return this;
                },
                toggleRecordingModel: function (event){
                    var enableRecording = $(event.currentTarget).is(':checked');
                    this.recordingEnableModel.set({value:enableRecording});
                    this.toggleRecordingView();
                    return this;
                },
                toggleRecordingView: function () {
                    var toggle = _.isEqual(this.clonedRecordingOriginalModel, this.recordingEnableModel.toJSON());
                    this.$('.recording_enable').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                toggleBrowserSettingsModel: function (event){
                    var toggleAttr = $(event.currentTarget).attr('data-attr'),
                        enableAttr = $(event.currentTarget).is(':checked'),
                        dummyObject = {};
                    dummyObject[toggleAttr] = enableAttr;
                    this.browserSettingsModel.set(dummyObject);
                    if(toggleAttr === "enable_http_proxy") {
                        this.$('.http_proxy_value').toggleClass('hidden', !enableAttr );
                    }
                    this.togglebrowserSettingsView();
                    return this;
                },
                togglebrowserSettingsView : function () {
                    var toggle = _.isEqual(this.clonedBrowserSettingsModel, this.browserSettingsModel.toJSON());
                    this.$('.browser-settings').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                togglePlaystoreEnableModel: function (event){
                    var enablePlayStore = $(event.currentTarget).is(':checked');
                    this.playstoreEnableModel.set({value:enablePlayStore});
                    this.togglePlaystoreEnableView();
                    return this;
                },
                togglePlaystoreEnableView: function () {
                    var toggle = _.isEqual(this.clonedPlaystoreEnableModel, this.playstoreEnableModel.toJSON());
                    this.$('.playstore-enable').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                toggleAppInstallationModel: function (event){
                    var allowAppInstallation = $(event.currentTarget).is(':checked');
                    this.appInstallationModel.set({value:allowAppInstallation});
                    this.toggleAppInstallationView();
                    return this;
                },
                toggleAppInstallationView: function () {
                    var toggle = _.isEqual(this.clonedAppInstallationModel, this.appInstallationModel.toJSON());
                    this.$('.app-installation').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                toggleInAppPurchasesModel: function (event){
                    var allowInAppPurchases = $(event.currentTarget).is(':checked');
                    this.inAppPurchasesModel.set({value:allowInAppPurchases});
                    this.toggleInAppPurchasesView();
                    return this;
                },
                toggleInAppPurchasesView: function () {
                    var toggle = _.isEqual(this.clonedInAppPurchasesModel, this.inAppPurchasesModel.toJSON());
                    this.$('.in-app-purchases').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                toggleYoutubeEnableModel: function (event){
                    var enablePlayStore = $(event.currentTarget).is(':checked');
                    this.youtubeEnableModel.set({value:enablePlayStore});
                    this.toggleYoutubeEnableView();
                    return this;
                },
                toggleYoutubeEnableView: function () {
                    var toggle = _.isEqual(this.clonedYoutubeEnableModel, this.youtubeEnableModel.toJSON());
                    this.$('.youtube-enable').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                toggleiTunesEnableModel: function (event){
                    var enableiTunes = $(event.currentTarget).is(':checked');
                    this.iTunesEnableModel.set({value:enableiTunes});
                    this.toggleiTunesEnableView();
                    return this;
                },
                toggleiTunesEnableView: function () {
                    var toggle = _.isEqual(this.clonediTunesEnableModel, this.iTunesEnableModel.toJSON());
                    this.$('.iTunes').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                toggleSiriEnableModel: function (event){
                    var enableSiri = $(event.currentTarget).is(':checked');
                    this.siriEnableModel.set({value:enableSiri});
                    this.toggleSiriEnableView();
                    return this;
                },
                toggleSiriEnableView: function () {
                    var toggle = _.isEqual(this.clonedSiriEnableModel, this.siriEnableModel.toJSON());
                    this.$('.siri').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                toggleSafariEnableModel: function (event){
                    var enableSafari = $(event.currentTarget).is(':checked');
                    this.safariEnableModel.set({value:enableSafari});
                    this.toggleSafariEnableView();
                    return this;
                },
                toggleSafariEnableView: function () {
                    var toggle = _.isEqual(this.clonedSafariEnableModel, this.safariEnableModel.toJSON());
                    this.$('.safari').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    return this;
                },
                changeHTTPProxy: function (event) {
                    var HTTPProxy = $(event.currentTarget).val();  // TODO: ProxyValidation
                    this.browserSettingsModel.set({ http_proxy_value: HTTPProxy});
                    this.togglebrowserSettingsView();
                    return this;
                },
                updateInstalledApps: function (event) {
                    var $eventTarget = $(event.currentTarget),
                        targetAppID = $eventTarget.parents('.media').attr("data-id"),
                        appModel = this.installedAppsCollection.where({id:targetAppID})[0],
                        appDetailsJSON = appModel.toJSON(),
                        action = $eventTarget.attr('data-action');
                    if(action === "user_install") {
                        // TODO: SHOW THAT IT IS ALREADY INSTALLED
                    } else if(action === "user_remove") {
                        this.removedAppsCollection.add(appDetailsJSON);
                    } else if(action === "user_blacklist") {
                        this.blacklistedAppsCollection.add(appDetailsJSON);
                    }
                    this.installedAppsCollection.remove(appModel);
                    return this;
                },
                removeSelectedInstalledApp: function (event) {
                    event.preventDefault();
                    var $eventTarget = $(event.currentTarget),
                        targetAppID = $eventTarget.parents('.media').attr("data-id"),
                        appModel = this.installedAppsCollection.where({id:targetAppID})[0];
                    this.installedAppsCollection.remove(appModel);
                    return this;
                },
                addToInstalledAppsView: function (model, collection) {
                    this.$('.installed-applications-content-container .status').empty();
                    this.$('.installed-applications-content-container').prepend(this.installedAppTemplate({app:model.toJSON()}));
                    this.toggleInstalledAppsView();
                    return this;
                },
                removeFromInstalledAppsView: function (model, collection) {
                    var appId = model.get('id');
                    this.$('.installed-applications-content-container div[data-id="'+ appId +'"]').remove();
                    if(!collection.models.length) {
                        this.$('.installed-applications-content-container .status').html('There are no installed apps.');
                    }
                    this.toggleInstalledAppsView();
                    return this;
                },
                toggleInstalledAppsView: function () {
                    var toggle = _.isEqual(this.clonedInstalledAppsCollection, this.installedAppsCollection.toJSON());
                    this.$('.installed-applications').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    this.$('.installed-applications .unsaved-changes').toggleClass('hidden', toggle);
                    return this;
                },
                updateRemovedApps: function (event) {
                    var $eventTarget = $(event.currentTarget),
                        targetAppID = $eventTarget.parents('.media').attr("data-id"),
                        appModel = this.removedAppsCollection.where({id:targetAppID})[0],
                        appDetailsJSON = appModel.toJSON(),
                        action = $eventTarget.attr('data-action');
                    if(action === "user_install") {
                        this.installedAppsCollection.add(appDetailsJSON);
                    } else if(action === "user_remove") {

                        // TODO: SHOW THAT IT IS ALREADY REMOVED
                    } else if(action === "user_blacklist") {
                        this.blacklistedAppsCollection.add(appDetailsJSON);
                    }
                    this.removedAppsCollection.remove(appModel);
                    return this;
                },
                removeSelectedRemovedApp: function (event) {
                    event.preventDefault();
                    var $eventTarget = $(event.currentTarget),
                        targetAppID = $eventTarget.parents('.media').attr("data-id"),
                        appModel = this.removedAppsCollection.where({id:targetAppID})[0];
                    this.removedAppsCollection.remove(appModel);
                    return this;
                },
                addToRemovedAppsView: function (model, collection) {
                    this.$('.removed-applications-content-container .status').empty();
                    this.$('.removed-applications-content-container').prepend(this.removedAppTemplate({app:model.toJSON()}));
                    this.toggleRemovedAppsView();
                    return this;
                },
                removeFromRemovedAppsView: function (model, collection) {
                    var appId = model.get('id');
                    this.$('.removed-applications-content-container div[data-id="'+ appId +'"]').remove();
                    if(!collection.models.length) {
                        this.$('.removed-applications-content-container .status').html('There are no removed apps.');
                    }
                    this.toggleRemovedAppsView();
                    return this;
                },
                toggleRemovedAppsView: function () {
                    var toggle = _.isEqual(this.clonedRemovedAppsCollection, this.removedAppsCollection.toJSON());
                    this.$('.removed-applications').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    this.$('.removed-applications .unsaved-changes').toggleClass('hidden', toggle);
                    return this;
                },
                updateBlacklistedApps: function (event) {
                    var $eventTarget = $(event.currentTarget),
                        targetAppID = $eventTarget.parents('.media').attr("data-id"),
                        appModel = this.blacklistedAppsCollection.where({id:targetAppID})[0],
                        appDetailsJSON = appModel.toJSON(),
                        action = $eventTarget.attr('data-action');

                    if(action === "user_install") {
                        this.installedAppsCollection.add(appDetailsJSON);
                    } else if(action === "user_remove") {
                        this.removedAppsCollection.add(appDetailsJSON);
                    } else if(action === "user_blacklist") {
                        // TODO: SHOW THAT IT IS ALREADY REMOVED
                    }
                    this.blacklistedAppsCollection.remove(appModel);
                    return this;
                },
                removeSelectedBlacklistedApp: function (event) {
                    event.preventDefault();
                    var $eventTarget = $(event.currentTarget),
                        targetAppID = $eventTarget.parents('.media').attr("data-id"),
                        appModel = this.blacklistedAppsCollection.where({id:targetAppID})[0];
                    this.blacklistedAppsCollection.remove(appModel);
                    return this;
                },
                addToBlacklistedAppsView: function (model, collection) {
                    this.$('.blacklisted-applications-content-container .status').empty();
                    this.$('.blacklisted-applications-content-container').prepend(this.blacklistedAppTemplate({app:model.toJSON()}));
                    this.toggleBlacklistedAppsView();
                    return this;
                },
                removeFromBlacklistedAppsView: function (model, collection) {
                    var appId = model.get('id');
                    this.$('.blacklisted-applications-content-container div[data-id="'+ appId +'"]').remove();
                    if(!collection.models.length) {
                        this.$('.blacklisted-applications-content-container .status').html('There are no blacklisted apps.');
                    }
                    this.toggleBlacklistedAppsView();
                    return this;
                },

                toggleBlacklistedAppsView: function () {
                    var toggle = _.isEqual(this.clonedBlacklistedAppsCollection, this.blacklistedAppsCollection.toJSON());
                    this.$('.blacklisted-applications').toggleClass('model-changed',!toggle);
                    this.toggleSaveChangesView(toggle);
                    this.$('.blacklisted-applications .unsaved-changes').toggleClass('hidden', toggle);
                    return this;
                },

                updateSelectedApps: function (event) {
                    var $eventTarget = $(event.currentTarget),
                        targetAppID = $eventTarget.parents('.media').attr("data-id"),
                        appModel = this.selectedAppsCollection.where({id:targetAppID})[0],
                        appDetailsJSON = appModel.toJSON(),
                        action = $eventTarget.attr('data-action');

                    if(action === "user_install") {
                        this.installedAppsCollection.add(appDetailsJSON);
                    } else if(action === "user_remove") {
                        this.removedAppsCollection.add(appDetailsJSON);
                    } else if(action === "user_blacklist") {
                        this.blacklistedAppsCollection.add(appDetailsJSON);
                    }
                    this.selectedAppsCollection.remove(appModel);
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
                template: _.template(policiesTemplate),
                installedAppTemplate: _.template(installedAppTemplate),
                blacklistedAppTemplate: _.template(blacklistedAppTemplate),
                removedAppTemplate: _.template(removedAppTemplate),
                render: function () {
                    this.model.fetch();
                    return this;
                },
                renderTemplate: function (collection) {
                    var template = this.template(collection);
                    this.$el.html(template);
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
                }
            })
        };
        return exports;

    }
);
