namespace('EvCl.UI', function(exports){
	exports.createNotebooksWindow = function(){
		/*
		 * UI Layout definitions
		 */
		var window = Ti.UI.createWindow({
			barColor:'#338844',
			title:L('Notebooks')
		});
		
		var notebooksTable = Ti.UI.createTableView({
		});
		window.add(notebooksTable);
		
		var addNotebookButton = Ti.UI.createButton({
			systemButton:Ti.UI.iPhone.SystemButton.ADD
		});
		window.rightNavButton = addNotebookButton;

		/*
		 * Functions
		 */
		var createNotebookRow = function(notebook){
			var row = Ti.UI.createTableViewRow({
				height:48,
				hasChild:true,
				notebook:notebook
			});
			
			var image = Ti.UI.createImageView({
				image:'images/notebook.png',
				left:4,
				width:36,
				height:36
			});
			row.add(image);
			
			var title = Ti.UI.createLabel({
				left:45,
				right:0,
				height:'auto',
				text:notebook.name,
				color:'#000000'
			});
			row.add(title);
			
			row.addEventListener('click', function(e){
				var notebook = e.rowData.notebook;
				EvCl.UI.currentTab.open(
					EvCl.UI.createNotesWindow(notebook)
				);
			});
			
			return row;
		};
		
		var listNotebooks = function(){
			EvCl.Evernote.listNotebooks({
				success:function(notebooks){
					notebooksTable.data = notebooks.map(function(notebook){
						return createNotebookRow(notebook);
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
		Ti.App.addEventListener('app:authenticated', function(e){
			listNotebooks();
		});

		Ti.App.addEventListener('app:notebookAdded', function(e){
			listNotebooks();
		});
		
		addNotebookButton.addEventListener('click', function(){
			EvCl.UI.currentTab.open(EvCl.UI.createAddNotebookWindow());
		});
		
		return window;
	}
	
	exports.createAddNotebookWindow = function(){
		/*
		 * UI Layout definitions
		 */
		var window = Ti.UI.createWindow({
			barColor:'#338844',
			backgroundColor:'#d8dfea',
			title:L('Add Notebook')
		});
		
		var titleField = Ti.UI.createTextField({
			top:40,
			left:8,
			right:8,
			color:'black',
			hintText:'Enter new notebook name',
			height:40,
	        borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		window.add(titleField);
		
		var addButton = Ti.UI.createButton({
			title:L('Add')
		})
		window.rightNavButton = addButton;
		
		var addingIndicator = Ti.UI.createActivityIndicator({
			width:32,
			height:32,
			visible:true
		});
		
		/*
		 * Event Handlers
		 */		
		window.addEventListener('open', function(){
			titleField.focus();
		});
		
		addButton.addEventListener('click', function(e){
			if(!titleField.value){
				alert(L("Please enter notebook name."));
				return;
			}
			window.rightNavButton = addingIndicator;
			EvCl.Evernote.addNotebook({
				name:titleField.value,
				success:function(){
					window.close();
					window.rightNavButton = addButton;
					Ti.App.fireEvent("app:notebookAdded");
				},
				error:function(){
					window.rightNavButton = addButton;
				}
			});
		});
		
		return window;
	}
});
