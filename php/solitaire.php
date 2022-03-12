<?php

// ======================================================================================= solitaire
// ----------------------------------------------------------------------- map_win_cards_to_fiftytwo

function map_win_cards_to_fiftytwo ($deck)
{
	$newdeck = array ();
	$count = count ($deck);
	for ($i = 0; $i < $count; $i++)
	{
		$windex = $deck[$i];
		$wrank = (int) ($windex / 4);
		$wsuit = $windex % 4;
		if ($wsuit == 0)
		{
			$suit = 1;
		}
		else if ($wsuit == 1)
		{
			$suit = 0;
		}
		else
		{
			$suit = $wsuit;
		}
		
		$newdeck[$i] = ($suit * 13) + $wrank + 1;
	}
	
	return $newdeck;
}

// ----------------------------------------------------------------------------- shuffled_deck_win52

function shuffled_deck_win52 ($seed)
{
	$wLeft = 52;
	$tempdeck = array ();
	$GLOBALS['randSeed'] = $seed;
	$deck = array ();
	
	function winRand ()
	{
		$rseed = $GLOBALS['randSeed'];
		$rseed = (($rseed * 0x000343FD) & 0x7FFFFFFF) + 0x00269EC3; // 214013, 2531011
		$GLOBALS['randSeed'] = $rseed;
		return (($rseed >> 0x10) & 0x7FFF);
	}
	
	for ($i = 0; $i < 52; $i++)
	{
		$tempdeck[$i] = $i;
	}
	
	for ($i = 0; $i < 52; $i++)
	{
		$j = winRand () % $wLeft;
		$deck[$i] = $tempdeck[$j];
		$tempdeck[$j] = $tempdeck[--$wLeft];
	}
	
	return $deck;
}

?>
