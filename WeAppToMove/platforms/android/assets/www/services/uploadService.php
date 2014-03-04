<?php
	$new_image_name = "namethisimage.jpg";
	$destination = $_SERVER['DOCUMENT_ROOT'] ."/".$new_image_name;
	move_uploaded_file($_FILES["file"]["tmp_name"], $destination);
?>