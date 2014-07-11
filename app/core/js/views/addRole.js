define(
    ['jquery','app','views/templateView','text!template/add-role.html', 'core/js/API/roles-save'],
    function($, App, TemplateView, addRoleTemplate) {
       'use strict';
        var exports = {};
        exports.Model = Backbone.Model.extend({
            url:'/roles',
            defaults: {
               name:''
            },
            validate: function (attrs) {
                var alphanum = new RegExp(/^[A-Za-z0-9]+$/);
                if(!$.trim(attrs.name)) {
                    return "The name of the role should not be empty.";
                }

                if(!alphanum.test(attrs.name)) {
                    return "The name of the role should only have alphabets and numbers in it."
                }
            }
        });
        exports.View = TemplateView.extend({
            template: _.template(addRoleTemplate),
            events: {
                'click .save-role': 'saveRole'
            },
            initialize: function (options) {
                this.options = options;
                this.model = new exports.Model();
                this.listenTo(this.model, 'invalid', this.showError );
                this.listenTo(this.model, 'request', this.showRequesting);
                this.listenTo(this.model, 'sync', this.postSuccess);
                this.listenTo(this.model, 'error', this.showPostError);
                return this;
            },
            saveRole: function (event) {
                var roleName = this.$("input[name=role-name]").val();
                this.model.save({name:roleName}, {validate:true});
                return this;
            },
            showRequesting: function () {
                this.$('.post-status').empty().html("Saving...");
                return this;
            },
            postSuccess: function (model, response) {
                if(response.pass) {
                    this.$('.post-status').empty().addClass('text-success').html("Role Saved Successfully");
                    App.vent.trigger("Modal:addRole", true);
                } else {
                    this.$('.post-status').empty().html("Internal Server Error Occured. Please try again after sometime...");
                    App.vent.trigger("Modal:addRole", false);
                }
                return this;
            },
            showError: function (model) {
                this.$(".error-message-container").empty().append('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="error-message"></span></div>')
                    .find(".error-message").empty().html(model.validationError);
                return this;
            },
            showPostError: function (error) {
                this.$('.post-status').empty().html(error.responseText);
                return this;
            }

        });
        return exports;
    }
);