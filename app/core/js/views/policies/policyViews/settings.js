/**
 * Created by Ankit on 2/2/14.
 */
define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'views/policies/policyViews/saveChanges',
        'text!template/policy-settings.html', 'core/js/API/policies/settings', 'core/js/API/policies/settings-save'],
    function($, _, Backbone, crel, App, TemplateView, SaveChangesView, policiesTemplate) {
        var exports = {
            Model:Backbone.RelationalModel.extend({
                urlRoot: '',
                idAttribute: '_id',
                relations:[
                    {
                        type: Backbone.HasOne,
                        key: 'enable_background_data',
                        relatedModel: 'BackgroundData',
                        reverseRelation: {
                            key: 'settings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_backup',
                        relatedModel: 'Backup',
                        reverseRelation: {
                            key: 'settings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_clipboard',
                        relatedModel: 'ClipBoard',
                        reverseRelation: {
                            key: 'settings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_google_crash_report',
                        relatedModel: 'GoogleCrashReport',
                        reverseRelation: {
                            key: 'settings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_data_roaming',
                        relatedModel: 'DataRoaming',
                        reverseRelation: {
                            key: 'settings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_push_roaming',
                        relatedModel: 'PushRoaming',
                        reverseRelation: {
                            key: 'settings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_sync_roaming',
                        relatedModel: 'SyncRoaming',
                        reverseRelation: {
                            key: 'settings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_voice_roaming',
                        relatedModel: 'VoiceRoaming',
                        reverseRelation: {
                            key: 'settings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_explicit_content',
                        relatedModel: 'ExplicitContent',
                        reverseRelation: {
                            key: 'settings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_untrusted_tls_prompt',
                        relatedModel: 'UntrustedTLSPrompt',
                        reverseRelation: {
                            key: 'settings',
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
            BackgroundData: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: true
                }
            }),
            Backup: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            ClipBoard: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            GoogleCrashReport: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: true
                }
            }),
            DataRoaming: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            PushRoaming: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            SyncRoaming: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            VoiceRoaming: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            ExplicitContent: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            UntrustedTLSPrompt: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            })
        };
        exports.Collection = Backbone.Collection.extend({

        });

        exports.View = TemplateView.extend({
            tagName: 'div',
            initialize: function(options) {
                this.options = options;
                this.model = new exports.Model();
                this.listenTo(this.model, 'request', this.showLoading);
                this.listenTo(this.model, 'sync', this.fetchSuccess);
                this.listenTo(this.model, 'error', this.fetchError);
            },
            events: {
                'click input[type=checkbox]'            :   'toggleSettingsModel',
                'click #saveChanges'                    :   'saveChanges',
                'click #discardChanges'                 :   'discardChanges'
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
                this.clonedOriginalModel = _.clone(this.model.toJSON(), true);
                return this;
            },
            toggleSettingsModel: function (event){
                var enable = $(event.currentTarget).is(':checked'),
                    targetModel = $(event.currentTarget).attr('data-attr');
                this.model.get(targetModel).set({value:enable});
                this.toggleSettingsView();
                return this;
            },
            toggleSettingsView: function () {
                var toggle = _.isEqual(this.clonedOriginalModel, this.model.toJSON());
                this.$('.settings-container').toggleClass('model-changed',!toggle);
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
            template: _.template(policiesTemplate),
            render: function () {
                this.model.fetch();
                return this;
            },
            renderTemplate: function (model) {
                var template = this.template({app:model});
                this.$el.html(template);
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

        return exports;

    }
);