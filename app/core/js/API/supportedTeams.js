define(['jquery.mockjax'], function () {
    if(debug) {
        $.mockjax({
            url: '/supports/teams*',
            responseTime: 250,
            responseText: {
                message: "",
                count: 7,
                data: [
                    "Team1",
                    "Team2",
                    "Team3",
                    "Team4",
                    "Team5",
                    "Team6",
                    "Team7"
                ],
                pass: true
            }
        });
    }
});
