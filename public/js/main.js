var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "list",
        "orchids/page/:page"	: "list",
        "orchids/add"         : "addOrchid",
        "orchids/:id"         : "orchidDetails",
        "about"             : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var orchidList = new OrchidCollection();
        orchidList.fetch({success: function(){
            $("#content").html(new OrchidListView({model: orchidList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    orchidDetails: function (id) {
        var orchid = new Orchid({_id: id});
        orchid.fetch({success: function(){
            $("#content").html(new OrchidView({model: orchid}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addOrchid: function() {
        var orchid = new Orchid();
        $('#content').html(new OrchidView({model: orchid}).el);
        this.headerView.selectMenuItem('add-menu');
          $( "#purchasedate" ).datepicker();
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'OrchidView', 'OrchidListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});