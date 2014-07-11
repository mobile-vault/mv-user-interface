/**
 * Created with JetBrains WebStorm.
 * User: ankitkhatri
 * Date: 22/02/14
 * Time: 2:30 AM
 * To change this template use File | Settings | File Templates.
 */

define(['jquery', 'underscore', 'backbone', 'crel', 'app', 'views/templateView', 'text!template/device-lock.html'],
    function ($, _, Backbone, crel, App, TemplateView, deviceLockTemplate) {
        var exports = {};
        exports.View = TemplateView.extend({
            template: _.template(deviceLockTemplate),
            events: {
                'click .device-lock-btn'          :   'deviceLockRequest',
                'change #deviceType'              :   'deviceTypeChanged'
            },
            initialize: function (options) {
                this.options = options;
                this.activePolicy = options.activePolicy;
                this.object = options.object;
                this.objectId = options.objectId;
                this.lock_key = '';
                return this;
            },
            deviceTypeChanged: function (event) {
                var currentDeviceOS = $(event.currentTarget).val();
                if(currentDeviceOS == 'Android') {
                    this.$('#lockKey').removeAttr('disabled');
                } if(currentDeviceOS == 'iOS') {
                    this.$('#lockKey').attr('disabled','disabled');
                }
                return this;
            },
            validateText: function() {
                var val = this.$('#lockKey').val();
                if(typeof +val != 'number') {
                    alert('Please enter a number as the key');
                    return false;
                }
                this.lock_key = val;
                return true;
            },
            deviceLockRequest: function(event) {

                if(this.validateText()) {
                    console.log(this.lock_key);
                var deviceLockData = {
                    'action': $(event.currentTarget).attr('name'),
                    'lock_key': this.lock_key
                };
                $.ajax({
                    type: 'PUT',
                    url: '/policies/' + this.object + '/' + this.objectId + '/' + this.activePolicy,
                    dataType: 'json',
                    success: function (response) {
                        App.vent.trigger('closeDeviceLockModal');
                    },

                    data: JSON.stringify(deviceLockData)
                });
                return this;
            }
            }
        });
        return exports;
    }
);