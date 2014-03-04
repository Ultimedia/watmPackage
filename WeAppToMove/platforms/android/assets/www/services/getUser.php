<?php
	require_once("core_functions.php");

	$email = $_POST['name'];
	$password = $_POST['password'];

	$dbc = getDBConnection();		
	$sql = "SELECT user_id, password, name, avatar FROM watm_users WHERE email = ?";
	if($stmt = $dbc->prepare($sql))
	{
		$stmt->bind_param('s',$email);
		if($stmt->execute())
		{
			$stmt->store_result();
			$stmt->bind_result($userid, $pdassword, $name, $avatar);
			$stmt->fetch();

			if($stmt->num_rows() == 0)
			{
				$return['status'] = false;
				$return['value'] = -1;
				$return['name'] = $name;
				$return['avatar'] = $avatar;
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
				$return['avatar'] = $avatar;
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