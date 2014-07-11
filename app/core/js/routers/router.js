define( ['jquery', 'underscore', 'backbone', 'app', "require"],
    function ($, _, Backbone, app, require) {
        'use strict';
        return Backbone.Router.extend({
            initialize: function() {
                this.on('route', this.updateFragments);
                return this;
            },
            show: function (options) {
                var that = this,
                    settings = $.extend({
                        hash: undefined,
                        title: '',
                        view: undefined,
                        viewOptions: {},
                        globalOptions: { bodyClass: '', mainClass: ''}
                    }, options);

                $("body").removeClass();
                $("body").addClass(settings.globalOptions.bodyClass);
                $("#main").removeClass();
                $("#main").addClass(settings.globalOptions.mainClass + " container");

                _.extend({}, Backbone.Events).trigger('domchange:title', settings.title);

                if ($.type(settings.view) === 'string') {
                    require([settings.view], function (myView) {
                        var view = new myView.View(settings.viewOptions);
                        that.displayView({View:view});
                    });
                } else if (settings.view instanceof Backbone.View) {
                    that.displayView({View: settings.view});
                }

                return this;
            },
            displayView: function (options) {
                var that = this, view;
                that.selector = options.selector || 'main';
                that.$selector = options.selector ? $(options.selector) : $('#main');
                if (this.currentView) {
                    this.currentView.close();
                }
                view = options.View;
                if(view instanceof Backbone.View) {
                    that.$selector.html(view.render().el);
                    this.currentView = view;
                }
                return this;
            },

            currentFragment: null,
            lastFragment: null,
            getCurrentFragment: function() {
                return this.currentFragment;
            },
            getLastFragment: function() {
              return this.lastFragment;
            },
            updateFragments: function(){
                    this.lastFragment = this.currentFragment;
                    this.currentFragment = Backbone.history.getFragment();
                    app.vent.trigger('navigation:main' , '#' + this.currentFragment || 'dashboard');
                    return this;
            },
            routes: {
//                'login'                         : require('./login'),
                '(/)'                             : 'toDashboard',//require('./index'),
                'home(/)'                         : 'showDashboard',
                'dashboard(/)'                    : 'showDashboard',
                'users(/)'                        : 'showUsers',
                'policies(/)'                     : 'showPolicies',
                'policies/:object/:id/:type(/)'   : 'showPolicies',
                'roles(/)'                        : 'showRoles',
                'teams(/)'                        : 'showTeams',
                'changepassword(/)'               : 'changePassword',
                /*'users/:type'                     : require('./users/index'),
                'users/:type/:id'                 : require('./users/index'),*/
                'users/installed/:id'             : 'showUsers', //require('./users/installed/index'),
                'users/not-installed/:id'         : 'showUsers', //require('./users/not-installed/index'),
                'users/deleted/:id'               : 'showUsers', //require('./users/deleted/index'),
                'users/profile/:id'               : 'showUsers', //require('./users/profile/index'),
                'users/add/:type(/)'              : 'addUsers', //require('./users/add/index'),
                'roles/:id'                       : 'showRoles', //require('./roles/index'),
                'roles/add(/)'                    : 'showRoles', //require('./roles/add/index'),
                'roles/profile/:id'               : 'showRoles', //require('./roles/profile/index'),
                'teams/:id'                       : 'showTeams', //require('./teams/index'),
                'teams/profile/:id'               : 'showTeams' //require('./teams/profile/index'),
                //'company/profile/:id'             : this.showTeams(), //require('./company/profile/index')
            },
            toDashboard: function () {
                this.navigate('dashboard', {trigger:true, replace: true});
            },
            showDashboard: function () {
                var that = this;
                require(['views/dashboard'],
                    function (Dashboard) {
                            var dashboard = new Dashboard.View({});
                            that.show({view:dashboard, title:"Dashboard"});
                    });
                return this;
            },
            showUsers: function (type, query) {
                var that = this;

                require(['app'],
                    function (app) {
                            var tab = _.isNull(type) ? 'all' : type;
                            that.show({
                                hash: '#users',
                                title: 'Users',
                                view: 'views/applications',
                                viewOptions: {
                                    query: $.type(query) === 'string' && query.length > 0 ? app.parseQuery(query) : {},
                                    tab: tab
                                }
                            });
                    });
            },
            addUsers: function(type) {
                var that = this;
                require(['app'],
                    function(app){
                        if(type === 'singleuser')
                        {
                            that.show({
                                title   : 'New User',
                                view    : 'views/newUserForm'
                            });
                        }
                        else if(type === 'bulkupload')
                        {
                            that.show({
                                title   : 'Bulk Upload',
                                view    : 'views/bulkUploader'
                            });
                        }
                    }
                )
            },

            showPolicies: function (object, id, type) {
                var that = this;
                require(['views/policies/policies'],
                    function (Policies) {
                            var policies = new Policies.View({object: object?object: 'company', id:id, type: type?type:'applications'});
                            that.show({view:policies, title:"Global Policies", globalOptions: { bodyClass: 'grey-body-bg', mainClass: 'no-padding'}});

                    });
            },
            showPolicy: function(type) {
                var that = this;
                if(type === 'vpn')
                {
                    require(['views/policies/policyViews/vpnProfileList'],
                        function (VPNProfileList) {
                            var vpnProfileList = new VPNProfileList.View({});
                            that.show({view: vpnProfileList, title:"Global Policies", globalOptions: { bodyClass: 'grey-body-bg', mainClass: 'no-padding'}});
                        }
                    );
                }
                else if(type === 'wifi')
                {
                    require(['views/policies/policyViews/wifiProfileList'],
                        function (WiFiProfileList) {
                            var wifiProfileList = new WiFiProfileList.View({});
                            that.show({view: wifiProfileList, title:"Global Policies", globalOptions: { bodyClass: 'grey-body-bg', mainClass: 'no-padding'}});
                        }
                    );
                }
            },

            showRoles: function (query) {
                var that = this;
                require(['app'],
                    function(app){
                            that.show({
                                hash: '#roles',
                                title: 'Roles',
                                view: 'views/roles',
                                viewOptions: {
                                    query: $.type(query) === 'string' && query.length > 0 ? app.parseQuery(query) : {}
                                }
                            });
                    }
                )
            },

            showTeams: function (query) {
                var that = this;
                require(['app'],
                    function(app){
                            that.show({
                                hash: '#teams',
                                title: 'Teams',
                                view: 'views/teams',
                                viewOptions: {
                                    query: $.type(query) === 'string' && query.length > 0 ? app.parseQuery(query) : {}
                                }
                            });
                    }
                )
            },
            changePassword: function () {
                var that = this;
                require(['views/changePassword'],
                    function (ChangePassword) {
                        var changePassword = new ChangePassword.View({});
                        that.show({view:changePassword, title:"ChangePassword"});
                    });
                return this;
            }
        });
    }
);