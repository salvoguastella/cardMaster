<?php

	header('Content-Type: text/html; charset=utf-8');

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$name=isset($_REQUEST['name']) ? $_REQUEST['name'] : "no name";
	$description=isset($_REQUEST['description']) ? $_REQUEST['description'] : "no description";
	$class=isset($_REQUEST['class']) ? $_REQUEST['class'] : 1;
	$cards=isset($_REQUEST['cards']) ? $_REQUEST['cards'] : "";

	try{
		$SQL="SELECT name FROM combos WHERE name='".$name."'";
		$check_exist=$conn->query($SQL);
		if($check_exist->fetchObject()){
			echo 0;
		}
		else{
			$SQL="INSERT INTO combos (name,notes,class,cards) VALUES (:name,:description,:class,:cards)";
			$new_combo=$conn->prepare($SQL);
			$new_combo->bindParam(':name',$name,PDO::PARAM_STR);
			$new_combo->bindParam(':description',$description,PDO::PARAM_STR);
			$new_combo->bindParam(':class',$class,PDO::PARAM_STR);
			$new_combo->bindParam(':cards',$cards,PDO::PARAM_STR);

			if($new_combo->execute()){
				echo "Combo '".ucwords($name)."' has been created!";
			}
			else{
				echo "data_error";
			}
		}
	}
	catch(PDOException $e) {
		echo "Error: " . $e->getMessage();
	}



?>