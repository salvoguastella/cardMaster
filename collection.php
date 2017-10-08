<?php
	//include headers, logo and round menu
    $page_name = "collection";
	include("header.php");
?>

    <div class='main'>
        <div class="card-content">
            <div class="loading"><i class="fa fa-spin fa-circle-o-notch"></i></div>
            <div class="card-grid panel">
                <div id="cardGrid">

                </div>
            </div>
            <div class="card-list panel">
                <div class="row header">
                    <span class="image"><i class="fa fa-file-image-o"></i></span>
                    <span class="sortable" data-sort="name">Name <i class="fa fa-sort"></i></span>
                    <span class="sortable" data-sort="class">Class <i class="fa fa-sort"></i></span>
                    <span class="sortable" data-sort="archetype">Archetype <i class="fa fa-sort"></i></span>
                    <span class="sortable" data-sort="type">Type <i class="fa fa-sort"></i></span>
                    <span><i class="ra ra-sword"></i></span>
                    <span><i class="ra ra-shield"></i></span>
                    <span>Flags</span>
                    <span></span>
                </div>
                <div id="cardList">

                </div>
            </div>
        </div>
        <div class="control-area">
            <div class='filter_panel panel'>
                <h2 class="form-caption" id="filterTrigger">
                    <i class="fa fa-list-ul"></i>
                    Filters 
                    <span class="card_results_string">
                        <span id="cardCount">0</span>
                         results found
                    </span>
                    <i class="fa fa-th-large view-switch" data-view="grid"></i>
                    <i class="fa fa-navicon view-switch" data-view="list"></i>
                </h2>
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
                    <div class="row">
                        <label for="">Archetype</label>
                        <?php
                            $element = "archetype";
                            include("resources/php_scripts/generate_dropdown.php");
                        ?>
                    </div>
                    <div class="row">
                        <label for="">Type</label>
                        <?php
                            $element = "type";
                            include("resources/php_scripts/generate_dropdown.php");
                        ?>
                    </div>
                    <?php
                        $flagMode = "is-filter";
                        include("resources/php_scripts/flag_list.php");
                    ?>
                    <div id="submitFilter" class="btn">Search</div>
                    <div id="resetFilter" class="btn">Reset filters</div>
                </div>
            </div>
            <ul class="mode-tabs">
                <li class="tab first active" data-target="#previewCard"><i class="fa fa-eye"></i></li>
                <li class="tab" data-target="#modifyCardForm"><i class="fa fa-pencil"></i></li>
            </ul>
            <div class='mid_wrapper panel'>
                <div class="tab-content active" id="previewCard">
                    <h2 class="form-caption"><i class="fa fa-eye"></i>Preview card</h2>
                    <div id="updateCard">
                        <span class="message">Update card</span>
                        <i class="loading fa fa-refresh fa-spin"></i>
                    </div>
                    <img class="card_render" src="" alt="">
                </div>
                <form id="modifyCardForm" action="resources/php_scripts/modify_card.php" class="card_form tab-content">
                    <h2 class="form-caption"><i class="fa fa-pencil"></i>Edit card</h2>
                    <div id="removeCard">
                        <span class="message">Delete card</span>
                        <span class="confirm">
                            Sure? <span id="confirm">Yes<i class="fa fa-check"></i></span>
                            <span id="cancel">No<i class="fa fa-remove"></i></span>
                        </span>
                    </div>
                    <input type="hidden" value="" class="card_id" name="id">
                    <input type="hidden" value="" class="card_mode" name="mode">
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
                        $flagMode = "is-form";
                        include("resources/php_scripts/flag_list.php");
                    ?>
                    <input type="hidden" value="0" class="card_flags" name="flags">
                    <input type="submit" value="Update" class="btn">
                </form>

            </div>
        </div>
    </div>

    <div id="imageList" class="panel">
        <div class="list-wrapper">
            <div class="close"><i class="fa fa-close"></i></div>
            <div class="header"></div>
            <div class="images" data-row="">

            </div>
            <div class="commands">

            </div>
        </div>
    </div>

<?php
	include("footer.php");
?>

