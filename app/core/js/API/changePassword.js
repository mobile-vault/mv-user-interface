define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/change_password',
            type: 'POST',
            responseTime: 250,
            responseText: {
                message: "Password changed successfully",
                pass: true
            }
        });
    }
});