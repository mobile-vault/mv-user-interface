define(['jquery.mockjax'], function () {
    if(debug) {
        $.mockjax({
            url: '/user_enroll',
            dataType: 'json',
            type: 'POST',
            status: 200,
            responseTime: 250,
            responseText: {
                pass: true
            }
        });
    }
});
