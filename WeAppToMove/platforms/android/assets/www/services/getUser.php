<?php
	require_once("core_functions.php");

	$email = $_POST['name'];
	$password = $_POST['password'];

	$dbc = getDBConnection();		
	$sql = "SELECT user_id, password, name, avatar, stamina_score, strength_score, equipment_score, current_location  FROM watm_users WHERE email = ?";
	if($stmt = $dbc->prepare($sql))
	{
		$stmt->bind_param('s',$email);
		if($stmt->execute())
		{
			$stmt->store_result();
			$stmt->bind_result($userid, $pdassword, $name, $avatar, $stamina_score, $strength_score, $equipment_score, $current_location);
			$stmt->fetch();

			if($stmt->num_rows() == 0)
			{
				$return['status'] = false;
				$return['value'] = -1;
				$return['name'] = $name;
				$return['stamina_score'] = $stamina_score;
				$return['strength_score'] = $strength_score;
				$return['equipment_score'] = $equipment_score;
				$return['current_location'] = $current_location;

			}else{

				if($pdassword == md5($password)){
					$return['password'] = true;
				}else{
					$return['password'] = false;
				}

				$return['status'] = true;
				$return['value'] = $userid;
				$return['name'] = $name;
				$return['stamina_score'] = $stamina_score;
				$return['strength_score'] = $strength_score;
				$return['equipment_score'] = $equipment_score;
				$return['current_location'] = $current_location;

			}
			print json_encode($return);
		}else{
			$return['status'] = false;
			$return['error']=$stmt->error;
			print json_encode($return);
		}
	}else{
		return false;
	}
?>

