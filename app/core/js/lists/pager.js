define(
    ['jquery', 'underscore', 'backbone', 'app', 'crel', 'lists/list'],
    function ($, _, Backbone, app, crel, list) {
        'use strict';
        var exports = {};
        exports.Collection = list.Collection.extend({});
        exports.View = list.View.extend({});

        _.extend(exports.Collection.prototype, {
            baseUrl: '',
            _defaultParams: {
                offset: 0,
                count: 5
            },
            fetchPrevSet: function () {
                if (this.hasPrev()) {
                    this.params.offset = Math.max(
                        this.params.offset - this.params.count,
                        0 // Prevent going into negative offsets
                    );
                    this.fetch();
                }
            },
            fetchNextSet: function () {
                if (this.hasNext()) {
                    var offset = +this.params.offset;
                    var count = +this.params.count;
                    this.params.offset = offset + count;

                    this.fetch();
                }
            },
            hasPrev: function () {
                return this.params.offset > 0;
            },
            hasNext: function () {
                var offset = +this.params.offset;
                var count = +this.params.count;
                return (offset + count) < this.recordCount;
            }
        });
        _.extend(exports.View.prototype, {
            initialize: function (options) {
                // No super reference.
                // Super references cause infinite loops after a few inherits
                // Use the class that was subClassed above
                // In this case, list.View
                list.View.prototype.initialize.call(this, options);
                this.listenTo(this.collection, 'sync', function () {
                    this.togglePagerButtons();
                    this.showDynamicList();
                    this.setFooterContent('reset');
                });
                this.listenTo(this.collection, 'request', function () {
                    this.togglePagerButtons(true);
                    this.setFooterContent('fetch');
                });
                this.listenTo(this.collection, 'error', function () {
                    this.togglePagerButtons(true);
                    this.setFooterContent('error');
                });
            },
            events: {
                'click .disabled': 'stopEvent',
                'change select[name=dynamicList]': 'changeListOption',
                'click [data-action=list-pagePrev]': 'pagePrev',
                'click [data-action=list-pageNext]': 'pageNext'
            },
            changeListOption: function (event) {
                var listCount;
                if ($(event.target).val() === 'All') {
                    this.collection.params.offset = 0;
                    listCount = this.collection.getRecordCount();
                }
                else {
                    listCount = $(event.target).val();
                }
                this.collection.params.count = listCount;
                this.collection.fetch();
            },
            layoutFooter: function ($footer) {
                var paginationFragment = document.createDocumentFragment();
                /*paginationFragment.appendChild(
                    crel('div', {class: 'col-lg-4 col-md-4 col-sm-4 col-xs-12'},
                        crel('div', {class: 'input-group'},
                            crel('span', {class: 'input-group-btn'},
                                crel('button', {type: 'button', class: 'btn btn-default'},
                                    crel('i', {class: 'fa fa-search'})
                                )
                            ),
                            crel('input', {type: 'text', class: 'form-control search-input', placeholder: 'No match found'})
                        )
                    )
                );
                paginationFragment.appendChild(
                    crel('div', {class: 'col-lg-3 col-md-4 col-sm-2 col-xs-4 delete-button'},
                        crel('button', {type: 'button', class: 'btn btn-default'}, 'Delete')
                    )
                );*/
                paginationFragment.appendChild(
                    crel('div', {class: 'pull-left'},'')
                );
                paginationFragment.appendChild(
                    crel('div', {class: 'margin-bottom'},
                        crel('ul', {class: 'pagination custom-pagination pull-right'},
                            crel('li', crel('a', {href: '#', class: 'btn btn-default', role: 'button', 'data-action': 'list-pagePrev'}, '<')),
                            crel('li', crel('a', {href: '#', class: 'btn btn-default', role: 'button', 'data-action': 'list-pageNext'}, '>'))
                        )
                    )
                );
                $footer.append(paginationFragment);
                return this;
            },
            showingString: 'Showing',
            recordString: 'records',
            beforeUpdateList: $.noop,
            afterUpdateList: $.noop,
            setFooterContent: function (event) {
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
            },
            togglePagerButtons: function (forcedOff) {
                var $footer = this.$el.find('footer');
                var $header = this.$el.find('header');
                if($header)
                {
                    $header.find('a[data-action=list-pageNext]').toggleClass('disabled', forcedOff || !this.collection.hasNext());
                    $header.find('a[data-action=list-pagePrev]').toggleClass('disabled', forcedOff || !this.collection.hasPrev());
                }
                if($footer)
                {
                    $footer.find('a[data-action=list-pageNext]').toggleClass('disabled', forcedOff || !this.collection.hasNext());
                    $footer.find('a[data-action=list-pagePrev]').toggleClass('disabled', forcedOff || !this.collection.hasPrev());
                }
                return this;
            },
            showDynamicList: function () {
                var $footer = this.$el.find('footer');
                var $selectList = $footer.find('.span4');
                $selectList.empty();
                var dynamicSelectFragment;
                if (this.collection.recordCount < 10) {
                    dynamicSelectFragment = document.createDocumentFragment();
                    dynamicSelectFragment.appendChild(crel('span', ' '));
                    if ($('select[name=dynamicList]').length === 0) {
                        $selectList.append(dynamicSelectFragment);
                    }
                }
                else if (this.collection.recordCount >= 10 && this.collection.recordCount < 20) {
                    dynamicSelectFragment = document.createDocumentFragment();
                    dynamicSelectFragment.appendChild(crel('small', 'Show'));
                    dynamicSelectFragment.appendChild(crel('span', ' '));
                    dynamicSelectFragment.appendChild(crel('select', {name: 'dynamicList', id: 'dynamicList'}, crel('option', {value: '10'}, '10'), crel('option', {value: 'All'}, 'All')));
                    dynamicSelectFragment.appendChild(crel('span', ' '));
                    dynamicSelectFragment.appendChild(crel('small', 'records per page'));
                    if ($('select[name=dynamicList]').length === 0) {
                        $selectList.append(dynamicSelectFragment);
                    }
                }
                else if (this.collection.recordCount >= 20 && this.collection.recordCount < 50) {
                    dynamicSelectFragment = document.createDocumentFragment();
                    dynamicSelectFragment.appendChild(crel('small', 'Show'));
                    dynamicSelectFragment.appendChild(crel('span', ' '));
                    dynamicSelectFragment.appendChild(crel('select', {name: 'dynamicList', id: 'dynamicList'}, crel('option', {value: '10'}, '10'), crel('option', {value: '20', selected: 'selected'}, '20'), crel('option', {value: 'All'}, 'All')));
                    dynamicSelectFragment.appendChild(crel('span', ' '));
                    dynamicSelectFragment.appendChild(crel('small', 'records per page'));
                    if ($('select[name=dynamicList]').length === 0) {
                        $selectList.append(dynamicSelectFragment);
                    }
                }
                else if (this.collection.recordCount >= 50 && this.collection.recordCount < 75) {
                    dynamicSelectFragment = document.createDocumentFragment();
                    dynamicSelectFragment.appendChild(crel('small', 'Show'));
                    dynamicSelectFragment.appendChild(crel('span', ' '));
                    dynamicSelectFragment.appendChild(crel('select', {name: 'dynamicList', id: 'dynamicList'}, crel('option', {value: '10'}, '10'), crel('option', {value: '20', selected: 'selected'}, '20'), crel('option', {value: '50'}, '50'), crel('option', {value: 'All'}, 'All')));
                    dynamicSelectFragment.appendChild(crel('span', ' '));
                    dynamicSelectFragment.appendChild(crel('small', 'records per page'));
                    if ($('select[name=dynamicList]').length === 0) {
                        $selectList.append(dynamicSelectFragment);
                    }
                }
                else if (this.collection.recordCount >= 75 && this.collection.recordCount < 100) {
                    dynamicSelectFragment = document.createDocumentFragment();
                    dynamicSelectFragment.appendChild(crel('small', 'Show'));
                    dynamicSelectFragment.appendChild(crel('span', ' '));
                    dynamicSelectFragment.appendChild(crel('select', {name: 'dynamicList', id: 'dynamicList'}, crel('option', {value: '10'}, '10'), crel('option', {value: '20', selected: 'selected'}, '20'), crel('option', {value: '50'}, '50'), crel('option', {value: '75'}, '75'), crel('option', {value: 'All'}, 'All')));
                    dynamicSelectFragment.appendChild(crel('span', ' '));
                    dynamicSelectFragment.appendChild(crel('small', 'records per page'));
                    if ($('select[name=dynamicList]').length === 0) {
                        $selectList.append(dynamicSelectFragment);
                    }
                }
                else if (this.collection.recordCount >= 100) {
                    dynamicSelectFragment = document.createDocumentFragment();
                    dynamicSelectFragment.appendChild(crel('small', 'Show'));
                    dynamicSelectFragment.appendChild(crel('span', ' '));
                    dynamicSelectFragment.appendChild(crel('select', {name: 'dynamicList', id: 'dynamicList'}, crel('option', {value: '10'}, '10'), crel('option', {value: '20', selected: 'selected'}, '20'), crel('option', {value: '50'}, '50'), crel('option', {value: '75'}, '75'), crel('option', {value: '100'}, '100'), crel('option', {value: 'All'}, 'All')));
                    dynamicSelectFragment.appendChild(crel('span', ' '));
                    dynamicSelectFragment.appendChild(crel('small', 'records per page'));
                    if ($('select[name=dynamicList]').length === 0) {
                        $selectList.append(dynamicSelectFragment);
                    }
                }

                $selectList.find('select[name=dynamicList]').val(this.collection.params.count === this.collection.recordCount ? 'All' : this.collection.params.count > this.collection.recordCount ? '10' : this.collection.params.count);
                return this;
            },
            pageNext: function (e) {
                e.preventDefault();
                this.collection.fetchNextSet();
                return this.updateNavigation();
            },
            pagePrev: function (e) {
                e.preventDefault();
                this.collection.fetchPrevSet();
                return this.updateNavigation();
            }
        });
        return exports;
    }
);

