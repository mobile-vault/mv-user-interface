/**
 * Created with JetBrains WebStorm.
 * User: ankitkhatri
 * Date: 27/01/14
 * Time: 4:48 PM
 * To change this template use File | Settings | File Templates.
 */


define(['jquery.mockjax'], function () {
    if(debug) {
        $.mockjax({
            url: '/dashboard/sessions',
            responseTime: 250,
            responseText: {
                message: "",
                count: 11,
                data: [


                    {
                        username: "Ankit",
                        user_id: 1,
                        ip: "192.168.2.150",
                        invalid: true,
                        created_on: "2014-01-03 18:50:00",
                        user_agent: "Chrome",
                        destroyed_on: "2014-05-04 07:23:00",
                        id: 1
                    },
                    {
                        username: "Aman",
                        user_id: 2,
                        ip: "192.168.2.1",
                        invalid: false,
                        created_on: "2014-01-04 19:39:00",
                        user_agent: "Firefox",
                        destroyed_on: "2014-01-04 19:39:00",
                        id: 11
                    },
                    {
                        username: "Swati",
                        user_id: 3,
                        ip: "10.97.20.10",
                        invalid: true,
                        created_on: "2014-01-04 19:39:00",
                        user_agent: "Firefox",
                        destroyed_on: "2014-01-04 19:42:00",
                        id: 10
                    },
                    {
                        username: "Popli",
                        user_id: 4,
                        ip: "192.168.2.11",
                        invalid: null,
                        created_on: "2014-01-04 19:34:00",
                        user_agent: "Firefox",
                        destroyed_on: "2014-01-04 19:39:00",
                        id: 9
                    },
                    {
                        username: "Atul",
                        user_id: 5,
                        ip: "192.168.2.150",
                        invalid: true,
                        created_on: "2014-01-03 18:50:00",
                        user_agent: "Chrome",
                        destroyed_on: "2014-01-04 19:39:00",
                        id: 1
                    }
                ],
                pass: true
            }
        });
    }
});
