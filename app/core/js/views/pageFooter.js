define(
    ['jquery', 'underscore', 'views/templateView', 'text!template/pageFooter.html'],
    function ($, _, TemplateView, FooterTemplate) {
        'use strict';
        var PageFooter = {};
        PageFooter.View = TemplateView.extend({
            template: _.template(FooterTemplate)
        });
        return PageFooter;
    }
);