appData.views.ProfileFriendsView = Backbone.View.extend({
    initialize: function () {
    	appData.views.friendsListView = [];
        $(appData.models.userModel.attributes.myFriends.models).each(function(index, userModel) {
        	console.log(userModel);

       	appData.views.friendsListView.push(new appData.views.FriendsListView({
            model:userModel
          }));
        });
    },
    
    render: function() { 
    	this.$el.html(this.template());
        appData.settings.currentModuleHTML = this.$el;

        _(appData.views.friendsListView).each(function(listView) {
            $('#profileFriendsListView', appData.settings.currentModuleHTML).append(listView.render().$el);
        });

        return this; 
    },
});