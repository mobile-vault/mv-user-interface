/**
 * Created by Ankit on 2/2/14.
 */
define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/view'],
    function($, _, Backbone, crel, App, View) {
        var exports = {};
        exports.Collection = Backbone.Collection.extend({

        });

        exports.View = View.extend({
            initialize: function(options) {
               this.options = options;
               this.collection = new exports.Collection();
            }
        })

    }
);