define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/policies/company/1/applications',
            type: 'GET',
            responseTime: 250,
            responseText: {
                message: "",
                count: 20,
                data: {
                    _id: 1,
                    object_type: 'Company',
                    name: 'HugoMinds Technologies Pvt. Ltd.',
                    installed_apps: [

                    ],
                    removed_apps: [

                    ],
                    blacklisted_apps: [

                    ],
                    youtube_enable: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    playstore_enable: {
                        value: true,
                        android: true,
                        iOS: true
                    },
                    browser_settings: {
                        enable_autofill: false,
                        enable_javascript: true,
                        enable_cookies: true,
                        enable_popups: false,
                        force_fraud_warnings: false,
                        enable_http_proxy: true,
                        http_proxy_value: "127.0.0.1",
                        android: true,
                        iOS: true
                    },
                    enable_recording: {
                        value: false,
                        android: true,
                        iOS: false
                    },
                    allow_app_installation: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    allow_in_app_purchases: {
                        value: true,
                        android: true,
                        iOS: true
                    },
                    itunes_enable: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    siri_enable: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    safari_enable: {
                        value: true,
                        android: false,
                        iOS: true
                    }
                },
                pass: true
            }
        });
    }
});
