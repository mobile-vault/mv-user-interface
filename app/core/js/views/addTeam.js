define(
    ['jquery','app','views/templateView','text!template/add-team.html', 'core/js/API/teams-save'],
    function($, App, TemplateView, addTeamTemplate) {
        'use strict';
        var exports = {};
        exports.Model = Backbone.Model.extend({
            url:'/teams',
            defaults: {
                name:''
            },
            validate: function (attrs) {
                var alphanum = new RegExp(/^[A-Za-z0-9]+$/);
                if(!$.trim(attrs.name)) {
                    return "The name of the team should not be empty.";
                }

                if(!alphanum.test(attrs.name)) {
                    return "The name of the team should only have alphabets and numbers in it."
                }
            }
        });
        exports.View = TemplateView.extend({
            template: _.template(addTeamTemplate),
            events: {
                'click .save-team': 'saveTeam'
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
            saveTeam: function (event) {
                var teamName = this.$("input[name=team-name]").val();
                this.model.save({name:teamName}, {validate:true});
                return this;
            },
            showRequesting: function () {
                this.$('.post-status').empty().html("Saving...");
                return this;
            },
            postSuccess: function (model, response) {
                if(response.pass) {
                    this.$('.post-status').empty().addClass('text-success').html("Team Saved Successfully");
                    App.vent.trigger("Modal:addTeam", true);
                } else {
                    this.$('.post-status').empty().html("Internal Server Error Occured. Please try again after sometime...");
                    App.vent.trigger("Modal:addTeam", false);
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