define(
    ['jquery', 'underscore', 'backbone', 'crel', 'views/templateView', 'text!template/userEnroll.html', 'core/js/API/preenroll'],
    function ($, _, Backbone, crel, TemplateView, UserEnrollTemplate, preenroll) {
        'use strict';
        var exports = {};
        exports.Model = Backbone.Model.extend({
            url: '/pre_enroll'
        });
        exports.View = Backbone.View.extend({
            initialize: function() {
                this.model = new exports.Model();
               _.bindAll(this, 'renderModel');

            },
            template: UserEnrollTemplate,
            render: function() {
                this.model.fetch({
                    success: this.renderModel
                });
                return this;
            },

            renderModel: function() {
                var modelData = this.model.toJSON().data;

                var template = _.template(this.template),
                    rolesObject = modelData.roles,
                    teamsObject = modelData.teams,
                    payload = {
                        roles: rolesObject,
                        teams: teamsObject
                    };

                this.$el.append(template(payload));
                return this;

            }

        });
        return exports;

    }

);

