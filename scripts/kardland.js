// =================================================================================================
// kardland.js
// =================================================================================================


// ===================================================================================== kardland.js
// ---------------------------------------------------------------------------------- ajaxRequest ()

function ajaxRequest ()
{
	try
	{
		var request = new XMLHttpRequest ();
	}
	catch (e1)
	{
		try
		{
			// Fall back to a Microsoft-style request.
			request = new ActiveXObject ("Msxml2.XMLHTTP");
		}
		catch (e2)
		{
			try
			{
				// Fall back to a(nother) Microsoft-style request.
				request = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e3)
			{
				// We have failed.
				request = false;
			}
		}
	}
	
	return request;
}

// ------------------------------------------------------------------------------- post_to_server ()

function post_to_server (message, completion)
{
	var responseParsed = null;
	var request = new ajaxRequest ();
	var errorMessage = 'No error.';
	
	request.open ('POST', message, true);
	request.setRequestHeader ('Content-type', 'application/x-www-form-urlencoded');
	request.withCredentials = true;
	request.onreadystatechange = function()
	{
		if (this.readyState == 4)		// 4 = completed
		{
			if (this.status == 200)		// 200 = no error
			{
				if (this.response)
				{
					try
					{
						responseParsed = JSON.parse (this.response);
				    }
					catch (e)
					{
						errorMessage = 'error in post_to_server(); ' + e;
						console.log (errorMessage);
				    }
					
					// Call completion function with the response.
					completion (responseParsed, errorMessage);
				}
				else 
				{
					// Fail. Call completion function with no response.
					console.log ('Ajax error: No data received');
					completion (null, 'Ajax error: No data received');
				}
			}
			else
			{
				// Fail. Call completion function with no response.
				console.log ('Ajax error: ' + this.statusText);
				completion (null, this.statusText);
			}
		}
	}
	
	request.send ();
};

// ------------------------------------------------------------------------------ login_to_server ()

function login_to_server (username, password, completion)
{
	var query;
	
	if ((username) && (password))
	{
		query = 'http://YOUR_URL/php/kardland.php?action=log_in&username=' + username + '&password=' + password;
		post_to_server (query, function (response, message)
		{
			if ((response) && (response.session))
			{
				console.log ('login_to_server; session: ' + response.session);
			}
			else
			{
				console.log ('login_to_server; no session.');
			}
			
			if ((response) && (response.loggedin))
			{
				sessionStorage.setItem ('username', username);
				sessionStorage.setItem ('password', password);
			}
			else
			{
				sessionStorage.setItem ('username', '');
				sessionStorage.setItem ('password', '');
			}
			
			completion (response, message);
		});
	}
	else
	{
		completion (null, 'login_to_server (); no username or password provided.');
	}
};

// --------------------------------------------------------------------------- create_new_account ()

function create_new_account (username, password, completion)
{
	var query;
	
	if ((username) && (password))
	{
		query = 'http://YOUR_URL/php/kardland.php?action=new_account&username=' + username + '&password=' + password;
		post_to_server (query, function (response, message)
		{
			if ((response) && (response.loggedin))
			{
				sessionStorage.setItem ('username', username);
				sessionStorage.setItem ('password', password);
			}
			else
			{
				sessionStorage.setItem ('username', '');
				sessionStorage.setItem ('password', '');
			}
			
			completion (response, message);
		});
	}
	else
	{
		completion (null, 'create_new_account (); no username or password provided.');
	}
};

// ----------------------------------------------------------------------------- validateUsername ()

function validateUsername (field)
{
	if (field == "")
	{
		return "You must enter a name."
	}
	else if (field.length < 5)
	{
		return "Names must be at least 5 characters."
	}
	else if (/[^a-zA-Z0-9_-]/.test (field))
	{
		return "Only letters, numbers, hyphens (-) and underscores (_) are allowed in your name."
	}
	
	return ""
}

// ----------------------------------------------------------------------------- validatePassword ()

function validatePassword (field)
{
	if (field == "")
	{
		return "You must enter a password."
	}
	else if (field.length < 6)
	{
		return "Passwords must be at least 6 characters."
	}
	/*
	else if (! /[a-z]/.test(field) || ! /[A-Z]/.test(field) || ! /[0-9]/.test(field))
	{
		return "Passwords must have at least one lower and upper-case letter and one number."
	}
	*/
	
	return ""
}

// -------------------------------------------------------------------------------- config_server ()

function config_server (username, password, completion)
{
	var query = null;
	var clearingSession = false;
	if ((username) && (password))
	{
		query = 'http://YOUR_URL/php/kardland.php?action=config&username=' + username + '&password=' + password;
	}
	else
	{
		query = 'http://YOUR_URL/php/kardland.php?action=log_out';
		clearingSession = true;
	}

	post_to_server (query, function (response, message)
	{
		if (!response)
		{
			console.log ('config_server; no response.');
		}
		else if ((!clearingSession) && (!response.session))
		{
			console.log ('config_server; no session.');
		}
		
		if (completion)
		{
			completion (response, message);
		}
	});
};
