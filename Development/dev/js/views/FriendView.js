appData.views.FriendView = Backbone.View.extend({

    initialize: function () {
      appData.views.FriendView.model = this.model;

      // is this a friend?
      if(appData.models.userModel.attributes.myFriends.where({"user_id": this.model.attributes.user_id}).length > 0){
        this.model.attributes.myFriend = true;
      }else if(appData.views.FriendView.model.attributes.user_id == appData.models.userModel.attributes.user_id){
        this.model.attributes.myFriend = true;
      }else{
        this.model.attributes.myFriend = false;
      }
    },

    render: function() { 
      this.$el.html(this.template(this.model.toJSON()));
      appData.settings.currentPageHTML = this.$el;
      return this; 
    }, 

    events: {
      "click #backButton": "backHandler",
      "click #addFriendButton": "addFriendHandler"
    },

    addFriendHandler: function(){
      Backbone.on('addedFriendHandler', this.addedAsFriendHandler);
      appData.services.phpService.addFriend(appData.views.FriendView.model.attributes.user_id, appData.models.userModel.attributes.user_id);
    },

    backHandler: function(){
      window.history.back();
    },

    addedAsFriendHandler: function(){
      Backbone.off('addedFriendHandler');
      $('#addFriendButton', appData.settings.currentPageHTML).remove();
    }
});

