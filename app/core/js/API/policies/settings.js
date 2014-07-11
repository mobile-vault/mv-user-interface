define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/policies/company/1/settings',
            type: 'GET',
            responseTime: 250,
            responseText: {
                message: "",
                count: 20,
                data: {
                    _id: 1,
                    object_type: 'Company',
                    name: 'HugoMinds Technologies Pvt. Ltd.',
                    enable_background_data: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_backup: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_clipboard: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_google_crash_report: {
                        value: true,
                        android: true,
                        iOS: true
                    },
                    enable_data_roaming: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_push_roaming: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_sync_roaming: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_voice_roaming: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    allow_explicit_content: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    allow_untrusted_tls_prompt: {
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

