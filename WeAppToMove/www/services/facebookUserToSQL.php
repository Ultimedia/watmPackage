<?php
	require_once("core_functions.php");

	$facebook_id = $_POST['facebook_id'];
	$name = $_POST['name'];
	$password = "";
	$facebook_data = $_POST['facebook_data'];
	$email = $_POST['email'];
	$avatar = $_POST['avatar'];
	$current_location = $_POST['current_location'];


	$dbc = getDBConnection();		
	$sql = "INSERT INTO watm_users (facebook_data, name, password, facebook_id, email, avatar, current_location) VALUES (?,?,?,?,?,?,?)";
	$stmt = null;
	
	if($stmt = $dbc->prepare($sql)){
		$stmt->bind_param("sssssss", $facebook_data, $name, $password, $facebook_id, $email, $avatar, $current_location);
		
		if($stmt->execute())
		{
			if($count == 0)
			{
				$status['user_id'] = mysqli_insert_id($dbc);
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

