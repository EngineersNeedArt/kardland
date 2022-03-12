<?php
// =================================================================================================
// utilities
// =================================================================================================


// ------------------------------------------------------------------------------ sanitize_string ()

function sanitize_string ($var)
{
	$var = strip_tags ($var);
	$var = htmlentities ($var);
	return stripslashes ($var);
}

// ---------------------------------------------------------------- get_sanitized_parameter_ifset ()

function get_sanitized_parameter_ifset ($param)
{
	if (isset ($_GET[$param]))
	{
		return sanitize_string ($_GET[$param]);
	}
	else
	{
		return NULL;
	}
}

// ------------------------------------------------------------------------------- config_session ()

function config_session ()
{
	if (session_id () === "")
	{
		session_start ();
	}
}

// --------------------------------------------------------------------- get_session_global_ifset ()

function get_session_global_ifset ($param)
{
	if (session_id () === "")
	{
		session_start ();
	}
	
	if (isset ($_SESSION[$param]))
	{
		return $_SESSION[$param];
	}
	else
	{
		return NULL;
	}
}

// --------------------------------------------------------------------------- set_session_global ()

function set_session_global ($param, $value)
{
	if (session_id () === "")
	{
		session_start ();
	}
	
	$_SESSION[$param] = $value;
}

// ------------------------------------------------------------------------- clear_session_global ()

function clear_session_global ($param)
{
	if (session_id () !== "")
	{
		$_SESSION[$param] = NULL;
	}
}

?>
