<?php

	class Link{
		private $text;
		private $url;
		private $class;

		public function __construct($text,$url,$class){
			$this->text = $text;
			$this->url=$url;
			$this->class=$class;
		}
		public function getElement(){
			return "<a href='".$this->url."' class='".$this->class."'><h3>".$this->text."</h3></a>";
		}
	}

	$links = [];

	array_push($links,new Link("Home","index.php","nav-item"));
	array_push($links,new Link("New card","create_card.php","nav-item"));
	array_push($links,new Link("Card list","collection.php","nav-item"));
	array_push($links,new Link("Archive","archive.php","nav-item"));
	array_push($links,new Link("Sandbox","sandbox.php","nav-item"));
	array_push($links,new Link("Summary","summary.php","nav-item"));
	array_push($links,new Link("Combos","combos.php","nav-item"));
	array_push($links,new Link("Key words","key_words.php","nav-item"));

?>

<div class="top">
	<div class="logo-holder">
	</div>
	<div class="desk-navigation">
		<ul>
			<?php
			for($i=0;$i<count($links);$i++){
				echo "<li>";
				echo $links[$i]->getELement();
				echo "</li>";
			}
			?>
		</ul>
	</div>
</div>