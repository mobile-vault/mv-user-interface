var prefixServer= '';
    if(!debug) {
        prefixServer = 'static/';
    }
console.log(prefixServer);
/*exported requirejs */
var requirejs = {
    // enforceDefine: If set to true, an error will be thrown if a script loads
    // that does not call define() or have a shim exports string value that can
    // be checked. This helps catch load failures in IE.
    // See: http://requirejs.org/docs/api.html#ieloadfail
    enforceDefine: true,

    // baseURL: The root path to use for all module lookups.
    // See: http://requirejs.org/docs/api.html#config-baseUrl
    baseUrl: './',

    // paths: Path mappings for module names not found directly under baseUrl.
    // See: http://requirejs.org/docs/api.html#config-paths
    paths: {
        'core'                          : prefixServer + 'core',
        'app'                           : prefixServer + 'core/js/routers/app',
        'main'                          : prefixServer + 'core/js/main',
        'routers'                       : prefixServer + 'core/js/routers',
        'collections'                   : prefixServer + 'core/js/collections',
        'models'                        : prefixServer + 'core/js/models',
        'views'                         : prefixServer + 'core/js/views',
        'lists'                         : prefixServer + 'core/js/lists',
        'modals'                        : prefixServer + 'core/js/modals',
        'reports'                       : prefixServer + 'core/js/reports',
        'template'                      : prefixServer + 'core/template',


        // RequireJS Plugins

        'async'                         : prefixServer + 'vendor/requirejs-plugins/src/async',
        'font'                          : prefixServer + 'vendor/requirejs-plugins/src/font',
        'goog'                          : prefixServer + 'vendor/requirejs-plugins/src/goog',
        'image'                         : prefixServer + 'vendor/requirejs-plugins/src/image',
        'json'                          : prefixServer + 'vendor/requirejs-plugins/src/json',
        'noext'                         : prefixServer + 'vendor/requirejs-plugins/src/noext',
        'propertyParser'                : prefixServer + 'vendor/requirejs-plugins/src/propertyParser',
        'text'                          : prefixServer + 'vendor/requirejs-text/text',

        // Vendor Library Paths
        //'handlebars'                  : 'vendor/handlebars/handlebars.runtime',
        'highcharts'                    : prefixServer + 'vendor/highstock-components/highstock',
        'highcharts-more'               : prefixServer + 'vendor/highstock-components/highcharts-more',
        'jquery'                        : prefixServer + 'vendor/jquery/jquery',
        'jquery.cookie'                 : prefixServer + 'vendor/jquery.cookie/jquery.cookie',
        'jquery.mockjax'                : prefixServer + 'vendor/jquery-mockjax/jquery.mockjax',
        'jquery.simulate'               : prefixServer + 'vendor/jquery-simulate/jquery.simulate',
        'livestamp'                     : prefixServer + 'vendor/livestampjs/livestamp',
        'moment'                        : prefixServer + 'vendor/moment/moment',
        'select2'                       : prefixServer + 'vendor/select2/select2',
        'underscore'                    : prefixServer + 'vendor/lodash/dist/lodash',
        'crel'                          : prefixServer + 'vendor/crel/crel',
        'sly'                           : prefixServer + 'vendor/sly/dist/sly',

        // Backbone Paths
        'backbone'                      : prefixServer + 'vendor/backbone/backbone',
        'backbone.modelBinder'          : prefixServer + 'vendor/backbone.modelbinder/Backbone.ModelBinder',
        'backbone.validation'           : prefixServer + 'vendor/backbone-validation/dist/backbone-validation-amd',
        'backbone.relational'           : prefixServer + 'vendor/backbone-relational/backbone-relational',

        // Bootstrap Paths
        'bootstrap.affix'               : prefixServer + 'vendor/bootstrap/js/affix',
        'bootstrap.alert'               : prefixServer + 'vendor/bootstrap/js/alert',
        'bootstrap.button'              : prefixServer + 'vendor/bootstrap/js/button',
        'bootstrap.carousel'            : prefixServer + 'vendor/bootstrap/js/carousel',
        'bootstrap.collapse'            : prefixServer + 'vendor/bootstrap/js/collapse',
        'bootstrap.dropdown'            : prefixServer + 'vendor/bootstrap/js/dropdown',
        'bootstrap.modal'               : prefixServer + 'vendor/bootstrap/js/modal',
        'bootstrap.popover'             : prefixServer + 'vendor/bootstrap/js/popover',
        'bootstrap.scrollspy'           : prefixServer + 'vendor/bootstrap/js/scrollspy',
        'bootstrap.tab'                 : prefixServer + 'vendor/bootstrap/js/tab',
        'bootstrap.tooltip'             : prefixServer + 'vendor/bootstrap/js/tooltip',
        'bootstrap.transition'          : prefixServer + 'vendor/bootstrap/js/transition',

        // JQuery File Upload Plug-in Paths
        'jquery.iframe-transport'       : prefixServer + 'vendor/jquery-file-upload/js/jquery.iframe-transport',
        'jquery.fileupload'             : prefixServer + 'vendor/jquery-file-upload/js/jquery.fileupload',
        'jquery.fileupload-ui'          : prefixServer + 'vendor/jquery-file-upload/js/jquery.fileupload-ui',
        'jquery.fileupload-process'     : prefixServer + 'vendor/jquery-file-upload/js/jquery.fileupload-process',
        'jquery.fileupload-resize'      : prefixServer + 'vendor/jquery-file-upload/js/jquery.fileupload-resize',
        'jquery.fileupload-validate'    : prefixServer + 'vendor/jquery-file-upload/js/jquery.fileupload-validate',

        // jQuery UI Paths
        'jquery.ui.core'                : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.core',
        'jquery.ui.widget'              : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.widget',
        'jquery.ui.mouse'               : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.mouse',
        'jquery.ui.position'            : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.position',
        'jquery.ui.draggable'           : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.draggable',
        'jquery.ui.droppable'           : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.droppable',
        'jquery.ui.resizable'           : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.resizable',
        'jquery.ui.selectable'          : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.selectable',
        'jquery.ui.sortable'            : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.sortable',
        'jquery.ui.accordion'           : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.accordion',
        'jquery.ui.autocomplete'        : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.autocomplete',
        'jquery.ui.button'              : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.button',
        'jquery.ui.datepicker'          : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.datepicker',
        'jquery.ui.dialog'              : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.dialog',
        'jquery.ui.menu'                : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.menu',
        'jquery.ui.progressbar'         : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.progressbar',
        'jquery.ui.slider'              : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.slider',
        'jquery.ui.spinner'             : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.spinner',
        'jquery.ui.tabs'                : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.tabs',
        'jquery.ui.tooltip'             : prefixServer + 'vendor/jquery-ui/ui/jquery.ui.tooltip'
    },

    // shim: Configure dependencies, exports, and custom initialization for non-AMD scripts.
    // See: http://requirejs.org/docs/api.html#config-shim
    shim: {
        // Vendor Library Shims
        'backbone'                      : { exports: 'Backbone', deps: ['underscore', 'jquery'] },
        'handlebars'                    : { exports: 'Handlebars' },
        'highcharts'                    : { exports: 'Highcharts' },
        'highcharts-more'               : { exports: 'Highcharts.seriesTypes.bubble', deps: ['highcharts'] },
        'jquery.mockjax'                : { exports: '$.mockjax', deps: ['jquery'] },
        'jquery.simulate'               : { exports: '$.simulate', deps: ['jquery']},
        'livestamp'                     : { exports: '$.livestamp', deps: ['jquery', 'moment'] },
        'select2'                       : { exports: 'Select2', deps: ['jquery']},
        'crel'                          : { exports: 'crel'},
        'sly'                           : { exports: 'Sly', deps: ['jquery']},
        'backbone.relational'           : { exports: 'Backbone.RelationalModel', deps: ['backbone']},

        // Bootstrap Shims
        'bootstrap.affix'               : { exports: 'jQuery.fn.affix',           deps: ['jquery'] },
        'bootstrap.alert'               : { exports: 'jQuery.fn.alert',           deps: ['jquery'] },
        'bootstrap.button'              : { exports: 'jQuery.fn.button',          deps: ['jquery'] },
        'bootstrap.carousel'            : { exports: 'jQuery.fn.carousel',        deps: ['jquery'] },
        'bootstrap.collapse'            : { exports: 'jQuery.fn.collapse',        deps: ['jquery', 'bootstrap.transition'] },
        'bootstrap.dropdown'            : { exports: 'jQuery.fn.dropdown',        deps: ['jquery'] },
        'bootstrap.modal'               : { exports: 'jQuery.fn.modal',           deps: ['jquery'] },
        'bootstrap.popover'             : { exports: 'jQuery.fn.popover',         deps: ['jquery', 'bootstrap.tooltip'] },
        'bootstrap.scrollspy'           : { exports: 'jQuery.fn.scrollspy',       deps: ['jquery'] },
        'bootstrap.tab'                 : { exports: 'jQuery.fn.tab',             deps: ['jquery'] },
        'bootstrap.tooltip'             : { exports: 'jQuery.fn.tooltip',         deps: ['jquery'] },
        'bootstrap.transition'          : { exports: 'jQuery.fn.emulateTransitionEnd', deps: ['jquery'] },

        // jQuery UI Core Shims
        'jquery.ui.core'                : { exports: 'jQuery.ui',       deps: ['jquery']},
        'jquery.ui.widget'              : { exports: 'jQuery.widget',   deps: ['jquery']},
        'jquery.ui.mouse'               : { exports: 'jQuery.ui.mouse', deps: ['jquery', 'jquery.ui.core', 'jquery.ui.widget']},
        'jquery.ui.position'            : { exports: 'jQuery.position', deps: ['jquery']},

        // jQuery UI Interaction Shims
        'jquery.ui.draggable'           : { exports: 'jQuery.ui.draggable',  deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse']},
        'jquery.ui.droppable'           : { exports: 'jQuery.ui.droppable',  deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse', 'jquery.ui.draggable']},
        'jquery.ui.resizable'           : { exports: 'jQuery.ui.resizable',  deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse']},
        'jquery.ui.selectable'          : { exports: 'jQuery.ui.selectable', deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse']},
        'jquery.ui.sortable'            : { exports: 'jQuery.ui.sortable',   deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse']},

        // jQuery UI Widget Shims
        'jquery.ui.accordion'           : { exports: 'jQuery.ui.accordion',    deps: ['jquery.ui.core', 'jquery.ui.widget']},
        'jquery.ui.autocomplete'        : { exports: 'jQuery.ui.autocomplete', deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.position', 'jquery.ui.menu']},
        'jquery.ui.button'              : { exports: 'jQuery.ui.button',       deps: ['jquery.ui.core', 'jquery.ui.widget']},
        'jquery.ui.datepicker'          : { exports: 'jQuery.ui.datepicker',   deps: ['jquery.ui.core']},
        'jquery.ui.dialog'              : { exports: 'jQuery.ui.dialog',       deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse', 'jquery.ui.position', 'jquery.ui.draggable', 'jquery.ui.resizable', 'jquery.ui.button']},
        'jquery.ui.menu'                : { exports: 'jQuery.ui.menu',         deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.position']},
        'jquery.ui.progressbar'         : { exports: 'jQuery.ui.progressbar',  deps: ['jquery.ui.core', 'jquery.ui.widget']},
        'jquery.ui.slider'              : { exports: 'jQuery.ui.slider',       deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse']},
        'jquery.ui.spinner'             : { exports: 'jQuery.ui.spinner',      deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.button']},
        'jquery.ui.tabs'                : { exports: 'jQuery.ui.tabs',         deps: ['jquery.ui.core', 'jquery.ui.widget']},
        'jquery.ui.tooltip'             : { exports: 'jQuery.ui.tooltip',      deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.position']},
        'jquery.iframe-transport'       : {exports: 'jQuery.ajaxSettings.converters["iframe script"]', deps: ['jquery']},
        'jquery.fileupload'             : {exports: 'jQuery.blueimp.fileupload', deps: ['jquery.ui.widget']}
    },

    // deps: An array of dependencies to load as soon as require() is defined.
    // See: http://requirejs.org/docs/api.html#config-deps
    deps: ['jquery', 'underscore', 'backbone', 'bootstrap.alert']

    // callback: A function to execute after deps have been loaded.
    // See: http://requirejs.org/docs/api.html#config-callback
    // callback: function () { 'use strict'; return this; }
};
