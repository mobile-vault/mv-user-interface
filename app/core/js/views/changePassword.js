define(
    ['jquery', 'underscore', 'backbone', 'app','crel', 'views/templateView', 'text!template/changePassword.html', 'core/js/API/changePassword'],
    function ($, _, Backbone, app, crel, TemplateView, ChangePasswordTemplate) {
        'use strict';
        var exports = {};
        var timer1;
        exports.Model = Backbone.Model.extend({
            urlRoot: '/change_password',
            defaults: {
                current_password: '',
                new_password: '',
                confirm_password: ''
            },
//            parse: function(response) {
//                if (response.pass) {
//                    return response.data;
//                }
//                return response;
//            },

            validate: function(attributes){
                var form =  $('#changePasswordForm');
                if(attributes.current_password.length < 8)
                {
                    form.find('#currentPasswordDiv').addClass('has-error');
                    form.find('#currentPasswordError').text('Current Password must have atleast 8 characters.').css({color: '#a94442'}).removeClass('display-none');
                    return true;
                }
                else if(!attributes.current_password.length < 8)
                {
                    form.find('#currentPasswordDiv').removeClass('has-error');
                    form.find('#currentPasswordError').addClass('display-none');
                }
                if(attributes.new_password.length < 8)
                {
                    form.find('#newPasswordDiv').addClass('has-error');
                    form.find('#newPasswordError').text('New Password must have atleast 8 characters.').css({color: '#a94442'}).removeClass('display-none');
                    return true;
                }
                else if(!attributes.new_password.length < 8)
                {
                    form.find('#newPasswordDiv').removeClass('has-error');
                    form.find('#newPasswordError').addClass('display-none');
                }
                if(attributes.confirm_password.length < 8)
                {
                    form.find('#confirmPasswordDiv').addClass('has-error');
                    form.find('#confirmPasswordError').text('Confirm Password must have atleast 8 characters.').css({color: '#a94442'}).removeClass('display-none');
                    return true;
                }
                else if(!attributes.confirm_password.length < 8)
                {
                    form.find('#confirmPasswordDiv').removeClass('has-error');
                    form.find('#confirmPasswordError').addClass('display-none');
                }
                if(attributes.new_password !== attributes.confirm_password)
                {
                    $(".error-message-container").empty().append('<div class="alert alert-danger alert-dismissable margin-top-large"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span class="error-message"></span></div>')
                        .find(".error-message").empty().html('Confirm Password must be same as New Password');
                }
            }
        });

        exports.View = TemplateView.extend({

            initialize: function() {
                this.model = new exports.Model();
                this.listenTo(this.model, 'request', this.enrolling);
                this.listenTo(this.model, 'sync', this.enrolled);
                this.listenTo(this.model, 'error', this.enrollError);
                return this;
            },
            enrolling: function() {
                this.$("#status").html("Sending...");
                return this;
            },
            enrolled: function (model, response) {
                this.$('#changePasswordForm input').val('');
                this.$("#status").html(response.message);
                setTimeout(function () { this.$("#status").html('');}, 5000);
                return this;
            },
            enrollError: function () {
                this.$("#status").html("Some Internal Error.");
            },
            template: _.template(ChangePasswordTemplate),
            events: {
                'click button[name=savePassword]'  : 'savePassword',
                'click button[name=cancel]'         : 'cancel'
            },
            savePassword: function() {
                var $form = $(this.el).find('#changePasswordForm');
                this.model.set({
                    current_password: $form.find('#currentPassword').val(),
                    new_password: $form.find('#newPassword').val(),
                    confirm_password: $form.find('#confirmPassword').val()
                });

                this.model.save({}, {}, {validate: true});
                return this;
            },
            render: function() {
                this.$el.html(this.template);
                this.$el.find('.custom-enroll-error').hide();
                return this;
            }
        });
        return exports;
    }
);