define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/users*',
            type: 'GET',
            responseTime: 250,
            responseText: {
                message: "",
                count: 20,
                data: [
                    {
                        user_device: "12344",
                        user_id: "1",
                        user_email: "atul@codemymobile.com",
                        user_device_os: "ios",
                        user_violation: 1,
                        user_name: "Atul Dhawan",
                        user_role: "Manager",
                        user_team: "Android"
                    },
                    {
                        user_device: "34554",
                        user_id: "2",
                        user_email: "nitesh@codemymobile.com",
                        user_device_os: "ios",
                        user_violation: 1,
                        user_name: "Nitesh",
                        user_role: "Developer",
                        user_team: "Server"
                    },
                    {
                        user_device: "21432675",
                        user_id: "3",
                        user_email: "aman@codemymobile.com",
                        user_device_os: "android",
                        user_violation: 1,
                        user_name: "Aman",
                        user_role: "Lead",
                        user_team: "Android"
                    },
                    {
                        user_device: "646536",
                        user_id: "4",
                        user_email: "sandeep@codemymobile.com",
                        user_device_os: "ios",
                        user_violation: 1,
                        user_name: "Sandeep",
                        user_role: "Designer",
                        user_team: "Android"
                    },
                    {
                        user_device: "2525254",
                        user_id: "5",
                        user_email: "ravi@codemymobile.com",
                        user_device_os: "ios",
                        user_violation: 1,
                        user_name: "Ravi",
                        user_role: "Developer",
                        user_team: "Android"
                    },
                    {
                        user_device: "214326752352",
                        user_id: "6",
                        user_email: "popli@codemymobile.com",
                        user_device_os: "android",
                        user_violation: 1,
                        user_name: "Popli",
                        user_role: "Developer",
                        user_team: "Android"
                    },
                    {
                        user_device: "357580353",
                        user_id: "7",
                        user_email: "akshat@codemymobile.com",
                        user_device_os: "android",
                        user_violation: 1,
                        user_name: "Akshat",
                        user_role: "Developer",
                        user_team: "Android"
                    },
                    {
                        user_device: "24646426",
                        user_id: "8",
                        user_email: "swati@codemymobile.com",
                        user_device_os: "android",
                        user_violation: 1,
                        user_name: "Swati",
                        user_role: "Manager",
                        user_team: "Mangement"
                    },
                    {
                        user_device: "976958485",
                        user_id: "9",
                        user_email: "ankit@codemymobile.com",
                        user_device_os: "android",
                        user_violation: 1,
                        user_name: "Ankit",
                        user_role: "Manager",
                        user_team: "Android"
                    },
                    {
                        user_device: "958343646",
                        user_id: "10",
                        user_email: "shiva@codemymobile.com",
                        user_device_os: "ios",
                        user_violation: 1,
                        user_name: "Shiva",
                        user_role: "Developer",
                        user_team: "Android"
                    }
                ],
                pass: true
            }
        });
    }
});

