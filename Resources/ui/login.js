namespace('EvCl.UI', function(exports){
	exports.createLoginWindow = function(){
		/*
		 * UI Layout definitions
		 */
		var window = Ti.UI.createWindow({
			title:L('Login Evernote'),
			backgroundImage:'images/bg.png'
		});
		
		var email_ = Ti.UI.createLabel({
			top:20,
			width:'auto',
			height:'auto',
			text:L('E-Mail Address'),
			color:'#eeeeee'
		});
		window.add(email_);
		
		var email = Ti.UI.createTextField({
			top:45,
			width:240,
			height:35,
			borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		});
		window.add(email);
		
		var password_ = Ti.UI.createLabel({
			top:90,
			width:'auto',
			height:'auto',
			text:L('Password'),
			color:'#eeeeee'
		});
		window.add(password_);

		var password = Ti.UI.createTextField({
			top:115,
			width:240,
			height:35,
			passwordMask:true,
			borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		});
		window.add(password);

		var login = Ti.UI.createButton({
			top:170,
			title:L('Login'),
			width:140,
			height:35
		})
		window.add(login);
		
		var loginIndicator = Ti.UI.createActivityIndicator({
			width:32,
			height:32,
			top:230
		});
		window.add(loginIndicator);
		
		/*
		 * Event handlers
		 */
		login.addEventListener('click', function(){
			loginIndicator.show();
			EvCl.Evernote.authenticate({
				email:email.value,
				password:password.value,
				success:function(auth) {
					loginIndicator.hide();
					Ti.App.fireEvent('app:authenticated');
					window.close();	
				},
				error:function(error) {
					loginIndicator.hide();
					alert(e.error);
				}
			});
		});
		
		return window;	
	}
});
