(function($){

  window.FazzleX = {
    Modules: {
      modules: [],

      fetchTemplate: function(path, done, scope) {
        done = done || function(){};
        scope = scope || window;
        window.JST = window.JST || {};

        // Should be an instant synchronous way of getting the template, if it
        // exists in the JST object.
        if (JST[path]) {
          return done.call(scope,JST[path]);
        }

        // Fetch it asynchronously if not available from JST
        return $.get(path, function(contents) {
          var tmpl = _.template(contents);
          JST[path] = tmpl;

          done.call(scope,tmpl);
        });
      },
      register: function(module){
        FazzleX.Modules.modules.push(module);
      },
      execute: function(moduleId,element){
        var mod = false;
        $(FazzleX.Modules.modules).each(function(){
          if( this.id === moduleId ) {
            mod = this;
          }
        });
        if( mod ) {
          mod.run = mod.run || function(callback){
            callback = callback || function(){};
            FazzleX.Modules.fetchTemplate(this.template, function(tmpl) {
              callback.apply( this, [ tmpl ]);
            },this);
          };

          mod.run.call(mod,function(tpl,view){
            $(element).html( tpl() );
          });
        }
        else {
          console.log('Couldn\'t find module '+moduleId);
        }
        return mod;
      }
    }
  };

  FazzleX.Router = Backbone.Router.extend({
    routes: {
      '*actions': 'navigation'
    },
    getElement: function(element){
      return this.el;
    },
    setElement: function(element){
      this.el = element;
      return this;
    },
    navigation: function(action){

      if( action == "" ) {
        action = "login";
      }

      //
      FazzleX.Modules.execute( action, this.getElement() );
    }
  });

// "Add a Contact" button view
window.FacebookLoginView = Backbone.View.extend({
  el: $('#login-tabs'),
  
  events: {
    'click': 'add'
  },
  
  initialize: function(){
    console.log('Initializing Home View');
  },
  
  add: function( event ){
    //event.preventDefault();
    alert('this');
  }
});

  // define class extensions we're using.
  $.fn.fazzleUi = function(cfg){
    var o = {
      config: _.extend({}, cfg ),
      initialize: function( element ){
        var me = this;

        this.getRouter().setElement(element).on('route:navigation',function(action){
          $('a').removeClass('current');
          $('a[href=#'+action+']').addClass('current');

          var e = $( '#' + ( action === "" ? 'default' : action) ); // find the content action
          if( e.length > 0 && e.attr('title') ) {
            document.title = me.config.data.siteName + ' - ' + e.attr('title');
          }
        });
      },
      getRouter: function(){
        return this.router === undefined ? ( this.router = new FazzleX.Router({
        }) ) : this.router;
      }
    };

    //
    o.initialize( $( this ) );

    //
    Backbone.history.start();

    //
    return o;
  };

})(jQuery);