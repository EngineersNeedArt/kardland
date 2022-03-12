<?php
if (session_id () === "")
{
	session_start ();
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Kardland - FreeCell</title>
<link rel="icon" type="image/png" href="http://YOUR_URL/favicon.png">
<link rel="icon" type="image/vnd.microsoft.icon" href="http://YOUR_URL/favicon.ico">
<link rel="stylesheet" type="text/css" href="kardland.css">
<link rel="stylesheet" type="text/css" href="freecell.css">
</head>

<body>
	
<div id="content">
	
	<div id="leftsidebar" class="unselectable">
		<a href="index.php">
		<img src="images/KardLandLogo.svg" width="128" id="logo" draggable="false">
		</a>
		<span id="new_button" class="pillbutton unselectable" onclick="new_button_click()" style="position:absolute; bottom:72px; left:26px; width:92px;">New Game</span>
		<span id="undo_button" class="pillbutton unselectable" onclick="undo_button_click()" style="position:absolute; bottom:24px; left:26px; width:92px;">Undo</span>
		<img src="images/info_scroll.svg" width="100" id="info_scroll" draggable="false">
	</div>
	
	<div id="header">
		<p class="account_verbage"><span id="welcome_block" style="display:none;">Welcome, Guest</span><span id="signin_block"><a href="#" id="sign_in_link">Sign In</a> | <a href="#" id="sign_up_link">Sign Up</a></span></p>
	</div>
	
	<div id="field" class="unselectable" style="background:url(images/FreeCellLabel.svg) bottom right no-repeat">
	</div>
<!-- 416, 448, 480, 512, 544, 576, 608 -->
	<div id="basement" class="unselectable">
		<div class="text_box" style="width:416px;">
			<img src="images/freecell_regions.svg" width="200" draggable="false" class="illustration">
			<p class="text_heading">What is FreeCell?</p>
			<p>An unusual solitaire game &mdash; unusual because all fifty-two cards are dealt face up for the player to see. Since 99.9% of all deals are winnable, there is almost no element of luck in winning.</p>
			<p class="text_heading">How to play FreeCell:</p>
			<p>Move all fifty-two cards from the tableau (the eight columns &mdash; shown in blue in the illustration) to the foundations (four spaces in the top-right &mdash; shown in green in the illustration). They must be grouped by suit in order: Ace first, King last. You may move only one card at a time. You may move a card on top of another in the tableau if the card you are moving is the opposite color of the card you are moving on top of and exactly one smaller in rank (so a Ten may be placed on a Jack). Any one card may be placed in each of the four free cells (four spaced in the top left &mdash; shown in red in the illustration). Should a column become empty, any card may be placed there.</p>
		</div>
		
		<div class="text_box" style="width:576px;">
			<p class="text_heading">Short cuts:</p>
			<p>&bull; While technically you can move only one card at a time in FreeCell, if you have an empty free cell, you could, with two moves, move an ordered pair of cards from one column to another. This version of FreeCell recognizes this and <span class="red_text">allows you to drag an extra card for every empty free cell</span> you have available (the dragged cards must be ordered as described in "How to play FreeCell" &mdash; alternating colors, descending in rank). Additionally, an empty column actually even doubles the number of cards you can drag (you'll have to work out why that is for yourself).</p>
			<p>&bull; Try <span class="red_text">double-clicking</span> on a card. If a good location can be found for the card you clicked on, this implementation of FreeCell will move it for you.</p>
			<p>&bull; <span class="red_text">Cards are put up in the foundation automatically</span> for you when it is prudent to do so. Note: not every card is always put away for you automatically when it can be put up! Since cards of alternating colors are used to build ordered stacks in the tableau, it might not be wise, for example, to put a good deal more of the red cards away in the foundation when few black cards have been put away. You may need those red cards still in the tableau in order to move a black card off of something buried beneath it. For this reason, this FreeCell doesn't automatically put away cards that would imbalance the rank of red and black cards in the foundations. You may of course put away to the foundation any (allowable) card yourself.</p>
		</div>
		
		<div class="text_box" style="width:416px;">
			<p class="text_heading">Esoterica:</p>
			<p>&bull; You may <span class="red_text">bring a card back down from the foundation</span> and return it to the tableau. This is called "worrying back" a card and is, I understand, technically not allowed in FreeCell. If you want to play "pure" then resist the temptation to worry back a card. It has saved a few of my games though.</p>
			<p>&bull; Note: <span class="red_text">cards you worry-back are not automatically put away again</span> &mdash; you'll have to put them away yourself. This is true also for cards moved back down when you click the "Undo" button.</p>
		</div>
	</div>
</div>

<!-- Game Over Modal Window -->
<div id="gameover_modal" class="modal">
	<div class="modal-content" style="width:480px;">
		<span class="close_modal" id="gameover_close">&times;</span>
		<img src="images/KardLandLogoHorizontal.svg" width="200" style="display:block; margin-left:auto; margin-right:auto; margin-top:8px; padding:8px;">
		<p class="modal_header" style="text-align:center;">Congratulations, you completed FreeCell!</p>
		<br>
		<p class="modal_text" style="text-align:center;">FreeCell games played: <span class="modal_text" id="gameover_played">0</span></p>
		<p class="modal_text" style="text-align:center;">FreeCell games won: <span class="modal_text" id="gameover_won">0</span></p>
		<br>
		<p class="modal_text">Thank you for visiting Kardland and playing our solitaire. I hope you are having fun.</p>
	</div>
</div>

<!-- Sign In Modal Window -->
<div id="signin_modal" class="modal">
	<div class="modal-content" style="width:320px;">
		<span class="close_modal" id="signin_close">&times;</span>
		<img src="images/KardLandLogoHorizontal.svg" width="200" style="display:block; margin-left:auto; margin-right:auto; margin-top:8px; padding:8px;">
			<p class="modal_text">Sign in with the name and password you registered with.</p>
			<p id="signin_username_label" class="modal_text" style="margin-top:8px;">Name:</p>
			<div class="text_input">
				<input type="text" name="signin_username_data" placeholder="Your Name" id="signin_username_input" style="margin-left:27px;">
			</div>
			<p id="signin_password_label" class="modal_text" style="margin-top:8px;">Password:</p>
			<div class="text_input">
				<input type="password" name="signin_password_data" placeholder="Password" id="signin_password_input" style="margin-left:27px;">
			</div>
			<br>
			<p id="signin_result_label" class="modal_text" style="text-align:center; margin-bottom:20px;"></p>
			<span id="signin_button" class="pillbutton unselectable" onclick="signin_button_click()" style="width:80px;">Sign In</span>
	</div>
</div>

<!-- Sign Up Modal Window -->
<div id="signup_modal" class="modal">
	<div class="modal-content" style="width:400px;">
		<span class="close_modal" id="signup_close">&times;</span>
		<img src="images/KardLandLogoHorizontal.svg" width="200" style="display:block; margin-left:auto; margin-right:auto; margin-top:8px; padding:8px;">
			<p class="modal_text">Signing up takes just a minute. Your account will allow Kardland to keep a record of the games you've played and won.</p>
			<p id="signup_username_label" class="modal_text" style="margin-top:8px;">Choose the name you will use on Kardland:</p>
			<div class="text_input">
				<input type="text" name="signup_username_data" placeholder="Your Name" id="signup_username_input" style="margin-left:27px;">
			</div>
			<p id="signup_password_label" class="modal_text" style="margin-top:8px;">Choose a password so that we will know it is you.</p>
			<div class="text_input">
				<input type="password" name="signup_password_data" placeholder="Password" id="signup_password_input" style="margin-left:27px;">
			</div>
			<p id="signup_password2_label" class="modal_text" style="margin-top:8px;">Enter your password again to confirm.</p>
			<div class="text_input">
				<input type="password" name="signup_password2_data" placeholder="Password" maxlength="12" id="signup_password2_input" style="margin-left:27px;">
			</div>
			<br>
			<p id="signup_result_label" class="modal_text" style="text-align:center; margin-bottom:20px;"></p>
			<span id="signup_button" class="pillbutton unselectable" onclick="signup_button_click()" style="width:80px;">Sign Up</span>
	</div>
</div>

<script type="text/javascript" src="scripts/fiftytwo.js"></script>
<script type="text/javascript" src="scripts/kardland.js"></script>
<script type="text/javascript" src="scripts/modal.js"></script>
<script type="text/javascript" src="scripts/freecell.js"></script>
	
</body>
</html>
