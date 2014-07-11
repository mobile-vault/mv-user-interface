define(
    ['underscore', 'exports'],
    function (_, exports) {
        'use strict';
        var Utils = exports.Utils = {};
        _.extend(Utils, {
            _docTitleSeparator: ' | ',

            /**
             * @method setDocumentTitle
             * @param title {string} Title to append
             * @returns {string} The final document title
             */
            setDocumentTitle: function (title) {
                // backup document title
                if (_.isUndefined(this._docTitle)) {
                    this._docTitle = document.title;
                }

                var out;
                if (_.isString(title)) {
                    out = document.title = this._docTitle + this._docTitleSeparator + title;
                } else {
                    out = document.title = this._docTitle;
                }

                return out;
            }
        });
    }
);
