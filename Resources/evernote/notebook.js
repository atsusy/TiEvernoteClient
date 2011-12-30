namespace('EvCl.Evernote', function(exports){
	var config = EvCl.Evernote.config;
	var api = EvCl.Evernote.api;
	
	exports.listNotebooks = function(args) {
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
		notestore.listNotebooks(Ti.App.Properties.getString('authenticationToken'), function(e){
			if(e.type == 'success'){
				args.success(e.result);
			}else{
				args.error(e.error);
			}
		});	
	}
	
	exports.addNotebook = function(args){
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
		var notebook = api.createNotebook();
		notebook.name = args.name;
		notestore.createNotebook(Ti.App.Properties.getString('authenticationToken'), notebook, function(e){
			if(e.type == 'success'){
				args.success();
			}else{
				args.error(e.error);
			}
		});
	}
});
