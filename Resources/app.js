var namespace = require('syrup').namespace

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

/*
 * Currently open login window everytime.
 * I will persist authentication information and 
 * depersist it when app startups and authenticate automatically.
 */
var loginWindow = EvCl.UI.createLoginWindow();
loginWindow.open({
	modal:true
});
