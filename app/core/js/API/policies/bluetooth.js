define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/policies/company/1/bluetooth',
            type: 'GET',
            responseTime: 250,
            responseText: {
                message: "",
                data: {
                    _id: 1,
                    object_type: 'Company',
                    name: 'HugoMinds Technologies Pvt. Ltd.',
                    bluetooth_status: {
                        enable_bluetooth: true,
                        power_status: false,
                        android: true,
                        iOS: true
                    },
                    white_listed_pairings: [
                        {
//                        bluetooth_id: 1,
                            bluetooth_name: 'ravi',
                            bluetooth_cod: 1,
                            bluetooth_uuid: 45,
                            bluetooth_pairing: true,
                            android: true,
                            iOS: true
                        },
                        {
//                        bluetooth_id: 2,
                            bluetooth_name: 'popli',
                            bluetooth_cod: 3,
                            bluetooth_uuid: 67,
                            bluetooth_pairing: true,
                            android: true,
                            iOS: true
                        },
                        {
//                        bluetooth_id: 3,
                            bluetooth_name: 'aman',
                            bluetooth_cod: 5,
                            bluetooth_uuid: 88,
                            bluetooth_pairing: true,
                            android: true,
                            iOS: true
                        },
                        {
//                        bluetooth_id: 4,
                            bluetooth_name: 'ravi',
                            bluetooth_cod: 7,
                            bluetooth_uuid: 32,
                            bluetooth_pairing: true,
                            android: true,
                            iOS: true
                        }
                    ],
                    black_listed_pairings: [
                        {
//                        bluetooth_id: 7,
                            bluetooth_name: 'jkjdg',
                            bluetooth_cod: 3,
                            bluetooth_uuid: 55,
                            bluetooth_pairing: true,
                            android: true,
                            iOS: true
                        },
                        {
//                        bluetooth_id: 9,
                            bluetooth_name: 'uyhkjn',
                            bluetooth_cod: 2,
                            bluetooth_uuid: 75,
                            bluetooth_pairing: true,
                            android: true,
                            iOS: true
                        },
                        {
//                        bluetooth_id: 6,
                            bluetooth_name: 'nnckd',
                            bluetooth_cod: 7,
                            bluetooth_uuid: 53,
                            bluetooth_pairing: true,
                            android: true,
                            iOS: true
                        },
                        {
//                        bluetooth_id: 5,
                            bluetooth_name: 'jkjdg',
                            bluetooth_cod: 4,
                            bluetooth_uuid: 98,
                            bluetooth_pairing: true,
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

