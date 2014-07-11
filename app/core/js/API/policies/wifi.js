define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/policies/company/1/wifi',
            type: 'GET',
            responseTime: 250,
            responseText: {
                message: "",
                count: 7,
                data: {
                    _id: 1,
                    object_type: 'Company',
                    name: 'HugoMinds Technologies Pvt. Ltd.',
                    installed_wifis: [
                        {
                            ssid: "Atul",
                            wifi_security: "None",
                            auto_join: false,
                            hidden_network: false,
                            android: true,
                            iOS: true
                        },
                        {
                            ssid: "popli",
                            wifi_security: "WEP",
                            password: "abcdefg",
                            auto_join: false,
                            hidden_network: false,
                            android: true,
                            iOS: true
                        },
                        {
                            ssid: "ravi",
                            wifi_security: "PSK",
                            password: "OkCool",
                            auto_join: false,
                            hidden_network: false,
                            android: true,
                            iOS: true
                        }
                    ]
                },
                pass: true
            }
        });
    }
});

