define(
    ['views/view', 'highcharts', 'crel', 'app', 'core/js/API/osStats', 'core/js/API/userStats'],
    function (View, Highcharts, crel, app) {
        'use strict';
        var backboneViewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
        var exports = {};
        exports.name = 'charts';
        exports.models = {
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
        };

        exports.views = {
            Main: View.extend({
                tagName: 'div',
                className: [exports.name].join(' '),
                /**
                 * @attribute defaultOptions
                 * @type Object
                 * @default See source code
                 * @protected
                 */
                defaultOptions: {
                    chart:  {},
                    title:  { text: '' },
                    credits:{ enabled: false },
                    xAxis:  { showLastLabel: true },
                    yAxis:  { title: { text: '' } }
                },
                /**
                 * Initialize this view, and set the Highcharts renderTo property to this.el
                 * @method initialize
                 * @param options {Object} Options to pass to the new Highcharts instance
                 * @chainable
                 */
                initialize: function (options) {
                    this.chartOptions = _.merge({}, this.defaultOptions, this.model.get('chartOptions'), _.omit(options, backboneViewOptions));
                    this.chartOptions.chart.renderTo = this.el;
                    this.collection = new Backbone.Collection();
                    this.collection.url = this.model.get('URL');
                    this.listenTo(this.collection, 'request', this.showLoading);
                    this.listenTo(this.collection, 'sync', this.fetchSuccess);
                    this.listenTo(this.collection, 'error', this.fetchError);
                    this.listenTo(this.model, 'change:URL', this.updateCollection);
                    this.listenTo(this.model, 'change', this.renderChartWrapper);
                    return this;
                },

                showLoading: function() {
                    this._loading = this._loading || new app.loading();
                    this.$el.html(this._loading.render().el);
                    return this;
                },
                hideLoading: function () {
                    if (this._loading) { this._loading.close(); }
                    return this;
                },
                fetchSuccess: function() {
                    this.hideLoading();
                    this.$el.empty();
                    this.renderChart();
                    return this;
                },

                fetchError: function() {
                    this.$el.html(crel('div', {class: 'centerLine'}, 'Error Fetching Data...'));
                    return this;
                },

                updateCollection: function(model, value) {
                    this.collection.url = value;
                    this.collection.fetch();
                    return this;
                },

                renderChartWrapper: function() {
                    if(model.hasChanged('URL'))
                    {
                        return this;
                    }
                    this.renderChart();
                    return this;
                },

                render: function () {
                    if (this.collection.url) {
                        this.collection.fetch();

                    } else {
                        this.$el.append(crel('div', {class: 'centerLine'}, 'Nothing to load...'));
                    }
                    return this;
                },
                /**
                 * Create a new instance of a Highaharts chart which will append itself to this.el.
                 *
                 * Note: The chart cannot take on 100% height/width unless this.el is in the DOM.
                 * Re-rendering after append will correct the height and width to 100%.
                 * @method renderChart
                 * @chainable
                 */
                renderChart: function () {
                    var collectionData, piechartModels, donutModels, data = [], chartData = [], usersData = [], versionsData = [], that = this;
                    var colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
                        return {
                            radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                            stops: [
                                [0, color],
                                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                            ]
                        };
                    });
                    this._destroyChart();
                    if(this.collection)
                    {
                        if(this.collection.url === '/dashboard/devices')
                        {
                            collectionData = this.collection.toJSON();


                            piechartModels = collectionData[0];
                            data = piechartModels.data;
                        }

                        else if(this.collection.url === '/dashboard/enrollment')
                        {
                            collectionData = this.collection.toJSON();
                            donutModels = collectionData[0];
                            chartData = _.pairs(_.omit(donutModels.data.UserInformation, 'Total Users'));
                        }

                        for (var i = 0, k=1; i < data.length; i++,k++) {
                            usersData.push({
                                name: data[i].drilldown.name,
                                y: data[i].y,
                                color: data[i].drilldown.name === 'Android'?colors[2]:colors[0]
                            });

                            for (var j = 0; j < data[i].drilldown.data.length; j++) {
                                var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
                                versionsData.push({
                                    name: data[i].drilldown.name + ' ' + data[i].drilldown.categories[j],
                                    y: data[i].drilldown.data[j],
                                    color: Highcharts.Color(data[i].drilldown.name === 'Android'?colors[2]:colors[0]).brighten(brightness).get()
                                });
                            }
                        }

                        if(this.collection instanceof Backbone.Collection)
                        {
                            that.chartOptions.series = [{data: chartData, name: 'Share'}];
                        }
                    }

                    this.chartOptions.chart.type = this.model.get('type');

                    if(this.chartOptions.chart.type === 'pie' && this.collection.url === '/dashboard/devices')
                    {
                        var series = this.chartOptions.series;
                        this.chartOptions.plotOptions = {
                            pie: {
                                shadow: false,
                                center: ['50%', '50%']
                            }
                        };
                        this.chartOptions.series = [{
                            data: usersData,
                            name: 'Users',
                            size: '60%',
                            showInLegend: true,
                            dataLabels: {
                                color: 'white',
                                distance: -30,
                                enabled: true,
                                formatter: function () {
                                    return this.y > 5 ? this.point.name : null;
                                }
                            }
                        },
                            {
                                name: 'Versions',
                                data: versionsData,
                                size: '80%',
                                innerSize: '60%',
                                dataLabels: {
                                    formatter: function() {
                                        return this.y > 1 ? '<b>'+ this.point.name +':</b> '+ this.y.toFixed(2) +'%'  : null;
                                    }
                                }

                            }];
                    }

                    if(this.chartOptions.chart.type === 'pie' && this.collection.url === '/dashboard/enrollment')
                    {   //var colors = Highcharts.getOptions().colors;
                        this.chartOptions.series = [{
                            data: chartData,
                            name: 'Share',
                            showInLegend: true,
                            colors: [colors[8], colors[6], colors[2]],
                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    return '<b>' + this.point.name + '</b>: '+ this.percentage.toFixed(2) + ' %';                            }
                            }
                        }];
                    }
                    this.chartOptions.title.text = this.model.get('APIName');
//                this.chartOptions.series = _.result(this.collection, 'toJSON');
                    this.chart = new Highcharts.Chart(this.chartOptions);
                    return this;
                },
                /**
                 * Make sure to destroy the chart before close.
                 * @method close
                 * @returns {*}
                 */
                close: function () {
                    if (!this.isClosed) {
                        this._destroyChart();
                        View.prototype.close.apply(this, arguments);
                    }
                    return this;
                },
                /**
                 * Removes this.chart and purges memory.
                 * @method _destroyChart
                 * @chainable
                 * @private
                 */
                _destroyChart: function () {
                    if (_.isObject(this.chart) && _.isFunction(this.chart.destroy)) {
                        this.chart.destroy();
                    }
                    return this;
                }
            })
        };
        return exports;
    }
);
