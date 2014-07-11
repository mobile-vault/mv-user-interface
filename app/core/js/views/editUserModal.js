define(
    ['jquery', 'underscore', 'backbone', 'app', 'core/js/vent', 'crel', 'modals/baseModal', 'text!template/modals/editUser.html'/*, 'core/js/API/pre_enroll'*/],
    function ($, _, Backbone, app, Vent, crel, BaseModal, EditUsersTemplate) {
        'use strict';
        var exports = {
            Model: Backbone.Model.extend({
                urlRoot: '/pre_enroll',
                defaults: {
                    user_name: '',
                    user_id: '',
                    user_role: '',
                    user_team: '',
                    user_company: 'TopPatch'
                }
            }),
            UserDataModel: Backbone.Model.extend({
                idAttribute: 'user_id',
                validate: function (attrs) {
                    var alphanum = new RegExp(/^[A-Za-z0-9]+$/);
                    if(!$.trim(attrs.user_name)) {
                        return "The name of the user should not be empty.";
                    }

                    if(!alphanum.test(attrs.user_name)) {
                        return "The name of the user should only have alphabets and numbers in it."
                    }
                }
            }),
            View: BaseModal.View.extend({
                id: 'edit-user',
                init: function (userModel) {
                    this.userModel = userModel;
                    this.template = _.template(EditUsersTemplate);
                    this.model = new exports.Model();
                    this.userDataModel = new exports.UserDataModel();
                    this.userDataModel.urlRoot = '/users/';
                    this.model.fetch();
                    this.listenTo(this.model, 'sync', this.extractData);
                    this.listenTo(this.userDataModel, 'invalid', this.showError );
                    this.listenTo(this.userDataModel, 'request', this.showingRequest);
                    this.listenTo(this.userDataModel, 'sync', this.onSuccess);
                    this.listenTo(this.userDataModel, 'error', this.showPostError);
                    return this;
                },
                col: '12',
                events: {
                    'submit #edit-user-form'    :   'updateEditFormData'
                },
                showError: function (model) {
                    this.$(".error-message-container").empty().append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="error-message"></span></div>')
                        .find(".error-message").empty().html(model.validationError);
                    return this;
                },
                showingRequest: function (model, response, options) {
                    this.$('.show-status').empty().html("Saving...");
                    return this;
                },
                onSuccess: function(model, response, options) {
                    if(response.pass)
                    {
                        this.$('.show-status').empty().addClass('text-success').html("User Data Edited Successfully");
                        app.vent.trigger("Modal:editUser", true);
                    }
                    else
                    {
                        this.$('.show-status').empty().html("Internal Server Error Occured. Please try again after sometime...");
                        app.vent.trigger("Modal:editUser", false);
                    }
                    return this;
                },
                showPostError: function (model, response, options) {
                    this.$('.show-status').empty().html(response.responseText);
                    return this;
                },
                extractData: function(model) {
                    var modelData = model.toJSON().data,
                        rolesObject = modelData.roles,
                        teamsObject = modelData.teams,
                        payload = {
                            roles: rolesObject,
                            teams: teamsObject,
                            userModel: this.userModel
                        };
                    this.renderContent(payload);
                    return this;
                },
                renderContent: function(payload) {
                    var userName = this.userModel.get('user_name'),
                        userTeam = this.userModel.get('user_team'),
                        userRole = this.userModel.get('user_role');

                    var template = this.template({header: false, payload: payload, userRole: userRole, userTeam: userTeam});

                    this.setHeaderHTML(this.renderHeader(payload));
                    this.setContentHTML(template);
                    var form = this.$el.find('#edit-user-form');
                    form.find('#edit-user-name').val(userName);

                    return this;
                },
                renderHeader: function(payload) {
                    return this.template({header: true, payload: payload});
                },
                updateEditFormData: function(event) {
                    event.preventDefault();
                    var form = this.$el.find('#edit-user-form');

                    this.userDataModel.set({
                        user_name: form.find('#edit-user-name').val(),
                        user_id: form.find('#edit-user-id').val(),
                        user_role: form.find('#edit-role-name').val(),
                        user_team: form.find('#edit-team-name').val(),
                        user_company: form.find('#edit-company').text()
                    });

                    this.userDataModel.save({}, {}, {validate: true});
                    return this;
                }
            })
        };
        return exports;
    }
);

