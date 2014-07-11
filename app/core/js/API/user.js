/**
 * Created with JetBrains WebStorm.
 * User: ankitkhatri
 * Date: 23/01/14
 * Time: 6:19 PM
 * To change this template use File | Settings | File Templates.
 */
 define(['jquery.mockjax'], function(){
     if(debug) {
         $.mockjax({
             url: '/user',
             responseTime: 250,
             responseText: {
                 message: "",
                 data: {
                     username: "admin",
                     company_id: 1,
                     current_customer: {
                         name: "Toppatch Inc."
                     },
                     full_name: "Toppatch Admin Account",
                     enabled: true,
                     customers: [ ],
                     groups: [ ],
                     default_customer: {
                         name: "default"
                     },
                     user_name: "admin",
                     email: "admin@toppatch.com",
                     permissions: [
                         "admin",
                         "install"
                     ]
                 },
                 pass: true
             }
         });
     }
 });


