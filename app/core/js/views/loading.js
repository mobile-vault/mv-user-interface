define(
    ['views/templateView', 'text!template/loading.html'],
    function (TemplateView, loadingTemplate) {
        'use strict';
        return TemplateView.extend({
            className: 'loading-container',
            template: _.template(loadingTemplate),
            _loadingText: 'Loading ...',
            render: function () {
                this.isClosed = false;
                if (!this.$loading) {
                    if (Modernizr.cssanimations) {
                        this.$loading = this.template();
                    } else {
                        // Non-animated fallback
                        this.$loading = this.getLoadingText();
                        this.$el.addClass('text-center');
                    }
                }
                this.$el.html(this.$loading);
                return this;
            },
            setLoadingText: function (text) {
                this._loadingText = text;
                return this;
            },
            getLoadingText: function () {
                return this._loadingText;
            }

        });
    });