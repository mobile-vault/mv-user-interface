define(['jquery.mockjax'], function () {
    if(debug) {
        $.mockjax({
            url: '/user_bulk',
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
