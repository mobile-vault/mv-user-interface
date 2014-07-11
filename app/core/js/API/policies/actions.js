define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/policies/company/1/actions',
            type: 'GET',
            responseTime: 250,
            responseText: {
                message: "",
                count: 20,
                data: {
                    _id: 1,
                    object_type: 'Company',
                    name: 'HugoMinds Technologies Pvt. Ltd.'

                },
                pass: true
            }
        });
    }
});

