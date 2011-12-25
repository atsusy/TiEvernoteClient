namespace('EvCl.UI', function(exports){
	exports.createNotebooksWindow = function(){
		/*
		 * UI Layout definitions
		 */
		var window = Ti.UI.createWindow({
		});
		
		var notebooksTable = Ti.UI.createTableView({
		});
		window.add(notebooksTable);

		/*
		 * Functions
		 */
		var createNotebookRow = function(notebook){
			var row = Ti.UI.createTableViewRow({
				height:'auto',
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

		/*
		 * Event Handlers
		 */		
		Ti.App.addEventListener('app:authenticated', function(e){
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
		});
		
		return window;
	}
});
