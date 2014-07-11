define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'views/policies/policyViews/saveChanges',
        'text!template/policy-access.html', 'core/js/API/policies/access', 'core/js/API/policies/access-save'],
    function($, _, Backbone, crel, App, TemplateView, SaveChangesView, accessPolicyTemplate) {
        var exports = {
            Model:Backbone.RelationalModel.extend({
                urlRoot: '',
                idAttribute: '_id',
                relations:[
                    {
                        type: Backbone.HasOne,
                        key: 'enable_change_settings',
                        relatedModel: 'ChangeSettings',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_screen_capture',
                        relatedModel: 'ScreenCapture',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_factory_reset',
                        relatedModel: 'FactoryReset',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_usb_debugging',
                        relatedModel: 'USBDebugging',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_admin_mode',
                        relatedModel: 'AdminMode',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_cloud_backup',
                        relatedModel: 'CloudBackup',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_cloud_document_sync',
                        relatedModel: 'CloudDocumentSync',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_adding_game_center_friends',
                        relatedModel: 'AddingGameCenterFriends',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_global_background_fetch_when_roaming',
                        relatedModel: 'AllowGlobalBackgroundFetchWhenRoaming',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'force_itunes_store_password_entry',
                        relatedModel: 'ForceiTunesStorePasswordEntry',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'force_encrypted_backups',
                        relatedModel: 'ForceEncryptedBackups',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_multi_player_gaming',
                        relatedModel: 'MultiPlayerGaming',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_photo_stream',
                        relatedModel: 'PhotoStream',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_voice_dialing',
                        relatedModel: 'VoiceDialing',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'allow_video_conferencing',
                        relatedModel: 'VideoConferencing',
                        reverseRelation: {
                            key: 'hardwareSettings',
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
            ChangeSettings: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            ScreenCapture: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: true
                }
            }),
            FactoryReset: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            USBDebugging: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            AdminMode: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            CloudBackup: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            CloudDocumentSync: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            AddingGameCenterFriends: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            MultiPlayerGaming: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            AllowGlobalBackgroundFetchWhenRoaming: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            ForceiTunesStorePasswordEntry: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            ForceEncryptedBackups: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            PhotoStream: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            VoiceDialing: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: false,
                    iOS: true
                }
            }),
            VideoConferencing: Backbone.RelationalModel.extend({
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
                'click input[type=checkbox]'            :   'toggleAccessModel',
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
                this.clonedOriginalModel = _.clone(this.model.toJSON(),true);
                return this;
            },
            toggleAccessModel: function (event){
                var enable = $(event.currentTarget).is(':checked'),
                    targetModel = $(event.currentTarget).attr('data-attr');
                this.model.get(targetModel).set({value:enable});
                this.toggleAccessView();
                return this;
            },
            toggleAccessView: function () {
                var toggle = _.isEqual(this.clonedOriginalModel, this.model.toJSON());
                this.$('.access-settings').toggleClass('model-changed',!toggle);    if(!toggle)
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
            template: _.template(accessPolicyTemplate),
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
        });
        return exports;
    }
);