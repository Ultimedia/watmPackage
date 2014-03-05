appData.views.ProfileAvatarView = Backbone.View.extend({

    initialize: function () {

    },
    
    render: function() { 
    	this.$el.html(this.template(appData.models.userModel.toJSON()));
        appData.settings.currentModuleHTML = this.$el;
        return this; 
    }
});