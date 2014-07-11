define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/roles?role=developer*',
            type: 'GET',
            responseTime: 250,
            responseText: {
                message: "",
                count: 20,
                data: [
                    {
                        user_device: "12344",
                        user_id: "1",
                        user_name: "Aman",
                        user_team: "Team1",
                        user_role: 'Developer'
                    },
                    {
                        user_device: "34554",
                        user_id: "2",
                        user_name: "developer",
                        user_team: "Server",
                        user_role: 'Designer'
                    },
                    {
                        user_device: "21432675",
                        user_id: "3",
                        user_name: "developer",
                        user_team: "Team2",
                        user_role: 'Engineer'
                    },
                    {
                        user_device: "646536",
                        user_id: "4",
                        user_name: "developer",
                        user_team: "Team3",
                        user_role: 'ContentWriter'
                    },
                    {
                        user_device: "2525254",
                        user_id: "5",
                        user_name: "developer",
                        user_team: "Team4",
                        user_role: 'Supervisor'
                    },
                    {
                        user_device: "214326752352",
                        user_id: "6",
                        user_name: "developer",
                        user_team: "Team5",
                        user_role: 'Tester'
                    },
                    {
                        user_device: "357580353",
                        user_id: "7",
                        user_name: "developer",
                        user_team: "Team6",
                        user_role: 'Manager'
                    },
                    {
                        user_device: "24646426",
                        user_id: "8",
                        user_name: "developer",
                        user_team: "Mangement",
                        user_role: 'Manager'
                    },
                    {
                        user_device: "976958485",
                        user_id: "9",
                        user_name: "developer",
                        user_team: "Team7",
                        user_role: 'Manager'
                    },
                    {
                        user_device: "958343646",
                        user_id: "10",
                        user_name: "developer",
                        user_team: "Team8",
                        user_role: 'Manager'
                    }
                ],
                pass: true
            }
        });
    }
});

