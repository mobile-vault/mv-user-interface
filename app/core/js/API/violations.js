/**
 * Created with JetBrains WebStorm.
 * User: ankitkhatri
 * Date: 27/01/14
 * Time: 4:48 PM
 * To change this template use File | Settings | File Templates.
 */


define(['jquery', 'jquery.mockjax'], function ($) {
    if(debug) {
        $.mockjax({
            url: '/dashboard/violations*',
            responseTime: 250,
            type: 'get',
            contentType: 'text/json',
            urlParams: ['page', 'count'],
            getParameterByName: function (name) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location.search);
                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            },
            response: function (settings) {
                var page = this.getParameterByName('page') ? this.getParameterByName('page') : 1;
                var count = this.getParameterByName('count') ? this.getParameterByName('count') : 5;
                var totalCount = 12;
                var loopCount = 0;
                var data = [];
                var usernames = ["Atul Dhawan", "Ankit Khatri", "Neha Dhupia", "Sunny Leone", "Busty BombShell"];
                var roles = ["Developer", "Designer", "PornStar", "Actor", "Manager"];
                var teams = ["Server", "UI", "Testing", "Management", "Sales"]

                for (loopCount = ((page - 1) * count); loopCount < (totalCount < page * count ? totalCount : page * count); loopCount++) {
                    data.push({
                        user_device: "214326752352",
                        user_id: "12",
                        user_role: roles[Math.floor((Math.random() * 5))],
                        time_stamp: "2014-01-12 17:59:00",
                        user_device_os: "android-touchwiz",
                        user_name: usernames[Math.floor((Math.random() * 5))],
                        user_team: teams[Math.floor((Math.random() * 5))]
                    })
                }

                this.responseText = {
                    message: "Hey",
                    count: totalCount,
                    data: data,
                    pass: true
                }
            }
            /*responseText: {
             message: "",
             data: {
             count: 11,
             violation_details: [
             {
             user_device: "214326752352",
             user_id: "12",
             user_role: "Developer",
             time_stamp: "2014-01-12 17:59:00",
             user_device_os: "android-touchwiz",
             user_name: "Atul Dhawan",
             user_team: "Server"
             },
             {
             user_device: "34554",
             user_id: "2",
             user_role: "Developer",
             time_stamp: "2014-01-11 18:59:00",
             user_device_os: "ios",
             user_name: "Nitesh",
             user_team: "Server"
             },
             {
             user_device: "21432675",
             user_id: "3",
             user_role: "Lead",
             time_stamp: "2014-01-10 17:59:00",
             user_device_os: "android-touchwiz",
             user_name: "Aman",
             user_team: "Android"
             },
             {
             user_device: "646536",
             user_id: "4",
             user_role: "Designer",
             time_stamp: "2014-01-09 18:59:00",
             user_device_os: "ios",
             user_name: "Sandeep",
             user_team: "Android"
             },
             {
             user_device: "2525254",
             user_id: "5",
             user_role: "Developer",
             time_stamp: "2014-01-08 17:59:00",
             user_device_os: "ios",
             user_name: "Ravi",
             user_team: "Android"
             }
             ]
             }
             }  */
        });
    }
});
