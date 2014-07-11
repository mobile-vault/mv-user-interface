define(['backbone', 'core/js/API/login'],
    function (Backbone) {
        'use strict';
        return Backbone.Model.extend({
            defaults: {
                username: 'Mr MDM'
            },
            url: '/admin',        //Currently using mockjax http://192.168.2.150:8888/admin
//            url: 'http://192.168.2.33:2000/',
            parse: function (response) {
                this.apiMessage = response.message;
                this.apiPass = response.pass;
                return response.data;
            },
            hasPermission: function (userType) {
                return _.indexOf(this.get('permissions'), userType) !== -1;
            }
        });
    }
);