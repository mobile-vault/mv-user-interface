define(
    ['jquery', 'underscore', 'backbone', 'app', 'crel', 'moment', 'views/modalView', 'views/editUserModal', 'views/view',
     'lists/pager', 'text!template/users.html', 'text!template/appTemplate.html', 'core/js/API/userlist'],
    function ($, _, Backbone, app, crel, moment, ModalView, EditUserModalView, View, Pager, UserTemplate, AppTemplate) {
        'use strict';
        var exports = {};

        exports.Model = Backbone.Model.extend({
            idAttribute: 'user_id'
        });

        exports.Collection = Pager.Collection.extend({
            baseUrl:'/users',
            model: exports.Model,
            _defaultParams: {
                offset: 0,
                count: 10
            }
        });

        _.extend(exports, {
            View: View.extend({
                initialize: function (options) {
                    this.options = options;
                    this.template = UserTemplate;
                    this.collection = new exports.Collection();
                    this.searchType = 'name';
                    this.vent = app.vent;
                    this.filterCollection = new Backbone.Collection();
                    this.listenTo(this.filterCollection, 'request', this.getFilterRequest);
                    this.listenTo(this.filterCollection, 'sync', this.getFilterSuccess);
                    this.listenTo(this.filterCollection, 'error', this.getFilterError);
                    var pagerView = Pager.View.extend({
                        collection:this.collection,
                        appTemplate: AppTemplate,
                        causeNavigation: false,
                        renderModel: function (model) {
                            var template = _.template(this.appTemplate),
                                payload = {
                                    params: this.collection.params,
                                    model: model
                                    /*type: this.tab*//*,
                                     viewHelpers: {
                                     formatDate: function (date) {
                                     return date ? moment(date * 1000).format('L') : 'N/A';
                                     }
                                     }*/
                                };
                            return template(payload);
                        },
                        layoutHeader: function ($header) {
                            var headerTemplate = _.template(UserTemplate);
                            $header.append(headerTemplate({header: true, legend: false, query: this.collection.params}));
                            return this;
                        },
                        layoutLegend: function ($legend) {
                            var legendTemplate = _.template(UserTemplate);
                            $legend.append(legendTemplate({header: false, legend: true, query: this.collection.params}));
                            return this;
                        }
                    });
                    this.pager =  new pagerView();
                },
                events: {
                    'change select[name=advancedSearch]'    :   'filterSearchBy',
                    'keyup input[name=search]'              :   'debouncedSearch',
                    'change select[name=sortBy]'            :   'sortBy',
                    'change select[name=sortType]'          :   'orderBy',
                    'change select[name=filterKey]'         :   'filterKey',
                    'change select[name=filterValue]'       :   'filterValue',
                    'click a.innerTabs'                     :   'changeTab',
                    'click #addNewUser'                     :   'openModal',
                    'click input[data-toggle=all]'          :   'selectAll',
                    'change input[name=checkbox]'           :   'toggleDeleteButton',
                    'click .add-user'                       :   'addUser',
                    'click button[name=userActions]'        :   'navigateToUserActions',
                    'click #editUser'                       :   'openEditUserModal',
                    'submit #edit-user-form'                :   'updateEditFormData',
                    'click button[name=user-policy]'        :   'navigateToUserPolicy',
                    'click button[name=deleteUser]'         :   'deleteUser'
                },
                openModal: function () {
                    if (this.modal) {
                        this.modal.close();
                        this.modal = undefined;
                    }
                    this.modal = new ModalView.View().init().open();
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
                debouncedSearch: _.debounce(function (event) {
                    var searchType = $(event.currentTarget).data('type');
                    if(this.searchType !== searchType)
                    {
                        delete this.pager.collection.params[this.searchType];
                        this.searchType = searchType;
                    }
                    var query = $(event.currentTarget).val().trim();
                    this.searchBy(query);
                }, 300),
                searchBy: function (query) {
                    this.pager.collection.params[this.searchType] = query;
                    this.pager.collection.params.offset = 0;
                    this.pager.collection.fetch();
                    return this;
                },
                addUser: function(){
                    app.router.navigate('/users/add/singleuser', {trigger:true});
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
                    else if(selectedOption === 'team')
                    {
                        searchText.remove();
                        searchBox.append(crel('input', {type: 'text', id: 'searchText', name: 'search', 'data-type': 'team', class: 'form-control search-input', placeholder: 'Search By Team', style: 'width: auto'}));
                    }
                    else if(selectedOption === 'device_id')
                    {
                        searchText.remove();
                        searchBox.append(crel('input', {type: 'text', id: 'searchText', name: 'search', 'data-type': 'device_id', class: 'form-control search-input', placeholder: 'Search By Device ID', style: 'width: auto'}));
                    }
                    else
                    {
                        searchText.remove();
                        searchBox.append(crel('input', {type: 'text', id: 'searchText', name: 'search', 'data-type':'name', class: 'form-control search-input', placeholder: 'Search By Name', style: 'width: auto'}));
                    }
                    delete this.pager.collection.params[this.searchType];
                    this.pager.collection.fetch();
                    return this;
                },
                sortBy: function (event) {
                    this.pager.collection.params.sort_by = $(event.currentTarget).val();
                    this.pager.collection.params.offset = 0;
                    this.pager.collection.fetch();
                    return this;
                },
                orderBy: function (event) {
                    this.pager.collection.params.sort = $(event.currentTarget).val();
                    this.pager.collection.params.offset = 0;
                    this.pager.collection.fetch();
                    return this;
                },
                filterKey: function(event) {
                    var selectedOption = $(event.currentTarget).val();
                    if(selectedOption === 'role')
                    {
                       this.filterCollection.url = '/roles';
                    }
                    else if(selectedOption === 'team')
                    {
                        this.filterCollection.url = '/teams';
                    }
                    else if(selectedOption === 'os')
                    {
                        this.filterCollection.url = '/operating_system';
                    }
                    else
                    {
                       this.$el.find('header select[name=filterValue]').empty().attr('disabled', 'disabled');
                       delete this.pager.collection.params.filter_key;
                       delete this.pager.collection.params.filter_value;
                       this.pager.collection.fetch();
                       return this;
                    }
                    this.filterCollection.fetch();
                    return this;
                },
                filterValue: function(event) {
                    var filteredKey = this.$('header select[name=filterKey]').val(),
                        filteredValue = $(event.currentTarget).val();
                    this.pager.collection.params.filter_key = filteredKey === 'none' ? '' : filteredKey;
                    this.pager.collection.params.filter_value = filteredValue;
                    this.pager.collection.params.offset = 0;
                    this.pager.collection.fetch();
                    return this;
                },
                getFilterRequest: function() {
                    var header = this.$el.find('header'),
                        selectedValue = header.find('select[name=filterValue]').empty();
                    selectedValue.append(
                        crel('option', {value: ''}, 'Loading...')
                    ).attr('disabled', 'disabled');
                    return this;
                },
                getFilterSuccess: function() {
                    var header = this.$el.find('header'),
                        filteredKey = header.find('select[name=filterKey]').val(),
                        selectedValue = header.find('select[name=filterValue]').empty(),
                        selectedValueFragment = document.createDocumentFragment(),
                        filteredValues;
                    if(filteredKey === 'role')
                    {
                        filteredValues = this.filterCollection.toJSON()[0].data;

                        _.each(filteredValues, function(filteredValue) {
                            selectedValueFragment.appendChild(
                                crel('option', {value: filteredValue.role_name}, filteredValue.role_type)
                            );
                        });
                    }
                    else if(filteredKey === 'team')
                    {
                        filteredValues = this.filterCollection.toJSON()[0].data;

                        _.each(filteredValues, function(filteredValue) {
                            selectedValueFragment.appendChild(
                                crel('option', {value: filteredValue.team_name}, filteredValue.team_type)
                            );
                        });
                    }
                    else if(filteredKey === 'os')
                    {
                        filteredValues = this.filterCollection.toJSON()[0].data;

                        _.each(filteredValues, function(filteredValue) {
                            selectedValueFragment.appendChild(
                                crel('option', {value: filteredValue}, filteredValue)
                            );
                        });
                    }

                    selectedValue.append($(selectedValueFragment)).removeAttr('disabled');
                    selectedValue.trigger('change');
                    return this;
                },
                getFilterError: function() {
                    var header = this.$el.find('header'),
                        selectedValue = header.find('select[name=filterValue]').empty();
                    selectedValue.append(
                        crel('option', {value: ''}, 'Error...')
                    ).attr('disabled', 'disabled');
                    return this;
                },
                openEditUserModal: function(event) {
                    var userModelID = $(event.currentTarget).parents('.item').data('modelid'),
                        userModel = this.collection.get(userModelID),
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
                changeTab: function (event) {
                    event.preventDefault();
                    var $href = $(event.currentTarget),
                        tab = $href.data('type');
                    delete this.pager.collection.params;
                    this.pager.collection.params.offset = 0;
                    this.pager.collection.params.count = 10;
                    this.updateTabContent(tab);
                    return this;
                },
                updateTabContent: function (tab) {
                    var $tab = this.$el.find('a[data-type=' + tab + ']'),
                        url = $tab.attr('href');
                    $tab.parent().addClass('active').siblings().removeClass('active');
                    this.pager.tab = tab;
                    this.pager.collection.baseUrl = url;
                    this.pager.collection.params.offset = 0;
                    this.renderContent();
                },
                beforeRender: $.noop,
                onRender: $.noop,
                render: function () {
                    if (this.beforeRender !== $.noop) { this.beforeRender(); }

                    var template = _.template(this.template);
                    this.$el.empty().append(template({header: false, legend: false, tab: this.options.tab}));
                    this.updateTabContent(this.options.tab);

                    if (this.onRender !== $.noop) { this.onRender(); }
                    return this;
                },
                renderContent: function () {
                    this.pager.render();
                    this.$('.tab-content').empty().append(this.pager.delegateEvents().$el);
                    return this;
                },
                navigateToUserPolicy: function(event) {
                    var fragment = $(event.currentTarget).attr('data-action');
                    event.preventDefault();
                    event.stopPropagation();
                    app.router.navigate(fragment, {trigger:true});
                    return this;
                },
                navigateToUserActions: function(event) {
                    var fragment = $(event.currentTarget).attr('data-action');
                    event.preventDefault();
                    event.stopPropagation();
                    app.router.navigate(fragment, {trigger:true});
                    return this;
                },
                deleteUser: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var userModelID = $(event.currentTarget).parents('.item').data('modelid'),
                        userModel = this.collection.get(userModelID),
                        that = this;
                    this.collection.sync('delete', userModel,
                        {
                            url: '/users/' + userModel.get('user_id'),
                            success: function()
                            {
                                that.$el.empty();
                                that.render();
                            }
                        });
                    return this;
                }
            })
        });
        return exports;
    }
);
