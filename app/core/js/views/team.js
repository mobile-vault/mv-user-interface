define(
    ['jquery', 'underscore', 'backbone', 'app', 'crel', 'views/view', 'views/editUserModal', 'lists/pager', 'text!template/teams.html',
        'text!template/teamMembers.html', 'core/js/API/team1', 'core/js/API/team2', 'core/js/API/team3', 'core/js/API/team4',
     'core/js/API/team5', 'core/js/API/team6', 'core/js/API/team7'],
    function ($, _, Backbone, app, crel, View, EditUserModalView, Pager, TeamsTemplate, TeamMembersTemplate) {
        'use strict';
        var exports = {};

        exports.Collection = Pager.Collection.extend({
            baseUrl:'/teams',
            _defaultParams: {
                team: '',
                offset: 0,
                count: 10
            }
        });

        exports.View = View.extend({
            initialize: function() {
                this.collection = new exports.Collection();
                this.collection.baseUrl = '/teams';
                var PagerView = Pager.View.extend({
                    collection:this.collection,
                    teamMembersTemplate: TeamMembersTemplate,
                    causeNavigation: false,
                    renderModel: function (model) {
                        var template = _.template(this.teamMembersTemplate),
                            payload = {
                                params: this.collection.params,
                                model: model
                            };
                        return template(payload);
                    },
                    layoutHeader: function ($header) {
                        var headerTemplate = _.template(TeamsTemplate);
                        $header.append(headerTemplate({header: true, legend: false, query: this.collection.params}));
                        return this;
                    },
                    layoutLegend: function ($legend) {
                        var legendTemplate = _.template(TeamsTemplate);
                        $legend.append(legendTemplate({header: false, legend: true, query: this.collection.params}));
                        return this;
                    }
                });
                this.pager =  new PagerView();
            },
            render: function() {
                this.pager.render();
                return this;
            }
        });
        return exports;
    }
);

