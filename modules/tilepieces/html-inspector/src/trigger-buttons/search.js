let searchTrigger = document.getElementById("search-trigger");
searchTrigger.addEventListener("click", e => {
  searchTrigger.classList.toggle("opened");
  searchTrigger.classList.toggle("selected");
  var isOpened = searchBar.classList.toggle("opened");
  isOpened && selectedTab && selectedTab.click();
});