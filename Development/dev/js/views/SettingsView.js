appData.views.SettingsView = Backbone.View.extend({

    initialize: function () {
    	appData.views.SettingsView.avatarUploadHandler = this.avatarUploadHandler;
    	appData.views.SettingsView.avatarUpdatedHandler = this.avatarUpdatedHandler;
    },

    render: function () {
    	console.log(appData.models.userModel.attributes);

      this.$el.html(this.template({user: appData.models.userModel.attributes}));
      appData.settings.currentPageHTML = this.$el;

      if(appData.settings.native){
        $('#changeAvatar').removeClass('hide');
      }

      return this;
    },

    events: {
    	"click #changeAvatar": "changeAvatarHandler",
      "click #signOutButton": "signOutHandler"
    },

    signOutHandler: function(){
      window.location.hash = "#";
    },   

    avatarUpdatedHandler: function(){
    	Backbone.off('updateUserAvatar');
    	$('#userAvatar', appData.settings.currentPageHTML).attr('src', appData.settings.imagePath + appData.views.SettingsView.uploadedPhotoUrl);
    },

    changeAvatarHandler: function(){

		navigator.camera.getPicture(this.uploadAvatar,
			function(message) { 
			},{ quality: 50, targetWidth: 640, targetHeight: 480, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY }
		);
    	// change avatar
    },

    avatarUploadHandler: function(){
    	Backbone.on('updateUserAvatar', appData.views.SettingsView.avatarUpdatedHandler);
    	appData.services.phpService.updateUserAvatar(appData.settings.imagePath + appData.views.SettingsView.uploadedPhotoUrl);
    },

    uploadAvatar: function(imageURI) {
      var options = new FileUploadOptions();
      options.fileKey="file";
      options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
      options.mimeType="image/jpeg";

      var params = new Object();
      params.value1 =  options.fileName;
      appData.views.SettingsView.uploadedPhotoUrl = options.fileName;

      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();  
      ft.upload(imageURI, appData.settings.servicePath + appData.settings.imageUploadService, appData.views.SettingsView.avatarUploadHandler(), null, options);    
    },
});