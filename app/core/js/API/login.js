define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/admin',
            type: 'GET',
            responseTime: 250,
            responseText: {
                message: "",
                data: {
                    username: "abhishek@codemymobile.com",
                    company_id: "1",
                    permissions: ["admin", "install"]
                },
                pass: true
            }
        });
    }
});