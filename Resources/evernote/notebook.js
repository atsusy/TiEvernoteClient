namespace('EvCl.Evernote', function(exports){
	var config = EvCl.Evernote.config;
	var api = EvCl.Evernote.api;
	
	var checkAuth = function(){
		
	};
	
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
	};
	
	exports.findNotes = function(args) {
		var auth = EvCl.Evernote.auth;
		if(!auth){
			/*
			 * TODO
			 */
			return;
		}
		var notestore = api.createNoteStoreClient(config.url+"note/"+auth.shardId);
		var filter = api.createNoteFilter();
		if(args.notebook){
			filter.notebookGuid = args.notebook.guid;
		}
		notestore.findNotes(auth.token, filter, 0, 100, function(e){
			if(e.type == 'success'){
				args.success(e.result);
			}else{
				args.error(e.error);
			}
		});
	};	
});
