define(
    ['jquery', 'underscore', 'app' , 'views/templateView', 'bootstrap.dropdown', 'bootstrap.collapse', 'text!template/pageHeader.html'],
    function ($, _, app, TemplateView, DropDown, Collapse, HeaderTemplate) {
        'use strict';
        var PageHeader = {};
        PageHeader.View = TemplateView.extend({
            template: _.template(HeaderTemplate),
            initialize: function (options) {
                this.options = options;
                this.vent = app.vent;
                return this;
            },
            setActive: function (hash) {
                var lastFragment =  app.router.lastFragment || "#dashboard",
                    lastHash = lastFragment.match(/[^\/]*/)[0],
                    hash = hash.match(/[^\/]*/)[0];

                $(".custom-nav li a[data-id=#" + lastHash + "]").parent('li').removeClass('active');
                $(".custom-nav li a[data-id=" + hash + "]").parent('li').addClass('active');
                return this;
            }, render : function () {
                TemplateView.prototype.render.apply(this, arguments);
                this.listenTo(this.vent, "navigation:main", this.setActive);
                return this;
            }
        });
        return PageHeader;
    }
);