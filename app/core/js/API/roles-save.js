define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/roles',
            type: 'POST',
            responseTime: 250,
            responseText: {
                message: "Great!",
                count: 10,
                data: {},
                pass: true
            }
        });
    }
});

