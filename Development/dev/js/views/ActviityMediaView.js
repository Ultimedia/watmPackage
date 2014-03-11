appData.views.ActivityMediaView = Backbone.View.extend({

    initialize: function () {
      appData.events.getMediaSuccesEvent.bind("mediaLoadSuccesHandler", this.getMediaLoadSuccesHandler);
      appData.services.phpService.getMedia(this.model); 
      appData.views.ActivityMediaView.model = this.model;

      appData.views.ActivityMediaView.win = this.win;
      Backbone.on('addPhotoToDatabaseHandler', this.addPhotoToDatabaseHandler);
    },

    events: {
      "click #addMediaButton": "capturePhotoEditHandler"
    },

    getMediaLoadSuccesHandler: function(media){
      console.log(media);

      appData.views.ActivityDetailView.mediaListView = [];
      appData.views.ActivityDetailView.model.attributes.media = media;
      appData.views.ActivityDetailView.model.attributes.media.each(function(mediaModel) {

          var mediaUser = appData.collections.users.where({user_id:mediaModel.attributes.user_id});
              mediaUser = mediaUser[0];
              mediaModel.attributes.userModel = mediaUser.attributes;
              mediaModel.attributes.url = mediaModel.attributes.url;
              mediaModel.attributes.imagePath = appData.settings.imagePath;

          appData.views.ActivityDetailView.mediaListView.push(new appData.views.ActivityMediaViewer({
            model : mediaModel
          }));
      });

      $('#mediaContenListt', appData.settings.currentModuleHTML).empty();
      _(appData.views.ActivityDetailView.mediaListView).each(function(dv) {
          $('#mediaContenListt', appData.settings.currentModuleHTML).append(dv.render().$el);
      });
    },

    render: function() { 
      this.$el.html(this.template(this.model.attributes));
      appData.settings.currentModuleHTML = this.$el;

      // Hide the upload button if we're not on a native device
      if(appData.settings.native){
        $('#addMediaButton',appData.settings.currentModuleHTML).removeClass('hide');
      }

        return this; 
    },

    capturePhotoEditHandler: function() {
      var page = this.$el;

      // Retrieve image file location from specified source
      navigator.camera.getPicture(this.uploadPhoto,
        function(message) { 
        },{ quality: 50, targetWidth: 640, targetHeight: 480, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.CAMERA }
      );
    },

    uploadPhoto: function(imageURI) {
      var options = new FileUploadOptions();
      options.fileKey="file";
      options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
      options.mimeType="image/jpeg";

      var params = new Object();
      params.value1 =  options.fileName;
      appData.views.ActivityMediaView.uploadedPhotoUrl = options.fileName;

      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();  
      ft.upload(imageURI, appData.settings.servicePath + appData.settings.imageUploadService, appData.views.ActivityMediaView.win(), null, options);    
    },

    win: function(r) {
      appData.services.phpService.addPhotoToDatabase(appData.views.ActivityMediaView.uploadedPhotoUrl, appData.views.ActivityMediaView.model.attributes.activity_id);
    },

    addPhotoToDatabaseHandler: function(){
      // get images from database
      appData.services.phpService.getMedia(appData.views.ActivityMediaView.model); 
    }
});

