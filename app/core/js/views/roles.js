define(
    ['jquery', 'underscore', 'backbone', 'app', 'crel', 'lists/pager', 'views/view', 'views/editUserModal', 'views/role', 'modals/baseModal', 'views/addRole', 'text!template/roles.html', 'core/js/API/roles'],
    function ($, _, Backbone, app, crel, Pager, View, EditUserModalView, Role, baseModal, addRole, RolesTemplate, roles) {
        'use strict';
        var exports = {};

        exports.Model = Backbone.Model.extend({
            idAttribute: 'role_id'
        });

        exports.Collection = Backbone.Collection.extend({
            url:'/roles',
            model: exports.Model,
            parse: function(response) {
                return response.data;
            }
        });

        exports.View = View.extend({
            initialize: function(options) {
                this.options = options;
                this.collection = new exports.Collection();
                this.collection.url = '/roles';
                this.listenTo(this.collection, 'request', this.showLoading);
                this.listenTo(this.collection, 'sync', this.fetchSuccess);
                this.listenTo(this.collection, 'error', this.fetchError);
                this.filterCollection = new Backbone.Collection();
                this.searchType = 'name';
                this.vent = app.vent;
                this.listenTo(this.filterCollection, 'request', this.getFilterRequest);
                this.listenTo(this.filterCollection, 'sync', this.getFilterSuccess);
                this.listenTo(this.filterCollection, 'error', this.getFilterError);
            },
            template: RolesTemplate,
            events: {
                'change select[name=advancedSearch]'    :   'filterSearchBy',
                'keyup input[name=search]'              :   'debouncedSearch',
                'change select[name=sortBy]'            :   'sortBy',
                'change select[name=sortType]'          :   'orderBy',
                'change select[name=filterKey]'         :   'filterKey',
                'change select[name=filterValue]'       :   'filterValue',
                'click #editUser'                       :   'openEditUserModal',
                'click a[data-toggle=collapse]'         :   'renderRoleContent',
                'click input[data-toggle=all]'          :   'selectAll',
                'change input[name=checkbox]'           :   'toggleDeleteButton',
                'click button.btn-delete'               :   'deleteRole',
                'click button[name=deleteUser]'         :   'deleteUser',
                'click button.btn-policies'             :   'navigateToPolicies',
                'click button.btn-actions'              :   'navigateToRoleActions',
                'click button.add-role'                 :   'addRole',
                'click button[name=userActions]'        :   'navigateToUserActions',
                'click button[name=user-policy]'        :   'navigateToUserPolicy'
            },
            debouncedSearch: _.debounce(function (event) {
                var searchType = $(event.currentTarget).data('type');
                if(this.searchType !== searchType)
                {
                    delete this.individualRoleView.pager.collection.params[this.searchType];
                    this.searchType = searchType;
                }
                var query = $(event.currentTarget).val().trim();
                this.searchBy(query);
            }, 300),
            showLoading: function () {
                var $el = this.$el;
                this._loading = this._loading || new app.loading();
                $el.empty().append(this._loading.render().el);
                return this;
            },

            hideLoading: function () {
                if (this._loading) { this._loading.close(); }
                return this;
            },

            fetchSuccess: function (collection, response, options) {
                this.hideLoading();
                this.renderRoles(collection);
                return this;
            },

            fetchError: function (collection, response, options) {
                var $el = this.$el;
                this.hideLoading();
                $el.empty().html(
                    response.responseText
                );
                return this;
            },
            searchBy: function (query) {
                this.individualRoleView.pager.collection.params[this.searchType] = query;
                this.individualRoleView.pager.collection.params.offset = 0;
                this.individualRoleView.pager.collection.fetch();
                return this;
            },
            toggleDeleteButton: function(event) {
                var deleteButton = $('#delete'),
                    checkedBoxes = $('input[name=checkbox]:checked');
                deleteButton.prop('disabled', !checkedBoxes.length);
                return this;
            },
            selectAll: function (event) {
                var checked = event.target.checked,
                    $checkboxes = this.$('input[name=checkbox]');
                $checkboxes.prop('checked', checked);
                $('#delete').prop('disabled', !$checkboxes.prop('checked'));
                return this;
            },
            filterSearchBy: function(event) {
                var header = $('header'),
                    searchBox = header.find('#searchBox'),
                    searchText = header.find('#searchText'),
                    selectedOption = $(event.currentTarget).val();
                if(selectedOption === 'team')
                {
                    searchText.remove();
                    searchBox.append(crel('input', {type: 'text', id: 'searchText', name: 'search', 'data-type': 'team', class: 'form-control search-input', placeholder: 'Search By Team', style: 'width: auto'}));
                }
                else if(selectedOption === 'deviceID')
                {
                    searchText.remove();
                    searchBox.append(crel('input', {type: 'text', id: 'searchText', name: 'search', 'data-type': 'device_id', class: 'form-control search-input', placeholder: 'Search By Device ID', style: 'width: auto'}));
                }
                else
                {
                    searchText.remove();
                    searchBox.append(crel('input', {type: 'text', id: 'searchText', name: 'search', 'data-type':'name', class: 'form-control search-input', placeholder: 'Search By Name', style: 'width: auto'}));
                }
                delete this.individualRoleView.pager.collection.params[this.searchType];
                this.individualRoleView.pager.collection.fetch();
                return this;
            },
            sortBy: function (event) {
                this.individualRoleView.pager.collection.params.sort_by = $(event.currentTarget).val();
                this.individualRoleView.pager.collection.params.offset = 0;
                this.individualRoleView.pager.collection.fetch();
                return this;
            },
            orderBy: function (event) {
                this.individualRoleView.pager.collection.params.sort = $(event.currentTarget).val();
                this.individualRoleView.pager.collection.params.offset = 0;
                this.individualRoleView.pager.collection.fetch();
                return this;
            },
            filterKey: function(event) {
                var selectedOption = $(event.currentTarget).val();
                console.log(selectedOption);
                if(selectedOption === 'team')
                {
                    this.filterCollection.url = '/teams';
                }
                else
                {
                    this.$el.find('header select[name=filterValue]').empty().attr('disabled', 'disabled');
                    delete this.individualRoleView.pager.collection.params.filter_key;
                    delete this.individualRoleView.pager.collection.params.filter_value;
                    this.individualRoleView.pager.collection.fetch();
                    return this;
                }
                this.filterCollection.fetch();
                return this;
            },
            filterValue: function(event) {
                var header = this.$el.find('.in').find('header'),
                    filteredKey = header.find('select[name=filterKey]').val(),
                    filteredValue = $(event.currentTarget).val();
                console.log(filteredKey);
                this.individualRoleView.pager.collection.params.filter_key = filteredKey === 'none' ? '' : filteredKey;
                this.individualRoleView.pager.collection.params.filter_value = filteredValue;
                this.individualRoleView.pager.collection.params.offset = 0;
                this.individualRoleView.pager.collection.fetch();
                return this;
            },
            getFilterRequest: function() {
                var header = this.$el.find('.in').find('header'),
                    selectedValue = header.find('select[name=filterValue]').empty();
                selectedValue.append(
                    crel('option', {value: ''}, 'Loading...')
                ).attr('disabled', 'disabled');
                return this;
            },
            getFilterSuccess: function() {
                var header = this.$el.find('.in').find('header'),
                    selectedValue = header.find('select[name=filterValue]').empty(),
                    selectedValueFragment = document.createDocumentFragment(),
                    filteredObjects = this.filterCollection.toJSON()[0].data;
                _.each(filteredObjects, function(filteredObject) {
                    selectedValueFragment.appendChild(
                        crel('option', {value: filteredObject.team_name}, filteredObject.team_type)
                    );
                });
                selectedValue.append($(selectedValueFragment)).removeAttr('disabled');
                selectedValue.trigger('change');
                return this;
            },
            getFilterError: function() {
                var header = this.$el.find('.in').find('header'),
                    selectedValue = header.find('select[name=filterValue]').empty();
                selectedValue.append(
                    crel('option', {value: ''}, 'Error...')
                ).attr('disabled', 'disabled');
                return this;
            },
            openEditUserModal: function(event) {
                var userModelID = $(event.currentTarget).parents('.item').data('modelid'),
                    userModel = this.individualRoleView.collection.get(userModelID),
                    modalElement = $('.modal');

                if(modalElement){
                    modalElement.remove();
                }

                if(this.modal instanceof Backbone.View)
                {
                    this.modal.close();
                }
                /* if (this.modal) {
                 this.modal.close();
                 delete this.modal;
                 }*/
                this.modal = new EditUserModalView.View().init(userModel);
                this.listenTo(this.vent, 'Modal:editUser', this.closeEditModal);
                this.modal.open();
                return this;
            },
            closeEditModal: function (param) {
                this.modal.hide();
                if(param) {
                    this.$el.empty();
                    this.render();
                }
                return this;
            },
            navigateToPolicies: function(event) {
                var fragment = $(event.currentTarget).attr('data-action');
                event.preventDefault();
                event.stopPropagation();
                app.router.navigate(fragment, {trigger:true});
                return this;
            },
            addRole: function (event) {
                if (this.addRoleModal && this.addRoleModal instanceof Backbone.View) {
                    this.addRoleModal.close();
                }
                this.addRoleModal = new baseModal.View();
                this.listenTo(this.vent, "Modal:addRole", this.closeModal);
                this.addRoleModal.setHeaderHTML("<h4>Add New Role</h4>");
                this.addRoleModal.setContentView(new addRole.View());
                this.addRoleModal.open();
                return this;
            },
            closeModal: function (param) {
                this.addRoleModal.hide();
                if(param) {
                    this.$el.empty();
                    this.render();
                }
                return this;
            },
            renderRoleContent: function(event) {
                var accordionId = $(event.currentTarget).attr('href');
                if($(accordionId).hasClass('collapse'))
                {
                    if(!this.$el.find(accordionId).find('.panel-content').html().length)
                    {
                        this.individualRoleView = new Role.View();
                        this.individualRoleView.collection.params.role = $(event.currentTarget).attr('name');
                        this.individualRoleView.render();
                        this.$el.find(accordionId).find('.panel-content').append(this.individualRoleView.pager.delegateEvents().$el);
                    }
                    else
                    {
                        this.individualRoleView.collection.params.role = $(event.currentTarget).attr('name');
                        this.individualRoleView.render();
                        this.$el.find(accordionId).find('.panel-content').empty().append(this.individualRoleView.pager.delegateEvents().$el);
                    }
                }
                return this;
            },
            renderRoles: function(collection) {
                var template = _.template(this.template);
                this.$el.empty().append(template({header: false, legend: false, models: collection.models}));
                return this;
            },
            render: function() {
                this.collection.fetch();
                return this;
            },
            deleteRole:function(event) {
                event.preventDefault();
                event.stopPropagation();
                var roleModelID = $(event.currentTarget).parents('.panel').data('modelid'),
                    roleModel = this.collection.get(roleModelID),
                    that = this;
                this.collection.sync('delete', roleModel,
                    {
                        success: function()
                        {
                            that.$el.empty();
                            that.render();
                        }
                    }
                );
                return this;
            },
            deleteUser:function(event) {
                event.preventDefault();
                event.stopPropagation();
                var userModelID = $(event.currentTarget).parents('.item').data('modelid'),
                    userModel = this.individualRoleView.collection.get(userModelID),
                    that = this;
                this.individualRoleView.collection.sync('delete', userModel,
                    {
                        url: '/users/' + userModel.get('user_id'),
                        success: function()
                        {
                            that.$el.empty();
                            that.render();
                        }
                    }
                );
                return this;
            },
            navigateToUserActions: function(event) {
                var fragment = $(event.currentTarget).attr('data-action');
                event.preventDefault();
                event.stopPropagation();
                app.router.navigate(fragment, {trigger:true});
                return this;
            },
            navigateToRoleActions: function(event) {
                var fragment = $(event.currentTarget).attr('data-action');
                event.preventDefault();
                event.stopPropagation();
                app.router.navigate(fragment, {trigger:true});
                return this;
            },
            navigateToUserPolicy: function(event) {
                var fragment = $(event.currentTarget).attr('data-action');
                event.preventDefault();
                event.stopPropagation();
                app.router.navigate(fragment, {trigger:true});
                return this;
            }
        });
        return exports;
    }
);

