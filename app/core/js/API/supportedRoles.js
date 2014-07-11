define(['jquery.mockjax'], function () {
    if(debug) {
        $.mockjax({
            url: '/supports/roles*',
            responseTime: 250,
            responseText: {
                message: "",
                count: 7,
                data: [
                    "Developer",
                    "Designer",
                    "Engineer",
                    "Supervisor",
                    "Content Writer",
                    "Tester",
                    "Manager"
                ],
                pass: true
            }
        });
    }
});
