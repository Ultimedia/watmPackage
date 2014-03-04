<?php
	require_once("core_functions.php");

	$dbc = getDBConnection();		
	$sql = "SELECT * FROM watm_users";

	$result = $dbc->query($sql);
	$users = array();

	while($row = $result->fetch_assoc()){
		$user = array("user_id" => $row["user_id"],
			"facebook_id" => $row["facebook_id"], 
			"email" => $row["email"], 
			"name" => $row["name"],
			"avatar" => $row["avatar"],
			"facebook_data" => $row["facebook_data"],
			"current_location" => $row["current_location"]);
		$users[] = $user;
	}
	
	$dbc->close();
	print json_encode($users);
?>
