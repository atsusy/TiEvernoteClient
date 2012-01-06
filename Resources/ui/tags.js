namespace('EvCl.UI', function(exports){
	exports.createTagsWindow = function(){
		/*
		 * UI Layout definitions
		 */
		var window = Ti.UI.createWindow({
			barColor:'#338844',
			title:L('Tags')
		});
		
		var tagsTable = Ti.UI.createTableView({
		});
		window.add(tagsTable);
		
		var addTagButton = Ti.UI.createButton({
			systemButton:Ti.UI.iPhone.SystemButton.ADD
		});
		window.rightNavButton = addTagButton;
		
		/*
		 * Functions
		 */
		var createTagRow = function(tag){
			var row = Ti.UI.createTableViewRow({
				height:48,
				hasChild:true,
				tag:tag
			});
			
			var image = Ti.UI.createImageView({
				image:'images/tags_icon.png',
				left:4,
				width:36,
				height:36
			});
			row.add(image);
			
			var title = Ti.UI.createLabel({
				left:45,
				right:0,
				height:'auto',
				text:tag.name,
				color:'#000000'
			});
			row.add(title);
			
			row.addEventListener('click', function(e){
				var tag = e.rowData.tag;
				EvCl.UI.currentTab.open(
					EvCl.UI.createNotesWindow({
						tag:tag
					})
				);
			});
			
			return row;
		};
		
		var listTags = function(){
			EvCl.Evernote.listTags({
				success:function(tags){
					tagsTable.data = tags.map(function(tag){
						return createTagRow(tag);
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
			listTags();
		});		
		
		Ti.App.addEventListener('app:tagAdded', function(e){
			listTags();
		});

		Ti.App.addEventListener('app:noteAdded', function(e){
			listTags();
		});
		
		addTagButton.addEventListener('click', function(){
			EvCl.UI.currentTab.open(EvCl.UI.createAddTagWindow());
		});

		return window;		
	}
	
	exports.createAddTagWindow = function(notebook){
		/*
		 * UI Layout definitions
		 */
		var window = Ti.UI.createWindow({
			title:L('Add Tag'),
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
			top:40,
			left:8,
			right:8,
			color:'black',
			hintText:'Enter new tag name',
			height:40,
	        borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		window.add(titleField);
		
		/*
		 * Event Handlers
		 */		
		window.addEventListener('open', function(){
			titleField.focus();
		});
		
		addButton.addEventListener('click', function(e){
			if(!titleField.value){
				alert(L("Please enter tag name."));
				return;
			}
			window.rightNavButton = addingIndicator;
			EvCl.Evernote.addTag({
				name:titleField.value,
				success:function(){
					window.close();
					window.rightNavButton = addButton;
					Ti.App.fireEvent("app:tagAdded");
				},
				error:function(){
					window.rightNavButton = addButton;
				}
			});
		});
		
		return window;
	}
});