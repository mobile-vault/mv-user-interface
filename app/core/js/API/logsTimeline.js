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
            url: '/dashboard/logs',
            responseTime: 250,
            responseText: {
                message: "",
                logs: [
                    {
                        company_id: 1,
                        component_id: 2,
                        component_type: "role",
                        id: 23,
                        level: "info",
                        message: "Command sent to Deputy Manager  having ID = 2",
                        raw: null,
                        tag: null,
                        timestamp: "2014-06-05T14:12:35.733971"
                    },
                    {
                        company_id: 1,
                        component_id: 1,
                        component_type: "user",
                        id: 21,
                        level: "info",
                        message: "Command sent to abhishek  having ID = 1",
                        raw: null,
                        tag: null,
                        timestamp: "2014-06-05T14:05:02.582162"
                    },
                    {
                        company_id: 1,
                        component_id: 7,
                        component_type: "role",
                        id: 20,
                        level: "info",
                        message: "Command sent to Trainee  having ID = 7",
                        raw: null,
                        tag: null,
                        timestamp: "2014-06-05T14:01:50.127557"
                    },
                    {
                        company_id: 1,
                        component_id: 2,
                        component_type: "user",
                        id: 9,
                        level: "info",
                        message: "Command sent to CMM Dev  having ID = 2",
                        raw: null,
                        tag: null,
                        timestamp: "2014-06-05T08:01:41.472524"
                    },
                    {
                        company_id: 3,
                        component_id: 4,
                        component_type: "user",
                        id: 9,
                        level: "info",
                        message: "Command sent to CMM Dev  having ID = 2",
                        raw: null,
                        tag: null,
                        timestamp: "2014-06-05T08:01:41.472524"
                    }
                ],
                pass: true
            }
        });
    }
});
