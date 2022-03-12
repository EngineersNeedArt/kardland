# kardland
A couple of solitaire games written for the web in Javascript: FreeCell and Klondike. You can see the code running at [www.kardland.com](http://www.kardland.com).

<p align="center">
<img width="768" src="https://github.com/EngineersNeedArt/kardland/blob/b40c341a47242b420871e2c16183a6c4ddd1aa2f/documentation/kardland_screenshot.png" alt="SystemSix screenshot.">
</p>

### History

I wrote this as an exercise to learn Javascript. There is a bit of PHP (that I had to learn as well) to talk to a back-end server running PostgreSQL.

### CardEngine

The code was based on an earlier framework I had written in Objective-C to try to create a "Card Engine" — a general-purpose card-game framework. I imagined the typical card game as consisting of a `cardTable` object containing any number of `cardStack`s. The discard pile might be a `cardStack`, each player's hand a `cardStack`, the deck the players draw cards from itself another `cardStack`.

At the model level, you moved cards from one `cardStack` to another. Dealing a hand then meant moving cards from the "deck" `cardStack` to each of the "player's hand" `cardStack`. The act of moving a card would of course remove a card object from the array of one `cardStack` and then add it to the array of another. Simple methods like `shuffle()` (and `dealTopCardTo(stack)`) would be a part of the `cardStack` base class.

The `cardStack` object also had a view layer: `cardStackView`. The view would display the cards in the `cardStack` as a vertical stack (like a deck where only the top card is visible). Other layout/view options: a vertical spread (like in solitaire games) a horizontal spread (the player's hand), random (discard pile). More complex layouts like a pyramid layout in one particular variant of solitaire could be done with custom code in a `cardStackView` subclass.

I neglected to mention it before but of course there was an object to represent the playing card as well. Rank, suit and whether face up or down was about all it needed in the way of properties. I don't recall if there was a specific `cardView` class to draw the card or if the `cardStackView` base class knew how to draw a card.

Hit testing was handled by the `cardStackView`. Delegate methods existed on the `cardStackView` that could be implemented to return `TRUE/FALSE` as to whether a card *could* be moved. If a card drag was in session another delgate method could be implemented to return `TRUE/FALSE` as to whether a particular `cardStackView` destination was valid.

With the above basic framework I imagined any number of card games could be implemented by simply customizing the initial set up (how many decks, how many card stacks, their visual appearance) and implementing the game logic in the delegate callbacks/methods.

As **Soft Dorothy Software** I released a couple of solitaire games for the iPad using this "CardEngine" ([Lab Solitaire](https://github.com/softdorothy/LabSolitaire) and [Parlour Solitaire](https://github.com/softdorothy/ParlourSolitaire)). It did prove to in fact be pretty straightforward to implement two different games in the manner I described.

Some years later I wanted to learn Javascript and so took the ideas from the card engine and tried to implement them in Javascript. The "engine", such as it is, resides in `fiftytwo.js`.

### Issues

Doesn't work on Mobile. I think I know enough about touch events now that I could add that functionailty. Too little time, too many projects....

Some weirdness when resizing the window as cards are animating (being put away). What can you do?

Shadow is incorrect when dragging more than one card (only the shadow of one card is drawn, not the whole stack).
