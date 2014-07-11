define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/policies/company/1/access',
            dataType: 'json',
            type: 'GET',
            status: 200,
            responseTime: 250,
            responseText: {
                message: "",
                count: 20,
                data: {
                    _id: 1,
                    object_type: 'Company',
                    name: 'HugoMinds Technologies Pvt. Ltd.',
                    enable_change_settings: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_screen_capture: {
                        value: true,
                        android: true,
                        iOS: true
                    },
                    enable_factory_reset: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_usb_debugging: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    enable_admin_mode: {
                        value: true,
                        android: true,
                        iOS: false
                    },
                    allow_cloud_backup: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    allow_cloud_document_sync: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    allow_adding_game_center_friends: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    allow_global_background_fetch_when_roaming: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    force_itunes_store_password_entry: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    force_encrypted_backups: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    allow_multi_player_gaming: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    allow_photo_stream: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    allow_voice_dialing: {
                        value: true,
                        android: false,
                        iOS: true
                    },
                    allow_video_conferencing: {
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

