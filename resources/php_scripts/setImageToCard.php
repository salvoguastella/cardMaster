<?php

	header('Content-Type: text/html; charset=utf-8');

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$id=isset($_REQUEST['cardID']) ? $_REQUEST['cardID'] : "0";
	$image=isset($_REQUEST['imageID']) ? $_REQUEST['imageID'] : "587";

	try{
		$SQL="UPDATE card_data SET image=:image WHERE id = :id";
		$edit_card=$conn->prepare($SQL);
		$edit_card->bindParam(':id',$id,PDO::PARAM_STR);
		$edit_card->bindParam(':image',$image,PDO::PARAM_STR);
		if($edit_card->execute()){
			echo "New icon set !";
			//echo $id." ".$image;
		}
		else echo "data_error";
	}
	catch(PDOException $e) {
		echo "Error: " . $e->getMessage();
	}


?>