namespace('EvCl.UI', function(exports){
	exports.createNotesWindow = function(notebook){
		/*
		 * UI Layout definitions
		 */
		var window = Ti.UI.createWindow({
			title:notebook.name
		});
		
		var notesTable = Ti.UI.createTableView({
			
		});
		window.add(notesTable);
		
		/*
		 * Functions
		 */
		var createNoteRow = function(note){
			var row = Ti.UI.createTableViewRow({
				height:'auto',
				title:note.title
			});
			
			return row;
		};
		
		/*
		 * Event Handlers
		 */
		window.addEventListener('open', function(e){
			EvCl.Evernote.findNotes({
				notebook:notebook,
				success:function(noteList){
					notesTable.data = noteList.notes.map(function(note){
						return createNoteRow(note);
					});
				},
				error:function(error){
					/*
					 * TODO
					 */
				}
			})
		});	

		return window;
	}
});
