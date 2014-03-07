<?php
	require_once("core_functions.php");

	$user_id = $_POST["user_id"];

	$dbc = getDBConnection();		
	$sql = "SELECT * FROM watm_activity_invited 
			INNER JOIN watm_activities ON watm_activity_invited.activity_id = watm_activities.activity_id  
			LEFT JOIN watm_sports ON watm_activities.sport_id = watm_sports.sport_id
			LEFT JOIN watm_users ON watm_activities.user_ID = watm_users.user_id
			LEFT JOIN watm_buurten ON watm_activities.buurt_id = watm_buurten.buurt_id
			LEFT JOIN watm_locations ON watm_activities.location_id = watm_locations.location_id
			WHERE watm_activity_invited.visible = 1 and watm_activity_invited.user_id =". $user_id . " and date >= CURRENT_DATE() ORDER BY date";

	$result = $dbc->query($sql);
	$invitations = array();

	while($row = $result->fetch_assoc()){
		$invitation = array("title" => $row["title"], "activity_id" => $row["activity_id"], "invitation_id" => $row["invitation_id"]);
		$invitations[] = $invitation;
	}
	
	$dbc->close();
	print json_encode($invitations);
?>