/**
 * Created by Ankit on 2/2/14.
 */
define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'views/policies/policyViews/saveChanges',
        'text!template/policy-hardware.html', 'core/js/API/policies/hardware', 'core/js/API/policies/hardware-save'],
    function($, _, Backbone, crel, App, TemplateView, SaveChangesView, policiesTemplate) {
        var exports = {
            Model:Backbone.RelationalModel.extend({
                urlRoot: '',
                idAttribute: '_id',
                relations:[
                    {
                    type: Backbone.HasOne,
                    key: 'enable_camera',
                    relatedModel: 'Camera',
                    reverseRelation: {
                        key: 'hardwareSettings',
                        includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_external_storage_encryption',
                        relatedModel: 'ExternalStorageEncryption',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_internal_storage_encryption',
                        relatedModel: 'InternalStorageEncryption',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_microphone',
                        relatedModel: 'Microphone',
                        reverseRelation: {
                            key: 'hardwareSettings',
                            includeInJSON:false
                        }
                    },
                    {
                        type: Backbone.HasOne,
                        key: 'enable_android_beam',
                        relatedModel: 'AndroidBeam',
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
            AndroidBeam: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: false
                }
            }),
            Microphone: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: true
                }
            }),
            InternalStorageEncryption: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: true
                }
            }),
            ExternalStorageEncryption: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
                    iOS: true
                }
            }),
            Camera: Backbone.RelationalModel.extend({
                defaults: {
                    value: true,
                    android: true,
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
                'change input[type=checkbox]'            :   'toggleHardwareModel',
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
            toggleHardwareModel: function (event){
                var enable = $(event.currentTarget).is(':checked'),
                    targetModel = $(event.currentTarget).attr('data-attr');
                this.model.get(targetModel).set({value:enable});
                this.toggleHardwareView();
                return this;
            },
            toggleHardwareView: function () {
                var toggle = _.isEqual(this.clonedOriginalModel, this.model.toJSON());
                this.$('.hardware-settings').toggleClass('model-changed',!toggle);
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
        });

        return exports;

    }
);