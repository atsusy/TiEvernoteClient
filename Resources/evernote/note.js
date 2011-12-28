namespace('EvCl.Evernote', function(exports){
	var config = EvCl.Evernote.config;
	var api = EvCl.Evernote.api;
	
	exports.getNoteContent = function(args) {
		var auth = EvCl.Evernote.auth;
		if(!auth){
			/*
			 * TODO
			 */
			return;
		}
		var notestore = api.createNoteStoreClient(config.url+"note/"+auth.shardId);
		notestore.getNoteContent(auth.token, args.guid, function(e){
			if(e.type == 'success'){
				args.success(e.result);
			}else{
				args.error(e.error);
			}
		});
	}
	
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
	}
	
	exports.addNote = function(args){
		var auth = EvCl.Evernote.auth;
		if(!auth){
			/*
			 * TODO
			 */
			return;
		}
		var notestore = api.createNoteStoreClient(config.url+"note/"+auth.shardId);
		var note = api.createNote();
		note.title = args.title;
		note.content = args.content;
		note.tagNames = args.tagNames;
		note.notebookGuid = args.notebookGuid;
		var attributes = api.createNoteAttributes();
		if (args.attributes.latitude) { attributes.latitude = args.attributes.latitude; }
		if (args.attributes.longitude) { attributes.longitude = args.attributes.longitude; }
		if (args.attributes.sourceURL) { attributes.sourceURL = args.attributes.sourceURL; }
		note.attributes = attributes;
		notestore.createNote(auth.token, note, function(e){
			if(e.type == 'success'){
				args.success();
			}else{
				args.error(e.error);
			}
		});
	}	
});
