function scrollToPanel(panelEl){
  if(
    (window.innerWidth > 1024 && mobileWrapper.className.match(/left|right/)) ||
    (window.innerWidth < 1024 && window.innerWidth > window.innerHeight)
  )
    panelEl.parentNode.scrollTop = panelEl.offsetTop
  else if(
    (window.innerWidth > 1024 && mobileWrapper.className.match(/top|bottom/)) ||
    (window.innerWidth < 1024 && window.innerWidth < window.innerHeight)
  )
    panelEl.parentNode.scrollLeft = panelEl.offsetLeft
}