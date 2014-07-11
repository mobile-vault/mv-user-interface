define(['jquery.mockjax'], function () {
    if(debug) {
        $.mockjax({
            url: '/supports/operating_system*',
            responseTime: 250,
            responseText: {
                message: "",
                count: 2,
                data: [
                    "Android",
                    "iOS"
                ],
                pass: true
            }
        });
    }
});
