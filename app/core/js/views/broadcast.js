define(
    ['jquery', 'underscore', 'backbone', 'views/templateView', 'text!template/broadcast.html', 'core/js/API/postMessage'],
    function ($, _, Backbone, TemplateView, Broadcast) {
        'use strict';
        var exports = {};
        var timer;
        exports.name = 'broadcast-message';

        exports.models = {
            Main: Backbone.Model.extend(
                {
                    url: ''
                }
            )
        };

        exports.views = {
            Main: TemplateView.extend({
                tagName: 'div',
                className: [exports.name].join(' '),
                template: _.template(Broadcast),
                initialize: function (options) {
                    this.options = options;
                    var BroadcastModel = Backbone.Model.extend({
                            initialize: function(){
                                this.on("invalid", function(model, error) {
                                    $('.submit-notification').addClass('alert-danger').removeClass('alert-success').html(error).show();
                                    clearTimeout(timer);
                                    timer = setTimeout(function(){
                                        $('.submit-notification').hide();
                                    },3000);
                                });
                            },
                            defaults: {
                                broadcast: ''
                            },
                            validate: function(attributes){
                                if(!$.trim(attributes.broadcast)){
                                    console.log("empty message")
                                    return 'Message cannot be empty';
                                }
                            }
                        }
                    );
                    this.broadcastModel = new BroadcastModel();
                    this.broadcastModel.url = this.model.get('url');

                    this.listenTo(this.broadcastModel, 'request', this.sendingMessage);
                    this.listenTo(this.broadcastModel, 'sync', this.sendingSuccess);
                    this.listenTo(this.broadcastModel, 'error', this.errorOnSending);

                    return this;
                },
                sendingMessage: function(){
                },
                sendingSuccess: function(model, xhr, options){
                    if(xhr.pass === true)
                    {
                        $('.submit-notification').addClass('alert-success').removeClass('alert-danger').html('Your message has been sent').show();
                        $('#broadcastForm')[0].reset();
                        clearTimeout(timer);
                        timer = setTimeout(function(){
                            $('.submit-notification').hide();
                        },3000);
                    }
                    else
                    {
                        $('.submit-notification').addClass('alert-danger').removeClass('alert-success').html('Some Error occurred on server. Try again after sometime!').show();
                        $('#broadcastForm')[0].reset();
                        clearTimeout(timer);
                        timer = setTimeout(function(){
                            $('.submit-notification').hide();
                        },3000);
                    }
                    return this;
                },
                errorOnSending: function(model, xhr, options){
                    $('.submit-notification').addClass('alert-danger').removeClass('alert-success').html('Message cannot be sent. Try again!').show();
                    $('#broadcastForm')[0].reset();
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        $('.submit-notification').hide();
                    },3000);
                    return this;
                },

                events: {
                    'submit #broadcastForm': 'submitMessage'
                },
                submitMessage : function(e){
                    e.preventDefault();
                    var newMessage =  $(e.currentTarget).find($('textarea')).val();
                    this.broadcastModel.save({broadcast: newMessage}, {validate: true});
                    return this;
                },
                render: function () {
                    var template = this.template();
                    this.$el.html(template);
                    this.$el.find('.submit-notification').hide();
                    return this;
                }
            })
        };
        return exports;
    }
);

