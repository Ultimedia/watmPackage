User = Backbone.Model.extend({
	defaults: {
	    user_id: '',
	    name: '',
	    email: '',
	    facebook_data: {},
	    facebookUser: false,
	    current_location: "50.827404, 3.254647",
    	avatar_strength: 0,
    	avatar_equipment: 0,
    	avatar_stamina: 0,
    	avatar: "",
    	myChallenges: [],
    	myBadges: []
    },
	initialize: function(){
		
	}
});

