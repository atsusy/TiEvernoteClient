var namespace = require('syrup').namespace

if (!Ti.App.Properties.hasProperty('email')) {
	Ti.App.Properties.setString('email', '');
}

if (!Ti.App.Properties.hasProperty('authenticationToken')) {
	Ti.App.Properties.setString('authenticationToken', '');
}

if (!Ti.App.Properties.hasProperty('userShardId')) {
	Ti.App.Properties.setString('userShardId', '');
}

if (!Ti.App.Properties.hasProperty('expired')) {
	Ti.App.Properties.setDouble('expired', 0);
}

Ti.include('evernote/config.js');
Ti.include('evernote/api.js');
Ti.include('evernote/authenticate.js');
Ti.include('evernote/notebook.js');
Ti.include('evernote/note.js');
Ti.include('ui/login.js');
Ti.include('ui/notebooks.js');
Ti.include('ui/notes.js');

var tabGroup = Ti.UI.createTabGroup();

var notebooksTab = Ti.UI.createTab({
	window:EvCl.UI.createNotebooksWindow(),
	title:L('Notebooks'),
	icon:'images/notebooks_icon.png'
});
tabGroup.addTab(notebooksTab);

EvCl.UI.currentTab = notebooksTab;  
tabGroup.addEventListener('focus', function(e){
	EvCl.UI.currentTab = e.tab    
});

tabGroup.open();

if (Ti.App.Properties.getString('authenticationToken')
 && Ti.App.Properties.getString('userShardId')
 && Ti.App.Properties.getDouble('expired') > 0
 && Ti.App.Properties.getDouble('expired') > new Date().getTime()) {
	EvCl.Evernote.refreshAuthentication({
		success:function(){
			Ti.App.fireEvent('app:authenticated');
		},
		error:function(error){
			var loginWindow = EvCl.UI.createLoginWindow();
			loginWindow.open({
				modal:true
			});
		}
	});
} else {
	var loginWindow = EvCl.UI.createLoginWindow();
	loginWindow.open({
		modal:true
	});
}
