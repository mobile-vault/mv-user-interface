define(
    ['require','backbone', 'app', 'models/users'],
    function (require, Backbone, app, users) {
        'use strict';
        var user = new users;
        var deferredRender = new $.Deferred();
        var deferredRouter = new $.Deferred();

        user.on('sync', deferredRender.resolve).fetch();

        require(
            ['views/pageHeader', 'views/pageFooter'],
            function (PageHeader,PageFooter) {
                deferredRender.done(function () {
                    var pageHeader = new PageHeader.View();
                    var pageFooter = new PageFooter.View();


                    // Prepend header to body
                    // Append footer to body
                    $('body').prepend(pageHeader.render().$el.html()).append(pageFooter.render().$el.html());

//                    $('.custom-nav li').on('click', function(){
//                        $('.custom-nav li').removeClass("active");
//                        $(this).addClass("active");
//                    });



                    if(user.hasPermission("admin")) {
                        $('#userName').append(user.get('username'));
                        app.companyID = user.get('company_id');
                        /*pageHeader.$('#userMenu')
                         .find('.divider')
                         .before(crel('li', crel('a', {'href': '#admin/users'}, 'Admin Settings')));*/
                    }

                    // resolve the deferred object
                    deferredRouter.resolve();
                });
            }
        );

        require(['routers/router', 'views/broadcast'], function(Router, Broadcast) {
            deferredRouter.done(function(){
                app.router = new Router();
                Backbone.history.start();
                /*var broadcast = new Broadcast.View();
                $('#main').append(broadcast.render().$el.html());*/
            })
        });
    }
)