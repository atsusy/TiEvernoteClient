namespace('EvCl.Evernote', function(exports){
	var config = EvCl.Evernote.config;
	var api = EvCl.Evernote.api;
	
	exports.listNotebooks = function(args) {
		var auth = EvCl.Evernote.auth;
		if(!auth){
			/*
			 * TODO
			 */
			return;
		}
		var notestore = api.createNoteStoreClient(config.url+"note/"+auth.shardId);
		notestore.listNotebooks(auth.token, function(e){
			if(e.type == 'success'){
				args.success(e.result);
			}else{
				args.error(e.error);
			}
		});	
	}
	
	exports.addNotebook = function(args){
		var auth = EvCl.Evernote.auth;
		if(!auth){
			/*
			 * TODO
			 */
			return;
		}
		var notestore = api.createNoteStoreClient(config.url+"note/"+auth.shardId);
		var notebook = api.createNotebook();
		notebook.name = args.name;
		notestore.createNotebook(auth.token, notebook, function(e){
			if(e.type == 'success'){
				args.success();
			}else{
				args.error(e.error);
			}
		});
	}
});
