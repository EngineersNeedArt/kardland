// =================================================================================================
// Freecell
// =================================================================================================


// Create global table.
table = new fiftytwo.Table ('cards');
autoPutAwayCards = [];
fieldWidth = 0;
gameOver = false;
playerHasNotYetMoved = true;
loggedIn = false;

// ---------------------------------------------------------------------------------- layoutTable ()

function layoutTable () {
	"use strict";
	
	// Create stacks.
	table.addNewStack ('FREE1', 'FREECELL', 0.0, 0.0, 0.0, 0.0).setPlaceholderImage ('images/freeCellPlaceholder.svg');
	table.addNewStack ('FREE2', 'FREECELL', 1.15, 0.0, 0.0, 0.0).setPlaceholderImage ('images/freeCellPlaceholder.svg');
	table.addNewStack ('FREE3', 'FREECELL', 2.3, 0.0, 0.0, 0.0).setPlaceholderImage ('images/freeCellPlaceholder.svg');
	table.addNewStack ('FREE4', 'FREECELL', 3.45, 0.0, 0.0, 0.0).setPlaceholderImage ('images/freeCellPlaceholder.svg');
	table.addNewStack ('DIAMONDS', 'FOUNDATION', 4.95, 0.0, 0.0, 0.0).setPlaceholderImage ('images/diamondFoundationPlaceholder.svg');
	table.addNewStack ('CLUBS', 'FOUNDATION', 6.1, 0.0, 0.0, 0.0).setPlaceholderImage ('images/clubFoundationPlaceholder.svg');
	table.addNewStack ('HEARTS', 'FOUNDATION', 7.25, 0.0, 0.0, 0.0).setPlaceholderImage ('images/heartFoundationPlaceholder.svg');
	table.addNewStack ('SPADES', 'FOUNDATION', 8.4, 0.0, 0.0, 0.0).setPlaceholderImage ('images/spadeFoundationPlaceholder.svg');
	table.addNewStack ('COL1', 'COLUMN', 0.0, 1.15, 0.0, 0.3);
	table.addNewStack ('COL2', 'COLUMN', 1.2, 1.15, 0.0, 0.3);
	table.addNewStack ('COL3', 'COLUMN', 2.4, 1.15, 0.0, 0.3);
	table.addNewStack ('COL4', 'COLUMN', 3.6, 1.15, 0.0, 0.3);
	table.addNewStack ('COL5', 'COLUMN', 4.8, 1.15, 0.0, 0.3);
	table.addNewStack ('COL6', 'COLUMN', 6.0, 1.15, 0.0, 0.3);
	table.addNewStack ('COL7', 'COLUMN', 7.2, 1.15, 0.0, 0.3);
	table.addNewStack ('COL8', 'COLUMN', 8.4, 1.15, 0.0, 0.3);
};

// ------------------------------------------------------------------------------ dealInitialHand ()

function dealInitialHand (cards) {
	"use strict";
	var i;
	for (i = 0; i < 6; i++) {
		table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL1'));
		table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL2'));
		table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL3'));
		table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL4'));
		table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL5'));
		table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL6'));
		table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL7'));
		table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL8'));
	}
	table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL1'));
	table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL2'));
	table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL3'));
	table.dealCardToStack (cards.shift (), table.stackWithIdentifier ('COL4'));
};

// --------------------------------------------------------------------------- wasCardAutoPutAway ()

function wasCardAutoPutAway (card) {
	var putAway = false;
	
	for (var i = 0, count = autoPutAwayCards.length; i < count; i += 1) {
		if (autoPutAwayCards [i] === card) {
			putAway = true;
			break;
		}
	}
	
	return putAway;
};

// ------------------------------------------------------------------- indicateCardWasAutoPutAway ()

function indicateCardWasAutoPutAway (card) {
	if (!wasCardAutoPutAway (card)) {
		autoPutAwayCards.push (card);
	}
};

// ------------------------------------------------------------------------ showColumnPlaceholder ()

function showColumnPlaceholder (columnStacks, placeholder, exceptStack) {
	"use strict";
	var count = columnStacks.length;
	var stack;
	
	// Clear placeholders from empty columns (if any).
	for (var i = 0; i < count; i++) {
		stack = columnStacks[i];
		if (((stack != exceptStack) && (!stack.topCard ())) || (!placeholder)) {
			if (placeholder === 'allow') {
				stack.setPlaceholderImage ('images/allowedPlaceholder.svg');
			} else if (placeholder === 'disallow') {
				stack.setPlaceholderImage ('images/disallowedPlaceholder.svg');
			} else {
				stack.setPlaceholderImage (null);
			}
		}
	}
};

// ------------------------------------------------------------------------------ cardsAreOrdered ()

function cardsAreOrdered (stack, startingAtIndex) {
	var cardTesting = stack.cardAtIndex (startingAtIndex);
	var followingCard;
	var ordered = true;
	
	for (var i = startingAtIndex + 1, cardCount = stack.numberOfCards; i < cardCount; i += 1) {
		// The card following cardTesting.
		followingCard = stack.cardAtIndex (i);
		
		// The card rank must increase exactly by one.
		if (cardTesting.rank !== followingCard.rank + 1) {
			ordered = false;
			break;
		}
		
		// Can't drag if the color sequence of the stack do not alternate.
		if (cardTesting.compareColorWithCard (followingCard) !== cardColorComparison.OPPOSITE) {
			ordered = false;
			break;
		}
		
		// This will be the card to test for in the next pass through the loop.
		cardTesting = followingCard;
	}
	
	return ordered;
};

// ------------------------------------------------------------------------- canDragCardFromStack ()

// Enum type for playing card suit.
var dragRestrictions = {
	NONE: 0,
	EMPTYCOLUMNONLY: 1,
	DISALLOWEMPTYCOLUMN: 2
};

function canDragCardFromStack (card, stack) {
	"use strict";
	var canDrag = false;
	var cardIndex;
	var cardCount;
	var cardDragCount;
	var emptyColumns = 0;
	var emptyCells = 0;
	var stacks;
	var count = 0;
	var i;
	var draggingEntireColumn = false;
	var ordered;
	var unrestrictedNumberCanDrag;
	var restrictedNumberCanDrag;
	
	// Initially assume no restrictions.
	table.dragRestriction = dragRestrictions.NONE;
	
	if (stack.topCard () === card) {
		// The top card can always be dragged.
		canDrag = true;
	} else {
		// Get the index of card attempting to be dragged and number of cards in stack.
		cardIndex = stack.indexOfCard (card);
		cardCount = stack.numberOfCards;
		
		// The number of cards the player wishes to drag.
		cardDragCount = (cardCount - cardIndex);
		
		// See how many empty tableau columns and free-cells there are.
		stacks = table.stacks;
		count = stacks.length;
		for (i = 0; i < count; i += 1) {
			if (!stacks[i].topCard ()) {
				if (stacks[i].role === 'COLUMN') {
					emptyColumns = emptyColumns + 1;
				} else if (stacks[i].role === 'FREECELL') {
					emptyCells = emptyCells + 1;
				}
			}
		}
		
		// Is the entire column being dragged?
		draggingEntireColumn = ((emptyColumns > 0) && (cardIndex === 0));
		
		// Validate first that each card atop the one attempting to 
		// be dragged follows down in rank and alternates in color.
		ordered = cardsAreOrdered (stack, cardIndex);
		
		if (ordered) {
			// Take into consideration empty cells and tableau columns.
			if (emptyColumns > 0) {
				// An empty tableau column allows us to drag double the number 
				// we would be able to drag with empty cells alone. However, 
				// there is a restriction that we cannot drag these cards to 
				// one of the empty columns. If that is the case then we have 
				// to subtract one of the empty columns from out calculation.
				// With no restrictions however, we are free to drag 
				// (empty cells + 1) x (empty columns - 1) x 2.
				if (emptyColumns > 1) {
					unrestrictedNumberCanDrag = (emptyCells + 1) * ((emptyColumns - 1) * 2);
				} else {
					unrestrictedNumberCanDrag = emptyCells + 1;
				}
				
				// With restrictions we can drag up to (empty cells + 1) x empty columns x 2.
				restrictedNumberCanDrag = (emptyCells + 1) * (emptyColumns * 2);
				
				// We allow the drag if it meets restricted (larger of the two) drag limitation.
				canDrag = cardDragCount <= restrictedNumberCanDrag;
				
				// However, if we are not less than the free drag limitation, we indicate 
				// that the drag is restricted and we will disallow the user from dragging 
				// to an empty column.
				if ((canDrag) && (cardDragCount > unrestrictedNumberCanDrag) && (!draggingEntireColumn)) {
					table.dragRestriction = dragRestrictions.DISALLOWEMPTYCOLUMN;
					showColumnPlaceholder (table.stacksWithRole ('COLUMN'), 'disallow', null);
				}
			} else {
				// No empty columns, whether we can drag the stack depends solely 
				// on whether there are enough free cells.
				canDrag = cardDragCount <= (emptyCells + 1);
			}
		}
		
		// if ((!canDrag) && (draggingEntireColumn))
		if (draggingEntireColumn) {
			// Column drag allowed (but only to an empty column).
			if (!canDrag) {
				table.dragRestriction = dragRestrictions.EMPTYCOLUMNONLY;
				canDrag = true;
			}
			
			// Display "Marujirushi" over empty columns to indicate where player can drag to.
			showColumnPlaceholder (table.stacksWithRole ('COLUMN'), 'allow', stack);
		}
	}
	
	return canDrag;
};

// ------------------------------------------------------------------ foundationAndCardSuitsMatch ()

function foundationAndCardSuitsMatch (stack, card) {
	"use strict";
	return (((stack.identifier === 'DIAMONDS') && (card.suit === cardSuit.DIAMONDS)) || 
	((stack.identifier === 'CLUBS') && (card.suit === cardSuit.CLUBS)) || 
	((stack.identifier === 'HEARTS') && (card.suit === cardSuit.HEARTS)) || 
	((stack.identifier === 'SPADES') && (card.suit === cardSuit.SPADES)));
};

// ----------------------------------------------------------------- canDragStackFromStackToStack ()

function canDragStackFromStackToStack (stack, srcStack, destStack) {
	"use strict";
	var canDrag = false;
	var topDestCard;
	var bottomSrcCard;
	
	// if DISALLOW_DRAGTO_IF_ANIMATION
	
	// What is the top card on the stack the player is dragging to?
	topDestCard = destStack.topCard ();
	
	// What is the bottom card on the stack the player is dragging?
	bottomSrcCard = stack.cardAtIndex (0);
	
	// Do we have a top card (if not, we're dragging to an empty stack)?
	if (topDestCard) {
		// If there is a card (the destination stack is not empty).
		// Handle the case when the destination stack is the foundation.
		if (destStack.role === 'FOUNDATION') {
			// The card being dragged must be one rank higher than 
			// the top card on the foundation, and match its suit.
			if ((bottomSrcCard.rank === (topDestCard.rank + 1)) && 
					(bottomSrcCard.suit === topDestCard.suit) && 
					(stack.numberOfCards === 1)) {
				canDrag = true;
			}
		} else if (destStack.role === 'FREECELL') {
			// If there is already a card in the cell, the 
			// player may not drag another card there.
			canDrag = false;
		} else {
			if (table.dragRestriction === dragRestrictions.EMPTYCOLUMNONLY) {
				canDrag = false;
			} else {
				// If the stack is the tableau, the rank of the card being 
				// dragged must be one smaller and opposite in color.
				canDrag = (((bottomSrcCard.rank + 1) == topDestCard.rank) && 
						(bottomSrcCard.compareColorWithCard (topDestCard) === cardColorComparison.OPPOSITE));
			}
		}
	} else {
		// Empty stack. Allow an ace only on foundations, any card may 
		// be placed in empty cells or on empty tableua columns.
		if (destStack.role === 'FOUNDATION') {
			// Foundation - since no card on foundation, card must be an Ace.
			if ((bottomSrcCard.rank === 1) && (stack.numberOfCards === 1) && 
					(foundationAndCardSuitsMatch (destStack, bottomSrcCard))) {
				canDrag = true;
			}
		} else if (destStack.role === 'FREECELL') {
			// Cell - only a single card can be dragged, but any card is allowed.
			canDrag = (stack.numberOfCards === 1);
		} else {
			// Tableau - since no card on tableau, any card allowed 
			// (unless a restricted drag).
			canDrag = table.dragRestriction !== dragRestrictions.DISALLOWEMPTYCOLUMN;
		}
	}
	
	return canDrag;
};

// ------------------------------------------------------------------ foundationShouldTakeCardAll ()

function foundationShouldTakeCardAll (card, table) {
	"use strict";
	var stackToPutAwayTo = null;
	var foundationStacks = table.stacksWithRole ('FOUNDATION');
	var topCard;
	
	// Walk the foundations looking for a match.
	for (var i = 0, count = foundationStacks.length; i < count; i += 1) {
		// Top card of foundation.
		topCard = foundationStacks[i].topCard ();
		
		if (!topCard) {
			// Foundation is empty (no top card). Only an Ace may be placed.
			if ((card.suit === i) && (card.rank === 1)) {
				stackToPutAwayTo = foundationStacks[i];
				break;
			}
		} else if ((card.suit === topCard.suit) && (card.rank === (topCard.rank + 1))) {
			// Put away any card that it is legal to put away.
			stackToPutAwayTo = foundationStacks[i];
			break;
		}
	}
	
	return stackToPutAwayTo;
};

// ---------------------------------------------------------------- foundationShouldTakeCardSmart ()

function foundationShouldTakeCardSmart (card, table) {
	"use strict";
	var stackToPutAwayTo = null;
	var lowestRedFoundationRank = 13;	// Initially assume King is the lowest ranking card.
	var lowestBlackFoundationRank = 13;	// Initially assume King is the lowest ranking card.
	var foundationStacks = table.stacksWithRole ('FOUNDATION');
	var count = foundationStacks.length;
	var i;
	var stack;
	var topCard;
	var oppositeFoundationCard;
	
	// Walk foundations finding the lowest black ranking card and lowest red ranking cards.
	for (i = 0; i < count; i += 1) {
		// Foundation stack.
		stack = foundationStacks[i];
		
		// Top card of foundation.
		topCard = stack.topCard ();
		
		// Compare.
		if (!topCard) {
			// If no card on foundation, this becomes (zero) the lowest card of the given color.
			if ((stack.identifier === 'DIAMONDS') || (stack.identifier === 'HEARTS')) {
				lowestRedFoundationRank = 0;
			} else {
				lowestBlackFoundationRank = 0;
			}
		} else {
			if ((topCard.color === cardSuit.RED) && (topCard.rank < lowestRedFoundationRank)) {
				lowestRedFoundationRank = topCard.rank;
			} else if ((topCard.color === cardSuit.BLACK) && (topCard.rank < lowestBlackFoundationRank)) {
				lowestBlackFoundationRank = topCard.rank;
			}
		}
	}
	
	// Walk the foundations looking for a match.
	for (i = 0; i < count; i += 1) {
		// Foundation stack.
		stack = foundationStacks[i];
		
		// Top card of foundation.
		topCard = stack.topCard ();
		
		// Compare.
		if (!topCard) {
			// Foundation is empty (no top card). Only an Ace may be placed.
			if ((card.rank === 1) && (foundationAndCardSuitsMatch (stack, card))) {
				stackToPutAwayTo = stack;
				break;
			}
		} else if ((card.suit === topCard.suit) && (card.rank === (topCard.rank + 1))) {
			// First pass: card must ranked one greater than the top card of 
			// the foundation correspoding to card's suit.
			// Second pass: two's are always put up (Microsoft way).
			if (card.rank <= 2) {
				stackToPutAwayTo = stack;
			}
			
			// Third pass: put up if both opposite color foundations are built 
			// up to within two of the card's rank (also Microsoft way).
			if ((card.color === cardSuit.RED) && (card.rank <= (lowestBlackFoundationRank + 1))) {
				stackToPutAwayTo = stack;
			} else if ((card.color === cardSuit.BLACK) && (card.rank <= (lowestRedFoundationRank + 1))) {
				stackToPutAwayTo = stack;
			}
			
			// Fourth pass: there is one case we will also allow, if card ranks 
			// is within 2 greater than both the opposite color's foundation ranks 
			// AND within 3 of its same-color-opposite-suit foundation card (NETCell way).
			if (!stackToPutAwayTo) {
				if ((card.suit === cardSuit.DIAMONDS) && (card.rank <= (lowestBlackFoundationRank + 2))) {
					// Top card of 'opposite' (Hearts) foundation (same color, other suit).
					oppositeFoundationCard = foundationStacks[2].topCard ();
					if ((oppositeFoundationCard) && (card.rank <= (oppositeFoundationCard.rank + 3))) {
						stackToPutAwayTo = stack;
					}
				} else if ((card.suit === cardSuit.CLUBS) && (card.rank <= (lowestRedFoundationRank + 2))) {
					// Top card of 'opposite' (Spades) foundation (same color, other suit).
					oppositeFoundationCard = foundationStacks[3].topCard ();
					if ((oppositeFoundationCard) && (card.rank <= (oppositeFoundationCard.rank + 3))) {
						stackToPutAwayTo = stack;
					}
				} else if ((card.suit === cardSuit.HEARTS) && (card.rank <= (lowestBlackFoundationRank + 2))) {
					// Top card of 'opposite' (Diamonds) foundation (same color, other suit).
					oppositeFoundationCard = foundationStacks[0].topCard ();
					if ((oppositeFoundationCard) && (card.rank <= (oppositeFoundationCard.rank + 3))) {
						stackToPutAwayTo = stack;
					}
				} else if ((card.suit === cardSuit.SPADES) && (card.rank <= (lowestRedFoundationRank + 2))) {
					// Top card of 'opposite' (Clubs) foundation (same color, other suit).
					oppositeFoundationCard = foundationStacks[1].topCard ();
					if ((oppositeFoundationCard) && (card.rank <= (oppositeFoundationCard.rank + 3))) {
						stackToPutAwayTo = stack;
					}
				}
			}
		}
	}
	
	return stackToPutAwayTo;
};

// ----------------------------------------------------------------- determineIfCardsCanBePutAway ()

function determineIfCardsCanBePutAway (table) {
	"use strict";
	var didPutAwayCard;
	var columnStacks = table.stacksWithRole ('COLUMN');
	var cellStacks = table.stacksWithRole ('FREECELL');
	var i;
	var count;
	var stack;
	var topCard;
	var destinationStack;
	
	do {
		// Indicate no card found at this point.
		didPutAwayCard = false;
		
		// Walk the tableaus, examining the top cards of eack stack.
		count = columnStacks.length;
		for (i = 0; i < count; i += 1) {
			// Column stack.
			stack = columnStacks[i];
			
			// Card that is on top of stack.
			topCard = stack.topCard ();
			if (!topCard) {
				continue;
			}
			
			// If card was worried back (or Undone) the player doesn't want us moving the card.
			if (wasCardAutoPutAway (topCard)) {
				continue;
			}
			
			// Determine if top card of tableau has a foundation it should be put-away to.
			destinationStack = foundationShouldTakeCardSmart (topCard, table);
			if (destinationStack) {
				table.moveTopCardFromStackToStack (stack, destinationStack, true);
				indicateCardWasAutoPutAway (topCard);
				didPutAwayCard = true;
			}
		}
		
		// Walk the cells, examining the top cards of eack stack.
		count = cellStacks.length;
		for (i = 0; i < count; i += 1) {
			// FreeCell stack.
			stack = cellStacks[i];
			
			// Card on stack.
			topCard = stack.topCard ();
			if (!topCard) {
				continue;
			}
			
			// Determine if top card of cell has a foundation it should be put-away to.
			destinationStack = foundationShouldTakeCardSmart (topCard, table);
			if (destinationStack) {
				table.moveTopCardFromStackToStack (stack, destinationStack, true);
				indicateCardWasAutoPutAway (topCard);
				didPutAwayCard = true;
			}
		}
	}
	while (didPutAwayCard);
}

// ---------------------------------------------------------------------------- evaulateUndoState ()

function evaulateUndoState () {
	var undoButton = document.getElementById ('undo_button');
	
	if (table.canUndo ()) {
		undoButton.style.color = '#000000';
		undoButton.className = "pillbutton unselectable";
	} else {
		undoButton.style.color = '#999999';
		undoButton.className = "pillbutton unselectable nohover";
	}
}

// ---------------------------------------------------------------------------- cardDragCompleted ()

function cardDragCompleted (table, dragged) {
	"use strict";
	showColumnPlaceholder (table.stacksWithRole ('COLUMN'), null, null);
	
	if (dragged) {
		if (playerHasNotYetMoved) {
			playerHasNotYetMoved = false;
			indicate_played_freecell ();
		}
		
		evaluate_table ();
	}
}

// ---------------------------------------------------------------------------- cardDoubleClicked ()

function cardDoubleClicked (card, stackContaining) {
	"use strict";
	var destinationStack = null;
	var cardMoved = false;
	var i;
	var count;
	var columnStacks = table.stacksWithRole ('COLUMN');
	var cellStacks = table.stacksWithRole ('FREECELL');
	var topCard;
	var emptyTableauStack = null;
	
	// Only double-clicks on top card are allowed.
	if (stackContaining.topCard () !== card) {
		return;
	}
	
	// Disallow double-clicking the foundation (card will just get put up again).
	if (stackContaining.role === 'FOUNDATION') {
		return;
	}
	
	// Check first to see if card can be put up in the foundation.
	destinationStack = foundationShouldTakeCardSmart (card, table);
	if (destinationStack) {
		table.moveTopCardFromStackToStack (stackContaining, destinationStack, true);
		cardMoved = true;
	}
	
	if (!cardMoved) {
		// Walk the tableaus, examining the top cards of eack stack.
		count = columnStacks.length;
		for (i = 0; i < count; i += 1) {
			// Column stack.
			destinationStack = columnStacks[i];
			
			// Card that is on top of stack.
			topCard = destinationStack.topCard ();
			if (!topCard) {
				// Note empty tableau column, we may use it later.
				if (!emptyTableauStack) {
					emptyTableauStack = destinationStack;
				}
				continue;
			}
			
			// Test if the top card is of the opposite color and if 
			// the rank is one larger than the card double-clicked on.
			if ((card.compareColorWithCard (topCard) === cardColorComparison.OPPOSITE) && 
					(topCard.rank === (card.rank + 1))) {
				table.moveTopCardFromStackToStack (stackContaining, destinationStack, true);
				cardMoved = true;
				break;
			}
		}
	}
	
	if (!cardMoved) {
		// We make a special case for Kings: we look first for an 
		// empty tableau column rather than an empty cell.
		if ((card.rank === 13) && (emptyTableauStack)) {
			table.moveTopCardFromStackToStack (stackContaining, emptyTableauStack, true);
			cardMoved = true;
		}
	}
	
	if (!cardMoved) {
		// If the card double-tapped is in a cell already, look first for an empty tableau.
		if (stackContaining.role === 'FREECELL') {
			if (emptyTableauStack) {
				table.moveTopCardFromStackToStack (stackContaining, emptyTableauStack, true);
				cardMoved = true;
			}
		} else {
			// Failing the above tests, we will look for an empty cell.
			count = cellStacks.length;
			for (i = 0; i < count; i += 1) {
				// FreeCell stack.
				destinationStack = cellStacks[i];
			
				// Looking for an empty cell.
				if (!destinationStack.topCard ()) {
					table.moveTopCardFromStackToStack (stackContaining, destinationStack, true);
					cardMoved = true;
					break;
				}
			}
		
			// No empty cells, then finally use an empty tableau columns 
			// if we had previously found one.
			if ((!cardMoved) && (emptyTableauStack)) {
				table.moveTopCardFromStackToStack (stackContaining, emptyTableauStack, true);
				cardMoved = true;
			}
		}
	}
	
	// Finally, at this point let's relax the "Smart" guidance and 
	// see if the Foundation will accomodate the card after all.
	if (!cardMoved) {
		destinationStack = foundationShouldTakeCardAll (card, table);
		if (destinationStack) {
			table.moveTopCardFromStackToStack (stackContaining, destinationStack, true);
			cardMoved = true;
		}
	}
	
	if (cardMoved) {
		if (playerHasNotYetMoved) {
			playerHasNotYetMoved = false;
			indicate_played_freecell ();
		}
		
		evaluate_table ();
	}
};

// --------------------------------------------------------------------- indicate_played_freecell ()

function indicate_played_freecell () {
	// Load and store games played and won from local storage.
	var gamesPlayed = +(localStorage.getItem ("KARDLAND0_FREECELL_PLAYED"));
	if (gamesPlayed === null) {
		gamesPlayed = 0;
	}
	gamesPlayed += 1;
	localStorage.setItem ("KARDLAND0_FREECELL_PLAYED", gamesPlayed);
};

// ------------------------------------------------------------------------ indicate_won_freecell ()

function indicate_won_freecell () {
	var gamesWon = +(localStorage.getItem ("KARDLAND0_FREECELL_WON"));
	if (gamesWon === null) {
		gamesWon = 0;
	}
	gamesWon += 1;
	localStorage.setItem ("KARDLAND0_FREECELL_WON", gamesWon);
	
	return gamesWon;
};

// ------------------------------------------------------------------------------ displayGameOver ()

function displayGameOver () {
	// Load and store games played and won from local storage.
	var gamesPlayed = +(localStorage.getItem ("KARDLAND0_FREECELL_PLAYED"));
	if (gamesPlayed === null) {
		gamesPlayed = 0;
	}
	
	var gamesWon = indicate_won_freecell ()
	
	document.getElementById ('gameover_played').innerHTML = gamesPlayed;
	document.getElementById ('gameover_won').innerHTML = gamesWon;
	document.getElementById ('gameover_modal').style.display = "block";
};

// ---------------------------------------------------------------------------- animationComplete ()

function animationComplete (table) {
	if (gameOver) {
		setTimeout (displayGameOver, 750);
	}
}

// ------------------------------------------------------------------------ evaluate_if_game_over ()

function evaluate_if_game_over () {
	var foundationStacks = table.stacksWithRole ('FOUNDATION');
	var i;
	var count = foundationStacks.length;
	var gameOver = true;
	
	// Walk all the foundations and count the cards on the stack. Anything less than 13 means
	// we are not done yet.
	for (i = 0; i < count; i += 1) {
		if (foundationStacks[i].numberOfCards < 13) {
			gameOver = false;
			break;
		}
	}
	
	return gameOver;
};

// ----------------------------------------------------------------------------- new_button_click ()

function new_button_click () {
	gameOver = false;
	table.reset ();
	
	// Clear the cards from the DOM.
	var fieldNode = document.getElementById ('field');
	while (fieldNode.firstChild) {
		fieldNode.removeChild (fieldNode.firstChild);
	}
	
	// Replace 'null' with Microsoft FreeCell game number; only impossible game known: 11982.
	begin_game (null);
};

// ---------------------------------------------------------------------------- undo_button_click ()

function undo_button_click () {
	table.undo ();
	evaulateUndoState ();
};

// -------------------------------------------------------------------------- size_the_card_table ()

function size_the_card_table () {
	fieldWidth = document.getElementById ("field").offsetWidth;
	if (fieldWidth < 880) {
		table.setCardWidth (73);
	} else if (fieldWidth < 1152) {
		table.setCardWidth (89);
	} else {
		table.setCardWidth (111);
	}
};

// ---------------------------------------------------------------------------- size_the_basement ()

function size_the_basement () {
	basement = document.getElementById ("basement");
	basement.style.top = window.innerHeight + 'px';
};

// ------------------------------------------------------------------------------- window_resized ()

function window_resized () {
	size_the_card_table ();
	size_the_basement ();
};

// ------------------------------------------------------------------------------- evaluate_table ()

function evaluate_table () {
	determineIfCardsCanBePutAway (table);
	evaulateUndoState ();
	gameOver = evaluate_if_game_over ();
};

// ----------------------------------------------------------------------------------- begin_game ()

function begin_game (dealNumber) {
	playerHasNotYetMoved = true;
	
	// Create deck of cards, shuffle them, all face up.
	var deck = table.newDeck (false);
	table.shuffle (deck, dealNumber);
	table.flipCards (deck, true);
	
	// Deal all the cards out to the tableau (columns).
	dealInitialHand (deck);
	
	table.performFunctionWhenLoadingComplete (function () {
		// Load up div elements in html (display the card table).
		table.appendCardElementsToElement (document.getElementById ('field'));
		setTimeout (evaluate_table, 1000);
	});
}

// -------------------------------------------------------------------------------- window.onload ()

window.onload = function () {
	// Get the width of our play field. Size the 'basement'.
	size_the_card_table ();
	size_the_basement ();
	
	// Handle window resize events.
	if (window.addEventListener) {
		window.addEventListener ('resize', window_resized, false);
	} else if (window.attachEvent) {
		window.attachEvent ('onresize', window_resized);
	} else {
		window['onresize'] = window_resized;
	}
	
	// Prepare 'Game Over' modal window.
	gameover_modal = prepare_modal_window ('gameover_modal', 'gameover_close');
	
	// Layout the FreeCell stacks.
	layoutTable ();
	
	// Assign callback functions to enforce FreeCell logic.
	table.canDragCardFromStack = canDragCardFromStack;
	table.canDragStackFromStackToStack = canDragStackFromStackToStack;
	table.cardDragCompleted = cardDragCompleted;
	table.cardDoubleClicked = cardDoubleClicked;
	table.animationComplete = animationComplete;
	
	// Replace 'null' with Microsoft FreeCell game number; only impossible game known: 11982.
	// One of the easiest deals: 11987.
	begin_game (null);
};
