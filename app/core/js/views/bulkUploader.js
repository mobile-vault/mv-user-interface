define(
    ['jquery', 'underscore', 'backbone', 'crel', 'views/templateView', 'views/view', 'lists/pager', 'text!template/bulkUpload.html', 'text!template/uploadedData.html',
    'jquery.iframe-transport', 'jquery.fileupload', 'core/js/API/upload',  'core/js/API/uploadedusers'],

    function ($, _, Backbone, crel, TemplateView, View, Pager, BulkUploader, ItemTemplate) {
        'use strict';
        var exports = {
        };

        exports.models = {
            Main: Backbone.Model.extend({
                defaults: { url: ''}
            })
        };

        exports.View = TemplateView.extend({
            initialize: function () {
                var uploadFileModel = Backbone.Model.extend({
                    validate: function (attrs) {

                    }
                });
                this.uploadFileModel = new uploadFileModel();
                this.uploadFileModel.url = '/upload';   // TODO: Check Link
            },
            template: _.template(BulkUploader),
            events: {
                'click #uploadButton': 'uploadFile'
                // 'submit form' : 'uploadFile'
            },

            uploadFile: function () {
                var that = this;
                that.$(".upload-file").change(function () {
                    that.$("#upload-file-info").val($(this).val());
                    // that.$(this).parent().hide();
                    that.$('#submit-upload').show();
                    var info = $(this).val();
                    var index = info.lastIndexOf("\\");
                    $(".file-info").html(info.substring(index + 1));
                });
                $('#uploadButton').fileupload({
                    url: '/user_bulk',
                    type: 'POST',
                    dataType: 'json',
//                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    add: function (e, data) {
                        data.context = $('<p/>').text('Uploading...');

                        that.$el.find('#input-submit-upload').prop('disabled',true).css('cursor','alias');
                        that.$el.find('.button-upload').addClass('disabled');
                        that.$el.find('.sample-data').remove();
                        that.$el.find('.file-format').hide();
                        that.$el.find('#uploadButton>a').html('Uploading...').css('cursor','alias');
                        data.submit();
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('.bar').css(
                            'width',
                            progress + '%'
                        );
                    },
                    done: function (e, data) {
                        data.context.text('Upload finished.');
                        $('#uploadButton>a').html('Upload finished') ;
                        $('#upload-form')[0].reset();
                        exports.model = Backbone.Model.extend({

                        });
                        exports.Collection = Backbone.Collection.extend({
                            model: exports.model
                        });
                        var listUsers = new exports.Collection({

                        });

                        listUsers.remove(listUsers.at(0));
                        listUsers.add(data.result.data);
                        data.context.text('Upload finished.');
                        $('#uploadButton>a').html('Upload finished') ;
                        $('#upload-form')[0].reset();

                        var UserView = Backbone.View.extend({
                            initialize: function(){

                            },
                            template: _.template(ItemTemplate),
                            render: function(){
                                var modelData = this.model.toJSON();

                                var template = this.template,
                                    team_id = this.model.get('team_id'),
                                    email = this.model.get('email'),
                                    name = this.model.get('name'),
                                    role_id = this.model.get('role_id'),
                                    payload = {
                                        team_id: team_id,
                                        email: email,
                                        name: name,
                                        role_id: role_id

                                    };
                                this.$el.append(template(payload));
                                return this;
                            }
                        });

                        var UserCollectionView = Backbone.View.extend({
                            className: 'container-data',
                            initialize: function(){
                                this.render();
                            },
                            render: function(){
                                this.collection.each(this.addOne, this);
                                this.getHeader();
                                return this;
                            },
                            addOne: function(users){
                                var userview = new UserView({model: users});

                                this.$el.append(userview.render().el);
                                $('.upload-outer-container').append(this.el);
                            },
                            getHeader: function(){
                                var headerFragment = document.createDocumentFragment();
                                var footerFragment = document.createDocumentFragment();
                                headerFragment.appendChild(
                                    crel('div', {class: 'data-header'},
                                        crel('div', {class: 'row'},
                                            crel('div', {class: 'col-lg-3'}, 'Team ID'),
                                            crel('div', {class: 'col-lg-3'}, 'Email' ),
                                            crel('div', {class: 'col-lg-3'},'Name'),
                                            crel('div', {class: 'col-lg-3'}, 'Role ID')
                                        ))
                                );

                                footerFragment.appendChild(
                                    crel('div', {class: 'footer-data'},
                                        crel('div', {class: 'row'},
                                            crel('div', {class: 'col-lg-12'}, 'Data has been successfully submitted ' +
                                                'to the Database, profile will be mailed soon.')

                                        ))
                                );

                                that.$el.find('.container-data').prepend(headerFragment);
                                that.$el.find('.container-data').append(footerFragment);
                                return this;
                            }



                        });

                        var usercollectionview = new UserCollectionView({
                            collection: listUsers
                        });
                    },
                    fail: function (e, data) {

                    }
                })
            },

            render: function () {
                var template = this.template();
                this.$el.html(template);
                return this;
            }
        });
        return exports;
    });
