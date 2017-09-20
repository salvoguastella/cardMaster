<?php

	header('Content-Type: text/html; charset=utf-8');

	include_once("conn.php");

	$conn=Core::getInstance()->dbh;

	$mode=isset($_REQUEST['mode']) ? $_REQUEST['mode'] : "create";
	$id=isset($_REQUEST['id']) ? $_REQUEST['id'] : -1;
	$name=isset($_REQUEST['name']) ? $_REQUEST['name'] : "no name";
	$description=isset($_REQUEST['description']) ? $_REQUEST['description'] : "no description";
	$class=isset($_REQUEST['class']) ? $_REQUEST['class'] : 0;
	$type=isset($_REQUEST['type']) ? $_REQUEST['type'] : 0;
	$archetype=isset($_REQUEST['archetype']) ? $_REQUEST['archetype'] : 0;
	$attack=isset($_REQUEST['attack']) ? $_REQUEST['attack'] : 0;
	$health=isset($_REQUEST['health']) ? $_REQUEST['health'] : 0;
	$flags=isset($_REQUEST['flags']) ? $_REQUEST['flags'] : 0;
	$lang=isset($_REQUEST['lang']) ? $_REQUEST['lang'] : "it";

	try{
		$lang_table = "card_".$lang;
		$SQL="SELECT name FROM ".$lang_table." WHERE name='".addslashes($name)."'";
		$check_exist=$conn->query($SQL);
		if($check_exist->fetchObject()){
			echo 0;
		}
		else{
			$SQL="INSERT INTO card_data (class,type,archetype,flags,attack,health) VALUES (:class,:type,:archetype,:flags,:attack,:health)";
			$new_card=$conn->prepare($SQL);
			$new_card->bindParam(':class',$class,PDO::PARAM_STR);
			$new_card->bindParam(':type',$type,PDO::PARAM_STR);
			$new_card->bindParam(':archetype',$archetype,PDO::PARAM_STR);
			$new_card->bindParam(':flags',$flags,PDO::PARAM_STR);
			$new_card->bindParam(':attack',$attack,PDO::PARAM_STR);
			$new_card->bindParam(':health',$health,PDO::PARAM_STR);

			if($new_card->execute()){
				$ins_id = $conn->lastInsertId();
				$SQL="INSERT INTO ".$lang_table."(ref,name,description) VALUES (:ref,:name,:description)";
				$new_cardText=$conn->prepare($SQL);
				$new_cardText->bindParam(':ref',$ins_id,PDO::PARAM_STR);
				$lashName = addslashes($name);
				$new_cardText->bindParam(':name',$lashName,PDO::PARAM_STR);
				$lashDescription=addslashes($description);
				$new_cardText->bindParam(':description',$lashDescription,PDO::PARAM_STR);
				if($new_cardText->execute()){
					echo "Card '".ucwords($name)."' has been created!";
				}
				else echo "lang_error";
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