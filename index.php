<?php
if (session_id () === "")
{
	session_start ();
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Kardland</title>
<link rel="icon" type="image/png" href="http://YOUR_URL/favicon.png">
<link rel="icon" type="image/vnd.microsoft.icon" href="http://YOUR_URL/favicon.ico">
<link rel="stylesheet" type="text/css" href="kardland.css">
</head>

<body>
	<script type="text/javascript" src="scripts/kardland.js"></script>
	<script type="text/javascript" src="scripts/modal.js"></script>
	
	<script>
	
	// ------------------------------------------------------------------------- display_username ()
	
	function display_username ()
	{
		document.getElementById ('signin_block').style.display = 'none';
		document.getElementById ('welcome_block').style.display = 'inline';
		document.getElementById ('welcome_label').innerHTML = 'Welcome, ' + sessionStorage.getItem ('username') + '.';
	};
	
	// ---------------------------------------------------------------------- signin_button_click ()
	
	function signin_button_click ()
	{
		var usernameLabel = document.getElementById ('signin_username_label');
		var usernameInput = document.getElementById ('signin_username_input');
		var passwordLabel = document.getElementById ('signin_password_label');
		var passwordInput = document.getElementById ('signin_password_input');
		var resultLabel = document.getElementById ('signin_result_label');
		var dismiss = true;
		
		// Reset to default (non-error) state.
		resultLabel.innerHTML = '';
		
		// Validate name.
		if (usernameInput.value == '')
		{
			// Display error state.
			usernameLabel.innerHTML = 'Enter your name:';
			usernameLabel.className = 'text_error';
		}
		else
		{
			// Display normal state.
			usernameLabel.innerHTML = 'Name:';
			usernameLabel.className = 'modal_text';
			
			// Validate password.
			if (passwordInput.value == '')
			{
				// Display error state.
				passwordInput.value = '';
				passwordLabel.innerHTML = 'Enter your password:';
				passwordLabel.className = 'text_error';
			}
			else
			{
				// Display normal state.
				passwordLabel.innerHTML = 'Password:';
				passwordLabel.className = 'modal_text';
				
				// Attempt to log in to account.
				login_to_server (usernameInput.value, passwordInput.value, function (response, message)
				{
					passwordInput.value = '';
					
					if ((response) && (response.loggedin))
					{
						usernameInput.value = '';
						
						// Fetch username.
						display_username ();
					}
					else
					{
						if (response)
						{
							resultLabel.innerHTML = response.message;
						}
						else
						{
							resultLabel.innerHTML = message;
						}
					}
				});
			}
		}
	};
	
	// ---------------------------------------------------------------------- signup_button_click ()
	
	function signup_button_click ()
	{
		var usernameLabel = document.getElementById ('signup_username_label');
		var usernameInput = document.getElementById ('signup_username_input');
		var passwordLabel = document.getElementById ('signup_password_label');
		var passwordInput = document.getElementById ('signup_password_input');
		var password2Label = document.getElementById ('signup_password2_label');
		var password2Input = document.getElementById ('signup_password2_input');
		var resultLabel = document.getElementById ('signup_result_label');
		var failMessage;
		var dismiss = true;
		
		// Reset to default (non-error) state.
		usernameLabel.innerHTML = 'Name:';
		usernameLabel.className = 'modal_text';
		passwordLabel.innerHTML = 'Password:';
		passwordLabel.className = 'modal_text';
		password2Label.innerHTML = 'Password:';
		password2Label.className = 'modal_text';
		resultLabel.innerHTML = '';
		resultLabel.className = 'modal_text';
		
		failMessage = validateUsername (usernameInput.value);
		if (failMessage)
		{
			// Display as error.
			usernameLabel.innerHTML = failMessage;
			usernameLabel.className = 'text_error';
		}
		else
		{
			// Display as correct.
			usernameLabel.innerHTML = 'Choose the name you will use on Kardland:';
			usernameLabel.className = 'modal_text';
			
			failMessage = validatePassword (passwordInput.value);
			if (failMessage)
			{
				// Display as error.
				passwordLabel.innerHTML = failMessage;
				passwordLabel.className = 'text_error';
				passwordInput.value = '';
				password2Input.value = '';
			}
			else
			{
				// Display as correct.
				passwordLabel.innerHTML = 'Choose a password so that we will know it is you.';
				passwordLabel.className = 'modal_text';
				
				if (passwordInput.value != password2Input.value)
				{
					// Display as error.
					password2Label.innerHTML = 'The two passwords you entered do not match.';
					password2Label.className = 'text_error';
					passwordInput.value = '';
					password2Input.value = '';
				}
				else
				{
					// Display as correct.
					password2Label.innerHTML = 'Enter your password again to confirm.';
					password2Label.className = 'modal_text';
					
					// Attempt to log in to account.
					create_new_account (usernameInput.value, passwordInput.value, function (response, message)
					{
						if (response.loggedin)
						{
							display_username ();
							resultLabel.innerHTML = 'Welcome, ' + sessionStorage.getItem ('username');
							resultLabel.className = 'modal_text';
						}
						else
						{
							if (response)
							{
								if (response.message == 'The name you chose already exists.')
								{
									dismiss = false;
								}
								resultLabel.innerHTML = response.message;
							}
							else
							{
								resultLabel.innerHTML = 'Error signing in: ' + message;
							}
							
							resultLabel.className = 'text_error';
						}
						
						passwordInput.value = '';
						password2Input.value = '';
						
						if (dismiss)
						{
							setTimeout (signup_modal.close, 1500);
						}
					});
				}
			}
		}
	};
	
	// ----------------------------------------------------------------------------- signup_click ()
	
	function signup_click ()
	{
		document.getElementById ('signup_modal').style.display = "block";
	};
	
	// ---------------------------------------------------------------------------- window.onload ()
	
	window.onload = function ()
	{
		var element;
		var username = sessionStorage.getItem ('username');
		var password = sessionStorage.getItem ('password');
		var loggedIn = false;
		
		config_server (username, password, function (response, message)
		{
			if ((response) && (response.loggedin))
			{
				loggedIn = response.loggedin;
			}
			
			// Prepare 'Sign Up' modal window.
			signup_modal = prepare_modal_window ('signup_modal', 'signup_close');
			
			if (loggedIn)
			{
				display_username ();
			}
		});
	};
	
	</script>
	
	<div id="content">
		
		<div id="mainleftsidebar" class="unselectable">
			<img src="images/KardLandLogo.svg" width="160" height="160" id="logo" draggable="false">
			<div id="welcome_block" style="display:none;">
			<p class="modal_text" id="welcome_label">Welcome, Laine</p>
			</div>
			<div id="signin_block">
				<p id="signin_username_label" class="modal_text" style="margin-left:36px;">Name:</p>
				<div class="text_input">
					<input type="text" name="player_name_data" placeholder="Your Name" id="signin_username_input" style="margin-left:36px;">
				</div>
				<p id="signin_password_label" class="modal_text" style="margin-left:36px; margin-top:8px;">Password:</p>
				<div class="text_input">
					<input type="password" name="player_password_data" placeholder="Password" id="signin_password_input" style="margin-left:36px;">
				</div>
				<p id="signin_result_label" class="text_error" style="text-align:center;"></p>
				<span id="login_button" class="pillbutton unselectable" onclick="signin_button_click()" style="margin-top:16px; width:80px;">Sign In</span>
				<br>
				<br>
				<p class="text_descriptive">New to KardLand?</p>
				<p class="text_descriptive">Create a free account.</p>
				<p class="text_descriptive">Signing up allows you to keep track of your games, return to games in progress and save your game state in case you refresh your browser.</p>
				<span id="create_button" class="pillbutton unselectable" onclick="signup_click()" style="margin-top:16px; width:80px;">Sign Up</span>
			</div>
		</div>
		
		<div id="header">
		</div>
		
		<div id="field" class="unselectable">
			<div id="thumbnail" class="thumbnail_block unselectable">
				<a href="freecell.php">
				<img src="images/freecell_thumbnail.jpg" width="225" height="150" class="thumbnail_image" draggable="false">
				<p class="thumbnail_label">FreeCell</p>
				</a>
			</div>
			<div id="thumbnail" class="thumbnail_block unselectable">
				<a href="klondike.html">
				<img src="images/klondike_thumbnail.jpg" width="225" height="150" class="thumbnail_image" draggable="false">
				<p class="thumbnail_label">Klondike (classic solitaire)</p>
				</a>
			</div>
		</div>
	</div>
	
	<!-- Sign Up Modal Window -->
	<div id="signup_modal" class="modal">
		<div class="modal-content" style="width:400px;">
			<span class="close_modal" id="signup_close">&times;</span>
			<img src="images/KardLandLogoHorizontal.svg" width="200" style="display:block; margin-left:auto; margin-right:auto; margin-top:8px; padding:8px;">
				<p class="modal_text">Signing up takes just a minute. Your account will allow Kardland to keep a record of the games you've played and won.</p>
				<p id="signup_username_label" class="modal_text" style="margin-top:8px;">Choose the name you will use on Kardland:</p>
				<div class="text_input">
					<input type="text" name="signup_username_data" placeholder="Your Name" id="signup_username_input" style="margin-left:27px;">
				</div>
				<p id="signup_password_label" class="modal_text" style="margin-top:8px;">Choose a password so that we will know it is you.</p>
				<div class="text_input">
					<input type="password" name="signup_password_data" placeholder="Password" id="signup_password_input" style="margin-left:27px;">
				</div>
				<p id="signup_password2_label" class="modal_text" style="margin-top:8px;">Enter your password again to confirm.</p>
				<div class="text_input">
					<input type="password" name="signup_password2_data" placeholder="Password" maxlength="12" id="signup_password2_input" style="margin-left:27px;">
				</div>
				<br>
				<p id="signup_result_label" class="modal_text" style="text-align:center; margin-bottom:20px;"></p>
				<span id="signup_button" class="pillbutton unselectable" onclick="signup_button_click()" style="width:80px;">Sign Up</span>
		</div>
	</div>
	
</body>
</html>
