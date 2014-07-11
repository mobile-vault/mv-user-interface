define(['jquery.mockjax'], function () {
    if(debug) {
        $.mockjax({
            url: '/pre_enroll',
            responseTime: 250,
            responseText: {
                data: {
                    roles: [
                        {
                            role: "Developer",
                            role_id: "1"
                        },
                        {
                            role: "Designer",
                            role_id: "2"
                        },
                        {
                            role: "Engineer",
                            role_id: "3"
                        },
                        {
                            role: "Supervisor",
                            role_id: "4"
                        },
                        {
                            role: "ContentWriter",
                            role_id: "5"
                        },
                        {
                            role: "Tester",
                            role_id: "6"
                        },
                        {
                            role: "Manager",
                            role_id: "7"
                        }
                    ],
                    teams: [
                        {
                            team_id: "1",
                            team: "Team1"
                        },
                        {
                            team_id: "2",
                            team: "Team2"
                        },
                        {
                            team_id: "3",
                            team: "Team3"
                        },
                        {
                            team_id: "4",
                            team: "Team4"
                        },
                        {
                            team_id: "5",
                            team: "Team5"
                        },
                        {
                            team_id: "6",
                            team: "Team6"
                        },
                        {
                            team_id: "7",
                            team: "Team7"
                        }
                    ]},
                pass: true
            }
        });
    }
});

