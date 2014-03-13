appData.views.LoadingView = Backbone.View.extend({

    initialize: function () {
        appData.views.LoadingView = this;

        appData.events.getActivitiesSuccesEvent.bind("activitiesLoadedHandler", this.activitiesLoadedHandler);
        appData.events.getSportsSuccesEvent.bind("sportsLoadedHandler", this.sportsLoadedHandlers);
        appData.events.getUsersSuccesEvent.bind("usersLoadedHandler", this.usersLoadedHandler)
        appData.events.getBuurtenEvent.bind("buurtenLoadedHandler", this.buurtenLoadedHandler);
        appData.events.getLocationsSuccesEvent.bind("getLocationsSuccesHandler", this.getLocationsSuccesHandler);
        Backbone.on('getChallengesHandler', this.getChallengesHandler)
        Backbone.on('myPlannedActivitiesLoadedHandler', this.getMyPlannedActivitiesLoadedHandler);
        Backbone.on('myActivitiesLoadedHandler', this.getMyActivitiesLoadedHandler);
        Backbone.on('getFavouriteSportsHandler', this.getFavouriteSportsHandler)
        Backbone.on('getMyFavouriteSportsHandler', this.getMyFavouriteSportsHandler)
        Backbone.on('getMyChallengesHandler', this.getMyChallengesHandler);
        Backbone.on('getMyBadgesHandler', this.getMyBadgesHandler);
        Backbone.on('getFriendsHandler', this.getMyFriendsHandler)
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
    	appData.settings.currentPageHTML = this.$el;

        // load the data
        appData.services.phpService.getActivities(true);
        return this;
    },
    activitiesLoadedHandler: function(){
        appData.services.phpService.getSports();
    },

    sportsLoadedHandlers: function(){
        
        appData.services.phpService.getChallenges();
    },

    getChallengesHandler: function(){
        Backbone.off('getChallengesHandler');
        appData.services.phpService.getUsers();
    },

    usersLoadedHandler: function(){
        appData.services.phpService.getBuurten();
    },

    buurtenLoadedHandler: function(){
        appData.services.phpService.getLocations();
    },

    getLocationsSuccesHandler: function(){
        appData.services.phpService.getMyPlannedActivities();
    },

    getMyPlannedActivitiesLoadedHandler: function(){
      Backbone.off('myPlannedActivitiesLoadedHandler');
      appData.services.phpService.getMyActivities();
    },

    getMyActivitiesLoadedHandler: function(){
      Backbone.off('myActivitiesLoadedHandler');
      appData.services.phpService.getFavouriteSports();
    },

    getFavouriteSportsHandler: function(){
        appData.services.phpService.getUserFavouriteSports();
        Backbone.off('getFavouriteSportsHandler');
    },

    getMyFavouriteSportsHandler: function(){
        appData.services.phpService.getMyChallengesHandler();
        Backbone.off('getMyFavouriteSportsHandler');
    },

    getMyChallengesHandler: function(){
        Backbone.off('getMyChallengesHandler');
        appData.services.phpService.getMyBadges();
    },

    getMyBadgesHandler: function(){
        Backbone.off('getMyBadgesHandler');
        appData.services.phpService.getFriends();
    },

    getMyFriendsHandler: function(){
        Backbone.off('getFriendsHandler');
        appData.settings.dataLoaded = true;


        if(appData.collections.myFavouriteSports.length > 0){
            appData.router.navigate('dashboard', true);
        }else{
            appData.router.navigate('sportselector', true);
        }

       appData.views.LoadingView.destroy_view();

    },

    destroy_view: function() {

    //COMPLETELY UNBIND THE VIEW
    this.undelegateEvents();

    this.$el.removeData().unbind(); 

    //Remove view from DOM
    this.remove();  
    Backbone.View.prototype.remove.call(this);

    }

});
