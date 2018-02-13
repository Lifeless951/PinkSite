document.addEventListener("DOMContentLoaded", function(){
	var menu = document.querySelector(".main-nav");
	var menuToggleBtn = document.querySelector(".main-nav__toggle");

	menu.classList.remove("main-nav--no-js")

	function onClickToggleMenu(event){
		menu.classList.toggle("main-nav--closed");
		event.preventDefault();
	}

	menuToggleBtn.addEventListener("click", onClickToggleMenu);
});