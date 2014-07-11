define(
    ['jquery', 'underscore', 'backbone', 'crel', 'moment', 'views/view', 'lists/pager'],
    function ($, _, Backbone, crel, moment, View, Pager) {
        'use strict';
        var exports = {};
        exports.name = 'list';
        exports.models = {
            Main: Backbone.Model.extend({
                defaults: {
                    source: '',
                    keys: [],
                    otherKeys: [],
                    columnNames: [],
                    className: [],
                    showFooter: true,
//                    link: false,
//                    linkKey: '',
                    title: false,
                    itemKeys: [
                        {key:'', name: '', className: ''}
                    ]
                }
            })
        };
        exports.views = {
            Main: View.extend({
                tagName: 'div',
                className: [exports.name].join(' '),
                initialize: function () {
                    if (_.isUndefined(this.model)) {
                        throw new Error('list view requires a list model');
                    }
                    var url = this.model.get('source'),
                        params = this.model.get('params'),
                        keys = this.model.get('keys'),
                        otherKeys = this.model.get('otherKeys'),
                        columnNames = this.model.get('columnNames'),
                        classes = this.model.get('className'),
                        itemKeys = [];
                    _.each(keys, function (key, i) {
                        itemKeys.push({key: key, name: columnNames[i], className: classes[i]});
                    });
                   /* this.collection = new (Pager.Collection.extend({
                        url: function () {
                            return (_.isEmpty(params)) ? '/' + url : '/' + url + '?' + $.param(params);
                        }
                    }))();*/
                    this.collection = new Pager.Collection();
                    this.collection.url = url;
                    this.pager = Pager.View.extend({
                        model: this.model,
                        collection: this.collection,
                        itemKeys: itemKeys,
                        renderModel: this.renderModel,
                        layoutHeader: this.layoutHeader,
                        layoutFooter: this.layoutFooter,
                        getCol: this.getCol,
                        showFooter: this.model.get('showFooter')
                    });
                    this.renderList();
                },
                beforeRender: $.noop,
                onRender: $.noop,
                render: function () {
                    if (this.beforeRender !== $.noop) { this.beforeRender(); }

                    var $el = this.$el;
                    if ($el.children().length === 0) {
                        $el.html(this.layout());
                    }
                    if (this.collection.url) { this.collection.fetch(); }

                    if (this.onRender !== $.noop) { this.onRender(); }
                    return this;
                },
                layout: function () {
                    var fragment = document.createDocumentFragment();
                    fragment.appendChild(crel('div'));
                    return fragment;
                },
                layoutHeader: function ($header) {
                    var title = this.model.get('title');
                    if (title) {
                        $header.removeClass('pull-right').append(crel('strong', title));
                    }
                },
                getCol: function (index) {
                    return this.model.get('className')[index];
                },
                renderModel: function (model) {
                    var model = model.toJSON();
                    var fragment = document.createDocumentFragment(),
                        keys = this.model.get('keys'),
                        otherKeys = this.model.get('otherKeys'),
                        item = $(crel('div', {class: 'item row'})),
                        link = false,
                        that = this,
                        item1,
                        item2;

                    if (_.has(model, 'user_device'))
                    {
                        link = item;
                        item1 = $(crel('a', {href: '#' + model.user_id, 'data-toggle': 'collapse'}));
                        link.append(item1);
                        _.each(keys, function (key, i) {
                            var data = model[key];
                            item1.append(crel('div', {class: that.getCol(i)}, data));
                        });
                        item2 = $(crel('div', {id: model.user_id, class: 'collapse'}));
                        link.append(item2);
                        _.each(otherKeys, function (otherKey) {
                            var data = _.pick(model, otherKey);
                            var key = otherKey.replace(/_/g, ' ');
                            var value = _.values(data);
                            item2.append(crel('div', {class: 'row'}, crel('div', {class: 'col-lg-12 col-md-12 col-sm-12 col-xs-12'}, crel('p', crel('span', key + ' : '), crel('span', value)))));
                            item2.find('p > span:nth-child(1)').css('text-transform', 'capitalize');
                        });
                    }
                    else
                    {
                        _.each(keys, function (key, i) {
                            var data = model[key];
                            item.append(crel('span', {class: that.getCol(i)}, data));
                        });
                    }
                    if (link) {
                        fragment.appendChild(link[0]);
                    } else {
                        fragment.appendChild(item[0]);
                    }
                    return fragment;
                },
                layoutLegend: function () {
                    var titles = this.model.get('columnNames'),
                        $header = this.$el.find('header'),
                        that = this, legend;
                    legend = crel('div', {class: 'violationTable'}, crel('div', {class: 'legend row'}));
                    _.each(titles, function (title) {
                        $(legend).append(crel('div',{class: that.getCol()}, crel('strong', title)));
                    });
                    $header.after($(legend));
                    return this;
                },
                layoutFooter: function ($footer) {
                    var paginationFragment = document.createDocumentFragment();
                    paginationFragment.appendChild(
                        crel('div', {class: 'col-lg-12 col-md-12 col-sm-12 col-xs-12'},
                            crel('ul', {class: 'pagination custom-pagination pull-right'},
                                crel('li', crel('a', {href: '#', class: 'btn btn-default', role: 'button', 'data-action': 'list-pagePrev'}, 'Prev')),
                                crel('li', crel('a', {href: '#', class: 'btn btn-default', role: 'button', 'data-action': 'list-pageNext'}, 'Next'))
                            )
                        )
                    );
                    $footer.append(paginationFragment);
                    return this;
                },
                renderList: function () {
                    var $el = this.$el,
                        pageView = new this.pager();
                    pageView.render();
                    $el.append(pageView.$el);
                }
            })
        };
        return exports;
    }
);