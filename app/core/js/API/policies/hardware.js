define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/policies/company/1/hardware',
            type: 'GET',
            responseTime: 250,
            responseText: {
                message: "",
                count: 20,
                data: {
                    _id: 1,
                    object_type: 'Company',
                    name: 'HugoMinds Technologies Pvt. Ltd.',
                    enable_camera: {
                        value: true,
                        android: true,
                        iOS: true
                    },
                    enable_external_storage_encryption: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_internal_storage_encryption: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_microphone: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_android_beam: {
                        value: true,
                        android: true,
                        iOS: false
                    }
                },
                pass: true
            }
        });
    }
});

