<?php
	require_once("core_functions.php");

	$facebook_id = $_GET['facebook_id'];

	$dbc = getDBConnection();		
	$sql = "SELECT user_id FROM watm_users WHERE facebook_id = ?";
	if($stmt = $dbc->prepare($sql))
	{
		$stmt->bind_param('s',$facebook_id);
		if($stmt->execute())
		{
			$stmt->store_result();
			$stmt->bind_result($userid);
			$stmt->fetch();

			if($stmt->num_rows() == 0)
			{
				$return['facebook_user'] = false;
				$return['user_id'] = $userid;

			}else{
				$return['facebook_user'] = true;
				$return['user_id'] = $userid;	
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