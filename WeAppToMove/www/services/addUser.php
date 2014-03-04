<?php
	require_once("core_functions.php");

	$email = $_POST['email'];
	$name = $_POST['name'];
	$password = $_POST['password'];
	$current_location = $_POST['current_location'];

	$dbc = getDBConnection();		
	$sql = "INSERT INTO watm_users (email, password, name, current_location) VALUES (?,?,?,?)";
	$stmt = null;
	
	if($stmt = $dbc->prepare($sql)){
		$stmt->bind_param("ssss", $email, md5($password), $name, $current_location);
		
		if($stmt->execute())
		{
			if($count == 0)
			{
				$status['id'] = mysqli_insert_id($dbc);
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

