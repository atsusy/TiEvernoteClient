namespace('EvCl.Evernote', function(exports){
	var config = EvCl.Evernote.config;
	var api = EvCl.Evernote.api;
	
	exports.authenticate = function(args){
		var userstore = api.createUserStoreClient(config.url+"user");
		userstore.authenticate(		
			args.email, args.password,
			config.consumerKey, config.consumerSecret, 
			function(event) {
				if(event.type == 'success') {
					Ti.App.Properties.setString('email', event.result.user.email);
					Ti.App.Properties.setString('authenticationToken', event.result.authenticationToken);
					Ti.App.Properties.setString('userShardId', event.result.user.shardId);
					Ti.App.Properties.setDouble('expired', new Date().getTime() + (event.result.expiration - event.result.currentTime));
					args.success();
				} else {
					args.error(event.error);
				}
			}
		);
	};
	
	exports.refreshAuthentication = function(args){
		var userstore = api.createUserStoreClient(config.url+'user');
		userstore.refreshAuthentication(Ti.App.Properties.getString('authenticationToken'), function(event){
			if (event.type == 'success') {
				Ti.App.Properties.setString('authenticationToken', event.result.authenticationToken);
				Ti.App.Properties.setDouble('expired', new Date().getTime() + (event.result.expiration - event.result.currentTime));
				args.success();
			} else {
				args.error(event.error);
			}
		});
	};
});
