define(['jquery.mockjax'], function () {
    if(debug) {
        $.mockjax({
            url: '/dashboard/enrollment',
            responseTime: 250,
            responseText: {
                message: "",
                data: {
                    UserInformation: {
                        Violations: 7,
                        "Total Users": 50,
                        "Not Enrolled": 3,
                        Enrolled: 40
                    }
                },
                pass: true
            }
        });
    }
});