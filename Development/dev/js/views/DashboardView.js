appData.views.DashboardView = Backbone.View.extend({

    initialize: function () {
        console.log(appData.collections);

        var that = this;
        this.searching = false;
     
        appData.events.updateActivitiesEvent.bind("activitiesUpdateHandler", this.activitiesUpdateHandler);        
        appData.collections.activities.sort_by_attribute('sql_index');
        Backbone.on('dashboardUpdatedHandler', this.generateAcitvitiesCollection);

        // update activities collection
        appData.views.DashboardView.markers = [];
        appData.views.DashboardView.clearMarkers = this.clearMarkers;
        appData.services.phpService.getActivities(false, null);
    },

    events: {
        "change #sortActivities": "sortActivitiesChangeHandler",
        "click #searchButton": "toggleSearchHandler",
        "keyup #searchInput": "searchHandler"
    },

    activitiesUpdateHandler: function(){
        this.generateAcitvitiesCollection();
    },

    generateAcitvitiesCollection: function(){
        Backbone.off('dashboardUpdatedHandler', this.generateAcitvitiesCollection);

        appData.views.activityListView = [];
        appData.views.locationList = [];

        var selectedCollection;
        if(this.searching){
            $(appData.collections.activitiesSearch).each(function(index, activity) {
              appData.views.locationList.push(activity);
              appData.views.activityListView.push(new appData.views.DashboardActivityView({
                model : activity
              }));
            });

        }else{
            appData.collections.activities.each(function(activity) {
              appData.views.locationList.push(activity);
              appData.views.activityListView.push(new appData.views.DashboardActivityView({
                model : activity
              }));
            });
        }

        $('#activityTable', appData.settings.currentPageHTML).empty();
        _(appData.views.activityListView).each(function(dv) {
            $('#activityTable', appData.settings.currentPageHTML).append(dv.render().$el);
        });

        this.setMarkers(appData.views.locationList);
    },

    searchHandler: function(evt){

     var search = $(evt.target).val().toLowerCase();
      if(search.length > 0){
      appData.collections.activitiesSearch = appData.collections.activities.filter(function(model) {
          return _.some(
            [ model.get('title') ], 
            function(value) {
              return value.toLowerCase().indexOf(search) != -1;
            });
         }); 
            this.searching = true;

      }else{
        this.searching = false;
      }

      this.generateAcitvitiesCollection();
    },

    // toggle search
    toggleSearchHandler: function(){
        $('#searchBar').toggleClass('hide');
        if($('#searchBar', appData.settings.currentPageHTML).hasClass('hide')){
            this.searching = false;
        }else{
            this.searching = true;
        }
    },

    // sort the activities table
    sortActivitiesChangeHandler: function(){
        
        switch($("#sortActivities")[0].selectedIndex){
            case 0:
                appData.collections.activities.sort_by_attribute('sql_index');
            break;

            case 1:
                appData.collections.activities.each(function(activity) {
                    
                    // calculate the distance between my current location and the location of the event
                    // using the Haversine formula:
                    var current_location = appData.models.userModel.get('current_location').split(',');
                    var point1 = {};
                        point1.lat = current_location[0];
                        point1.lng = current_location[1];

                    var activity_location = activity.attributes.coordinates.split(',');
                    var point2 = {};
                        point2.lat = activity_location[0];
                        point2.lng = activity_location[1];

                    var rad = function(x) {
                        return x*Math.PI/180;
                    }

                    var R = 6371; // earth's mean radius in km
                    var dLat  = rad(point2.lat - point1.lat);
                    var dLong = rad(point2.lng - point1.lng);

                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                          Math.cos(rad(point1.lat)) * Math.cos(rad(point2.lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    var d = R * c;
                    var resultaat = d.toFixed(2);

                        activity.attributes.distance = parseInt(resultaat);
                });

                // now order the collection by the distance
                appData.collections.activities.sort_by_attribute('distance');

            break;
        }

        this.generateAcitvitiesCollection();
    },

    render: function () {

        var view = this;

        this.$el.html(this.template({sortForm: appData.collections.sortOptions.toJSON()}));
        appData.settings.currentPageHTML = this.$el;

        this.initMap();
        this.generateAcitvitiesCollection();

        return this;
    },

    initMap: function() { 
        appData.settings.mapAdded = true;

        var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng(appData.settings.defaultLocation[0], appData.settings.defaultLocation[1]),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        }
        appData.views.DashboardView.map = new google.maps.Map($('#map_canvas',appData.settings.currentPageHTML)[0], mapOptions);

        // resize and relocate map
        google.maps.event.addListenerOnce(appData.views.DashboardView.map, 'idle', function() {
            google.maps.event.trigger(appData.views.DashboardView.map, 'resize');
            appData.views.DashboardView.map.setCenter(new google.maps.LatLng(appData.settings.defaultLocation[0], appData.settings.defaultLocation[1]), 13);
        });

        if(appData.settings.native){
            Backbone.on('getMyLocationHandler', this.getMyLocationHandler);
            appData.services.utilService.getLocationService("dashboard");
        }
    },

    getMyLocationHandler: function(position){
        Backbone.off('getMyLocationHandler');
        appData.views.DashboardView.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 13);
    },

    setMarkers: function(models){
        appData.views.DashboardView.clearMarkers();

        $(models).each(function(index, model){
            var coordinates = model.attributes.coordinates.split(",");
            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(coordinates[0], coordinates[1]),
              map:  appData.views.DashboardView.map,
              title: ""
            });

            marker.activityModel = model;

            google.maps.event.addListener(marker, "click", function(evt) {
                window.location = "#activity/" + this.activityModel.attributes.activity_id;
            });

            appData.views.DashboardView.markers.push(marker);
        });
    },

    clearMarkers: function(){
        for (var i=0; i<appData.views.DashboardView.markers.length; i++) {
          appData.views.DashboardView.markers[i].setVisible(false);
        }
        appData.views.DashboardView.markers = [];
    },
});

