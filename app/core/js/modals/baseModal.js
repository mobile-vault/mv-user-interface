define(
    ['jquery', 'underscore', 'backbone', 'crel', 'views/view', 'bootstrap.modal'],
    function ($, _, Backbone, crel, View, BootstrapModal) {
        'use strict';
        return {
            View: View.extend({
                className: 'modal fade',
                id: '',
                _opened: false,

                // Variables that affect bootstrap-modal functionality
                animate: false,
                keyboard: true,
                backdrop: true,

                // Variables that affect the modal itself
                col: '', // Leave blank for default bootstrap width
                /*buttons: [
                    {
                        text: 'Done',
                        action: 'close',
                        className: 'btn-primary col-lg-2 col-md-2 col-sm-2 col-xs-2',
                        position: 'right'
                    }
                ],*/

                // White list of variables and function that are allowed to be set during init
                _allowed: ['animate', 'keyboard', 'backdrop', 'col', 'buttons', 'confirm', 'cancel'],

                events: {
                    'click [data-action=confirm]': function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        this.confirm();
                    },
                    'click [data-action=cancel]': function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        this.cancel();
                    },
                    'click [data-action=close]': function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        this.hide();
                    },
                    'hidden': function () {
                        this._opened = false;
                        this.close();
                    }
                },

                initialize: function (options) {
                    var $el = this.$el;

                    if (options) {
                        _.extend(this, _.pick(options, this._allowed));
                    }

                    this.render().setCol();

                    if (this.animate) {
                        $el.addClass('fade');
                    }

                    return this;
                },

                beforeRender: $.noop,
                onRender: $.noop,

                // Set up the modal DOM, but do not show it in browser
                render: function () {
                    if (this.beforeRender !== $.noop) { this.beforeRender(); }

                    var $el = this.$el,
                        $body = $el.find('.modal-body');

                    if ($body.length === 0) {
                        this.layout().renderButtons();
                    }

                    if (this.onRender !== $.noop) { this.onRender(); }

                    return this;
                },

                layout: function () {
                    var baseTemplate = document.createDocumentFragment();
                    baseTemplate.appendChild(
                        crel('div', {'class': 'modal-dialog'},
                            crel('div', {'class': 'modal-content no-border-radius'},
                                crel('div', {'class': 'modal-header'}),
                                crel('div', {'class': 'modal-body'}),
                                crel('footer', {'class': 'modal-footer custom-modal-footer'})
                            )
                        )
                    );
                    this.$el.html(baseTemplate);

                    return this;
                },

                renderButtons: function () {
                    if (_.isArray(this.buttons) && this.buttons.length > 0) {
                        var buttons = {
                                left: [],
                                right: []
                            },
                            footer = this.$('.modal-footer');
                        _.each(this.buttons, function (button) {
                            var attributes = { 'class': 'btn' },
                                text = _.isUndefined(button.text) ? 'undefined' : button.text;
                            if (_.isString(button.className)) {
                                attributes['class'] = [attributes['class'], button.className].join(' ');
                            }
                            if (_.isString(button.action)) {
                                attributes['data-action'] = button.action;
                            }
                            if (_.isString(button.style)) {
                                attributes.style = button.style;
                            }
                            buttons[button.position || 'left'].push(crel('button', attributes, text));
                        });

                        if (buttons.left.length > 0) {
                            var options = {};
                            if (buttons.right.length > 0) {
                                options.class = 'pull-left';
                            }
                            footer.append(crel.apply(this, _.flatten(['div', options, buttons.left], true)));
                        }

                        if (buttons.right.length > 0) {
                            footer.append(crel.apply(this, _.flatten(['div', {'class': 'pull-right'}, buttons.right], true)));
                        }
                    }

                    return this;
                },

                // --------------------------------------------------------------------------------
                // Methods for HTML content
                // --------------------------------------------------------------------------------
                openWithHTML: function () {
                    this.setContentHTML(arguments);
                    if (!this.isOpen()) {
                        this.open();
                    }
                    return this;
                },

                setContentHTML: function (content) {
                    this.closeContentView();
                    this.$('.modal-body').empty().html(content);
                    return this;
                },

                setHeaderHTML: function (content) {
                    this.$('.modal-header').empty().html(content);
                    return this;
                },

                // --------------------------------------------------------------------------------
                // Methods for Backbone.View content
                // --------------------------------------------------------------------------------
                openWithView: function (view) {
                    this.setContentView(view);
                    if (!this.isOpen()) {
                        this.open();
                    }
                    return this;
                },

                setContentView: function (view) {
                    var that = this,
                        modalBody = this.$('.modal-body');
                    this.closeContentView();

                    if (view instanceof Backbone.View) {
                        this._contentView = view;
                        this._contentView
                            .render()
                            .delegateEvents();
                        modalBody.empty().html(this._contentView.el);
                    } else if ($.type(view) === 'string') {
                        require([view], function (loaded) {
                            that._contentView = new loaded.View();
                            that._contentView
                                .render()
                                .delegateEvents();
                            modalBody.empty().html(that._contentView.el);
                        });
                    }

                    return this;
                },

                closeContentView: function () {
                    if (!_.isUndefined(this._contentView)) {
                        this._contentView.close();
                        this._contentView = undefined;
                    }
                    return this;
                },

                // --------------------------------------------------------------------------------
                // Modal utility methods
                // --------------------------------------------------------------------------------
                isOpen: function () {
                    return this._opened;
                },

                // Show the modal in browser
                open: function () {
                    var $el = $(this.el);
                    if (!this.isOpen()) {
                        this.delegateEvents();

                        if (!_.isUndefined(this._contentView)) {
                            this._contentView.delegateEvents();
                        }

                        // Set bootstrap modal options
                        $el.modal({
                            keyboard: this.keyboard,
                            backdrop: this.backdrop
                        });

                        this._opened = true;
                    }

                    return this;
                },

                hide: function () {
                    this.$el.modal('hide');
                    return this;
                },
                cancel: function () {
                    return this.hide();
                },
                confirm: function () {
                    return this.hide();
                },

                // optional: col
                // Not fully tested for every case
                setCol: function (col) {
                    var $el = this.$el,
                        colNum = /^col-lg-[1-9][0-2]{0,1} col-md-[1-9][0-2]{0,1} col-sm-[1-9][0-2]{0,1} col-xs-[1-9][0-2]{0,1} $/,
                        numeric = /^[1-9][0-2]{0,1}$/;

                    col = (col || this.col).trim();

                    if (colNum.test(col)) {
                        $el.removeClass(this.col)
                            .addClass(this.col = col);
                    } else if (numeric.test(col)) {
                        $el.removeClass(this.col)
                            .addClass(this.col = 'col-lg-' + col + ' col-md-' + col + ' col-sm-' + col + ' col-xs-' + col);
                    } else {
                        $el.removeClass(this.col);
                        this.col = '';
                    }

                    return this;
                },

                beforeClose: function () {
                    if (this.isOpen()) {
                        this.hide();
                    }
                    this.closeContentView();
                }
            })
        };
    }
);
