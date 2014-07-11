define(
    ['jquery', 'underscore', 'backbone', 'app', 'crel', 'lists/pager', 'views/view', 'views/editUserModal', 'views/team',
        'modals/baseModal', 'views/addTeam', 'text!template/teams.html', 'core/js/API/teams', 'core/js/API/supportedRoles', 'core/js/API/supportedTeams'],
    function ($, _, Backbone, app, crel, Pager, View, EditUserModalView, Team, baseModal, addTeam, TeamsTemplate, teams) {
        'use strict';
        var exports = {};

        exports.Model = Backbone.Model.extend({
            idAttribute: 'team_id'
        });

        exports.Collection = Backbone.Collection.extend({
            url:'/teams',
            model: exports.Model,
            parse: function(response) {
                return response.data;
            }
        });

        exports.View = View.extend({
            initialize: function(options) {
                this.options = options;
                this.collection = new exports.Collection();
                this.collection.url = '/teams';
                this.listenTo(this.collection, 'request', this.showLoading);
                this.listenTo(this.collection, 'sync', this.fetchSuccess);
                this.listenTo(this.collection, 'error', this.fetchError);
                this.searchType = 'name';
                this.filterCollection = new Backbone.Collection();
                this.vent = app.vent;
                this.listenTo(this.filterCollection, 'request', this.getFilterRequest);
                this.listenTo(this.filterCollection, 'sync', this.getFilterSuccess);
                this.listenTo(this.filterCollection, 'error', this.getFilterError);
            },
            template: TeamsTemplate,
            events: {
                'change select[name=advancedSearch]'    :   'filterSearchBy',
                'keyup input[name=search]'              :   'debouncedSearch',
                'change select[name=sortBy]'            :   'sortBy',
                'change select[name=sortType]'          :   'orderBy',
                'change select[name=filterKey]'         :   'filterKey',
                'change select[name=filterValue]'       :   'filterValue',
                'click #editUser'                       :   'openEditUserModal',
                'click a[data-toggle=collapse]'         :   'renderTeamContent',
                'click input[data-toggle=all]'          :   'selectAll',
                'change input[name=checkbox]'           :   'toggleDeleteButton',
                'click button.btn-delete'               :   'deleteTeam',
                'click button[name=deleteUser]'         :   'deleteUser',
                'click button.btn-policies'             :   'navigateToPolicies',
                'click button.btn-actions'              :   'navigateToTeamActions',
                'click button.add-team'                 :   'addTeam',
                'click button[name=userActions]'        :   'navigateToUserActions',
                'click button[name=user-policy]'        :   'navigateToUserPolicy',
            },
            debouncedSearch: _.debounce(function (event) {
                var searchType = $(event.currentTarget).data('type');
                if(this.searchType !== searchType)
                {
                    delete this.individualTeamView.pager.collection.params[this.searchType];
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
                this.renderTeams(collection);
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
                this.individualTeamView.pager.collection.params[this.searchType] = query;
                this.individualTeamView.pager.collection.params.offset = 0;
                this.individualTeamView.pager.collection.fetch();
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
                if(selectedOption === 'role')
                {
                    searchText.remove();
                    searchBox.append(crel('input', {type: 'text', id: 'searchText', name: 'search', 'data-type': 'role', class: 'form-control search-input', placeholder: 'Search By Role', style: 'width: auto'}));
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
                delete this.individualTeamView.pager.collection.params[this.searchType];
                this.individualTeamView.pager.collection.fetch();
                return this;
            },
            sortBy: function (event) {
                this.individualTeamView.pager.collection.params.sort_by = $(event.currentTarget).val();
                this.individualTeamView.pager.collection.params.offset = 0;
                this.individualTeamView.pager.collection.fetch();
                return this;
            },
            orderBy: function (event) {
                this.individualTeamView.pager.collection.params.sort = $(event.currentTarget).val();
                this.individualTeamView.pager.collection.params.offset = 0;
                this.individualTeamView.pager.collection.fetch();
                return this;
            },
            filterKey: function(event) {
                var selectedOption = $(event.currentTarget).val();
                if(selectedOption === 'role')
                {
                    this.filterCollection.url = '/roles';
                }
                else
                {
                    this.$el.find('header select[name=filterValue]').empty().attr('disabled', 'disabled');
                    delete this.individualTeamView.pager.collection.params.filter_key;
                    delete this.individualTeamView.pager.collection.params.filter_value;
                    this.individualTeamView.pager.collection.fetch();
                    return this;
                }
                this.filterCollection.fetch();
                return this;
            },
            filterValue: function(event) {
                var header = this.$el.find('.in').find('header'),
                    filteredKey = header.find('select[name=filterKey]').val(),
                    filteredValue = $(event.currentTarget).val();
                this.individualTeamView.pager.collection.params.filter_key = filteredKey === 'none' ? '' : filteredKey;
                this.individualTeamView.pager.collection.params.filter_value = filteredValue;
                this.individualTeamView.pager.collection.params.offset = 0;
                this.individualTeamView.pager.collection.fetch();
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
                        crel('option', {value: filteredObject.role_name}, filteredObject.role_type)
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
                    userModel = this.individualTeamView.collection.get(userModelID),
                    modalElement = $('.modal');

                if(modalElement){
                    modalElement.remove();
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
            addTeam: function (event) {
                var modalElement = $('.modal');

                if(modalElement){
                    modalElement.remove();
                }
                this.addTeamModal = new baseModal.View();
                this.listenTo(this.vent, "Modal:addTeam", this.closeModal);
                this.addTeamModal.setHeaderHTML("<h4>Add New Team</h4>");
                this.addTeamModal.setContentView(new addTeam.View());
                this.addTeamModal.open();
                return this;
            },
            closeModal: function (param) {
                this.addTeamModal.hide();
                if(param) {
                    this.$el.empty();
                    this.render();
                }
                return this;
            },
            renderTeamContent: function(event) {
                var accordionId = $(event.currentTarget).attr('href');
                if($(accordionId).hasClass('collapse'))
                {
                    if(!this.$el.find(accordionId).find('.panel-content').html().length)
                    {
                        this.individualTeamView = new Team.View();
                        this.individualTeamView.collection.params.team = $(event.currentTarget).attr('name');
                        this.individualTeamView.render();
                        this.$el.find(accordionId).find('.panel-content').append(this.individualTeamView.pager.delegateEvents().$el);
                    }
                    else {
                        this.individualTeamView.collection.params.team = $(event.currentTarget).attr('name');
                        this.individualTeamView.render();
                        this.$el.find(accordionId).find('.panel-content').empty().append(this.individualTeamView.pager.delegateEvents().$el);
                    }
                }
            },
            renderTeams: function(collection) {
                var template = _.template(this.template);
                this.$el.empty().append(template({header: false, legend: false, models: collection.models}));
            },
            render: function() {
                this.collection.fetch();
                return this;
            },
            deleteUser:function(event) {
                event.preventDefault();
                event.stopPropagation();
                var userModelID = $(event.currentTarget).parents('.item').data('modelid'),
                    userModel = this.individualTeamView.collection.get(userModelID),
                    that = this;
                this.individualTeamView.collection.sync('delete', userModel, {url: '/users/'+userModel.get('user_id'), success: function() {
                    that.$el.empty();
                    that.render();
                }
                });
                return this;
            },
            deleteTeam:function(event) {
                event.preventDefault();
                event.stopPropagation();
                var teamModelID = $(event.currentTarget).parents('.panel').data('modelid'),
                    teamModel = this.collection.get(teamModelID),
                    that = this;
                this.collection.sync('delete', teamModel,
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
            navigateToUserActions: function(event) {
                var fragment = $(event.currentTarget).attr('data-action');
                event.preventDefault();
                event.stopPropagation();
                app.router.navigate(fragment, {trigger:true});
                return this;
            },
            navigateToTeamActions: function(event) {
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

