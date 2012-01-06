namespace('EvCl.UI', function(exports){
	exports.createNotesWindow = function(args){
		var title;
		var notebook = null;
		if(args.notebook){
			notebook = args.notebook;
			title = notebook.name;
		} 
		var tag = null;
		if(args.tag){
			tag = args.tag;
			title = tag.name;
		}
		
		/*
		 * UI Layout definitions
		 */
		var window = Ti.UI.createWindow({
			title:title,
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
		
		var findNotes = function(){
			EvCl.Evernote.findNotes({
				notebook:notebook,
				tag:tag,
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
			findNotes();
		});	
		
		addNoteButton.addEventListener('click', function(){
			EvCl.UI.currentTab.open(EvCl.UI.createAddNoteWindow(notebook));
		});

		Ti.App.fireEvent('app:noteAdded', function(){
			findNotes();
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
		
		var sections = [];
		
		var tableView = Ti.UI.createTableView({
			style:Ti.UI.iPhone.TableViewStyle.GROUPED
		});
		window.add(tableView);
		
		var titleSection = Ti.UI.createTableViewSection({
			headerTitle:'New note'
		});
		sections.push(titleSection);
		
		var titleRow = Ti.UI.createTableViewRow({
			touchEnabled:false,
			selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
		});
		titleSection.add(titleRow);
		
		var titleField = Ti.UI.createTextField({
			paddingLeft:10,
			paddingRight:10,
			color:'black',
			hintText:'Enter new note title'
		});
		titleRow.add(titleField);
		
		var contentSection = Ti.UI.createTableViewSection({
			touchEnabled:false,
			selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
		});
		sections.push(contentSection);
		
		var contentRow = Ti.UI.createTableViewRow({
			height: 140
		});
		contentSection.add(contentRow);
		
		var contentArea = Ti.UI.createTextArea({
			borderWidth:0,
			borderRadius:9,
			color:'black',
			font:{ fontSize:'16' },
			value:''
		});
		contentRow.add(contentArea);
		
		var tagsSection = Ti.UI.createTableViewSection({
			isTagSection:true,
			headerTitle:'Note tags',
			touchEnabled:false,
			selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
		});
		sections.push(tagsSection);
		
		var addTagsRow = Ti.UI.createTableViewRow({
			title:'+ Add new tag'
		});
		tagsSection.add(addTagsRow);
		
		addTagsRow.addEventListener('click', function(){
			var tagRow = Ti.UI.createTableViewRow({
				isTagRow:true,
				editable:true,
				touchEnabled:false,
				selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
			});
			
			var tagField = Ti.UI.createTextField({
				paddingLeft:10,
				paddingRight:10,
				color:'black',
				hintText:'Enter new note tag'
			});
			tagRow.add(tagField);
			
			tableView.insertRowAfter(2, tagRow);
		});
		
		var attributesSection = Ti.UI.createTableViewSection({
			headerTitle:'Note attributes',
			touchEnabled:false,
			selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
		});
		sections.push(attributesSection);
		
		var gpsRow = Ti.UI.createTableViewRow({
			title: 'GPS',
			touchEnabled: false,
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
		});
		attributesSection.add(gpsRow);
		
		var gpsSwitch = Ti.UI.createSwitch({
			right: 10,
			value: false
		});
		gpsRow.add(gpsSwitch);
		
		var latitude;
		var longitude;
		
		gpsSwitch.addEventListener('change', function(){
			if (this.value) {
				if (Ti.Geolocation.locationServicesEnabled) {
					Ti.Geolocation.getCurrentPosition(function(e){
						if (e.error) {
							/*
							 * TODO
							 */
						} else {
							latitude = e.coords.latitude;
							longitude = e.coords.longitude;
						}
					});
				} else {
					/*
					 * TODO
					 */
				}
			} else {
				latitude = null;
				longitude = null;
			}
		});
		
		var sourceUrlRow = Ti.UI.createTableViewRow({
			touchEnabled: false,
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
		});
		attributesSection.add(sourceUrlRow);
		
		var sourceUrlField = Ti.UI.createTextField({
			paddingLeft:10,
			paddingRight:10,
			color:'black',
			hintText:'Enter source URL'
		});
		sourceUrlRow.add(sourceUrlField);
		
		tableView.setData(sections);
		
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
			var tagNames = [];
			tableView.getData().forEach(function(value, key, array){
				if (value.isTagSection) {
					value.rows.forEach(function(value, key, array){
						if (value.isTagRow) {
							if (value.getChildren()[0].value) {
								tagNames.push(value.getChildren()[0].value);
							}
						}
					});
				}
			});
			window.rightNavButton = addingIndicator;
			EvCl.Evernote.addNote({
				title:titleField.value,
				content:createENML(contentArea.value),
				notebookGuid:notebook.guid,
				tagNames:tagNames,
				attributes:{
					latitude:latitude,
					longitude:longitude,
					sourceURL:sourceUrlField.value
				},
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
