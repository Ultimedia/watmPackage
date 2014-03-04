<?php
	require_once("core_functions.php");

	$user_id = $_POST['user_id'];

	$dbc = getDBConnection();		
	$sql = "SELECT * FROM watm_user_sports WHERE user_id=" . $user_id;
	
	$result = $dbc->query($sql);
	$projects = array();

	while($row = $result->fetch_assoc()){
		$project = array("sport_data" => $row["sport_data"]);
		$projects[] = $project;
	}
	
	$dbc->close();
	print json_encode($projects);
?>
