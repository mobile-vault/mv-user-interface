/**
 * Created with JetBrains WebStorm.
 * User: ankitkhatri
 * Date: 27/01/14
 * Time: 4:48 PM
 * To change this template use File | Settings | File Templates.
 */


define(['jquery.mockjax'], function () {
    if(debug) {
        $.mockjax({
            url: '/policies/restrictions/browser',
            responseTime: 250,
            responseText: {
                message: "",
                data: [
                    {
                        label: "Enable Auto Fill",
                        name: "enable_auto_fill",
                        value: true
                    },
                    {
                        label: "Force Fraud Warning",
                        name: "force_fraud_warning",
                        value: true
                    },
                    {
                        label: "Enable JS",
                        name: "enable_js",
                        value: true
                    },
                    {
                        label: "Block Pop Ups",
                        name: "block_pop_ups",
                        value: true
                    },
                    {
                        label: "Accept Cookies",
                        name: "accept_cookies",
                        value: true
                    }
                ],
                pass: true
            }
        });
    }
});
