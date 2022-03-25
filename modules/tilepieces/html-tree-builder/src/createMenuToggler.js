function createMenuToggler(div,noCreateDrag) {
  var divWrapper = document.createElement("div");
  divWrapper.className = "menu-toggle-wrapper"
  if(!noCreateDrag) {
    var dragToggler = document.createElement("span");
    dragToggler.className = "html-tree-build-dragger";
    dragToggler.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<g>
	<g>
		<g>
			<path style="fill:#727272;" d="M17.5,8.4c-0.4,0-0.7-0.1-1-0.4L12,3.4L7.5,7.8C7,8.4,6.1,8.4,5.6,7.8C5,7.3,5,6.4,5.6,5.9L11,0.5
			c0.5-0.5,1.4-0.5,1.9,0L18.4,6C19,6.6,19,7.4,18.4,8C18.2,8.2,17.8,8.4,17.5,8.4z"/>
		</g>
		<g>
			<path style="fill:#727272;" d="M12,11c-0.8,0-1.4-0.6-1.4-1.4l0-8.2c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4l0,8.2
			C13.4,10.4,12.8,11,12,11z"/>
		</g>
	</g>
	<g>
		<g>
			<path style="fill:#727272;" d="M6.5,15.6c0.4,0,0.7,0.1,1,0.4l4.5,4.6l4.5-4.5c0.5-0.5,1.4-0.5,1.9,0c0.5,0.5,0.5,1.4,0,1.9
			L13,23.5c-0.5,0.5-1.4,0.5-1.9,0L5.6,18C5,17.4,5,16.6,5.6,16C5.8,15.8,6.2,15.6,6.5,15.6z"/>
		</g>
		<g>
			<path style="fill:#727272;" d="M12,13c0.8,0,1.4,0.6,1.4,1.4l0,8.2c0,0.8-0.6,1.4-1.4,1.4c-0.8,0-1.4-0.6-1.4-1.4l0-8.2
			C10.6,13.6,11.2,13,12,13z"/>
		</g>
	</g>
</g>
</svg>`;
    divWrapper.prepend(dragToggler);
  }
  var menuToggler = document.createElement("a");
  menuToggler.setAttribute("href", "javascript:void(0)");
  menuToggler.className = "menu-toggle";
  menuToggler.textContent = "..."
  divWrapper.prepend(menuToggler);
  div.prepend(divWrapper);
}