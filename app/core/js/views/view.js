define(
    ['backbone'] ,
    function () {
        'use strict';
        return Backbone.View.extend({
            constructor: function () {
                Backbone.View.prototype.constructor.apply(this,arguments);
                this.$el
                    .attr('data-backbone-view', this.cid)
                    .data('view', this)
                ;
                return this;
            },

            close: function () {
                if(!this.isClosed) {
                    if(this.beforeClose && _.isFunction(this.beforeClose)) {
                        this.beforeClose();
                    }
                    this.isClosed = true;
                    this.closeChildViews()
                        .clean()
                        .remove()
                        .unbind()
                    ;
                }
                return this;
            },
            closeChildViews: function(){
                var childViews = this.$(['data-backbone-view']),
                    parent = this;

                childViews.each( function() {
                    var view = $(this).data('view');
                    if(view instanceof Backbone.View){
                        parent.stopListening(view);
                        view.close();
                    }

                })
                return this;
            },

            clean: function() {
                this.$el.empty();
                return this;
            }

        });



    }
)