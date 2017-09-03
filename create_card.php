<?php
	//include headers, logo and round menu
	$page_name = "creation";
	include("header.php");
?>


    <div class='main'>
			<?php 
			//include linear menu
			//include("top_wrapper.php");
			?>
            <div class='new_card_wrapper mid_wrapper'>
				<form id="newCardForm" action="resources/php_scripts/create_card.php" class="card_form panel">
					<h2 class="form-caption"><i class="fa fa-plus-square-o"></i>New card</h2>
					<input type="hidden" value="it" class="card_lang" name="lang">
					<input type="text" name="name" class="card_name" placeholder="Card name...">
					<textarea name="description" class="card_description" placeholder="Card description"></textarea>
					<?php
						$element = "class";
						include("resources/php_scripts/generate_dropdown.php");
						$element = "archetype";
						include("resources/php_scripts/generate_dropdown.php");
						$element = "type";
						include("resources/php_scripts/generate_dropdown.php");
					?>
					<div class="servant_values">
						<input type="text" name="attack" class="card_attack" placeholder="ATK">
						<input type="text" name="health" class="card_health" placeholder="HP">
					</div>
					<?php
						include("resources/php_scripts/flag_list.php");
					?>
					<input type="hidden" value="0" class="card_flags" name="flags">
					<input type="submit" value="Insert" class="btn">
				</form>

    		</div>
    </div>

<?php
	include("footer.php");
?>

