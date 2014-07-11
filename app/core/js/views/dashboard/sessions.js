define(
    ['jquery', 'underscore', 'backbone', 'crel', 'moment', 'views/view', 'lists/pager','core/js/API/sessions'],
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
                    var sessionCollection = Pager.Collection.extend({

                    });
                    this.collection = new sessionCollection();
                    this.collection.url = url;
                    this.pager = Pager.View.extend({
                        model: this.model,
                        collection: this.collection,
                        itemKeys: itemKeys,
                        renderModel: this.renderModel,
                        layoutHeader: this.layoutHeader,
                        /*setFooterContent: this.setFooterContent,*/
                        updateList: this.updateList,
                        getCol: this.getCol,
                        formattedDate: this.formattedDate,
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

                formattedDate: function (param) {
                    return param < 10 ? '0'+param : param;
                },
                renderModel: function (model) {
                    var model = model.toJSON();
                    var fragment = document.createDocumentFragment(),
                        keys = this.model.get('keys'),
                        otherKeys = this.model.get('otherKeys'),
                        item = $(crel('div', {class: 'item'})),
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
                            var data = model[key],
                                formattedDate;
                            if(key == "created_on") {
                                var timestamp = new Date(data);
                                formattedDate = timestamp.getFullYear() + '-' + that.formattedDate( timestamp.getMonth() + 1 ) + '-' + that.formattedDate(timestamp.getDate()) + ' ';
                                var time = new Date(timestamp.getTime());
                                formattedDate  = formattedDate + that.formattedDate(time.getHours()) + ':' + that.formattedDate(time.getMinutes()) + ':' + that.formattedDate(time.getSeconds());
                                data = formattedDate;
                            }
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
                /*layoutFooter: function ($footer) {
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
                },*/
                /*setFooterContent: function (event) {
                    var that = this,
                        $el = this.$el,
                        $footer = $el.find('footer'),
                        col = this.collection,
                        models = col.models;

                    if (event === 'reset') {
                        (function () {
                            var start = 1 + col.getParameter('offset'),
                                end = start + models.length - 1,
                                total = col.getRecordCount(),
                                out = [that.showingString, start, '-', end, 'of', total, that.recordString].join(' ').trim();

                            $footer.find('.pull-left').html(crel('p', {class: 'records-legend'},out));
                        }());
                    } else {
                        $footer.find('.pull-left').html('&nbsp;');
                        $footer.find('.span4').html('&nbsp;');
                    }
                },*/
                updateList: function() {
                    var that = this,
                        $el = this.$el,
                        $items = $el.find('.items'),
                        $item = this._baseItem,
                        models = this.collection.models;


                    $items.empty();

                    if ((models && models.length>0)){

                        _.each(models, function (model) {
                            $items.append(that.renderModel(model));
                        });

                    } else if (models === undefined) {
                        $items.html(
                            this.string_emptyData
                        );
                    }
                    else {
                        $items.html(
                            this.string_emptyData
                        );
                    }
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