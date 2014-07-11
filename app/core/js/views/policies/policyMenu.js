/**
 * Created with JetBrains WebStorm.
 * User: ankitkhatri
 * Date: 06/02/14
 * Time: 3:43 PM
 * To change this template use File | Settings | File Templates.
 */

define(
    ['jquery', 'underscore', 'backbone', 'views/templateView', 'text!template/policy-menu.html'],
    function ($, _, Backbone, TemplateView, PolicyMenuTemplate) {
        "use strict";
        return {
            Model: Backbone.Model.extend({
                defaults: {
                    active: false
                }
            }),
            View: TemplateView.extend({
                tagName: "li",
                className: "",
                template: PolicyMenuTemplate,
                initialize: function () {
                    this.listenTo(this.model, 'change:active', this.setActive);
                },
                render: function () {
                    var tmpl = _.template(this.template);
                    $(this.el).html(tmpl(this.model.toJSON())).toggleClass('active', this.model.get('active'));
                    return this;
                },
                setActive: function () {
                    $(this.el).toggleClass('active', this.model.get('active'));
                }
            })
        };
    }
);
