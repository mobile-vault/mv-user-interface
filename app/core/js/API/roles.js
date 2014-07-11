define(['jquery.mockjax'], function(){
    if(debug) {
        $.mockjax({
            url: '/roles',
            type: 'GET',
            responseTime: 500,
            responseText: {
                message: "",
                count: 10,
                data: [
                    {
                        role_type: 'Developer',
                        role_name: 'developer',
                        role_id: 1
                    },
                    {
                        role_type: 'Designer',
                        role_name: 'designer',
                        role_id: 2
                    },
                    {
                        role_type: 'Engineer',
                        role_name: 'engineer',
                        role_id: 3
                    },
                    {
                        role_type: 'Supervisor',
                        role_name: 'supervisor',
                        role_id: 4
                    },
                    {
                        role_type: 'Content Writer',
                        role_name: 'content_writer',
                        role_id: 5
                    },
                    {
                        role_type: 'Tester',
                        role_name: 'tester',
                        role_id: 6
                    },
                    {
                        role_type: 'Manager',
                        role_name: 'manager',
                        role_id: 7
                    }
                ],
                pass: true
            }
        });
    }
});

