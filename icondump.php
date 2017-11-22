<?php
	$dir = "./resources/icons/toAdd";
	$moveDir = "./resources/icons";
	$files = scandir($dir);

	$index = 0;
	$SQL = "INSERT INTO `Icons`(`name`, `path`) VALUES ";
	foreach ($files as $key => $file) {
		if (is_file($dir.DIRECTORY_SEPARATOR.$file)){
			$file_info = pathinfo($dir.DIRECTORY_SEPARATOR.$file);
			//echo ++$index." ".$file_info["filename"]."<br>";
			$SQL = $SQL."('".$file_info["filename"]."','".$moveDir."/".$file."'), ";
    		rename($dir."/".$file, $moveDir."/".$file);
		}
	}
	$SQL = rtrim($SQL,", ");

	include_once("./resources/php_scripts\conn.php");

	$conn=Core::getInstance()->dbh;

	$dump=$conn->prepare($SQL);
    if($dump->execute()){
    	echo "yeah";
    }
    else{
    	echo "error";
    	echo $SQL;
    }
    //last 201746
?>