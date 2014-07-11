define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/teams?team=team3*',
            type: 'GET',
            responseTime: 250,
            responseText: {
                message: "",
                count: 20,
                data: [
                    {
                        user_device: "12344",
                        user_id: "1",
                        user_name: "engineer",
                        user_role: "engineer"
                    },
                    {
                        user_device: "34554",
                        user_id: "2",
                        user_name: "engineer",
                        user_role: "engineer"
                    },
                    {
                        user_device: "21432675",
                        user_id: "3",
                        user_name: "engineer",
                        user_role: "engineer"
                    },
                    {
                        user_device: "646536",
                        user_id: "4",
                        user_name: "engineer",
                        user_role: "engineer"
                    },
                    {
                        user_device: "2525254",
                        user_id: "5",
                        user_name: "engineer",
                        user_role: "engineer"
                    },
                    {
                        user_device: "214326752352",
                        user_id: "6",
                        user_name: "engineer",
                        user_role: "engineer"
                    },
                    {
                        user_device: "357580353",
                        user_id: "7",
                        user_name: "engineer",
                        user_role: "engineer"
                    },
                    {
                        user_device: "24646426",
                        user_id: "8",
                        user_name: "engineer",
                        user_role: "engineer"
                    },
                    {
                        user_device: "976958485",
                        user_id: "9",
                        user_name: "engineer",
                        user_role: "engineer"
                    },
                    {
                        user_device: "958343646",
                        user_id: "10",
                        user_name: "engineer",
                        user_role: "engineer"
                    }
                ],
                pass: true
            }
        });
    }
});

