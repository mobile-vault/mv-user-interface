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
            url: '/dashboard/postmessage',
            dataType: 'json',
            status: 200,
            type: 'POST',
            responseTime: 250,
            responseText: {
                pass: true
            }
        });
    }
});

