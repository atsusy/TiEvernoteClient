namespace('EvCl.Evernote', function(exports){
	var config = EvCl.Evernote.config;
	var api = EvCl.Evernote.api;
	
	exports.getNoteContent = function(args) {
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
		notestore.getNoteContent(Ti.App.Properties.getString('authenticationToken'), args.guid, function(e){
			if(e.type == 'success'){
				args.success(e.result);
			}else{
				args.error(e.error);
			}
		});
	}
	
	exports.findNotes = function(args) {
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
		var filter = api.createNoteFilter();
		if(args.notebook){
			filter.notebookGuid = args.notebook.guid;
		}
		notestore.findNotes(Ti.App.Properties.getString('authenticationToken'), filter, 0, 100, function(e){
			if(e.type == 'success'){
				args.success(e.result);
			}else{
				args.error(e.error);
			}
		});
	}
	
	exports.addNote = function(args){
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
		notestore.createNote(Ti.App.Properties.getString('authenticationToken'), note, function(e){
			if(e.type == 'success'){
				args.success();
			}else{
				args.error(e.error);
			}
		});
	}	
});
