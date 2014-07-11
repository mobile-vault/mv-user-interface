define(
    ['views/view'],
    function (View) {
        'use strict';
        var viewOptions = ['template'];
        return View.extend({
            constructor: function (options) {
                if (_.isObject(options)) {
                    _.extend(this, _.pick(options, viewOptions));
                }
                View.prototype.constructor.apply(this, arguments);
                return this;
            },

            template: undefined,

            render: function () {
                this.isClosed = false;
                if (_.isFunction(this.template)) {
                    var data = this.getData(),
                        html = this.template(data);
                    this.$el.html(html);
                } else {
                    var error = new TypeError('Template is not a function');
                    error.name = 'TemplateNotFunction';
                    throw error;
                }
                // Base view does not have a render method
                return this;
            },

            getData: function () {
                var data = {};
                if (this.model instanceof Backbone.Model) {
                    data = this.model.toJSON();
                } else if (this.collection instanceof Backbone.Collection) {
                    data.items = this.collection.toJSON();
                }
                return data;
            }
        });
    }
);
