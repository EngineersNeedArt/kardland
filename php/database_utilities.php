<?php

// ============================================================================== database_utilities
// ----------------------------------------------------------------------------------- database_open

function database_open ($user, $name)
{
	// Param check.
	if (strlen ($name) == 0)
	{
		die ('No database specified in database_open()');
	}
	else if (strlen ($user) == 0)
	{
		die ('No user specified in database_open()');
	}
	
	try
	{
		$pdo = new PDO ('mysql: host = localhost; dbname=' . $name, $user, '');
	}
	catch (PDOException $e)
	{
		print 'Error!: ' . $e->getMessage () . '<br/>';
		die ();
	}
	
	return ($pdo);
}

// ----------------------------------------------------------------------------------- database_exec

function database_exec ($connection, $query)
{
	$result = $connection->exec ($query);
	
	return ($result);
}

// ---------------------------------------------------------------------------------- database_query

function database_query ($connection, $query)
{
	$result_array = NULL;
	
	$result = $connection->query ($query);
	if ($result !== false)
	foreach ($result as $row)
	{
		if (!$result_array)
		{
			$result_array = array ();
		}
		
	    array_push ($result_array, $row);
	}
	
	return ($result_array);
}

// ------------------------------------------------------------------------- database_last_insert_id

function database_last_insert_id ($connection)
{
	return $connection->lastInsertId ();
}

// ---------------------------------------------------------------------------------- database_close

function database_close ($connection)
{
	$connection = NULL;
}

?>