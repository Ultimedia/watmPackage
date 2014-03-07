appData.views.ProfileFriendsView = Backbone.View.extend({
    initialize: function () {
    	appData.views.friendsListView = [];
        $(appData.models.userModel.attributes.myFriends.models).each(function(index, userModel) {
       	appData.views.friendsListView.push(new appData.views.FriendsListView({
            model:userModel
          }));
        });


        appData.views.ProfileFriendsView.friendRemovedHandler = this.friendRemovedHandler;
    },
    
    events:{
        "click .removeFriend": "removeFriendHandler"
    },

    friendRemovedHandler: function(){
        console.log('friend remove');
    },

    removeFriendHandler: function(evt){
        var friend_id = $(evt.target).parent().attr('friend-id');

        Backbone.on('friendRemovedHandler', appData.views.ProfileFriendsView.friendRemovedHandler);
        appData.services.phpService.removeFriend(friend_id);

        $(evt.target).parent().hide(200);

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