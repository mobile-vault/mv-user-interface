define(
    ['core/js/views/charts/charts'],
    function (Charts) {
        'use strict';
        var backboneViewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
        var exports = {
            name:'osStats',
            models: {
                Main: Backbone.Model.extend({
                    defaults: {
                        type: 'line',
                        URL: '',
                        selectedKeys: [],
                        availableKeys: [],
                        APIName: '',
                        chartOptions: {}
                    }
                })
            },
            views: {
                Main: Charts.extend({

                    initialize: function (options) {
                        this.chartOptions = _.merge({}, this.defaultOptions, _.omit(options, backboneViewOptions));
                        this.chartOptions.chart.renderTo = this.el;
                        return this;
                    },

                    render: function () {
                        this._destroyChart();
                        this.chartOptions.series = _.result(this.collection, 'toJSON');
                        this.chart = new Highcharts.Chart(this.chartOptions);
                        return this;
                    }
                })
            }
        };


    }
);

