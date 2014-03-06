<?php
	require_once("core_functions.php");

	$dbc = getDBConnection();		
	$sql = "SELECT * FROM watm_users";

	$result = $dbc->query($sql);
	$users = array();
	$avatar;

	while($row = $result->fetch_assoc()){

		if($row["avatar"] == null){
			$avatar = "avatar.png";
		}else{
			$avatar = $row["avatar"];
		}

		$user = array("user_id" => $row["user_id"],
			"facebook_id" => $row["facebook_id"], 
			"stamina_score"=>(float)$row["stamina_score"],
			"strength_score"=>(float)$row["strength_score"],
			"equipment_score"=>(float)$row["equipment_score"],
			"email" => $row["email"], 
			"name" => $row["name"],
			"avatar" => $avatar,
			"facebook_data" => $row["facebook_data"],
			"current_location" => $row["current_location"],
			"current_location" => $row["current_location"]);
		$users[] = $user;
	}
	
	$dbc->close();
	print json_encode($users);
?>
