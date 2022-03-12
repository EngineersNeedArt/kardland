<?php
session_start();
include_once 'database_utilities.php';
include_once 'utilities.php';

// Defaults.
$loggedin = FALSE;
$result = NULL;

// Get parameters.
$action_input = get_sanitized_parameter_ifset ('action');
if (($action_input) && (strlen ($action_input) < 1))
{
	$action_input = NULL;
}

$username_input = get_sanitized_parameter_ifset ('username');
if (($username_input) && (strlen ($username_input) < 1))
{
	$username_input = NULL;
}

$password_input = get_sanitized_parameter_ifset ('password');
if (($password_input) && (strlen ($password_input) < 1))
{
	$password_input = NULL;
}

// Handle action.
if (($action_input) && (strcmp ($action_input, 'config') == 0))
{
	config_session ();
	
	$username = get_session_global_ifset ('username');
	// if ((!$username) && ($username_input) && ($password_input))
	// {
	// 	if (login ($username_input, $password_input))
	// 	{
	// 		$username = get_session_global_ifset ('username');
	// 	}
	// }
	
	if ($username)
	{
		$loggedin = TRUE;
	}
	
	$result = array ('loggedin' => $loggedin, 'message' => 'Configured.', 'session' => session_id ());
}
else if (($action_input) && (strcmp ($action_input, 'new_account') == 0))
{
	// Validate the username.
	$message = validate_username ($username_input);
	
	// Validate the password.
	if (!$message)
	{
		$message = validate_password ($password_input);
	}
	
	// See if name exists already.
	if (!$message)
	{
		// Open database connection.
		$db_connection = database_open ($user, $name);	// <--- supply user and database name.
		
		$query_arg = "SELECT * FROM players WHERE username = '" . $username_input . "'";
		$query_result = database_query ($db_connection, $query_arg);
		if (count ($query_result) > 0)
		{
			$result = array ('loggedin' => $loggedin, 'message' => 'The name you chose already exists.');
		}
		else
		{
			// Generate a random salt to use for this account.
			$salt = bin2hex (mcrypt_create_iv (32, MCRYPT_DEV_URANDOM));
			$saltedPassword =  $password_input . $salt;
			$hashedPassword = hash ('sha256', $saltedPassword);
			
			$query_arg = "INSERT INTO players (username, password_salt, password_hashed, account_created_date) VALUES ('" .
					$username_input . "', '" . $salt . "', '" . $hashedPassword . "', CURRENT_TIMESTAMP)";
			$query_result = database_query ($db_connection, $query_arg);
			if ($query_result)
			{
				$identifier = database_last_insert_id ($db_connection);
				if ($identifier > 0)
				{
					$loggedin = TRUE;
					$result = array ('loggedin' => $loggedin, 'message' => 'Created new account!');
					
					// Store username in session.
					set_session_global ('username', $username_input);
				}
				else
				{
					$result = array ('loggedin' => $loggedin, 'message' => 'Error creating account, unexpected identifier.');
				}
			}
			else
			{
				$result = array ('loggedin' => $loggedin, 'message' => 'Error creating account, unexpected query result.');
			}
		}
		
		// Clean up.
		database_close ($db_connection);
	}
	else
	{
		$result = array ('loggedin' => $loggedin, 'message' => $message);
	}
}
else if (($action_input) && (strcmp ($action_input, 'log_in') == 0))
{
	if (($username_input) && ($password_input))
	{
		$loggedin = login ($username_input, $password_input);
		
		if ($loggedin)
		{
			$result = array ('loggedin' => $loggedin, 'message' => 'Successfully logged in!', 'session' => session_id ());
		}
		else
		{
			$result = array ('loggedin' => $loggedin, 'message' => 'Failed to log in.', 'session' => session_id ());
		}
	}
	else
	{
		$result = array ('loggedin' => $loggedin, 'message' => 'Missing username and/or password.', 'session' => session_id ());
	}
}
else if (($action_input) && (strcmp ($action_input, 'log_out') == 0))
{
	$loggedin = FALSE;
	clear_session_global ('username');
	
	$result = array ('loggedin' => $loggedin, 'message' => 'Logged out.');
}
else if (($action_input) && (strcmp ($action_input, 'freecell_stats') == 0))
{
	$username = get_session_global_ifset ('username');
	if ($username)
	{
		$loggedin = TRUE;
		$played = 0;
		$won = 0;
		$date = NULL;
		
		// Open database connection.
		$db_connection = database_open ($user, $name);	// <--- supply user and database name.
		
		$query_arg = "SELECT freecell_played, freecell_won, freecell_last_date FROM players WHERE username = '" . $username . "'";
		$query_result = database_query ($db_connection, $query_arg);		
		
		if (($query_result) && (count ($query_result) > 0))
		{
			$row = $query_result[0];
			$played = $row['freecell_played'];
			$won = $row['freecell_won'];
			$date = $row['freecell_last_date'];
		}
		
		$result = array ('loggedin' => $loggedin, 'played' => $played, 'won' => $won, 'date' => $date);
		
		// Clean up.
		database_close ($db_connection);
	}
	else
	{
		$result = array ('loggedin' => $loggedin, 'message' => 'Not logged in ($_SESSION[username] = ' . $username . '.');
	}
}
else if (($action_input) && (strcmp ($action_input, 'bump_freecell_won') == 0))
{
	$username = get_session_global_ifset ('username');
	if ($username)
	{
		$loggedin = TRUE;
		$played = 0;
		$won = 0;
		$date = NULL;
		
		// Open database connection.
		$db_connection = database_open ($user, $name);	// <--- supply user and database name.
		
		$query_arg = "UPDATE players SET freecell_won = freecell_won + 1 WHERE username = '" . $username . "'";
		$query_result = database_exec ($db_connection, $query_arg);
		
		if (($query_result) && (count ($query_result) > 0))
		{
			$query_arg = "SELECT freecell_played, freecell_won, freecell_last_date FROM players WHERE username = '" . $username . "'";
			$query_result = database_query ($db_connection, $query_arg);
			if (($query_result) && (count ($query_result) > 0))
			{
				$row = $query_result[0];			
				$played = $row["freecell_played"];			
				$won = $row["freecell_won"];
				$date = $row["freecell_last_date"];
			}
			
			$result = array ('loggedin' => $loggedin, 'played' => $played, 'won' => $won, 'date' => $date, 'session' => session_id ());
		}
		else
		{
		}
		
		// Clean up.
		database_close ($db_connection);
	}
	else
	{
		$result = array ('loggedin' => $loggedin, 'message' => 'Not logged in ($_SESSION[username] = ' . $username . '.', 'session' => session_id ());
	}
}
else if (($action_input) && (strcmp ($action_input, 'bump_freecell_played') == 0))
{
	$username = get_session_global_ifset ('username');
	if ($username)
	{
		$loggedin = TRUE;
		$played = 0;
		
		// Open database connection.
		$db_connection = database_open ($user, $name);	// <--- supply user and database name.
		
		$query_arg = "UPDATE players SET freecell_played = freecell_played + 1 WHERE username = '" . $username . "'";
		$query_result = database_exec ($db_connection, $query_arg);
		if (($query_result) && (count ($query_result) > 0))
		{
			$identifier = database_last_insert_id ($db_connection);
			$query_arg = "SELECT freecell_played WHERE identifier = " . $identifier;
			$query_result = database_exec ($db_connection, $query_arg);
			$row = $query_result[0];
			$played = $row["freecell_played"];
		}
		
		$result = array ('loggedin' => $loggedin, 'played' => $played, 'session' => session_id ());
		
		// Clean up.
		database_close ($db_connection);
	}
	else
	{
		$result = array ('loggedin' => $loggedin, 'message' => 'Not logged in ($_SESSION[username] = ' . $username . '.', 'session' => session_id ());
	}
}
else
{
	$result = array ('loggedin' => $loggedin, 'message' => 'Malformed action: ' . $action_input);
}

header ("Content-type: application/json");
echo json_encode ($result);


// ======================================================================================= functions
// ------------------------------------------------------------------------------- validate_username

function validate_username ($field)
{
	if ((!$field) || (strlen ($field) < 1))
	{
		return 'You must provide a name.';
	}
	else if (strlen ($field) < 5)
	{
		return 'The name you provide must be more than 5 characters.';
	}
	else if (preg_match("/[^a-zA-Z0-9_-]/", $field))
	{
		return 'Only letters, numbers, hyphens (-) and underscores (_) are allowed in your name';
	}
	
	return NULL;
}

// ------------------------------------------------------------------------------- validate_password

function validate_password ($field)
{
	if ((!$field) || (strlen ($field) < 1))
	{
		return 'You must enter a password.';
	}
	else if (strlen ($field) < 6)
	{
		return 'Passwords must be at least 6 characters.';
	}
	/*
	else if ((!preg_match("/[a-z]/", $field)) ||
			(!preg_match("/[A-Z]/", $field)) ||
			(!preg_match("/[0-9]/", $field)))
	{
		return 'Passwords must have at least one lower and upper-case letter and one number.';
	}
	*/
	
	return NULL;
}

// ------------------------------------------------------------------------------------------- login

function login ($username, $password)
{
	$success = FALSE;
	$salt = NULL;
	
	// Open database connection.
	$db_connection = database_open ($user, $name);	// <--- supply user and database name.
	
	$query_arg = "SELECT password_salt FROM players WHERE username = '" . $username . "'";
	$query_result = database_query ($db_connection, $query_arg);
	
	if (($query_result) && (count ($query_result) > 0))
	{
		$row = $query_result[0];
		$salt = $row['password_salt'];
	}
	
	if ($salt)
	{
		// Create salted and hashed password.
		$saltedPassword =  $password . $salt;
		$hashedPassword = hash ('sha256', $saltedPassword);
		
		// See if a player is found matching username and the hashed password.
		$query_arg = "SELECT * FROM players WHERE username = '" . $username . "' AND password_hashed = '" . $hashedPassword . "'";
		$query_result = database_query ($db_connection, $query_arg);
		if (($query_result) && (count ($query_result) > 0))
		{
			$success = TRUE;
			
			// Store username in session.
			set_session_global ('username', $username);
		}
		else
		{
			debug_to_console ('Failed to SELECT password_hashed.');
		}
	}
	else
	{
		debug_to_console ('Failed to get salt.');
	}
	
	// Clean up.
	database_close ($db_connection);
	
	return $success;
}

// -------------------------------------------------------------------------------- debug_to_console

function debug_to_console ($data)
{
	if ((is_array ($data)) || (is_object ($data)))
	{
		echo ("<script>console.log('PHP: ".json_encode ($data)."');</script>");
	}
	else
	{
		echo ("<script>console.log('PHP: ".$data."');</script>");
	}
}

?>
