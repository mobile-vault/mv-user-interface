define(
    ['jquery', 'underscore', 'backbone', 'crel', 'modals/baseModal', 'text!template/modals/uploadModal.html', 'app', 'core/js/vent'],
    function ($, _, Backbone, crel, BaseModal, ModalTemplate, app, Vent) {
        'use strict';
        var exports = {
            View: BaseModal.View.extend({
                id: 'add-user',
                init: function () {
                    this.template = _.template(ModalTemplate);
                    this.renderContent();
                    return this;
                },
                col: '12',
                renderContent: function() {
                    var template = this.template({header: false});
                    this.setHeaderHTML(this.renderHeader());
                    this.setContentHTML(template);
                },
                renderHeader: function() {
                    return this.template({header: true});
                },
                events: {
                    'click #addSingleUser'  : 'navigateToUserForm',
                    'click #bulkUpload'  : 'navigateToBulkUpload'
                },
                navigateToUserForm: function(event) {
                    event.preventDefault();
                    this.confirm();
                    app.router.navigate('users/add/singleUser', {trigger: true});

                },
                navigateToBulkUpload: function(event) {
                    event.preventDefault();
                    this.confirm();
                    app.router.navigate('users/add/bulkUpload', {trigger: true});
                }

            })
        };
        return exports;
        }
);
