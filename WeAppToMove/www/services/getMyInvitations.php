<?php
	require_once("core_functions.php");

	$user_id = $_POST["user_id"];

	$dbc = getDBConnection();		
	$sql = "SELECT * FROM watm_activity_invited INNER JOIN watm_activities ON watm_activity_invited.activity_id = watm_activities.activity_id  WHERE watm_activity_invited.user_id =". $user_id;

	$result = $dbc->query($sql);
	$invitations = array();

	while($row = $result->fetch_assoc()){
		$invitation = array("title" => $row["title"], "activity_id" => $row["activity_id"]);
		$invitations[] = $invitation;
	}
	
	$dbc->close();
	print json_encode($invitations);
?>