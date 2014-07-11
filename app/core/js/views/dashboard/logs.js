/**
 * Created with JetBrains WebStorm.
 * User: ankitkhatri
 * Date: 27/01/14
 * Time: 7:04 PM
 * To change this template use File | Settings | File Templates.
 */
define(
    ['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'text!template/log.html', 'core/js/API/logsTimeline'],
    function ($, _, Backbone, crel, app, TemplateView, logsTemplate) {

        'use strict';
        var exports = {};
        exports.name = 'Logs Timeline';
        exports.models = {
            Main: Backbone.Model.extend({
                defaults: {
                    url: ''
                }
            })
        };

        exports.views = {
            Main: TemplateView.extend({
                className: 'logs-timeline',
                template: _.template(logsTemplate),
                initialize: function () {
                    var Collection = Backbone.Collection.extend({
                        parse: function(response) {
                              if (response.pass) {
                                  return response.logs;
                              }
                        }
                    });
                    this.collection = new Collection();
                    this.collection.url = this.model.get('url');
                    this.listenTo(this.collection, 'request', this.showLoading);
                    this.listenTo(this.collection, 'sync', this.fetchSuccess);
                    this.listenTo(this.collection, 'error', this.fetchError);
                },
                showLoading: function () {
                    this._loading = this._loading || new app.loading();
                    this.$el.html(this._loading.render().el);
                    return this;
                },
                hideLoading: function () {
                    if (this._loading) {
                        this._loading.close();
                    }
                    return this;
                },
                fetchSuccess: function () {
                    this.hideLoading();
                    this.$el.empty();
                    this.renderTimeline();
                    return this;
                },

                fetchError: function () {
                    this.$el.html(crel('div', {class: 'centerLine'}, 'Error Fetching Data...'));
                    return this;
                },
                render: function(){

                    this.collection.fetch();

                    return this;
                },
                renderTimeline: function() {
                    var timelineData = this.collection.toJSON();
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    var payload = {
                        collection: this.collection,
                        logs: timelineData,
                        months: months,
                        days: days
                    }
                    var template = this.template;

                    this.$el.html(template(payload));

                    return this;
                }

            })
        };
       return exports;
    });
