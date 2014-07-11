define(['jquery.mockjax'], function () {
    if(debug) {
        $.mockjax({
            url: '/dashboard/devices',
            responseTime: 250,
            responseText: {
                message: "",
                data: [
                    {
                        y: 55.5,
                        drilldown: {
                            data: [
                                5.6,
                                4.4,
                                7.3,
                                12.7,
                                5.5,
                                4.5,
                                1.5,
                                8.5,
                                5
                            ],
                            name: "iOS",
                            categories: [
                                "5.0",
                                "4.0",
                                "5.6",
                                "7.0",
                                "3.1",
                                "4.4",
                                "6.0",
                                "6.1.3",
                                "6.4"
                            ]
                        }
                    },
                    {
                        y: 44.5,
                        drilldown: {
                            data: [
                                9.5,
                                5.5,
                                10.5,
                                8.5,
                                4.0,
                                6.5

                            ],
                            name: "Android",
                            categories: [
                                "2.3",
                                "3.0",
                                "4.0",
                                "4.1",
                                "4.2",
                                "4.3",
                                "4.4"
                            ]
                        }
                    }
                ],
                pass: true
            }
        });
    }
});