namespace('EvCl.UI', function(exports){
	exports.createNotesWindow = function(notebook){
		/*
		 * UI Layout definitions
		 */
		var window = Ti.UI.createWindow({
			title:notebook.name,
			barColor:'#338844',
		});
		
		var notesTable = Ti.UI.createTableView({
			
		});
		window.add(notesTable);
		
		var addNoteButton = Ti.UI.createButton({
			systemButton:Ti.UI.iPhone.SystemButton.ADD
		});
		window.rightNavButton = addNoteButton;
		
		/*
		 * Functions
		 */
		var updateNoteContent = function(note, label){
			EvCl.Evernote.getNoteContent({
				guid:note.guid,
				success:function(content){
					var summary = content.replace(/<[^>]+>/g, "")
										 .replace(/[\r\n]/g,"")
										 .trim();
					label.text = summary;
				},
				error:function(error){
					/*
					 * TODO
					 */
				}
			});	
		}

		var createNoteRow = function(note){
			var row = Ti.UI.createTableViewRow({
				height:72,
				hasChild:true
			});
			
			var title = Ti.UI.createLabel({
				top:4,
				left:6,
				width:'auto',
				height:'auto',
				font: { fontSize:15, fontWeight:'bold'},
				text:note.title
			});
			row.add(title);
			
			var content = Ti.UI.createLabel({
				top:20,
				left:6,
				right:8,
				bottom:4,
				font:{ fontSize:12 },
				color:'#999999',
			});
			row.add(content);

			updateNoteContent(note, content);
							
			return row;
		};
		
		var findNotes = function(notebook){
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
			});			
		}
		
		/*
		 * Event Handlers
		 */
		window.addEventListener('open', function(e){
			findNotes(notebook);
		});	
		
		addNoteButton.addEventListener('click', function(){
			EvCl.UI.currentTab.open(EvCl.UI.createAddNoteWindow(notebook));
		});

		Ti.App.fireEvent('app:noteAdded', function(){
			findNotes(notebook);
		});
		
		return window;
	}
	
	exports.createAddNoteWindow = function(notebook){
		/*
		 * UI Layout definitions
		 */
		var window = Ti.UI.createWindow({
			title:L('Add Note'),
			backgroundColor:'#d8dfea',
			backButtonTitle:L('Back'),
			barColor:'#338844',
		});
		
		var addButton = Ti.UI.createButton({
			title:L('Add')
		});
		window.rightNavButton = addButton;
		
		var addingIndicator = Ti.UI.createActivityIndicator({
			width:32,
			height:32,
			visible:true
		});
		
		var titleField = Ti.UI.createTextField({
			top:8,
			left:8,
			right:8,
			color:'black',
			hintText:'Enter new note title',
			height:40,
	        borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		window.add(titleField);
		
		var contentArea = Ti.UI.createTextArea({
			top:60,
			left:8,
			right:8,
			bottom:8,
			color:'black'
		});
		window.add(contentArea);
		
		/*
		 * Functions
		 */
		var createENML = function(text){
			var xhtml = '<?xml version="1.0" encoding="UTF-8"?>';
			xhtml += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
			xhtml += '<en-note>';
			xhtml += text;
			xhtml += "</en-note>";
			return xhtml;
		}
		
		/*
		 * Event Handlers
		 */
		addButton.addEventListener('click', function(){
			if(!titleField.value){
				alert(L("Please enter note title."));
				return;
			}
			window.rightNavButton = addingIndicator;
			EvCl.Evernote.addNote({
				title:titleField.value,
				content:createENML(contentArea.value),
				notebookGuid:notebook.guid,
				success:function(){
					window.close();
					window.rightNavButton = addButton;
					Ti.App.fireEvent("app:noteAdded");
				},
				error:function(error){
					alert(error);
					window.rightNavButton = addButton;
				}
			});			
		});
		return window;
	}
});
