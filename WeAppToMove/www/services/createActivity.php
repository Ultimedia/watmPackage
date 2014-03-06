<?php
	require_once("core_functions.php");

	$user_id = $_POST['user_id'];
	$email = $_POST['email'];
	$location_id = $_POST['location_id'];
	$title = $_POST['title'];
	$sport_id = $_POST['sport_id'];
	$description = $_POST['description'];
	$dateRoot = $_POST['date'];
	$time = "";

	//$finalDate = strtotime($date);

	$date = strtotime($dateRoot);
	$date = date('Y/m/d H:i:s', $date);

	$dbc = getDBConnection();		
	$sql = "INSERT INTO watm_activities (title, sport_id, activity_description, date, time, user_id, location_id) VALUES (?,?,?,?,?,?,?)";
	$stmt = null;
	
	if($stmt = $dbc->prepare($sql)){
		$stmt->bind_param("sssssss", $title, $sport_id, $description, $date, $time, $user_id, $location_id);
		
		if($stmt->execute())
		{
			if($count == 0)
			{
				$status['activity_id'] = mysqli_insert_id($dbc);
				$status['value'] = true;
			}else{
				$status['value'] = false;
			}
			print json_encode($status);
		}else{
			$status['value'] = false;
			print json_encode($status);
		}
	}else{
		$dbc->close();
		return false;
	}
?>

