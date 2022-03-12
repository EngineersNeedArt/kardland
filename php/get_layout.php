<?php
include_once 'database_utilities.php';

// Open database connection.
$db_connection = database_open_ordie ($name);	// <--- supply database name.

// Create our SQL query.
$identifier = pg_escape_string ($_GET['identifier']);
$query_arg = sprintf ("SELECT * FROM stacks WHERE identifier = '%s'", $identifier);

// Get the record.
// Better code would do something sensible if the query returned no result.
// $query_result = pg_query ($db_connection, $query_arg);
// $row = pg_fetch_assoc ($query_result);

$query_array = database_query_array ($query_arg, $db_connection);

// Since "$row" is already an associative array, we can
// return it directly (after JSON-encoding).

header ("Content-type: application/json");
header ("Access-Control-Allow-Origin: *");
echo json_encode ($query_array);

// Clean up.
database_close ($db_connection);
?>