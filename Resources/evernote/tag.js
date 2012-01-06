namespace('EvCl.Evernote', function(exports){
	var config = EvCl.Evernote.config;
	var api = EvCl.Evernote.api;
	
	exports.listTags = function(args) {
		EvCl.Evernote.refreshAuthentication({
			success:function(){},
			error:function(error){
				var loginWindow = EvCl.UI.createLoginWindow();
				loginWindow.open({
					modal:true
				});
			}
		});
		
		var notestore = api.createNoteStoreClient(config.url+"note/"+Ti.App.Properties.getString('userShardId'));
		notestore.listTags(Ti.App.Properties.getString('authenticationToken'), function(e){
			if(e.type == 'success'){
				args.success(e.result);
			}else{
				args.error(e.error);
			}
		});	
	}
	
	exports.addTag = function(args){
		EvCl.Evernote.refreshAuthentication({
			success:function(){},
			error:function(error){
				var loginWindow = EvCl.UI.createLoginWindow();
				loginWindow.open({
					modal:true
				});
			}
		});
		
		var notestore = api.createNoteStoreClient(config.url+"note/"+Ti.App.Properties.getString('userShardId'));
		var tag = api.createTag();
		tag.name = args.name;
		notestore.createTag(Ti.App.Properties.getString('authenticationToken'), tag, function(e){
			if(e.type == 'success'){
				args.success();
			}else{
				args.error(e.error);
			}
		});
	}
});