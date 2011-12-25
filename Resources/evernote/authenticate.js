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
					var auth = {
						shardId:event.result.user.shardId,
						token:event.result.authenticationToken
					};
					exports.auth = auth;
					args.success(auth);
				} else {
					args.error(event.error);
				}
			}
		);
	};
});
