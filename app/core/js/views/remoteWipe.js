/**
 * Created with JetBrains WebStorm.
 * User: ankitkhatri
 * Date: 22/02/14
 * Time: 2:30 AM
 * To change this template use File | Settings | File Templates.
 */

define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'text!template/remote-wipe.html'],
    function ($, _, Backbone, crel, App, TemplateView, remoteWipeTemplate) {
        var exports = {};
        exports.View = TemplateView.extend({
            template: _.template(remoteWipeTemplate),
            events: {
                'click .remote-wipe-btn'          :   'remoteWipeRequest',
                'keyup input[name=confirm-text]'  :   'validateText'
            },
            initialize: function (options) {
                this.options = options;
                this.activePolicy = options.activePolicy;
                this.object = options.object;
                this.objectId = options.objectId;
                return this;
            },
            validateText: function(event) {
                var val = this.$('input[name=confirm-text]').val();
                if(val === 'REMOTE WIPE') {
                    this.$('.remote-wipe-btn').removeClass('disabled');
                } else {
                    this.$('.remote-wipe-btn').addClass('disabled');
                }
                return this;
            },
            remoteWipeRequest: function(event) {
                var remoteWipeData = {
                    'action': $(event.currentTarget).attr('name')
                };
                $.ajax({
                    type: 'PUT',
                    url: '/policies/' + this.object + '/' + this.objectId + '/' + this.activePolicy,
                    dataType: 'json',
                    data: JSON.stringify(remoteWipeData),
                    success: function (response) {
                        App.vent.trigger('closeRemoteWipeModal');
                    }
                });
            }
        });
        return exports;
    }
);