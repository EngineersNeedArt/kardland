// ------------------------------------------------------------------------- prepare_modal_window ()

prepare_modal_window = function (modalID, closeID)
{
	var modalElement = document.getElementById (modalID);
	var closeElement = document.getElementById (closeID);
	
	// Hide modal element when close element clicked.
	closeElement.onclick = function ()
	{
		modalElement.style.display = "none";
	}
	
	// When the user clicks anywhere outside of the modal element, close it.
	window.onclick = function (event)
	{
		if (event.target == modalElement)
		{
			modalElement.style.display = "none";
		}
	}

	// When the user clicks anywhere outside of the modal element, close it.
	close = function ()
	{
		modalElement.style.display = "none";
	}
	
	return {close : close};
};

