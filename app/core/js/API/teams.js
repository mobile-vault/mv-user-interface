define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/teams',
            type: 'GET',
            responseTime: 250,
            responseText: {
                message: "",
                count: 10,
                data: [
                    {
                        team_type: 'Team1',
                        team_name: 'team1',
                        team_id: 1
                    },
                    {
                        team_type: 'Team2',
                        team_name: 'team2',
                        team_id: 2
                    },
                    {
                        team_type: 'Team3',
                        team_name: 'team3',
                        team_id: 3
                    },
                    {
                        team_type: 'Team4',
                        team_name: 'team4',
                        team_id: 4
                    },
                    {
                        team_type: 'Team5',
                        team_name: 'team5',
                        team_id: 5
                    },
                    {
                        team_type: 'Team6',
                        team_name: 'team6',
                        team_id: 6
                    },
                    {
                        team_type: 'Team7',
                        team_name: 'team7',
                        team_id: 7
                    }
                ],
                pass: true
            }
        });
    }
});

