define(
    ['jquery', 'underscore', 'backbone', 'views/loading', 'exports', 'core/js/vent'],
    function ($, _, Backbone, loading, exports, Vent) {
        'use strict';
        var App = exports.App = {};
        _.extend(App, {
            rootElement: '#main',
            loading: loading,
            vent: Vent,
            policies: [
                { label: 'Applications', name: 'applications', className:'fa fa-tasks', url: 'applications' },
                { label: 'Hardware',name: 'hardware', className: 'fa fa-camera', url: 'hardware' },
                { label: 'Settings',name: 'settings', className: 'fa fa-gear', url: 'settings' },
                { label: 'Bluetooth', name: 'bluetooth', className:'fa fa-signal', url: 'bluetooth' },
                { label: 'Access', name: 'access', className: 'fa fa-shield', url: 'access' },
                { label: 'Wi-Fi', name: 'wifi', className: 'fa fa-signal', url: 'wifi' },
                { label: 'VPN', name: 'vpn', className: 'fa fa-lock', url: 'vpn'},
                { label: 'Actions', name: 'actions', className:'fa fa-check-square', url: 'actions'}
            ],
            parseQuery: function (query, coerce) {
                var params = {},
                    coerce_types = {'true': true, 'false': false, 'null': null},
                    decode = decodeURIComponent;

                _.each(query.split('&'), function (param) {
                    param = param.split('=');
                    var key = decode(param[0]),
                        val = decode(param[1]);
                    if (coerce || $.type(coerce) === "undefined") {
                        if ($.isNumeric(val)) {
                            val = +val;
                        } else if (val === "undefined") {
                            val = undefined;
                        } else if (coerce_types[val] !== undefined) {
                            val = coerce_types[val];
                        }
                    }
                    params[key] = val;
                });

                return params;
            },
            show: function (view) {
                this.close();
                $(this.rootElement).html(view.$el);
                this.currentView = view;
                return this;
            },
            close: function () {
                if (this.currentView) {
                    this.currentView.close();
                }
                return this;
            }
        });

        return App;
    }
);
