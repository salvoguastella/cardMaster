<?php 
	session_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name='viewport' content='width=device-width, user-scalable=no' />

<meta name="description" content="" />
<meta name="keywords" content="">
<meta name="author" content="Salvatore Guastella">
<?php
	if (isset($page_name)){
		echo "<title>".$page_name."</title>";
	}
	else{
		echo "<title>Home</title>";
	}
?>
<link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon">
<link rel="icon" href="img/favicon.ico" type="image/x-icon">

<link href='https://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic,800' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="resources/fontawesome/css/font-awesome.min.css">
<link rel="stylesheet" href="resources/rpgawesome/css/rpg-awesome.min.css">
<link rel="stylesheet" type="text/css" media="screen" href="resources/css/style.css?<?php echo time(); ?>" />
<script type="text/javascript" src="resources/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="resources/js/js.cookie.js"></script>
<script type="text/javascript" src="resources/js/script.js?<?php echo time(); ?>"></script>

</head>
<body>

    <div class='header_wrapper'>
		<div class="message-bar">Card master ALPHA - <span></span></div>
		<?php 
			include("navigation.php");
		?>
    </div>