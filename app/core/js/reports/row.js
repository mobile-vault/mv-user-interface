define(
    ['jquery', 'underscore', 'backbone', 'views/view', 'crel', 'reports/column'],
    function ($, _, Backbone, view, crel, column) {
        'use strict';

        var exports = {};

        exports.Model = Backbone.Model.extend({});
        exports.View = view.extend({});


        _.extend(exports.Model.prototype, {
            defaults: {
                rowHeight: 3,
                columnCount: 1,
                columns: Backbone.Collection.extend({
                    model: column.Model
                })
            }
        });

        _.extend(exports.View.prototype, {
            className: 'row',
            tagName: 'div',
            moduleName: 'row',
            initialize: function () {
//                this.subViews = [];
                if (_.isUndefined(this.model)) {
                    this.model = new exports.Model();
                }
               /* if (!_.isBoolean(this.options.editable)) {
                    this.options.editable = false;
                }*/
                this.rowHeight = this.model.get('rowHeight');
                return this.setHeight();
            },
            render: function () {
                var columns = this.model.get('columns'),
                    $el = this.$el,
                    that = this;
                if ($el.children().length === 0) {
                    $el.html(this.layout(columns));
                    this.$('.column').each(function () {
                        var $this = $(this),
                            cid = $this.data('cid'),
                            column = columns.get(cid);
                        that.renderColumn($this, column);
                    });
                }
                return this;
            },
            layout: function (columns) {
                var fragment,
                    that = this;
                fragment = document.createDocumentFragment();
                columns.each(function (model) {
                    var col = model.get('moduleSpan');
                    fragment.appendChild(
                        that.layoutColumn(col, model.cid)
                    );
                });
                return fragment;
            },
            layoutColumn: function (col, cid) {
                return crel('div', {class: 'column', 'data-cid': cid});
            },
            renderColumn: function ($el, model) {
                var columnView = new column.View({
                    el: $el,
                    model: model
//                    editable: this.options.editable
                });
//                this.addSubViews(columnView);
                return columnView.render().loadModule();
            },
            setHeight: function (height) {
                if (height instanceof exports.Model) {
                    height = height.get('rowHeight');
                }
                height = (height || this.rowHeight).toString().trim();
                var $el = this.$el,
                    spanNum = /^rowHeight[1-9][0-2]{0,1}$/,
                    numeric = /^[1-9][0-2]{0,1}$/;
                if (spanNum.test(height)) {
                    $el.removeClass(this.rowHeight)
                        .addClass(this.rowHeight = height);
                } else if (numeric.test(height)) {
                    $el.removeClass(this.rowHeight)
                        .addClass(this.rowHeight = 'rowheight' + height);
                } else {
                    $el.removeClass(this.rowHeight);
                    this.rowHeight = '';
                }
                return this;
            }
        });
        return exports;
    }
);
