define(
    ['jquery', 'underscore', 'backbone', 'reports/report'],
    function ($, _, Backbone, reports) {
        'use strict';
        var exports = {};
        exports.View = reports.View.extend({});

        var template = {
            rows: [
                {
                    rowHeight: 3,
                    columnCount: 1,
                    columns: [
                        {
                            moduleName: 'views/charts/chartWrapper',
                            moduleJSON: {
                                type: 'pie',
                                URL: '/dashboard/devices',
                                APIName: 'Number of Enrolled Devices',
                                chartOptions: {
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
                                    },
                                    colors: ['#918186', '#FA2A00', '#F9C65E'],
                                    plotoptions:{
                                        pie:{
                                            colors: ['#918186', '#FA2A00', '#F9C65E']
                                        }
                                    }
                                }
                            },
                            moduleSpan: 6
                        },
                        {
                            moduleName: 'views/charts/chartWrapper',
                            moduleJSON: {
                                type: 'pie',
                                URL: '/dashboard/enrollment',
                                APIName: 'Enrollment Status',
                                chartOptions: {
                                    colors: ['#918186', '#FA2A00', '#F9C65E'],
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
                                    }
                                }
                            },
                            moduleSpan: 6
                        }
                    ]
                },
                {
                    rowHeight: 0,
                    columns: [
                        {
                            moduleName: 'views/dashboard/violations',
                            moduleJSON: {
                                source: '/dashboard/violations',
                                keys: ['user_name', 'user_role', 'user_team','time_stamp'],
                                otherKeys: ['user_id', 'user_device_os', 'user_device'],
                                columnNames: ['User Name', 'Roles', 'Teams', 'Timestamp'],
                                className: ['col-xs-3', 'col-xs-3', 'col-xs-3', 'col-xs-3 alignRight'],
                                showFooter: true,
//                                    link: '#patches/os/',
//                                    linkKey: 'app_id',
                                title: 'Latest Violations'
                            },
                            moduleSpan: 6
                        },
                        {
                            moduleName: 'views/dashboard/sessions',
                            moduleJSON: {
                                source: '/dashboard/sessions',
                                keys: ['username', 'ip', 'user_agent', 'created_on'],
                                columnNames: ['User Name', 'IP Address', 'User-Agent', 'Timestamp',],
                                className: ['col-xs-3', 'col-xs-3',  'col-xs-3', 'col-xs-3 alignRight'],
                                showFooter: true,
//                                    link: '#patches/os/',
//                                    linkKey: 'app_id',
                                title: 'Last Login'
                            },
                            moduleSpan: 6
                        }
                    ]
                },
                {
                    rowHeight: 3,
                    columnCount: 1,
                    columns: [
                        {
                            moduleName: 'views/dashboard/logs',
                            moduleJSON: {
                                url: '/dashboard/logs'
                            },
                            moduleSpan: 12
                        }
                    ]
                },
                {
                    rowHeight: 3,
                    columnCount: 1,
                    columns: [
                        {
                            moduleName: 'views/broadcast',
                            moduleJSON: {
                                url: '/dashboard/postmessage'
                            },
                            moduleSpan: 12
                        }
                    ]
                }

            ]
        };

        _.extend(exports.View.prototype, {
            model: reports.View.prototype.deserialize(template)
        });

        return exports;
    }
);