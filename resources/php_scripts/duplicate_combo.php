<?php

	header('Content-Type: text/html; charset=utf-8');

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$id=isset($_REQUEST['id']) ? $_REQUEST['id'] : "";

	if($id != ""){
		try{
			$SQL="SELECT name, class, cards, notes FROM combos WHERE id='".$id."'";
			$original_stm=$conn->query($SQL);
			if($original_row = $original_stm->fetchObject()){
				$SQL="INSERT INTO combos (name,notes,class,cards) VALUES (:name,:description,:class,:cards)";
				$new_combo=$conn->prepare($SQL);
				$new_name = "Copy of ".$original_row->name;
				$new_combo->bindParam(':name', $new_name ,PDO::PARAM_STR);
				$new_combo->bindParam(':description',$original_row->notes,PDO::PARAM_STR);
				$new_combo->bindParam(':class',$original_row->class,PDO::PARAM_STR);
				$new_combo->bindParam(':cards',$original_row->cards,PDO::PARAM_STR);

				if($new_combo->execute()){
					echo "Combo '".ucwords($name)."' has been duplicated!";
				}
				else{
					echo "data_error";
				}
			}
			else{
				echo "data_error";
			}
		}
		catch(PDOException $e) {
			echo "Error: " . $e->getMessage();
		}
	}


?>