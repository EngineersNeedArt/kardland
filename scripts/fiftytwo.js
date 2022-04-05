// =================================================================================================
// fiftytwo.js
// =================================================================================================


// Namespace.
var fiftytwo = fiftytwo || {};


// ============================================================================================ Card
// 
// Card (index, faceUp)
// 
// -------------- Public --------------
// ------------ Properties ------------
// faceUp      <- treat as a read-only property, assign with setFaceUp() below.
// suit        <- treat as a read-only property, assign with setIndex() below.
// rank        <- treat as a read-only property, assign with setIndex() below.
// ------------- Methods --------------
// setIndex (index)             <- 1 to 52 range for a normal deck of cards; 53, 54 for jokers.
// setFaceUp (faceUp)           <- sets faceUp (card is redrawn).
// compareColorWithCard (card)	<- compares self with card returns: UNDEFINED, SAME or OPPOSITE.
// imageNameForIndex (index)
//
// ------------- Private --------------
// ------------ Properties ------------
// _index
// _stackContaining
// _imageName
// _domElement
// _domImage
// _hRandom
// _vRandom
// ------------- Methods --------------
// _suitForIndex (index)
// _rankForIndex (index)
// _updateDOMElement ()
// _mouseDown (event)
// _doubleClick (event)
// _getDOMElement ()

// ----------------------------------------------------------------------------------------- Card ()

fiftytwo.Card = function (index, imagePath, faceUp)
{
	"use strict";
	this.faceUp = faceUp;
	this._stackContaining = null;
	this._imageName = null;
	this._imagePath = imagePath;
	this._domElement = null;
	this._domImage = null;
	this._hRandom = Math.floor (Math.random () * 3) - 1;	// Value from -1 to 1.
	this._vRandom = Math.floor (Math.random () * 3) - 1;	// Value from -1 to 1.
	
	// Call after other properties (like faceUp) have been assigned.
	this.setIndex (index);
};

// ----------------------------------------------------------------------------- _updateCardImage ()

fiftytwo.Card.prototype._updateCardImage = function ()
{
	"use strict";
	
	this._imageName = this.imageNameForIndex (this.faceUp ? this._index : -1);
	this._updateDOMElement ();
	
	return this;
};

// ------------------------------------------------------------------------------------- setIndex ()
// Many of the card properties derive from the index. This method 
// therefore has to update all of those properties.

fiftytwo.Card.prototype.setIndex = function (index)
{
	"use strict";
	
	// Assign.
	this._index = index;
	
	// A card index with an invalid range can not be face up.
	if ((index <= 0) || (index > 54))
	{
		this.faceUp = false;
	}
	
	// Set properties.
	this.suit = this._suitForIndex (index);
	this.rank = this._rankForIndex (index);
	this._updateCardImage ();
	this.color = this._colorForSuit (this.suit);
	
	return this;
};

// ------------------------------------------------------------------------------------ setFaceUp ()

fiftytwo.Card.prototype.setFaceUp = function (faceUp)
{
	"use strict";
	
	if (this.faceUp !== faceUp)
	{
		this.faceUp = faceUp;
		this._updateCardImage ();
	}
	
	return this;
};

// ------------------------------------------------------------------------- compareColorWithCard ()

// Enum type for comparing card colors.
var cardColorComparison =
{
	UNDEFINED: 0,
	SAME: 1,
	OPPOSITE: 2
};

fiftytwo.Card.prototype.compareColorWithCard = function (card)
{
	"use strict";
	var comparison = cardColorComparison.UNDEFINED;
	var otherSuit = card.suit;
	var thisSuit = this.suit;
	
	if ((otherSuit > cardSuit.UNKNOWN) && (thisSuit > cardSuit.UNKNOWN))
	{
		if ((otherSuit === cardSuit.DIAMONDS) || (otherSuit === cardSuit.HEARTS))
		{
			if ((thisSuit === cardSuit.DIAMONDS) || (thisSuit === cardSuit.HEARTS))
			{
				comparison = cardColorComparison.SAME;
			}
			else if ((thisSuit === cardSuit.CLUBS) || (thisSuit === cardSuit.SPADES))
			{
				comparison = cardColorComparison.OPPOSITE;
			}
		}
		else if ((otherSuit === cardSuit.CLUBS) || (otherSuit === cardSuit.SPADES))
		{
			if ((thisSuit === cardSuit.DIAMONDS) || (thisSuit === cardSuit.HEARTS))
			{
				comparison = cardColorComparison.OPPOSITE;
			}
			else if ((thisSuit === cardSuit.CLUBS) || (thisSuit === cardSuit.SPADES))
			{
				comparison = cardColorComparison.SAME;
			}
		}
	}
	
	return comparison;
};

// -------------------------------------------------------------------------------- _suitForIndex ()

var cardSuit =
{
	UNKNOWN: 0,
	DIAMONDS: 1,
	CLUBS: 2,
	HEARTS: 3,
	SPADES: 4,
	RED: 5,		// For the Red Joker
	BLACK: 6	// For the Black Joker
};

fiftytwo.Card.prototype._suitForIndex = function (index)
{
	"use strict";
	var suit = cardSuit.UNKNOWN;
	
	// Assume no known suit (the index may not be within a valid 
	// range - therefore intentionally undefined (as an example, 
	// the actual index of a face down card may only be known to 
	// the server).
	
	if ((index >= 1) && (index <= 52))
	{
		switch (Math.floor ((index - 1) / 13))
		{
			case 0:
			suit = cardSuit.DIAMONDS;
			break;
			
			case 1:
			suit = cardSuit.CLUBS;
			break;
			
			case 2:
			suit = cardSuit.HEARTS;
			break;
			
			default:
			suit = cardSuit.SPADES;
		}
	}
	else if (index === 53)
	{
		suit = cardSuit.RED;
	}
	else if (index === 54)
	{
		suit = cardSuit.BLACK;
	}
	
	return suit;
};

// -------------------------------------------------------------------------------- _colorForSuit ()

fiftytwo.Card.prototype._colorForSuit = function (suit)
{
	"use strict";
	
	var color = cardSuit.UNKNOWN;
	if ((suit === cardSuit.DIAMONDS) || (suit === cardSuit.HEARTS))
	{
		color = cardSuit.RED;
	}
	else if ((suit === cardSuit.CLUBS) || (suit === cardSuit.SPADES))
	{
		color = cardSuit.BLACK;
	}
	
	return color;
};

// -------------------------------------------------------------------------------- _rankForIndex ()
// Ranks returned are 1 (for the Ace) through 13 (for the King) and 0 (zero) 
// for Jokers. If the card is unknown (face down) a -1 is returned.

fiftytwo.Card.prototype._rankForIndex = function (index)
{
	"use strict";
	var rank = -1;
	
	if ((index >= 1) && (index <= 52))
	{
		rank = ((index - 1) % 13) + 1;
	}
	else if ((index === 53) || (index === 54))
	{
		rank = 0;
	}
	
	return rank;
};

// ---------------------------------------------------------------------------- imageNameForIndex ()

fiftytwo.Card.prototype.imageNameForIndex = function (index)
{
	"use strict";
	var name;
	var rank;
	
	if ((index >= 1) && (index <= 52))
	{
		rank = ((index - 1) % 13) + 1;
		switch (Math.floor ((index - 1) / 13))
		{
			case 0:
			name = rank + 'd.svg';
			break;
		
			case 1:
			name = rank + 'c.svg';
			break;
		
			case 2:
			name = rank + 'h.svg';
			break;
		
			default:
			name = rank + 's.svg';
			break;
		}
	}
	else if (index === 53)
	{
		name = "jr.svg";
	}
	else if (index === 54)
	{
		name = "jb.svg";
	}
	else
	{
		name = "back.png";
	}
	
	return name;		
};

// ---------------------------------------------------------------------------- _updateDOMElement ()

fiftytwo.Card.prototype._updateDOMElement = function ()
{
	"use strict";
	
	if (this._domImage)
	{
		// this.elementImage.setAttribute ('alt', this.faceUp ? this.name () : "Card Back");
		this._domImage.src = this._imagePath + '/' + this._imageName;
	}
};

// ----------------------------------------------------------------------------------- _mouseDown ()

fiftytwo.Card.prototype._mouseDown = function (event)
{
	"use strict";
	var thisCard;
	var thisStack;
	var thisTable;
	
	if (!event)
	{
		event = window.event;
	}
	
	if (!event.which)
	{
		event.which = event.button;
	}
	
	// Only left-button mouse-downs.
	if (event.which > 1)
	{
		return;
	}
	
	// Get card object.
	thisCard = this.cardModel;
	
	// Stack the card came from.
	thisStack = thisCard._stackContaining;
	
	// Table the stack is associated with.
	thisTable = thisStack._tableContaining;
	
	// Call table to prepare to drag the stack (returns false if not allowed).
	if (!thisTable._beginDragCardFromStack(event, thisCard, thisStack))
	{
		thisCard._domImage.draggable = false;
		return;
	}
	thisCard._domImage.draggable = true;
	
	if (event.preventDefault)
	{
		event.preventDefault ();
	}
	
	event.returnValue = false;
	
	return false;
};

// --------------------------------------------------------------------------------- _doubleClick ()

fiftytwo.Card.prototype._doubleClick = function (event)
{
	"use strict";
	var thisCard;
	var thisStack;
	var thisTable;
	
	if (!event)
	{
		event = window.event;
	}
	
	if (!event.which)
	{
		event.which = event.button;
	}
	
	// Only left-button double clicks.
	if (event.which > 1)
	{
		return;
	}
	
	// Get card object.
	thisCard = this.cardModel;
	
	// Stack the card came from.
	thisStack = thisCard._stackContaining;
	
	// Table the stack is associated with.
	thisTable = thisStack._tableContaining;
	
	// Call through to table.	
	thisTable._cardDoubleClicked (thisCard);
};

// --------------------------------------------------------------------------------------- _click ()

fiftytwo.Card.prototype._click = function (event)
{
	"use strict";
	var thisCard;
	var thisStack;
	var thisTable;
	
	if (!event)
	{
		event = window.event;
	}
	
	if (!event.which)
	{
		event.which = event.button;
	}
	
	// Only left-button double clicks.
	if (event.which > 1)
	{
		return;
	}
	
	// Get card object.
	thisCard = this.cardModel;
	
	// Stack the card came from.
	thisStack = thisCard._stackContaining;
	
	// Table the stack is associated with.
	thisTable = thisStack._tableContaining;
	
	// Call through to table.	
	thisTable._cardClicked (thisCard);
};

// ------------------------------------------------------------------------------- _getDOMElement ()

fiftytwo.Card.prototype._getDOMElement = function ()
{
	"use strict";
	
	// Create a DOM node element.
	if (!this._domElement)
	{
		this._domElement = document.createElement ('div');
		this._domElement.cardModel = this;
		this._domElement.style.position = 'absolute';
		this._domElement.className = 'fiftytwo_card';
		
		// Create image element, append to node element.
		this._domImage = document.createElement ('img');
		this._domImage.style.display = 'block';
		/*
		if (navigator.userAgent.match ("Chrome"))
		{
			this._domImage.style.WebkitTransformStyle = 'flat';
		}
		else if (navigator.userAgent.match("Firefox"))
		{
			this._domImage.style.MozTransformStyle = 'flat';
		}
		else if (navigator.userAgent.match("MSIE"))
		{
			this._domImage.style.msTransformStyle = 'flat';
		}
		else if (navigator.userAgent.match("Opera"))
		{
			this._domImage.style.OTransformStyle = 'flat';
		}
		else
		{
			this._domImage.style.transformStyle = 'flat';
		}
		*/
		
		// this._domImage.setAttribute ('alt', this.faceUp ? this.name () : "Card Back");
		
		this._domImage.src = this._imagePath + '/' + this._imageName;
		this._domElement.appendChild (this._domImage);
		
		// Assign event handlers.
		this._domElement.onmousedown = this._mouseDown;
		// this._domElement.touchstart = this._mouseDown;
		this._domElement.ondblclick = this._doubleClick;
		this._domElement.onclick = this._click;
		// this._domElement.ondragstart = function (event)
		// {
		// 	console.log ("ondragstart");
		// };
	}
	
	return this._domElement;
};

// =========================================================================================== Stack
// 
// Stack (hSpread, vSpread)
// 
// -------------------- Public --------------------
// ------------------ Properties ------------------
// hSpread         <- multiple of cardWidth to offset cards horizontally.
// vSpread         <- multiple of cardHeight to offset cards vertically.
// hPosition       <- multiple of cardWidth to position stack horizontally.
// vPosition       <- multiple of cardHeight to position stack vertically.
// numberOfCards   <- count of cards in stack.
// identifier      <- optional string to identify stack (should be unique, e.g. 'COLUMN_3').
// role            <- optional role client can use to classify a stack (e.g. 'FOUNDATION').
// hRandomScale    <- optional horizontal scaling for a disheveled stack.
// vRandomScale    <- optional vertical scaling for a disheveled stack.
// ------------------- Methods --------------------
// cardAtIndex (index)            <- returns card from stack at index (index out of range: null).
// indexOfCard (card)             <- returns index of card (if card is not in stack: returns -1).
// topCard ()                     <- top card on stack (last card in _cards[] array).
// setPlaceholderImage (imageSrc) <- image to display as a placeholder when no cards, null clears.
// 
// ------------------- Private --------------------
// ------------------ Properties ------------------
// _cards[]
// _tableContaining
// _domElement
// _domImage
// _mouseStartX
// _mouseStartY
// _wasStyleLeft
// _wasStyleTop
// _hitTestRect
// _cardsInFlight[]
// ------------------- Methods --------------------
// _updateDOMElement ()
// _getDOMElement ()
// _rectForCardAtIndex (index)
// _positionCardElements ()
// _highlight (highlight)
// _addCard (card)
// _cardIsInFlight (card)
// _cardAnimationComplete (card)
// _reset ()
// _removeTopCard ()
// _addCards (cardArray)
// _stackCutFromCard (card)
// _hitTest ()
// _cardElements ()
// _relayout ()

// ---------------------------------------------------------------------------------------- stack ()

fiftytwo.Stack = function (hSpread, vSpread)
{
	"use strict";
	this.hSpread = hSpread;
	this.vSpread = vSpread;
	this.hSpreadFaceDown = hSpread;
	this.vSpreadFaceDown = vSpread;
	this.hPosition = 0;
	this.vPosition = 0;
	this.numberOfCards = 0;
	this.identifier = "STACK";
	this.role = "NONE";
	this.hRandomScale = 0;
	this.vRandomScale = 0;
	this._cards = [];
	this._tableContaining = null;
	this._domElement = null;
	this._domImage = null;
	this._placeholderImage = null;
	this._mouseStartX = 0;
	this._mouseStartY = 0;
	this._wasStyleLeft = 0;
	this._wasStyleTop = 0;
	this._hitTestRect = null;
	this._cardsInFlight = [];
};

// --------------------------------------------------------------------------- setHSpreadFaceDown ()

fiftytwo.Stack.prototype.setHSpreadFaceDown = function (spread)
{
	"use strict";
	this.hSpreadFaceDown = spread;
}

// --------------------------------------------------------------------------- setHSpreadFaceDown ()

fiftytwo.Stack.prototype.setVSpreadFaceDown = function (spread)
{
	"use strict";
	this.vSpreadFaceDown = spread;
}

// ---------------------------------------------------------------------------------- cardAtIndex ()

fiftytwo.Stack.prototype.cardAtIndex = function (index)
{
	"use strict";
	var card = null;
	
	if (index >= 0)
	{
		if ((this.numberOfCards > 0) && (index < this.numberOfCards))
		{
			card = this._cards[index];
		}
	}
	
	return card;
};

// ---------------------------------------------------------------------------------- indexOfCard ()
// returns -1 if the card is not found.

fiftytwo.Stack.prototype.indexOfCard = function (card)
{
	"use strict";
	var index = -1;
	var i;
	
	for (i = 0; i < this.numberOfCards; i += 1)
	{
		if (this._cards[i] === card)
		{
			index = i;
			break;
		}
	}
	
	return index;
};

// -------------------------------------------------------------------------------------- topCard ()

fiftytwo.Stack.prototype.topCard = function ()
{
	"use strict";
	var topCard = null;
	
	if (this.numberOfCards > 0)
	{
		topCard = this._cards[this.numberOfCards - 1];
	}
	
	return topCard;
};

// -------------------------------------------------------------------------- setPlaceholderImage ()

fiftytwo.Stack.prototype.setPlaceholderImage = function (imageSrc)
{
	"use strict";
	
	// Assign.
	this._placeholderImage = imageSrc;
	
	// If we have already instantiated our DOM element....
	if (this._domElement)
	{
		// Does our DOM element already have an image?
		if (this._domImage)
		{
			if (imageSrc)
			{
				// Assign image src that was provided.
				this._domImage.src = imageSrc;
			}
			else
			{
				// Remove child (image) element. Release image (assign null).
				this._domElement.removeChild (this._domImage);
				this._domImage = null;
			}
		}
		else if (imageSrc)
		{
			// Create the DOM image.
			this._createDOMImage ();
		}
	}
	
	return this;
};

// ----------------------------------------------------------------------------- _createDOMImage ()
// This should only have been called if we have already instantiated
// our DOM element and need to append an image element.

fiftytwo.Stack.prototype._createDOMImage = function ()
{
	"use strict";
	var domImage;
	
	// Create image element.
	domImage = document.createElement ('img');
	
	// Style image element.
	domImage.style.display = 'block';
	domImage.width = this._tableContaining.cardWidth;
	domImage.height = this._tableContaining.cardHeight;
	// domImage.style.backgroundsize = cardWidth;
//	domImage.pointerEvents = 'none';
	
	// Assign image src.
	domImage.src = this._placeholderImage;
	
	// Append image element to node element.
	this._domElement.appendChild (domImage);
	
	// Assign.
	this._domImage = domImage;
}

// ---------------------------------------------------------------------------- _updateDOMElement ()
// If the stack has cards the stack's DOM element is a hidden
// element placed exactly on top of the topmost card and ordered
// on top as well. If the stack is empty, its DOM element is
// where the first card would go (the base of the stack — or
// stack origin). If there is a placeholder image, it is
// displayed for the empty stack.

fiftytwo.Stack.prototype._updateDOMElement = function ()
{
	"use strict";
	var element;
	var cardWidth;
	var cardHeight;
	var count;
	var cardRect;
	var domImage;
	
	element = this._domElement;
	if (element)
	{
		// Get card width and height, assign to DOM element.
		cardWidth = this._tableContaining.cardWidth;
		cardHeight = this._tableContaining.cardHeight;
		element.style.width = cardWidth + 'px';
		element.style.height = cardHeight + 'px';
		element.style.borderRadius = (cardHeight / 25) + 'px';
//		element.pointerEvents = 'none';
		
		// Get count of cards.
		count = this.numberOfCards;
		
		if (count > 1)
		{
			// With at least one card, the stack's DOM element is the same as the card on top.
			cardRect = this._rectForCardAtIndex (count - 1);
			element.style.left = cardRect.left + 'px';
			if (this.vPosition >= 0)
			{
				element.style.top = cardRect.top + 'px';
				element.style.bottom = '';
			}
			else
			{
				element.style.bottom = (cardRect.top + cardHeight) + 'px';
				element.style.top = '';
			}
		}
		else
		{
			// With one or fewer cards, the stack's DOM element is at the stack origin.
			element.style.left = (Math.round (this.hPosition * cardWidth)) + 'px';
			if (this.vPosition >= 0)
			{
				element.style.top = (Math.round (this.vPosition * cardHeight)) + 'px';
				element.style.bottom = '';
			}
			else
			{
				element.style.bottom = (Math.round (-this.vPosition * cardHeight)) + 'px';
				element.style.top = '';
			}
		}
		
		// If we have an image element, size it, set visibility.
		domImage = this._domImage;
		if (domImage)
		{
			// Size image element.
			domImage.width = cardWidth;
			domImage.height = cardHeight;
			// domImage.style.backgroundsize = cardWidth;
			
			if (count > 0)
			{
				domImage.style.visibility = 'hidden';
			}
			else
			{
				domImage.style.visibility = 'visible';
			}
		}
		
		if (count > 0)
		{
			// Place the element above all other cards in stack.
			element.style.zIndex = count + 1;
		}
		else
		{
			element.style.zIndex = 0;
		}
	}
};

// --------------------------------------------------------------------------------------- _click ()

fiftytwo.Stack.prototype._click = function (event)
{
	"use strict";
	
	// We ignore the click event unless there are no cards on the stack.
	if (this.numberOfCards > 0)
	{
		return;
	}
	
	if (!event)
	{
		event = window.event;
	}
	
	if (!event.which)
	{
		event.which = event.button;
	}
	
	// Only left-button double clicks.
	if (event.which > 1)
	{
		return;
	}
	
	// Call through to table.	
	this._tableContaining._cardClicked (null);
};

// ------------------------------------------------------------------------------- _getDOMElement ()
// Lazily instantiated. We try to put off instantiating until
// asked to actually display content.

fiftytwo.Stack.prototype._getDOMElement = function ()
{
	"use strict";
	var element;
	
	// Create node element.
	if (!this._domElement)
	{
		// Create our element.
		element = document.createElement ('div');
		
		// Assign DOM element style.
		element.style.position = 'absolute';
		element.style.backgroundColor = 'transparent';
		// element.style.backgroundBlendMode = 'multiply';
		element.style.pointerEvents = 'none';	// MUST
		element.className = 'fiftytwo_stack';
		element.style.cursor = 'pointer';
		
		// Assign.
		this._domElement = element;
		
		// Add image if there is placeholder image specified.
		if (this._placeholderImage)
		{
			this._createDOMImage ();
		}
		
		// Adjust size and position of element.
		this._updateDOMElement ();
	}
	
	return this._domElement;
};

// ------------------------------------------------------------------------ _offsetForCardAtIndex ()

fiftytwo.Stack.prototype._offsetForCardAtIndex = function (index)
{
	"use strict";
	
	var offset = {};
	var cardWidth;
	var cardHeight;
	var left = 0;
	var top = 0;
	var i;
	
	if (!this._tableContaining)
	{
		return null;
	}
	
	// Calculate left and top.
	if ((this.hSpread !== 0.0) || (this.vSpread !== 0.0))
	{
		for (i = 1; i <= index; i++)
		{
			if (this._cards[i - 1].faceUp)
			{
				left = left + this.hSpread;
				top = top + this.vSpread;
			}
			else
			{
				left = left + this.hSpreadFaceDown;
				top = top + this.vSpreadFaceDown;
			}
		}
	}
	
	// Assign offset.
	offset.left = left;
	offset.top = top;
	
	return (offset);
}

// -------------------------------------------------------------------------- _rectForCardAtIndex ()

fiftytwo.Stack.prototype._rectForCardAtIndex = function (index)
{
	"use strict";

	var rect = {};
	var offset;
	var cardWidth = this._tableContaining.cardWidth;
	var cardHeight = this._tableContaining.cardHeight;
	
	// Get offset.
	if ((this.hSpread === 0.0) && (this.vSpread === 0.0))
	{
		rect.left = Math.round (this.hPosition * cardWidth);
		if (this.vPosition >= 0)
		{
			rect.top = Math.round (this.vPosition * cardHeight) - (index * 0.5);
		}
		else
		{
			rect.top = Math.round (-this.vPosition * cardHeight) - cardHeight + (index * 0.5);
		}
		rect.right = Math.round (rect.left + cardWidth);
		rect.bottom = Math.round (rect.top + cardHeight);
	}
	else
	{
		offset = this._offsetForCardAtIndex (index);
		if (offset)
		{
			// Assign rectangle.
			rect.left = Math.round ((this.hPosition + offset.left) * cardWidth);
			if (this.vPosition >= 0)
			{
				rect.top = Math.round ((this.vPosition + offset.top) * cardHeight);
			}
			else
			{
				rect.top = Math.round ((this.vPosition + offset.top) * cardHeight) - cardHeight;
			}
			rect.right = rect.left + cardWidth;
			rect.bottom = rect.top + cardHeight;
		}
	}
	
	return (rect);
};

// ------------------------------------------------------------------------ _positionCardElements ()
// This will instantiate all the card elements in the stack and then
// position them. It also invalidates the hit-test rectangle.

fiftytwo.Stack.prototype._positionCardElements = function ()
{
	"use strict";
	
	if (!this._tableContaining)
	{
		return;
	}
	var count = this.numberOfCards;
	var i;
	var cardElement;
	var cardImage;
	var table = this._tableContaining;
	var cardWidth = table.cardWidth;
	var cardHeight = table.cardHeight;
	var cardLeft = Math.round (this.hPosition * cardWidth);
	var cardTop = Math.round (Math.abs (this.vPosition) * cardHeight);
	var hOffset;
	var vOffset;
	var checkInFlight = (this._cardsInFlight.length > 0);
	
	for (i = 0; i < count; i += 1)
	{
		if ((checkInFlight) && (this._cardIsInFlight(this._cards[i])))
		{
			// If this card is "in-flight" (soon to animate here), then we are 
			// done with "landed" cards.
			break;
		}
		
		// Get card element.
		cardElement = this._cards[i]._getDOMElement();
		
		// Assign width and height and z-index.
		cardElement.style.width = cardWidth;
		cardElement.style.height = cardHeight;
		cardElement.style.zIndex = i + 1;
		
		// Assign left and top.
		// Special case when hSpread and vSpread are zero — treat as a tight stack of cards.
		if ((this.hSpread === 0.0) && (this.vSpread === 0.0))
		{
			// Assign left and top.
			cardElement.style.left = cardLeft + 'px';
			if (this.vPosition >= 0)
			{
				cardElement.style.top = cardTop + 'px';
				cardElement.style.bottom = '';
			}
			else
			{
				cardElement.style.bottom = cardTop + 'px';
				cardElement.style.top = '';
			}
			
			// Increment top only.
			if (this.vPosition >= 0)
			{
				cardTop = cardTop - 0.5;
			}
			else
			{
				cardTop = cardTop + 0.5;
			}
		}
		else
		{
			// Assign left + random value.
			hOffset = this._cards[i]._hRandom * this.hRandomScale;
			cardElement.style.left = (cardLeft + hOffset) + 'px';
			
			// Assign top + random value.
			vOffset = this._cards[i]._vRandom * this.vRandomScale;
			if (this.vPosition >= 0)
			{
				cardElement.style.top = (cardTop + vOffset) + 'px';
				cardElement.style.bottom = '';
			}
			else
			{
				cardElement.style.bottom = (cardTop + vOffset) + 'px';
				cardElement.style.top = '';
			}
			
			// Increment left and top.
			if (this._cards[i].faceUp)
			{
				cardLeft = cardLeft + this.hSpread * cardWidth;
				cardTop = cardTop + this.vSpread * cardHeight;
			}
			else
			{
				cardLeft = cardLeft + this.hSpreadFaceDown * cardWidth;
				cardTop = cardTop + this.vSpreadFaceDown * cardHeight;
			}
		}
		
		// Adjust image.
		cardImage = cardElement.childNodes[0];
		// cardImage.style.backgroundsize = cardWidth;
		cardImage.width = cardWidth;
		cardImage.height = cardHeight;
	}
	
	// Invalidate our hit test rectangle.
	this._hitTestRect = null;
};

// ----------------------------------------------------------------------------------- _highlight ()

fiftytwo.Stack.prototype._highlight = function (highlight)
{
	"use strict";
	if (this._domElement)
	{
		this._domElement.style.backgroundColor = highlight ? 'rgba(0,0,0,0.5)' : 'transparent';
	}
};

// ------------------------------------------------------------------------------------- _addCard ()

fiftytwo.Stack.prototype._addCard = function (card, animated)
{
	"use strict";
	
	var cardElement;
	
	// Indicate new stack owning card, push to our card array.
	card._stackContaining = this;
	this._cards.push(card);
	this.numberOfCards = this._cards.length;
	
	// If our DOM element has never been instantiated, there is not going to be any
	// animation nor are there any card elemnts to position or a DOM element to update.
	if (this._domElement)
	{
		if (animated)
		{
			// Indicate a card in-flight (animating).
			this._cardsInFlight.push(card);
		}
		else if (this._cardsInFlight.length === 0)
		{
			// We need to re-layout our card elements and resize our element.
			this._positionCardElements();
			this._updateDOMElement();
		}
	}
	
	return this;
};

// ------------------------------------------------------------------------------ _cardIsInFlight ()

fiftytwo.Stack.prototype._cardIsInFlight = function (card)
{
	"use strict";
	
	var inflight = false;
	
	for (var i = 0, count = this._cardsInFlight.length; i < count; i += 1)
	{
		if (this._cardsInFlight[i] === card)
		{
			inflight = true;
			break;
		}
	}
	
	return inflight;
};

// ----------------------------------------------------------------------- _cardAnimationComplete ()

fiftytwo.Stack.prototype._cardAnimationComplete = function (card)
{
	"use strict";
	
	var i;
	var count;
	var oneCard;
	
	// Dequeue card from our list of in-flight cards.
	count = this._cardsInFlight.length;
	for (i = 0; i < count; i += 1)
	{
		if (this._cardsInFlight[i] === card)
		{
			this._cardsInFlight.splice (i, 1);
			break;
		}
	}
	
	// Re-layout our card elements and resize our element.
	this._positionCardElements ();
	this._updateDOMElement ();
};

// --------------------------------------------------------------------------------------- _reset ()

fiftytwo.Stack.prototype._reset = function ()
{
	"use strict";
	
	this.numberOfCards = 0;
	this._cards = [];
	this._cardsInFlight = [];
	if (this._domElement)
	{
		this._positionCardElements();
		this._updateDOMElement();
	}
};

// ------------------------------------------------------------------------------- _removeTopCard ()

fiftytwo.Stack.prototype._removeTopCard = function ()
{
	"use strict";
	var topCard = this.topCard ();
	if (topCard)
	{
		this._cards.pop ();
		this.numberOfCards = this._cards.length;
		
		if (this._domElement)
		{
			// We need to re-layout our card elements and resize our element.
			this._positionCardElements();
			this._updateDOMElement();
		}
	}
	
	return topCard;
};

// ------------------------------------------------------------------------------------ _addCards ()

fiftytwo.Stack.prototype._addCards = function (cardArray)
{
	"use strict";
	var count = cardArray.length;
	var i;
	var card;
	var cardElement;
	
	for (i = 0; i < count; i += 1)
	{
		card = cardArray[i];
		
		// Indicate owning stack, add to our array.
		card._stackContaining = this;
		this._cards.push (card);
	}
	this.numberOfCards = this._cards.length;
	
	if (this._domElement)
	{
		// We need to re-layout our card elements and resize our element.
		this._positionCardElements();
		this._updateDOMElement();
	}
	
	return this;
};

// ---------------------------------------------------------------------------- _stackCutFromCard ()

fiftytwo.Stack.prototype._stackCutFromCard = function (card)
{
	"use strict";
	var cutStack;
	var i;
	var count;
	var index = this._cards.indexOf (card);
	var cardElement;
	var bounds;
	var parentBounds;
	var offset;
	
	if (index >= 0)
	{
		// Create stack.
		cutStack = new fiftytwo.Stack (this.hSpread, this.vSpread);
		
		// Assign horizontal and vertical position.
		if ((this.hSpread === 0) && (this.vSpread === 0))
		{
			cutStack.hPosition = this.hPosition;
			if (this.vPosition >= 0)
			{
				cutStack.vPosition = this.vPosition;
			}
			else
			{
				cardElement = card._getDOMElement();
				bounds = cardElement.getBoundingClientRect();
				parentBounds = cardElement.parentElement.getBoundingClientRect();
				cutStack.vPosition = (bounds.top - parentBounds.top) / this._tableContaining.cardHeight;
			}
		}
		else
		{
			offset = this._offsetForCardAtIndex (index);
			cutStack.hPosition = this.hPosition + offset.left;
			if (this.vPosition >= 0)
			{
				cutStack.vPosition = this.vPosition + offset.top;
			}
			else
			{
				bounds = card._getDOMElement().getBoundingClientRect();
				cutStack.vPosition = (bounds.top / this._tableContaining.cardHeight) + offset.top;
			}
		}
		
		// Add cards to the new cut stack.
		count = this.numberOfCards;
		for (i = index; i < count; i += 1)
		{
			cutStack._addCard (this._cards[i], false);
		}
		
		// Remove cards from our stack.
		for (i = index; i < count; i += 1)
		{
			this._cards.pop ();
		}
		this.numberOfCards = this._cards.length;
	}
	
	// Add a reference to this table.
	cutStack._tableContaining = this._tableContaining;
	
	if (this._domElement)
	{
		// Adjust position of element.
		this._positionCardElements();
		this._updateDOMElement();
	}
	
	return cutStack;
};

// ------------------------------------------------------------------------------------- _hitTest ()
// Note: x and y are in page space.

fiftytwo.Stack.prototype._hitTest = function (x, y)
{
	"use strict";
	var hit = false;
	var hitRect;
	
	// Fetch our hit test rect if it doesn't exist.
	if (!this._hitTestRect)
	{
		this._hitTestRect = this._domElement.getBoundingClientRect ();
	}
	
	hitRect = this._hitTestRect;
	if ((x >= hitRect.left) && (x < hitRect.right) && (y >= hitRect.top) && (y < hitRect.bottom))
	{
		hit = true;
	}
	
	return hit;
};

// -------------------------------------------------------------------------------- _cardElements ()

fiftytwo.Stack.prototype._cardElements = function ()
{
	"use strict";
	var elements = [];
	var count = this.numberOfCards;
	var i;
	
	// Layout all the card elemnts.
	this._positionCardElements();
	
	for (i = 0; i < count; i += 1)
	{
		// Push onto array.
		elements.push (this._cards[i]._domElement);
	}
	
	// Add our own element.
	elements.push (this._getDOMElement());
	
	return elements;
};

// ------------------------------------------------------------------------------------ _relayout ()

fiftytwo.Stack.prototype._relayout = function ()
{
	"use strict";
	
	if (this._domElement)
	{
		this._positionCardElements();
		this._updateDOMElement();
	}
};

// ====================================================================================== ImageCache
// 
// ImageCache ()
// 
// -------------- Public --------------
// ------------ Properties ------------
// ...
// ------------- Methods --------------
// ...
// ------------- Private --------------
// ------------ Properties ------------
// ...
// ------------- Methods --------------
// ...
//
// ----------------------------------------------------------------------------------- ImageCache ()

fiftytwo.ImageCache = function (path)
{
	"use strict";
	this.path = path;
	this.completed = false;
	this._images = [];
	this._imagesToLoad = 0;
	this._failedImages = [];
	this._completionFunction = null;
};

// ---------------------------------------------------------------------------------------- fetch ()

fiftytwo.ImageCache.prototype.fetch = function (completionFunction)
{
	"use strict";
	var i;
	var image;
	var fullPath;
	
	// We are beginning the fetch, store away completion function (if provided).
	this._completionFunction = completionFunction;
	this.completed = false;
	
	// We are pre-loading 55 images.
	this._imagesToLoad = 55;
	
	for (i = 0; i <= 54; i += 1)
	{
		// Create image element.
		image = document.createElement ('img');
		image.style.display = 'block';
		
		// Path to image.
		fullPath = this.path + '/' + fiftytwo.Card.prototype.imageNameForIndex (i);
		
		// We want to be notified as the images load (or fail to load).
		image.onload = this._cardLoaded.bind (this, fullPath);
		image.onerror = this._cardFailed.bind (this, fullPath);
		
		// Indicate this is an image we need to load. Assign image src.
		image.src = fullPath;
		
		// Push image to our image cache.
		this._images.push (image);
	}
};

// ---------------------------------------------------------------------------------- _cardLoaded ()

fiftytwo.ImageCache.prototype._cardLoaded = function (imageSrc)
{
	"use strict";
	
	// We have completed attempting to load an image.
	this._imagesToLoad -= 1;
	
	// If all images have loaded, we are done.
	if (this._imagesToLoad <= 0)
	{
		this._completed();
	}
};

// ---------------------------------------------------------------------------------- _cardFailed ()

fiftytwo.ImageCache.prototype._cardFailed = function (imageSrc)
{
	"use strict";
	
	// We have completed attempting to load an image.
	this._imagesToLoad -= 1;
	
	// Indicate failure.
	this._failedImages.push (imageSrc);
	console.log ('Failed to load image at path: ' + imageSrc);
	
	// If all images have loaded, we are done.
	if (this._imagesToLoad <= 0)
	{
		this._completed();
	}
};

// ----------------------------------------------------------------------------------- _completed ()

fiftytwo.ImageCache.prototype._completed = function ()
{
	"use strict";
	
	// Set flag indictaing complete.
	this.completed = true;
	
	// Call (optionally) provided completion function.
	if (this._completionFunction)
	{
		this._completionFunction (this._failedImages);
	}
};

// ========================================================================================== Action
// 
// Action ()
// 
// -------------- Public --------------
// ------------ Properties ------------
// ...
// ------------- Methods --------------
// ...
// ------------- Private --------------
// ------------ Properties ------------
// ...
// ------------- Methods --------------
// ...
//
// --------------------------------------------------------------------------------------- Action ()

fiftytwo.Action = function (type)
{
	"use strict";
	this._type = type;
	this._cards = [];
	this._sourceStack = null;
	this._destStack = null;
};

// ------------------------------------------------------------------------------- _reverseAction ()

fiftytwo.Action.prototype._reverseAction = function ()
{
	"use strict";
	var reverseAction = null;
	
	if (this._type === 'flip')
	{
		reverseAction = new fiftytwo.Action ('flip');
		reverseAction._cards = this._cards;
	}
	else if (this._type === 'move')
	{
		reverseAction = new fiftytwo.Action ('move');
		reverseAction._cards = this._cards;
		reverseAction._sourceStack = this._destStack;
		reverseAction._destStack = this._sourceStack;
	}
	else if (this._type === 'move_flip')
	{
		reverseAction = new fiftytwo.Action ('move_flip');
		reverseAction._cards = this._cards;
		reverseAction._sourceStack = this._destStack;
		reverseAction._destStack = this._sourceStack;
	}
	
	return reverseAction;
};

// ======================================================================================= Animation
// 
// Animation ()
// 
// ------------- Private --------------
// ------------ Properties ------------
// _progress
// _card
// _destStack
// _xStart
// _yStart
// _finalZIndex
// _xDistance
// _yDistance
// _stepsTotal
// ------------- Methods --------------
// _easeInQuadFunction (frame, totalFrames, delta)
// _easeInEaseOutQuadFunction (frame, totalFrames, delta)
// _easeInEaseOutSinFunction (frame, totalFrames, delta)
// _execute (shadowElement)

// ------------------------------------------------------------------------------------ Animation ()

fiftytwo.Animation = function (actions, card, destStack)
{
	"use strict";
	var cardElement;
	var bounds;
	var parentBounds;
	var cardsInDestStack;
	var endBounds;
	var xDistance;
	var yDistance;
	var distance;
	
	// Initial state.
	this._progress = 0;
	
	// Assign.
	this.actions = actions;
	this._card = card;
	this._destStack = destStack;
	
	// Get starting and ending location.
	cardElement = this._card._domElement;
	if (card._stackContaining.vPosition >= 0)
	{
		this._xStart = cardElement.offsetLeft;
		this._yStart = cardElement.offsetTop;
	}
	else
	{
		bounds = cardElement.getBoundingClientRect();
		parentBounds = cardElement.parentElement.getBoundingClientRect();
		this._xStart = bounds.left - parentBounds.left;
		this._yStart = bounds.top - parentBounds.top;
	}
	
	if (actions.indexOf ('move') >= 0)
	{
		// Number of cards where we are going (we are already counted as part of the stack).
		cardsInDestStack = destStack.numberOfCards;
		this._finalZIndex = cardsInDestStack;
		
		// Calculate distance to target.
		if (1)
		{
			endBounds = destStack._rectForCardAtIndex (cardsInDestStack - 1);
			xDistance = endBounds.left - this._xStart;
			yDistance = endBounds.top - this._yStart;
		}
		else
		{
			bounds = destStack._domElement.getBoundingClientRect();
			parentBounds = destStack._domElement.parentElement.getBoundingClientRect();
			xDistance = (bounds.left - parentBounds.left) - this._xStart;
			yDistance = (bounds.top - parentBounds.top) - this._yStart;
		}
		
		distance =  Math.sqrt ((xDistance * xDistance) + (yDistance * yDistance));
		this._xDistance = xDistance;
		this._yDistance = yDistance;
		this._stepsTotal = Math.floor (distance / 16);	// 20 is the distance to move each frame.
		if (this._stepsTotal < 1)
		{
			this._stepsTotal = 1;
		}
		
//		console.log ('start (' + this._xStart + ', ' + this._yStart + '); end (' + (this._xStart + xDistance) + ', ' + (this._yStart + yDistance) + '); dist (' + this._xDistance + ', ' + this._yDistance + ')');
	}
	
	if (actions.indexOf ('flip') >= 0)
	{
		if ((this._stepsTotal > 0) && (this._stepsTotal < 32))
		{
			this._stepsTotal = Math.round ((this._stepsTotal + 64) / 2.0) + 1;
		}
		else
		{
			this._stepsTotal = 33;
		}
	}
};

// -------------------------------------------------------------------------- _easeInQuadFunction ()

fiftytwo.Animation.prototype._easeInQuadFunction = function (frame, totalFrames, delta)
{
	"use strict";
	
	// Ease in.
	frame /= totalFrames;
	return (delta * frame * frame);
};

// ------------------------------------------------------------------- _easeInEaseOutQuadFunction ()

fiftytwo.Animation.prototype._easeInEaseOutQuadFunction = function (frame, totalFrames, delta)
{
	"use strict";
	
	// Ease in, ease out.
	frame /= totalFrames / 2;
	if (frame < 1)
	{
		return delta / 2 * frame * frame;
	}
	frame -= 1;
	
	return -delta / 2 * (frame * (frame - 2) - 1);
};

// -------------------------------------------------------------------- _easeInEaseOutSinFunction ()

fiftytwo.Animation.prototype._easeInEaseOutSinFunction = function (frame, totalFrames, delta)
{
	"use strict";
	
	// Use trig.
	return -delta / 2 * (Math.cos (Math.PI * frame / totalFrames) - 1);
};

// ------------------------------------------------------------------------------------- _execute ()
// Executes one frame of animation. Returns true if the animation
// is complete (the card is at its final destination).

fiftytwo.Animation.prototype._execute = function (shadowElement)
{
	"use strict";
	
	var complete = false;
	var cardLeft;
	var cardTop;
	var easedProgress;
	var hScale;
	var heightOffset;
	var cardElement = this._card._domElement;
	var arcAmount;
	var wasHalfway;
	var pastHalfway;
	var style;
	
	// Bump progress.
	this._progress = this._progress + 1;
	if (this._progress === this._stepsTotal)
	{
		complete = true;
	}
	
	if (this.actions.indexOf ('move') >= 0)
	{
		// Initialize lazily - card can have moved since the animation was pushed on the stack.
		if (this._progress <= 1)
		{
			// Bring above all other cards.
			cardElement.style.zIndex = 54;	// BOGUS - what if >1 deck?
			
			// Make sure the shadowElement is the correct size and visible.
			if (shadowElement)
			{
				shadowElement.style.width = cardElement.offsetWidth + 'px';
				shadowElement.style.height = cardElement.offsetHeight + 'px';
				shadowElement.style.visibility = 'visible';
				shadowElement.style.zIndex = 53;
			}
		}
		
		if (complete)
		{
			// If we have completed the animation, assign top and left.
			cardLeft = this._xStart + this._xDistance;
			cardTop = this._yStart + this._yDistance;
			heightOffset = 0;
			cardElement.style.zIndex = this._finalZIndex;
		}
		else
		{
			// A sinosoidal offset used to offset card and shadow for a 3D look.
			heightOffset = (Math.sin (Math.PI * this._progress / this._stepsTotal));
			
			// Use easing function to calculate left position.
			easedProgress = this._easeInEaseOutSinFunction (this._progress, this._stepsTotal, this._xDistance);
			cardLeft = this._xStart + Math.round (easedProgress);
			
			// Use easing function to calculate top position.
			easedProgress = this._easeInEaseOutSinFunction (this._progress, this._stepsTotal, this._yDistance);
			cardTop = this._yStart + Math.round (easedProgress);
		}
		
		arcAmount = Math.round (heightOffset * this._stepsTotal / 4);
		
		// Assign card left and top (use offset to make the card arc (rise) as it travels.
		cardElement.style.left = cardLeft + 'px';
		cardElement.style.top = (cardTop - (arcAmount * 2)) + 'px';
		
		// Optional shadow element.
		if (shadowElement)
		{
			if (!complete)
			{
				// Move the shadow element. Again, offset is used to arc the shadow path in a 3D manner.
				shadowElement.style.left = (cardLeft + arcAmount) + 'px';
				shadowElement.style.top = (cardTop + arcAmount) + 'px';
			}
		}
	}
	
	if (this.actions.indexOf ('flip') >= 0)
	{
		wasHalfway = (this._progress - 1) <= (this._stepsTotal / 2);
		
		if ((!wasHalfway) && (this._progress > (this._stepsTotal / 2)))
		{
			// Crossed half-way mark. Flip card.
			this._card._updateCardImage ();
		}
		
		if (complete)
		{
			// Clear transform (if any).
			cardElement.style.WebkitTransform = '';
			cardElement.style.MozTransform = '';
			cardElement.style.msTransform = '';
			cardElement.style.OTransform = '';
			cardElement.style.transform = '';
		}
		else
		{
			easedProgress = this._easeInEaseOutSinFunction (this._progress, this._stepsTotal, 1.0);
			if (easedProgress < 0.5)
			{
				style = 'perspective(8000) rotateY(' + (easedProgress * 180) + 'deg)';
			}
			else
			{
				style = 'perspective(8000) rotateY(' + ((1.0 - easedProgress) * -180) + 'deg)';
			}
			
			if (navigator.userAgent.match ("Chrome"))
			{
				cardElement.style.WebkitTransform = style;
			}
			else if (navigator.userAgent.match("Firefox"))
			{
				cardElement.style.MozTransform = style;
			}
			else if (navigator.userAgent.match("MSIE"))
			{
				cardElement.style.msTransform = style;
			}
			else if (navigator.userAgent.match("Opera"))
			{
				cardElement.style.OTransform = style;
			}
			else
			{
				cardElement.style.transform = style;
			}
		}
		
		// Optional shadow element.
		if (shadowElement)
		{
			if (complete)
			{
				// Clear transform (if any).
				shadowElement.style.WebkitTransform = '';
				shadowElement.style.MozTransform = '';
				shadowElement.style.msTransform = '';
				shadowElement.style.OTransform = '';
				shadowElement.style.transform = '';
			}
			else
			{
				style = 'scale(' + (Math.abs ((easedProgress * 2.0) - 1.0)) + ', 1.0)';

				if (navigator.userAgent.match ("Chrome"))
				{
					shadowElement.style.WebkitTransform = style;
				}
				else if (navigator.userAgent.match("Firefox"))
				{
					shadowElement.style.MozTransform = style;
				}
				else if (navigator.userAgent.match("MSIE"))
				{
					shadowElement.style.msTransform = style;
				}
				else if (navigator.userAgent.match("Opera"))
				{
					shadowElement.style.OTransform = style;
				}
				else
				{
					shadowElement.style.transform = style;
				}
			}
		}
	}
	
	if (complete)
	{
		// Optional shadow element.
		if (shadowElement)
		{
			// Hide the shadow when the animation completes.
			shadowElement.style.visibility = 'hidden';
		}
	}
	
	return complete;
};

// =========================================================================================== Table
// 
// Table ()
// 
// -------------- Public --------------
// ------------ Properties ------------
// stacks[]        <- .
// cardHeight      <- .
// cardWidth       <- .
// ------------- Methods --------------
// addNewStack (identifier, role, hPos, vPos, hSpread, vSpread) <- .
// stackWithIdentifier (identifier)
// stacksWithRole (role)
// dealCardToStack (card, stack)
// moveTopCardFromStackToStack (srcStack, destStack, animate)
// appendCardElementsToElement (element)
// newDeck (includeJokers)
// shuffle (cardArray)
// flipCards (cardArray, faceUp)
// canDragCardFromStack (card, stack)
// canDragStackFromStackToStack (stack, srcStack, destStack)
// cardDragCompleted (table)
// cardDoubleClicked (card, stackContaining)
// animationComplete (table)
// ...
// 
// ------------- Private --------------
// ------------ Properties ------------
// _draggingStack
// _sourceStack
// _lastStackHit
// _actions
// _dragShadowElement
// _cardsToLoad
// _loadCompletionFunction
// ------------- Methods --------------
// _highlightStack (stack)
// _stackHitAtPoint (x, y)
// _cardElements ()
// _mouseUp (event)
// _mouseMoved (event)
// _cardDoubleClicked (card)
// _cardClicked (card)
// ...
//
// ---------------------------------------------------------------------------------------- Table ()

fiftytwo.Table = function (cardImagesPath)
{
	"use strict";
	
	this.stacks = [];	// BOGUS - MAKE PRIVATE
	// this.cardHeight = 125;
	// this.cardWidth = Math.round (this.cardHeight * 2.5 / 3.5);
	this.cardWidth = 89;
	this.cardHeight = Math.round (this.cardWidth * 3.5 / 2.5);
	this._draggingStack = null;
	this._sourceStack = null;
	this._lastStackHit = null;
	this._actions = [];
	this._animations = [];
	this._animating = false;
	this._intervalID = 0;
	
	// Load the images needed for the cards.
	this._imageCache = new fiftytwo.ImageCache (cardImagesPath);
	this._imageCache.fetch (this._imageCacheComplete);
	
	this._loadCompletionFunction = null;
	
	// Create drag shadow element.
	this._dragShadowElement = document.createElement ('div');
	this._dragShadowElement.className = 'playingcardshadow';
	this._dragShadowElement.style.position = 'absolute';
	this._dragShadowElement.style.backgroundColor = 'rgba(0, 0, 0, 0.33)';
	this._dragShadowElement.style.visibility = 'hidden';
	this._dragShadowElement.style.borderRadius = (this.cardHeight / 25) + 'px';
};

// --------------------------------------------------------------------------------- setCardWidth ()

fiftytwo.Table.prototype.setCardWidth = function (width)
{
	"use strict";
	var stack;
	var count;
	var i;
	
	if (this.cardWidth !== width)
	{
		this.cardWidth = width;
		this.cardHeight = Math.round (this.cardWidth * 3.5 / 2.5);
		
		count = this.stacks.length;
		for (i = 0; i < count; i += 1)
		{
			this.stacks[i]._relayout ();
		}
	}
};

// ---------------------------------------------------------------------------------- addNewStack ()

fiftytwo.Table.prototype.addNewStack = function (identifier, role, hPos, vPos, hSpread, vSpread)
{
	"use strict";
	var stack = new fiftytwo.Stack (hSpread, vSpread); 	// Create stack.
	
	// Assign identifier.
	stack.identifier = identifier;

	// Assign role.
	stack.role = role;
	
	// Assign horizontal and vertical position (in cardHeight & cardWidth units respecitvely).
	stack.hPosition = hPos;
	stack.vPosition = vPos;
	
	// Add a reference to this table.
	stack._tableContaining = this;
	
	// Push stack to array.
	this.stacks.push (stack);
	
	return stack;
};

// -------------------------------------------------------------------------- stackWithIdentifier ()
// Returns first stack whose identifier matches identifier. Returns 
// null if no stack identifier matches.

fiftytwo.Table.prototype.stackWithIdentifier = function (identifier)
{
	"use strict";
	var stack = null;
	var ourStacks = this.stacks;
	var count = ourStacks.length;
	var i;
	
	for (i = 0; i < count; i += 1)
	{
		if (ourStacks[i].identifier === identifier)
		{
			stack = ourStacks[i];
			break;
		}
	}
	
	return stack;
};

// ------------------------------------------------------------------------------- stacksWithRole ()
// Returns an array of stacks whose role matches role. Returns an empty   
// array if no stacks role match.

fiftytwo.Table.prototype.stacksWithRole = function (role)
{
	"use strict";
	var stacks = [];
	var ourStacks = this.stacks;
	
	for (var i = 0, count = ourStacks.length; i < count; i += 1)
	{
		if (ourStacks[i].role === role)
		{
			stacks.push (ourStacks[i]);
		}
	}
	
	return stacks;
};

// ------------------------------------------------------------------------------ _highlightStack ()

fiftytwo.Table.prototype._highlightStack = function (stack)
{
	"use strict";
	var ourStacks = this.stacks;
	var oneStack = null;
	
	for (var i = 0, count = ourStacks.length; i < count; i += 1)
	{
		oneStack = ourStacks[i];
		oneStack._highlight (oneStack === stack);
	}
	
	return stack;
};

// ----------------------------------------------------------------------------- _stackHitAtPoint ()
// Note: x and y are in page space.

fiftytwo.Table.prototype._stackHitAtPoint = function (x, y)
{
	"use strict";
	var ourStacks = this.stacks;
	var stack = null;
	
	for (var i = 0, count = ourStacks.length; i < count; i += 1)
	{
		if (ourStacks[i]._hitTest (x, y))
		{
			stack = ourStacks[i];
			break;
		}
	}
	
	return stack;
};

// ---------------------------------------------------------------------------- _executeAnimation ()

fiftytwo.Table.prototype._executeAnimation = function ()
{
	"use strict";
	
	var animation = this._animations[0];
	var complete;
	var shadow = null;
	
	// Provide a shadow element if there is a card move involved.
	if (animation.actions.indexOf ('move') >= 0)
	{
		shadow = this._dragShadowElement;
	}
	
	// Call on animation to execute the next frame.
	if (animation._execute (shadow))
	{
		// It was the last frame (card is destinated).
		if (animation._destStack)
		{
			// Not relevant for 'flip' animation.
			animation._destStack._cardAnimationComplete (animation._card);
		}
		
		// Remove animation from head of queue.
		this._animations.splice (0, 1);
		if (this._animations.length === 0)
		{
			clearInterval (this._intervalID);
			this._intervalID = 0;
			this._animating = false;
			
			// Call completion method (user can overide).
			this.animationComplete (this);
		}
	}
};

// ---------------------------------------------------------------------------- _enqueueAnimation ()

fiftytwo.Table.prototype._enqueueAnimation = function (animation)
{
	"use strict";
	
	var card = animation._card;
	var count = this._animations.length;
	var i;
	var enequedAnimation;
	
	// If this card is already in the animation queue, its final location will be
	// different. Augment the new animation based on the card's final position.
	for (i = 0; i < count; i += 1)
	{
		enequedAnimation = this._animations[i];
		if ((enequedAnimation.actions.indexOf ('move') >= 0) && (enequedAnimation._card === card))
		{
			animation._xStart += enequedAnimation._xDistance;
			animation._yStart += enequedAnimation._yDistance;
			animation._xDistance -= enequedAnimation._xDistance;
			animation._yDistance -= enequedAnimation._yDistance;
		}
	}
	
	// Push animation to array.
	this._animations.push (animation);
	
	// If we were not already animating, begin.
	if (!this._animating)
	{
		this._animating = true;
		this._intervalID = setInterval (this._executeAnimation.bind (this), 15);
	}
};

// ------------------------------------------------------------------------------ dealCardToStack ()
// Not undo-able. (BOGUS: it could be if we had a way to reset the undo stack after)

fiftytwo.Table.prototype.dealCardToStack = function (card, stack)
{
	"use strict";
	if (stack)
	{
		// Add the card.
		stack._addCard (card, false); // BOGUS: should pass animate flag
	}
	
	return stack;
};

// ------------------------------------------------------------------ moveTopCardFromStackToStack ()
// Undo-able. This should be called from clients so that
// a proper undo action is pushed to the action stack.

fiftytwo.Table.prototype.moveTopCardFromStackToStack = function (srcStack, destStack, animate)
{
	"use strict";
	// Remove top card from source stack.
	var card = srcStack._removeTopCard ();
	var action;
	var animation;
	var animateAction;
	
	if (card)
	{
		// Add card to destination stack.
		destStack._addCard (card, animate);
		
		// Create an action object to represent the change in the game state.
		action = new fiftytwo.Action ('move');
		action._cards.push (card);
		action._sourceStack = srcStack;
		action._destStack = destStack;
		
		// Push action onto stack.
		this._actions.push (action);
		
		// Create an animation, enqueue.
		if (animate)
		{
			animateAction = ['move'];
			animation = new fiftytwo.Animation (animateAction, card, destStack);
			this._enqueueAnimation (animation);
		}
	}
	
	return this;
};

// ---------------------------------------------------------------------------------- flipTopCard ()
// Undo-able. This should be called from clients so that
// a proper undo action is pushed to the action stack.

fiftytwo.Table.prototype.flipTopCard = function (stack, animate)
{
	"use strict";
	var card = stack.topCard ();
	var action;
	var animation;
	var animateAction;
	var cardElement;
	var shadowElement;
	
	if (card)
	{
		// Flip card. We *don't* go through the settor because we don't want the
		if (animate)
		{
			// We *don't* go through the settor because we don't want the card image swapped
			// out at this time. We will do this half way through the animation.
			card.faceUp = !card.faceUp;
		}
		else
		{
			card.setFaceUp (!card.faceUp);
		}
		
		// Create an action object to represent the change in the game state. Push onto stack.
		action = new fiftytwo.Action ('flip');
		action._cards.push (card);
		this._actions.push (action);
		
		// Create an animation, enqueue.
		if (animate)
		{
			animateAction = ['flip'];
			animation = new fiftytwo.Animation (animateAction, card, null);
			this._enqueueAnimation (animation);
		}
	}
	
	return this;
};

// ----------------------------------------------------------- moveTopCardFromStackToStackAndFlip ()
// Undo-able. This should be called from clients so that
// a proper undo action is pushed to the action stack.

fiftytwo.Table.prototype.moveTopCardFromStackToStackAndFlip = function (srcStack, destStack, animate)
{
	"use strict";
	// Remove top card from source stack.
	var card = srcStack._removeTopCard ();
	var action;
	var animation;
	var animateAction;
	
	if (card)
	{
		// Add card to destination stack.
		destStack._addCard (card, animate);
		
		// Flip card. We *don't* go through the settor because we don't want the
		if (animate)
		{
			// We *don't* go through the settor because we don't want the card image swapped
			// out at this time. We will do this half way through the animation.
			card.faceUp = !card.faceUp;
		}
		else
		{
			card.setFaceUp (!card.faceUp);
		}
		
		// Create an action object to represent the change in the game state.
		action = new fiftytwo.Action ('move_flip');
		action._cards.push (card);
		action._sourceStack = srcStack;
		action._destStack = destStack;
		
		// Push action onto stack.
		this._actions.push (action);
		
		// Create an animation, enqueue.
		if (animate)
		{
			animateAction = ['move', 'flip'];
			animation = new fiftytwo.Animation (animateAction, card, destStack);
			this._enqueueAnimation (animation);
		}
	}
	
	return this;
};

// -------------------------------------------------------------------------- _imageCacheComplete ()

fiftytwo.Table.prototype._imageCacheComplete = function (failedImages)
{
	"use strict";
	
	if (this._loadCompletionFunction)
	{
		this._loadCompletionFunction (this);
	}
}

// -------------------------------------------------------------------------------- _cardElements ()

fiftytwo.Table.prototype._cardElements = function ()
{
	"use strict";
	var elements = [];
	var ourStacks = this.stacks;
	var stackCount = ourStacks.length;
	var s;
	var stack;
	var stackElements;
	
	for (s = 0; s < stackCount; s += 1)
	{
		stack = ourStacks[s];
		stackElements = stack._cardElements ();
		elements = elements.concat (stackElements);
	}
	
	// Add the shadow element.
	this._dragShadowElement.style.width = this.cardWidth + 'px';
	this._dragShadowElement.style.height = this.cardHeight + 'px';
	elements.push (this._dragShadowElement);
	
	return elements;
};

// ------------------------------------------------------------------ appendCardElementsToElement ()

fiftytwo.Table.prototype.appendCardElementsToElement = function (element)
{
	"use strict";
	var ourElements = this._cardElements ();
	var count = ourElements.length;
	var i;
	
	for (i = 0; i < count; i += 1)
	{
		element.appendChild (ourElements[i]);
	}
};

// ----------------------------------------------------------- performFunctionWhenLoadingComplete ()

fiftytwo.Table.prototype.performFunctionWhenLoadingComplete = function (completionFunction)
{
	"use strict";
	
	if (this._imageCache.completed)
	{
		completionFunction (this);
	}
	else
	{
		this._loadCompletionFunction = completionFunction;
	}
};

// -------------------------------------------------------------------------------------- newDeck ()

fiftytwo.Table.prototype.newDeck = function (includeJokers)
{
	"use strict";
	var count = 52;
	var i;
	var card;
	var deck = [];
	
	if (includeJokers)
	{
		count = 54;
	}
	
	for (i = 1; i <= count; i += 1)
	{
		card = new fiftytwo.Card (i, this._imageCache.path, false);
		deck.push (card);
	}
	
	return deck;
};

// -------------------------------------------------------------------------------------- shuffle ()
// TODO: perform "Windows" shuffle if 'dealNumber' passed in.

fiftytwo.Table.prototype.shuffle = function (cardArray, dealNumber)
{
	"use strict";
	var index = cardArray.length;
	var otherIndex;
	var temp;
	
	// While there remain elements to shuffle...
	while (index !== 0)
	{
		// Pick a remaining element...
		otherIndex = Math.floor (Math.random () * index);
		index -= 1;
	
		// And swap it with the current element.
		temp = cardArray[index];
		cardArray[index] = cardArray[otherIndex];
		cardArray[otherIndex] = temp;
	}
	
	return cardArray;
};

// ------------------------------------------------------------------------------------ flipCards ()

fiftytwo.Table.prototype.flipCards = function (cardArray, faceUp)
{
	"use strict";
	var i;
	var count = cardArray.length;
	
	for (i = 0; i < count; i += 1)
	{
		cardArray[i].setFaceUp (faceUp);
	}
	
	// BOGUS - NEEDS UNDO??
	
	return cardArray;
};

// ------------------------------------------------------------------------------------ _doAction ()

fiftytwo.Table.prototype._doAction = function (action)
{
	"use strict";
	var faceUp;
	var cutStack;
	
	if (action._type === 'flip')
	{
		faceUp = action._cards[0].faceUp;
		this.flipCards (action._cards, !faceUp);
	}
	else if (action._type === 'move')
	{
		cutStack = action._sourceStack._stackCutFromCard (action._cards[0]);
		action._destStack._addCards (cutStack._cards);
	}
	else if (action._type === 'move_flip')
	{
		faceUp = action._cards[0].faceUp;
		this.flipCards (action._cards, !faceUp);
		cutStack = action._sourceStack._stackCutFromCard (action._cards[0]);
		action._destStack._addCards (cutStack._cards);
	}
};

// ----------------------------------------------------------------------------------------- undo ()

fiftytwo.Table.prototype.undo = function ()
{
	"use strict";
	
	// Pop last action off of stack.
	var action = this._actions.pop ();
		
	// Perform its reverse action.
	if (action)
	{
		this._doAction (action._reverseAction ());
	}
};

// -------------------------------------------------------------------------------------- canUndo ()

fiftytwo.Table.prototype.canUndo = function ()
{
	"use strict";
	
	// Pop last action off of stack.
	return ((this._actions) && (this._actions.length > 0));
};

// ---------------------------------------------------------------------------------------- reset ()

fiftytwo.Table.prototype.reset = function ()
{
	"use strict";
	
	this._draggingStack = null;
	this._sourceStack = null;
	this._lastStackHit = null;
	this._actions = [];
	this._animations = [];
	this._animating = false;
	if (this._intervalID)
	{
		clearInterval (this._intervalID);
		this._intervalID = 0;
	}
	
	for (var i = 0, count = this.stacks.length; i < count; i += 1)
	{
		this.stacks[i]._reset ();
	}
};

// ------------------------------------------------------------------------- canDragCardFromStack ()

fiftytwo.Table.prototype.canDragCardFromStack = function (card, stack)
{
	"use strict";
	
	// Default implementation always returns true.
	return true;
};

// ----------------------------------------------------------------- canDragStackFromStackToStack ()

fiftytwo.Table.prototype.canDragStackFromStackToStack = function (stack, srcStack, destStack)
{
	"use strict";
	
	// Default implementation always returns true.
	return true;
};

// ---------------------------------------------------------------------------- cardDragCompleted ()

fiftytwo.Table.prototype.cardDragCompleted = function (table, dragged)
{
	"use strict";
	
	// Default implementation does nothing.
};

// ---------------------------------------------------------------------------- cardDoubleClicked ()

fiftytwo.Table.prototype.cardDoubleClicked = function (card, stackContaining)
{
	"use strict";
	
	// Default implementation does nothing.
};

// ---------------------------------------------------------------------------------- cardClicked ()

fiftytwo.Table.prototype.cardClicked = function (card, stackContaining)
{
	"use strict";
	
	// Default implementation does nothing.
};

// ---------------------------------------------------------------------------- animationComplete ()

fiftytwo.Table.prototype.animationComplete = function (table)
{
	"use strict";
	
	// Default implementation does nothing.
};

// -------------------------------------------------------------------- _allowedDragCardFromStack ()

fiftytwo.Table.prototype._allowedDragCardFromStack = function (card, stack)
{
	"use strict";
	
	// See if we're animating.
	// See if already dragging (a drag stack indicates this).
	// See if this card can be selected.
	return ((!this._animating) && (!this._draggingStack) && (this.canDragCardFromStack (card, stack)));
};

// ---------------------------------------------------------------------- _beginDragCardFromStack ()

fiftytwo.Table.prototype._beginDragCardFromStack = function (event, card, stack)
{
	var allowed;
	var dragStack;
	var dragCards;
	var i;
	var count;
	var domElement;
	
	// Are we allowed to drag the card?
	allowed = this._allowedDragCardFromStack (card, stack);
	if (allowed)
	{
		// Store away the stack the card(s) came from.
		this._sourceStack = stack;
	
		// The table's _draggingStack is created by cutting from the stack of the current card under 
		// the mouse. This represents the cards to drag around.
		dragStack = stack._stackCutFromCard (card);
		this._draggingStack = dragStack;
		dragCards = dragStack._cards;
		count = dragStack.numberOfCards;
		for (i = 0; i < count; i += 1)
		{
			domElement = dragCards[i]._domElement;
			domElement.style.zIndex = 54 + i;		// BOGUS - WHAT IF TWO DECKS?
		}
		this._dragShadowElement.style.zIndex = 53; 	// BOGUS - WHAT IF TWO DECKS?
		
		// Store away the initial mouse down location and the initial position of the card.
		// BOGUS - There was a lot of code to handle other browsers here. Look into restoring that.
		dragStack._mouseStartX = event.clientX;
		dragStack._mouseStartY = event.clientY;
		domElement = card._domElement;
		dragStack._wasStyleLeft = parseInt (domElement.style.left);
		dragStack._wasStyleTop = parseInt (domElement.style.top);
		
		if (document.addEventListener)
		{
			document.addEventListener ('mouseup', this._mouseUp.bind (this), false);
			document.addEventListener ('mousemove', this._mouseMoved.bind (this), false);
			// document.addEventListener ('touchend', this._mouseUp.bind (this), false);
			// document.addEventListener ('touchmove', this._mouseMoved.bind (this), false);
		}
		else if (document.attachEvent)
		{
			document.attachEvent ('onmouseup', this._mouseUp.bind (this));
			document.attachEvent ('onmousemove', this._mouseMoved.bind (this));
			// document.attachEvent ('ontouchend', this._mouseUp.bind (this));
			// document.attachEvent ('ontouchmove', this._mouseMoved.bind (this));
		}
		else
		{
			console.log ('Missing: no addEventListener or attachEvent methods.');
		}
	}
	
	return allowed;
}

// ---------------------------------------------------------------------------------- _mouseMoved ()
// 'this' is a table object.

fiftytwo.Table.prototype._mouseMoved = function (event)
{
	"use strict";
	var dragStack = this._draggingStack;
	var stackHit = null;
	var mouseDeltaX = 0;
	var mouseDeltaY = 0;
//	var hOffset = 0;
//	var vOffset = 0;
	var minX;
	var minY;
	var maxX;
	var maxY;
	var cardWidth = 0;
	var cardHeight = 0;
//	var hDelta = 0;
//	var vDelta = 0;
	var cardRect;
	var cardArray = null;
	var count = 0;
	var i;
	var oneCard;
	var cardElement;
	var shadowElement = null;
		
	if (!dragStack)
	{
		return;
	}
	
	// Start dragging
	// Get the stack (if any) mouse is over (coordinates are passed in page space).
	stackHit = this._stackHitAtPoint (event.clientX, event.clientY);
	
	// Optmization — if the user is still on the same stack (or null) we don't 
	// need to perform a number of things again like validation or higlighting.
	if (stackHit !== this._lastStackHit)
	{
		// See if the stack hit is a valid target.
		if (stackHit)
		{
			if (!this.canDragStackFromStackToStack (dragStack, this._sourceStack, stackHit))
			{
				stackHit = null;
			}
		}
		
		// Highlight (or not if stackHit null) stack.
		this._highlightStack (stackHit);
		
		// Store away the stack hit.
		this._lastStackHit = stackHit;
	}
	
	// Move all dragged cards.
	// BOGUS - There was a lot of code to handle other browsers here. Look into restoring that.
//	mouseDeltaX = dragStack._wasStyleLeft + (event.clientX - dragStack._mouseStartX);
//	mouseDeltaY = dragStack._wasStyleTop + (event.clientY - dragStack._mouseStartY);
	mouseDeltaX = event.clientX - dragStack._mouseStartX;
	mouseDeltaY = event.clientY - dragStack._mouseStartY;
	
//	console.log ('_mouseMoved: mouseDeltaX=' + mouseDeltaX + ', mouseDeltaY' + mouseDeltaY);
	
	cardWidth = this.cardWidth;
	cardHeight = this.cardHeight;
//	hDelta = dragStack.hSpread * cardWidth;
//	vDelta = dragStack.vSpread * cardHeight;
	
	cardArray = dragStack._cards;
	count = dragStack.numberOfCards;
	for (i = 0; i < count; i += 1)
	{
		oneCard = cardArray[i];
		cardElement = oneCard._domElement;
		cardRect = dragStack._rectForCardAtIndex (i);
		if (i === 0)
		{
			minX = cardRect.left;
			minY = cardRect.top;
			maxX = cardRect.left + cardWidth;
			minY = cardRect.top + cardHeight;
		}
		
		if (cardRect.left < minX)
		{
			minX = cardRect.left;
		}
		else if ((cardRect.left + cardWidth) > maxX)
		{
			maxX = cardRect.left + cardWidth;
		}
		
		if (cardRect.top < minY)
		{
			minY = cardRect.top;
		}
		else if ((cardRect.top + cardHeight) > maxY)
		{
			maxY = cardRect.top + cardHeight;
		}
		
//		cardElement.style.left = (mouseDeltaX + Math.round (hOffset)) + 'px';
//		cardElement.style.top = (mouseDeltaY + Math.round (vOffset)) + 'px';
//		hOffset = hOffset + hDelta;
//		vOffset = vOffset + vDelta;
		cardElement.style.left = (mouseDeltaX + Math.round (cardRect.left)) + 'px';
		cardElement.style.top = (mouseDeltaY + Math.round (cardRect.top)) + 'px';
		
//		console.log ('_mouseMoved: cardRect; left=' + cardRect.left + ', top=' + cardRect.top);
	}
	
	shadowElement = this._dragShadowElement;
	shadowElement.style.left = (mouseDeltaX + Math.round (minX) + 10) + 'px';
	shadowElement.style.top = (mouseDeltaY + Math.round (minY) + 10) + 'px';
	shadowElement.style.width = (Math.round (maxX - minX)) + 'px';
	shadowElement.style.height = (Math.round (maxY - minY)) + 'px';
	shadowElement.style.visibility = 'visible';
};

// ------------------------------------------------------------------------------------- _mouseUp ()

fiftytwo.Table.prototype._mouseUp = function (event)
{
	"use strict";
	var dragStack = this._draggingStack;
	var stackHit;
	var action;
	var cardsMoved = false;
	var shadowElement;
	
	if (!dragStack)
	{
		return;
	}
	
	// Get the stack (if any) mouse is over (coordinates are passed in page space).
	stackHit = this._stackHitAtPoint (event.clientX, event.clientY);
	
	// See if the stack hit is a valid target.
	if (stackHit)
	{
		if (!this.canDragStackFromStackToStack (dragStack, this._sourceStack, stackHit))
		{
			stackHit = null;
		}
	}
	
	// Clear highlights.
	this._highlightStack (null);
	
	// Did the user drag the card(s) to no stack or back to the original source stack?
	if ((!stackHit) || (stackHit === this._sourceStack))
	{
		// Back to the original stack (no action performed).
		this._sourceStack._addCards (dragStack._cards);
	}
	else
	{
		// Cards moved to a new stack.
		stackHit._addCards (dragStack._cards);
		
		// Create an action object to represent the change in the game state.
		action = new fiftytwo.Action ('move');
		action._cards = dragStack._cards;
		action._sourceStack = this._sourceStack;
		action._destStack = stackHit;
		
		// Push action onto stack.
		this._actions.push (action);
		
		cardsMoved = true;
	}
	
	// Remove all event handlers
	if (document.removeEventListener)
	{
		document.removeEventListener ('mouseup', this._mouseUp, false);
		document.removeEventListener ('mousemove', this._mouseMoved, false);
		// document.removeEventListener ('touchend', this._mouseUp, false);
		// document.removeEventListener ('touchmove', this._mouseMoved, false);
	}
	else if (document.detachEvent)
	{
		document.detachEvent ('onmouseup', this._mouseUp);
		document.detachEvent ('onmousemove', this._mouseMoved);
		// document.detachEvent ('ontouchend', this._mouseUp);
		// document.detachEvent ('ontouchmove', this._mouseMoved);
	}
	else
	{
		console.log ('Missing: no removeEventListener or detachEvent methods.');
	}
	
	shadowElement = this._dragShadowElement;
	shadowElement.style.visibility = 'hidden';
	
	// Method to be over-ridden.
	this.cardDragCompleted (this, cardsMoved);
	
	this._draggingStack = null;
	this._sourceStack = null;
	this._lastStackHit = null;
};

// --------------------------------------------------------------------------- _cardDoubleClicked ()

fiftytwo.Table.prototype._cardDoubleClicked = function (card)
{
	"use strict";
	
	if (!this._animating)
	{
		// Call into method intended to be over-ridden.
		this.cardDoubleClicked (card, card._stackContaining);
	}
};

// --------------------------------------------------------------------------------- _cardClicked ()

fiftytwo.Table.prototype._cardClicked = function (card)
{
	"use strict";
	
	if (!this._animating)
	{
		// Call into method intended to be over-ridden.
		this.cardClicked (card, card._stackContaining);
	}
};
