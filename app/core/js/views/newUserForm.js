define(
    ['jquery', 'underscore', 'backbone', 'app','crel', 'views/templateView', 'views/userEnroll', 'text!template/newUserForm.html', 'core/js/API/enroll'],
    function ($, _, Backbone, app, crel, TemplateView, UserEnrollForm, NewUserTemplate, enroll) {

        'use strict';
        var exports = {};
        var timer1;
        exports.Model = Backbone.Model.extend({
            urlRoot: '/user_enroll',
            defaults: {
                user_name: '',
                user_email: '',
                role_id: '',
                team_id: ''
            },

            validate: function(attributes){
                var form =  $('#enroll');
               if(!$.trim(attributes.user_email)){
                   form.find('#email').css('borderColor', '#953b39').attr('placeholder', 'Please enter an email address');
                    return 'please enter an email address';
                }
               else if(!this.validateEmail(attributes.user_email)){
                   form.find('#email').css('borderColor', '#953b39').attr('placeholder', 'Please enter a valid email address');
                   return 'please enter a valid email address';
               }

               else if(attributes.user_name.length < 4){
                   form.find('#user-name').css('borderColor', '#953b39').attr('placeholder', 'Name should contain ateast 4 letters').val('');
                   return 'please enter a username';
               }
            },
            validateEmail: function(email){
                var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                return regex.test(email);
            }

        });



        exports.View = TemplateView.extend({

            initialize: function() {
                exports.View.enrollModel = new exports.Model();
                this.userEnrollFormView = new UserEnrollForm.View();
                this.listenTo(exports.View.enrollModel, 'request', this.enrolling);
                this.listenTo(exports.View.enrollModel, 'sync', this.enrolled);
                this.listenTo(exports.View.enrollModel, 'error', this.enrollError);
            },

            template: _.template(NewUserTemplate),
            enrolling: function(){
                this.$el.find('.custom-enroll-error').addClass('alert-info').removeClass('alert-danger').html('Enrolling...').show();
            },
            enrolled: function(model, xhr, options){
                if(xhr.duplicate === true)
                {
                    this.$el.find('.custom-enroll-error').addClass('alert-danger').removeClass('alert-info').html('User with this Email is already enrolled !').show();
                }
                else
                {
                    this.$el.find('.custom-enroll-error').addClass('alert-success').removeClass('alert-danger alert-info').html('User has been enrolled !').show();
                }
                this.$el.find('#enroll')[0].reset();
                clearTimeout(timer1);
                var that = this;
                timer1 = setTimeout(function(){
                    that.$el.find('.custom-enroll-error').hide();

                },3000);
            },
            enrollError: function(model, xhr, options){
                this.$el.find('.custom-enroll-error').addClass('alert-danger').removeClass('alert-success').html('Sorry! An error occured! Try again').show();
                this.$el.find('#enroll')[0].reset();
                clearTimeout(timer1);
                var that = this;
                timer1 = setTimeout(function(){
                    that.$el.find('.custom-enroll-error').hide();

                },3000);

            },
            events: {
                'submit #enroll' : 'updateForm',
                'click #bulk-upload': 'bulkUpload',
                'focus #email' : 'emailfocus',
                'blur #email' : 'emailblur',
                'focus #user-name': 'usernamefocus',
                 'blur #user-name': 'usernameblur'
            },
            emailfocus: function(){
                this.$el.find('#enroll').find('#email').css('borderColor', '#66afe9').attr('placeholder', '');
            },
            emailblur: function(){
                this.$el.find('#enroll').find('#email').css('borderColor', '#cccccc').attr('placeholder', 'Email')
            },
            usernamefocus: function(){
                this.$el.find('#enroll').find('#user-name').css('borderColor', '#66afe9').attr('placeholder', '');
            },
            usernameblur: function(){
                this.$el.find('#enroll').find('#user-name').css('borderColor', '#cccccc').attr('placeholder', 'Name');
            },
            updateForm: function(event) {
                event.preventDefault();
                var $form = $(this.el).find('#enroll');
                exports.View.enrollModel.set({
                    user_email: $form.find('#email').val(),
                    user_name: $form.find('#user-name').val(),
                    role_id: $form.find('#role').val(),
                    team_id: $form.find('#team').val()
                });

                exports.View.enrollModel.save({},{}, {validate: true});

            },
            bulkUpload: function(){
                app.router.navigate('/users/add/bulkupload', {trigger:true});
            },
            render: function() {
                this.$el.html(this.template);
                this.$el.find('#userEnroll').append(this.userEnrollFormView.$el);
                this.$el.find('.custom-enroll-error').hide();
                this.userEnrollFormView.render();
                return this;
            }
        });
        return exports;
    }
);

