<?php
	//include headers, logo and round menu
    $page_name = "combos";
	include("header.php");
?>

    <div class='main'>
        <div class="combo-list panel">
            <div class="row header">
                <span class="sortable" data-sort="name">Name <i class="fa fa-sort"></i></span>
                <span>Cards</span>
                <span data-sort="class">Class <i class="fa fa-sort"></i></span>
                <span class="commands"></span>
            </div>
            <div class="new-combo">
            	<div class="new-combo__top">
            		<form action="resources/php_scripts/create_combo.php" id="newCombo" class="panel">
            			<div class="new-combo__top__left">
            				<div class="input-row">
	            				<input type="text" name="name" placeholder="Combo name...">
		            			<?php
								$element = "class";
								include("resources/php_scripts/generate_dropdown.php");
								?>
            				</div>
							<input type="hidden" name="cards">
							<div class="added-cards-row">
								<div class="added-card new-card new-card-to-combo">
									<span>New card</span>
									<?php
										require("resources/php_scripts/getCardNames.php");
									?>
									<div class="btn">Add</div>
								</div>
							</div>
            			</div>
            			<div class="new-combo__top__right">
            				<textarea name="description" placeholder="description"></textarea>
            			</div>
             		</form>
            	</div>
            	<div class="new-combo__bottom">
            		<div class="new-combo__trigger">
            			<i class="fa fa-plus"></i> New combo
            		</div>
            		<div class="new-combo__actions">
            			<span class="new-combo__save"><i class="fa fa-floppy-o"></i> Save</span>
            			<span class="new-combo__cancel"><i class="fa fa-remove"></i> Cancel</span>
            			
            		</div>
            	</div>
            </div>
            <div id="comboList">

            </div>
            <div class="edit-combo" id="editComboBox">
                <div class="edit-combo__top">
                    <form action="resources/php_scripts/edit_combo.php" id="editCombo" class="panel">
                        <div class="edit-combo__top__left">
                            <div class="input-row">
                                <input type="text" name="name" placeholder="Combo name...">
                                <?php
                                $element = "class";
                                include("resources/php_scripts/generate_dropdown.php");
                                ?>
                            </div>
                            <input type="hidden" name="cards">
                            <div class="added-cards-row">
                                <div class="added-card new-card new-card-to-combo">
                                    <span>New card</span>
                                    <?php
                                        require("resources/php_scripts/getCardNames.php");
                                    ?>
                                    <div class="btn">Add</div>
                                </div>
                            </div>
                        </div>
                        <div class="edit-combo__top__right">
                            <textarea name="description" placeholder="description"></textarea>
                        </div>
                    </form>
                </div>
                <div class="edit-combo__bottom">
                    <div class="edit-combo__actions">
                        <span class="edit-combo__save"><i class="fa fa-floppy-o"></i> Save</span>
                        <span class="edit-combo__cancel"><i class="fa fa-remove"></i> Cancel</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="control-area">
            <div class='filter_panel panel'>
                <h2 class="form-caption" id="filterTrigger"><i class="fa fa-list-ul"></i>Filters <span class="card_results_string"><span id="comboCount">0</span> results found</span></h2>
                <div class="filter-box">
                    <div class="row">
                        <i class="fa fa-search"></i>
                        <input type="text" id="textSearch">
                    </div>
                    <div class="row">
                        <label for="">Class</label>
                        <?php
                            $element = "class";
                            include("resources/php_scripts/generate_dropdown.php");
                        ?>
                    </div>

                    <div id="submitFilter" class="btn">Search</div>
                    <div id="resetFilter" class="btn">Reset filters</div>
                </div>
            </div>
        </div>
    </div>

<?php
	include("footer.php");
?>

