/**
 * Created by Ankit on 2/2/14.
 */
define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'modals/baseModal', 'views/remoteWipe',
        'views/deviceLock', 'text!template/policy-actions.html', 'core/js/API/policies/actions', 'core/js/API/policies/actions-save'],
    function ($, _, Backbone, crel, App, TemplateView, BaseModal, RemoteWipe, DeviceLock, policiesTemplate) {
        var exports = {};
        exports.Model = Backbone.Model.extend({
            parse: function (response) {
                if (response.pass) {
                    this.recordCount = response.count;
                    return response.data;
                }
                return response;
            }

        });

        exports.View = TemplateView.extend({
            tagName: 'div',
            initialize: function (options) {
                this.options = options;
                this.activePolicy = options.activePolicy;
                this.object = options.object;
                this.objectId = options.objectId;
                this.model = new exports.Model();
                this.listenTo(this.model, 'request', this.showLoading);
                this.listenTo(this.model, 'sync', this.fetchSuccess);
                this.listenTo(this.model, 'error', this.fetchError);
            },
            events: {
                'click button.remote-wipe'      :   'remoteWipe',
                'click button.shut-down'        :   'shutDown',
                'click button.reboot'           :   'reboot',
                'click button.update-info'      :   'updateInfo',
                'click button.clear-passcode'   :   'clearPasscode',
                'click button.device-lock'      :   'deviceLock'
            },
            showLoading: function () {
                var $el = this.$el;
                this._loading = this._loading || new App.loading();
                $el.empty().append(this._loading.render().el);
                return this;
            },

            hideLoading: function () {
                if (this._loading) {
                    this._loading.close();
                }
                return this;
            },

            fetchSuccess: function (model, response, options) {
                this.hideLoading();
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
            template: _.template(policiesTemplate),
            render: function () {
                this.model.fetch();
                return this;
            },
            renderTemplate: function(modelJSON) {
                var template = this.template(modelJSON);
                this.$el.html(template);
                return this;
            },
            remoteWipe: function (event) {
                this.modalView = new BaseModal.View();
                this.modalView.setHeaderHTML('<h4>Are you ABSOLUTELY sure?</h4>')
                this.modalView.setContentView(new RemoteWipe.View(this.options));
                this.modalView.open();
                this.listenTo(App.vent,'closeRemoteWipeModal', this.closeDeviceLockModal);
                return this;
            },
            shutDown: function(event) {
                var that = this,
                    shutdownData = {
                    'action': $(event.currentTarget).attr('name')
                };
                $.ajax({
                    type: 'PUT',
                    url: '/policies/' + this.object + '/' + this.objectId + '/' + this.activePolicy,
                    dataType: 'json',
                    data: JSON.stringify(shutdownData),
                    beforeSend: function () {
                        that.$el.find('#status').empty().removeClass('alert alert-success').addClass('alert alert-warning').html('Requesting..');
                    },
                    success: function (response) {
                        if(response.pass) {
                            that.$el.find('#status').empty().removeClass('alert alert-warning').addClass('alert alert-success').html(response.data.action + ' Action performed successfully!');
                            setTimeout( function () {
                                that.$el.find('#status').empty().removeClass('alert alert-warning').removeClass('alert alert-success');
                            }, 3000);
                        }
                    }
                });
            },
            reboot: function(event) {
                var that = this,
                    rebootData = {
                    'action': $(event.currentTarget).attr('name')
                };
                $.ajax({
                    type: 'PUT',
                    url: '/policies/' + this.object + '/' + this.objectId + '/' + this.activePolicy,
                    dataType: 'json',
                    data: JSON.stringify(rebootData),
                    beforeSend: function () {
                        that.$el.find('#status').empty().removeClass('alert alert-success').addClass('alert alert-warning').html('Requesting..');
                    },
                    success: function (response) {
                        if(response.pass) {
                            that.$el.find('#status').empty().removeClass('alert alert-warning').addClass('alert alert-success').html(response.data.action + ' Action performed successfully!');
                            setTimeout( function () {
                                that.$el.find('#status').empty().removeClass('alert alert-warning').removeClass('alert alert-success');
                            }, 3000);
                        }
                    }
                });
            },
            updateInfo: function(event) {
                var that = this,
                    updateIfoData = {
                    'action': $(event.currentTarget).attr('name')
                };
                $.ajax({
                    type: 'PUT',
                    url: '/policies/' + this.object + '/' + this.objectId + '/' + this.activePolicy,
                    dataType: 'json',
                    data: JSON.stringify(updateIfoData),
                    beforeSend: function () {
                        that.$el.find('#status').empty().removeClass('alert alert-success').addClass('alert alert-warning').html('Requesting..');
                    },
                    success: function (response) {
                        if(response.pass) {
                            that.$el.find('#status').empty().removeClass('alert alert-warning').addClass('alert alert-success').html(response.data.action + ' Action performed successfully!');
                            setTimeout( function () {
                                that.$el.find('#status').empty().removeClass('alert alert-warning').removeClass('alert alert-success');
                            }, 3000);
                        }
                    }
                });
            },
            clearPasscode: function(event) {
                var that = this,
                    clearPasscodeData = {
                    'action': $(event.currentTarget).attr('name')
                };
                $.ajax({
                    type: 'PUT',
                    url: '/policies/' + this.object + '/' + this.objectId + '/' + this.activePolicy,
                    dataType: 'json',
                    data: JSON.stringify(clearPasscodeData),
                    beforeSend: function () {
                        that.$el.find('#status').empty().removeClass('alert alert-success').addClass('alert alert-warning').html('Requesting..');
                    },
                    success: function (response) {
                        if(response.pass) {
                            that.$el.find('#status').empty().removeClass('alert alert-warning').addClass('alert alert-success').html(response.data.action + ' Action performed successfully!');
                            setTimeout( function () {
                                that.$el.find('#status').empty().removeClass('alert alert-warning').removeClass('alert alert-success');
                            }, 3000);
                        }
                    }
                });
            },
            deviceLock: function(event) {
                this.modalView = new BaseModal.View();
                this.modalView.setHeaderHTML('<h4>Lock Device Remotely</h4>')
                this.modalView.setContentView(new DeviceLock.View(this.options));
                this.modalView.open();
                this.listenTo(App.vent,'closeDeviceLockModal', this.closeDeviceLockModal);
                return this;

            },
            closeDeviceLockModal: function (event) {
                this.modalView.hide();
            }
        })

        return exports;

    }
);