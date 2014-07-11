define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'views/policies/policyMenu', 'text!template/policies.html','backbone.relational'],
    function ($, _, Backbone, crel, App, TemplateView, PolicyMenu, policiesTemplate) {
        var exports = {};
        exports.Collection = Backbone.Collection.extend({
            model: PolicyMenu.Model
        });

        exports.View = TemplateView.extend({
            tagName: 'div',
            initialize: function (options) {
                this.options = options;
                this.activePolicy = options.type;
                this.object = options.object;
                this.objectId = options.id?options.id: App.companyID;
                this.collection = new exports.Collection(App.policies);
                this.vent = App.vent;
                this.listenTo(this.vent, 'navigation:sidebar', this.setActive);
                this.listenTo(this.vent, 'policies:content', this.setPolicyContent);
            },
            template: _.template(policiesTemplate),
            events: {
                'click #policies-sidebar li a': 'updateContent'
            },
            render: function () {

                var that = this, template = this.template();
                this.$el.html(template);
                this.$el.find('#policies-sidebar').empty();
                _.each(this.collection.models, function (item) {
                    that.renderMenu(item);
                }, this);
                this.vent.trigger('navigation:sidebar', '/policies/'+ this.object+ "/" + this.objectId + "/", this.activePolicy );
                this.vent.trigger('policies:content', {name: this.activePolicy, url: '/policies/' + this.object+ "/" + this.objectId + "/" + this.activePolicy});
                return this;
            },
            updateContent: function (event) {
                var that = this,
                    menuView = $(event.currentTarget).parent().data('view');
                event.preventDefault();
                if (menuView instanceof Backbone.View) {
                    var activeMenuUrl = menuView.model.get('url'),
                        activePolicyViewName = menuView.model.get('name'),
                        payload = {name: activePolicyViewName, url: '/policies/'+ this.object+ "/" + this.objectId + "/" + activeMenuUrl};
                    this.vent.trigger('navigation:sidebar', '/policies/'+ this.object+ "/" + this.objectId + "/" , activeMenuUrl);
                    this.vent.trigger('policies:content', payload);
                }
                return this;
            },
            renderMenu: function (item) {
                var PolicyMenuView = new PolicyMenu.View({
                    model: item
                });
                this.$el.find('#policies-sidebar').append(PolicyMenuView.render().el);
            },
            setActive: function (baseUrl, url) {
                _.each(this.collection.models, function (model) {
                    model.set('active', model.get('url') === url);
                });
                this.activePolicy = this.collection.where({'active':true})[0].get('name');
                App.router.navigate('policies/'+ this.object+ "/" + this.objectId + "/" + this.activePolicy);
                return this;
            },
            setPolicyContent: function (payload) {
                var that = this;
                Backbone.Relational.store.reset();
                if(that.$('.sidebar-tab-content > div').length) {
                    that.$('.sidebar-tab-content > div').data('view').close();
                }

                require(['views/policies/policyViews/' + payload.name], function (PolicyView) {
                    Backbone.Relational.store.addModelScope(PolicyView);
                    var policiesView = that,
                        options = {
                        object: policiesView.object,
                        objectId: policiesView.objectId,
                        activePolicy: policiesView.activePolicy
                    };
                    var PolicyView = new PolicyView.View(options);
                    PolicyView.model.urlRoot =  payload.url;
                    that.$('.sidebar-tab-content').html(PolicyView.render().el);
                });
            }

        });

        return exports;

    }
);