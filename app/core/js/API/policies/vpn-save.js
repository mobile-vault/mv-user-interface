define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/policies/company/1/vpn/1',
            type: 'PUT',
            responseTime: 250,
            responseText: {
                message: "",
                count: 7,
                data: {
                    _id: 1,
                    object_type: 'Company',
                    name: 'HugoMinds Technologies Pvt. Ltd.',
                    installed_vpns: [
                        {
                            vpn_name: 'Type 1',
                            vpn_type: 'PPTP',
                            server_address: '192.168.1.2',
                            ppp_encryption: false,
                            advanced_options: true,
                            dns_search_domains: 'google.com',
                            dns_servers: '192.136.2.1',
                            forwarding_routes: '10.0.0.1/8',
                            android: true,
                            iOS: true
                        },
                        {
                            vpn_name: 'Type 2',
                            vpn_type: 'L2TP/IPSecPSK',
                            server_address: '192.168.2.3',
                            l2tp_secret: 'abcdef',
                            ipsec_id: '',
                            ipsec_key: 'abcdef',
                            advanced_options: false,
                            dns_search_domains: '',
                            dns_servers: '',
                            forwarding_routes: '',
                            android: true,
                            iOS: true
                        },
                        {
                            vpn_name: 'Type 3',
                            vpn_type: 'L2TP/IPSecRSA',
                            server_address: '10.2.36.2',
                            l2tp_secret: 'abcde',
                            ipsec_user_certificate: '',
                            ipsec_ca_certificate: '',
                            ipsec_server_certificate: '',
                            advanced_options: false,
                            dns_search_domains: '',
                            dns_servers: '',
                            forwarding_routes: '',
                            android: true,
                            iOS: true
                        },
                        {
                            vpn_name: 'Type 4',
                            vpn_type: 'IPSecXauthPSK',
                            server_address: '',
                            ipsec_id: '',
                            ipsec_key: '',
                            advanced_options: false,
                            dns_search_domains: '',
                            dns_servers: '',
                            forwarding_routes: '',
                            android: true,
                            iOS: true
                        },
                        {
                            vpn_name: 'Type 5',
                            vpn_type: 'IPSecXauthRSA',
                            server_address: '10.56.69.98',
                            ipsec_user_certificate: '',
                            ipsec_ca_certificate: '',
                            ipsec_server_certificate: '',
                            advanced_options: true,
                            dns_search_domains: 'google.com',
                            dns_servers: '192.136.2.1',
                            forwarding_routes: '10.0.0.1/8',
                            android: true,
                            iOS: true
                        },
                        {
                            vpn_name: 'Type 6',
                            vpn_type: 'IPSecHybridRSA',
                            server_address: '10.23.69.58',
                            ipsec_ca_certificate: '',
                            ipsec_server_certificate: '',
                            advanced_options: true,
                            dns_search_domains: 'google.com',
                            dns_servers: '192.136.2.1',
                            forwarding_routes: '10.0.0.1/8',
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

