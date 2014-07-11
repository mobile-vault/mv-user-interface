define(
    ['jquery', 'underscore', 'backbone', 'app', 'views/view', 'crel'],
    function ($, _, Backbone, app, View, crel) {
        'use strict';
        var exports = {};
        exports.Collection = Backbone.Collection.extend({});
        exports.View = View.extend({});

        _.extend(exports.Collection.prototype, {
            baseUrl: '',
            _defaultParams: {},
            params: {},
            url: function () {
                var query = this.query(),
                    url = this.baseUrl;

                if (query !== '?') { url += query; }
                return url;
            },

            query: function () {
                return '?' + $.param(this.params).trim();
            },

//            parse: function (response) {
//                this.recordCount = parseInt(response.count, 10) || 0;
//                return response.data || response;
//            },
            parse: function (response) {
                if (response.pass) {
                    this.recordCount = response.count;
                    return response.data;
                }
                return response;
            },

            initialize: function (options) {
                var that = this;
                if (options && options._defaultParams) {
                    this._defaultParams = _.clone(options._defaultParams);
                }
                // Reset params to default params
                this.params = _.clone(this._defaultParams);
                if (options && options.params) {
                    _.extend(
                        this.params,
                        // Accept only the params defined in this.params
                        // If this.params = {a: 1, b: 2} and options.params = {a: 0, c: 3}
                        // then final this.params is {a: 0, b: 2}. {c: 3} is ignored.
                        _.pick(
                            options.params,
                            _.keys(this.params)
                        )
                    );

                    // Convert numeric params into numbers
                    _.each(this.params, function (param, key) {
                        if ($.isNumeric(param) && $.type(param) === 'string') {
                            that.params[key] = parseInt(param, 10);
                        }
                    });
                }
            },

            getParameter: function (name) {
                var out;

                if (!name) {
                    out = this.params;
                } else {
                    out = this.params[name];
                }

                return out;
            },

            getRecordCount: function () {
                return this.recordCount;
            }
        });

        _.extend(exports.View.prototype, {
            tagName: 'article',
            className: 'list-row',
            showHeader: true,
            showLegend: true,
            showFooter: true,
            string_emptyData: 'No data available.',
            itemKeys: [],
            initialize: function (options) {
                if (options) {
                    _.extend(this, _.pick(options, ['showHeader', 'showLegend', 'showFooter', 'itemKeys']));
                }

                if (!this.collection instanceof exports.Collection) {
                    this.collection =  new exports.Collection();
                }

                this.listenTo(this.collection, 'request', this.showLoading);
                this.listenTo(this.collection, 'sync', this.fetchSuccess);
                this.listenTo(this.collection, 'error', this.fetchError);
            },

            events: {
                'click .disabled': 'stopEvent'
            },

            stopEvent: function (event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            },

            beforeRender: $.noop,
            onRender: $.noop,
            render: function () {
                if (this.beforeRender !== $.noop) { this.beforeRender(); }
                var $el = this.$el.empty().html(this.layout()),
                    $header = $el.find('header'),
                    $legend = $el.find('.legend'),
                    $footer = $el.find('footer'),
                    $items = $el.find('.items');
                if (!this._baseItem) {
                    //this._baseItem = _.clone($items.find('.item')).empty();
                }

                if (this.showHeader) { this.layoutHeader($header); }
                if (this.showLegend) { this.layoutLegend($legend); }
                if (this.showFooter) { this.layoutFooter($footer); }

                this.collection.fetch();
                if (this.onRender !== $.noop) { this.onRender(); }
                return this;
            },

            layout: function () {
                var fragment = document.createDocumentFragment(),
                    elements = document.createDocumentFragment();
                if (this.showHeader) {
                    elements.appendChild(crel('header', {class:'clearfix text-center'}));
                }

                if (this.showLegend) {
                    elements.appendChild(crel('div', {class: 'legend-list'}, crel('div', {class: 'legend clearfix'})));
                }

                elements.appendChild(
                    crel('div', {class: 'items'},
                        crel('div', {class: 'item'})
                    )
                );

                if (this.showFooter) {
                    elements.appendChild(
                        crel('footer', {class:'clearfix'})
                    );
                }

                fragment.appendChild(
                    crel('section', {class: 'list'}, elements)
                );

                return fragment;
            },
            layoutHeader: $.noop,
            layoutFooter: $.noop,
            layoutLegend: function ($legend) {
                var cells = [];
                _.each(this.itemKeys, function (key) {
                    var value = _.isFunction(key.legendFormat) ? key.legendFormat((key.name || key.key)) : (key.name || key.key);
                    cells.push(
                        crel('div', {class: (key.className || '').trim()}, crel('strong', value)
                    ));
                });
                $legend.append(cells);
                return this;
            },
            // Generic model render method
            // Override for custom look
            renderModel: function (item) {
                var content = document.createDocumentFragment();
                _.each(this.itemKeys, function (key) {
                    var value = _.isFunction(key.dataFormat) ? key.dataFormat(item.get(key.key), item) : item.attributes[key.key];
                    content.appendChild(
                        crel('div', {class: (key.className || '').trim()}, value)
                    );
                });

                if (_.isFunction(this.itemWrap)) {
                    content = this.itemWrap(content, item);
                }

                return crel('div', {class:'item'},
                    crel('div', {class:'row'}, content)
                );
            },

            beforeUpdateList: $.noop,
            afterUpdateList: $.noop,

            updateList: function () {
                if (this.beforeUpdateList !== $.noop) { this.beforeUpdateList(); }
                var that = this,
                    $el = this.$el,
                    $items = $el.find('.items'),
                    $item = this._baseItem,
                    models = this.collection.models;

                    // empty item list
                $items.empty();

                if (models.length > 0) {
                    _.each(models, function (model) {
                        $items.append(that.renderModel(model));
                    });
                } else {
                    $items.html(
                       /* _.clone($item).empty().html(*/
                            this.string_emptyData
                        /*)*/
                    );
                }


                if (this.afterUpdateList !== $.noop) { this.afterUpdateList(); }

                return this;
            },

            showLoading: function () {
                var $el = this.$el,
                    $items = $el.find('.items');
                this._loading = this._loading || new app.loading();
                $items.empty().append(this._loading.render().el);
                return this;
            },

            hideLoading: function () {
                if (this._loading) { this._loading.close(); }
                return this;
            },

            fetchSuccess: function (collection, response, options) {
                this.hideLoading().updateList();
                return this;
            },

            fetchError: function (collection, response, options) {
                var $el = this.$el,
                    $items = $el.find('.items'),
                    $item = this._baseItem;
                this.hideLoading();
                $items.html(//response.responseText
                    crel('div', {class: 'centerLine'}, 'Error Fetching Data...'));
                return this;
            },

            causeNavigation: true,
            updateNavigation: function () {
                if (this.causeNavigation) {
                    var pattern = /^[\w\d_\-\+%]+[\?\/]{0}/,
                        hash = pattern.exec(app.router.getCurrentFragment()) || '';

                    // Update the URL, but do not cause a route event
                    app.router.navigate(hash + this.collection.query());
                }

                return this;
            }
        });
        return exports;
    }
);