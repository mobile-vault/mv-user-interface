define(
    ['core/js/views/view', 'highcharts'],
    function (View, Highcharts) {
        'use strict';
        var backboneViewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
        return View.extend({
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
                this.chartOptions = _.merge({}, this.defaultOptions, _.omit(options, backboneViewOptions));
                this.chartOptions.chart.renderTo = this.el;
                return this;
            },
            /**
             * Create a new instance of a Highcharts chart which will append itself to this.el.
             *
             * Note: The chart cannot take on 100% height/width unless this.el is in the DOM.
             * Re-rendering after append will correct the height and width to 100%.
             * @method render
             * @chainable
             */
            render: function () {
                this._destroyChart();
                this.chartOptions.series = _.result(this.collection, 'toJSON');
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
        });
    }
);

