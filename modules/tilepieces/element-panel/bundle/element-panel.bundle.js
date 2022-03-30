function cssSpecificity(selector,inside){var arr=[0,0,0];var idMatch=/#[_a-zA-Z0-9-]+/g;var attributeMatch=/\[[_a-zA-Z0-9-="]+]+/g;var classMatch=/\.[_a-zA-Z0-9-]+/g;var pseudoClassMatch=/:[a-z-]+/gi;var pseudoElementMatch=/:{1,2}before|:{1,2}after|:{1,2}first-letter|:{1,2}first-line|::[a-z-]+/gi;var elementMatch=/(\s+|^|\*|\+|>|~|\|\|)[_a-zA-Z0-9-]+/g;selector=selector.replaceAll(":not("," ");selector=selector.replace(/:is\(([^)]*)\)/g,((match,variable)=>{var maxSpecificity=variable.split(",").map((v=>{var newArr=cssSpecificity(v,true);return{arr:newArr,specificity:Number(newArr.join(""))}})).sort(((a,b)=>b-a))[0];maxSpecificity.arr.forEach(((a,i)=>arr[i]+=a));return""}));selector=selector.replace(/:where\([^)]*\)/g," ");var ids=selector.match(idMatch);if(ids)arr[0]+=ids.length;var classes=selector.match(classMatch);if(classes)arr[1]+=classes.length;var attributes=selector.match(attributeMatch);if(attributes)arr[1]+=attributes.length;var pseudosClasses=selector.match(pseudoClassMatch);if(pseudosClasses){pseudosClasses.forEach((p=>{if(!p.match(pseudoElementMatch))arr[1]+=1}))}var pseudoElements=selector.match(pseudoElementMatch);if(pseudoElements)arr[2]+=pseudoElements.length;var elements=selector.match(elementMatch);if(elements)arr[2]+=elements.length;if(!inside)return Number(arr.join(""));else return arr}if(typeof module!=="undefined"&&typeof module.exports!=="undefined")module.exports=cssSpecificity;window.tilepieces_tabs=function(options){var outside=options.el;var inside=outside.querySelector(".tab-buttons-inside");var tabPrev=outside.querySelector(".tab-prev");var tabNext=outside.querySelector(".tab-next");var tabSelected=inside.querySelector(".selected");var tabSelectedElement=!options.noAction&&tabSelected&&outside.ownerDocument.querySelector(tabSelected.getAttribute("href"));var maximumRight;var left=0;var throttle;function callbackObserver(){clearTimeout(throttle);throttle=setTimeout((()=>{if(!inside.lastElementChild)return;maximumRight=-Math.abs(inside.lastElementChild.offsetLeft+inside.lastElementChild.offsetWidth-inside.offsetWidth);var swapleft=left;tabSelected&&moveTabSelected(tabSelected);if(left!=swapleft)inside.style.transform="translateX("+left+"px)";displayArrows()}),32)}var resizeObserver=new ResizeObserver(callbackObserver);resizeObserver.observe(outside);var observer=new MutationObserver(callbackObserver);observer.observe(inside,{childList:true,subtree:true});tabPrev.addEventListener("click",(function(e){left+=inside.offsetWidth/2;if(left>0)left=0;inside.style.transform="translateX("+left+"px)";displayArrows()}));tabNext.addEventListener("click",(function(e){left-=inside.offsetWidth/2;if(left<maximumRight)left=maximumRight;inside.style.transform="translateX("+left+"px)";displayArrows()}));function moveTabSelected(tabSelected){var tabSelectedLeft=tabSelected.offsetLeft;var tabSelectedWidth=tabSelected.offsetWidth;var sum=-(tabSelectedLeft+tabSelectedWidth);var tabPrevOffsetWidth=tabPrev.offsetWidth||37;var tabNextOffsetWidth=tabNext.offsetWidth||37;if(-tabSelectedLeft>left-tabPrevOffsetWidth||sum<left-inside.offsetWidth+tabNextOffsetWidth){var delta=-tabSelectedLeft+tabPrevOffsetWidth;left=delta>0?0:delta<maximumRight?maximumRight:delta}}function displayArrows(e){if(inside.scrollWidth<=inside.offsetWidth){if(left){left=0;inside.style.transform="translateX(0px)"}tabPrev.style.display="none";tabNext.style.display="none";return}if(left==0)tabPrev.style.display="none";else tabPrev.style.display="block";if(left<maximumRight){left=maximumRight;inside.style.transform="translateX("+left+"px)"}if(left==maximumRight)tabNext.style.display="none";else tabNext.style.display="block"}inside.addEventListener("click",(e=>{var target=e.target.closest("a");if(!target)return;e.preventDefault();if(target!=tabSelected){options.onSelect&&options.onSelect(e,target);if(options.noAction)return;if(tabSelected){tabSelected.classList.remove("selected");tabSelectedElement.hidden=true;if(tabSelectedElement.style.display)tabSelectedElement.style.display=""}tabSelected=target;tabSelectedElement=target.ownerDocument.querySelector(tabSelected.getAttribute("href"));tabSelectedElement.hidden=false;if(tabSelectedElement.style.display)tabSelectedElement.style.display=options.display||"block";tabSelected.classList.add("selected");var swapleft=left;moveTabSelected(tabSelected);if(left!=swapleft){inside.style.transform="translateX("+left+"px)";displayArrows()}}}))};function events(){var events={};return{on:function(name,callback){if(!events[name])events[name]=[];events[name].push(callback);return events[name].length},dispatch:function(name,data){if(!events[name])return false;var eventArray=events[name];for(var i=0;i<eventArray.length;i++)events[name][i](data)},get events(){return events},destroy:function(name,id){var response=false;if(typeof name==="undefined"||!events[name])return response;else if(typeof id==="undefined"&&events[name])response=delete events[name];else if(events[name]&&events[name][id])response=events[name].splice(id);return response}}}function offset(target){var rect=target.getBoundingClientRect();var win=target.ownerDocument.defaultView;return{top:rect.top+win.pageYOffset,left:rect.left+win.pageXOffset}}(()=>{var defaults={preventMouseOut:false,noBorderWindowEscape:false,onlyHandler:false,handle:null,grabCursors:true,drop:true,dragNoTransform:false,dragElementConstraint:function(){return false},constraint:function(){return false},target:null,grabClass:"__drag-cursor-grab",grabbingClass:"__drag-cursor-grabbing",noDrop:false,noDropClass:"__drag-cursor-no-drop",styleDrop:"__drag__drop-overlay",insertElement:"beforeend"};function mouse(HandlerEl){var $self=this;var options=$self.options;var frameElement=HandlerEl.ownerDocument.defaultView.frameElement;function mousedown(e){if(options.onlyHandler&&e.target!==HandlerEl)return;if(options.handle&&!e.target.closest(options.handle))return;var ev={x:e.pageX,y:e.pageY,target:e.target,ev:e};if($self.preventMouseOut)$self.preventMouseOut.style.display="block";$self.events.dispatch("down",ev);HandlerEl.ownerDocument.addEventListener("mouseup",mouseup);HandlerEl.ownerDocument.addEventListener("mousemove",mousemove);frameElement&&frameElement.addEventListener("mouseout",mouseup)}HandlerEl.addEventListener("mousedown",mousedown);function mouseup(e){if(options.grabbingClass){HandlerEl.ownerDocument.body.classList.remove(options.grabbingClass)}var ev={x:e.pageX,y:e.pageY,target:e.target,ev:e};if($self.preventMouseOut)$self.preventMouseOut.style.display="none";HandlerEl.ownerDocument.removeEventListener("mouseup",mouseup);HandlerEl.ownerDocument.removeEventListener("mousemove",mousemove);frameElement&&frameElement.removeEventListener("mouseout",mouseup);$self.events.dispatch("up",ev)}function mousemove(e){if(options.grabbingClass){HandlerEl.ownerDocument.body.classList.add(options.grabbingClass)}var ev={x:e.pageX,y:e.pageY,target:e.target,ev:e};$self.events.dispatch("move",ev)}return function(){HandlerEl.removeEventListener("mousedown",mousedown)}}function touch(HandlerEl){var $self=this;var options=this.options;function touchstart(e){if(options.onlyHandler&&e.target!==HandlerEl)return;if(options.handle&&!e.target.closest(options.handle))return;var ev={x:e.changedTouches[0].pageX,y:e.changedTouches[0].pageY,target:e.target,ev:e};$self.events.dispatch("down",ev);HandlerEl.ownerDocument.addEventListener("touchend",touchend,{passive:false});HandlerEl.ownerDocument.addEventListener("touchcancel",touchend,{passive:false});HandlerEl.ownerDocument.addEventListener("touchmove",touchmove,{passive:false})}HandlerEl.addEventListener("touchstart",touchstart,{passive:false});function touchmove(e){var ev={x:e.changedTouches[0].pageX,y:e.changedTouches[0].pageY,ev:e,target:HandlerEl.ownerDocument.elementFromPoint(e.changedTouches[0].pageX,e.changedTouches[0].pageY)};$self.events.dispatch("move",ev)}function touchend(e){if(e.type=="touchend"){var ev={x:e.changedTouches[0].pageX,y:e.changedTouches[0].pageY,target:HandlerEl.ownerDocument.elementFromPoint(e.changedTouches[0].pageX,e.changedTouches[0].pageY),ev:e};$self.events.dispatch("up",ev)}HandlerEl.ownerDocument.removeEventListener("touchend",touchend,{passive:false});HandlerEl.ownerDocument.removeEventListener("touchcancel",touchend,{passive:false});HandlerEl.ownerDocument.removeEventListener("touchmove",touchmove,{passive:false})}return function(){HandlerEl.removeEventListener("touchstart",touchstart,{passive:false})}}function init(HandlerEl,options){var $self=this;$self.events=events();$self.on=function(n,cb){$self.events.on(n,cb);return $self};$self.options=options;if($self.options.preventMouseOut){$self.preventMouseOut=document.querySelector(".__drag-prevent-mouse-out");if(!$self.preventMouseOut){$self.preventMouseOut=HandlerEl.ownerDocument.createElement("div");$self.preventMouseOut.className="__drag-prevent-mouse-out";HandlerEl.ownerDocument.body.appendChild($self.preventMouseOut)}}var touchDestroy=touch.call($self,HandlerEl);var mouseDestroy=mouse.call($self,HandlerEl);$self.destroy=()=>{touchDestroy();mouseDestroy()}}window.__drag=function(HandlerEl,options={}){return new init(HandlerEl,Object.assign({},defaults,options))};function getComputed(element,options){var X=0,Y=0;var computed=element.ownerDocument.defaultView.getComputedStyle(element,null);if(options.dragNoTransform){X=+computed.left.replace("px","");Y=+computed.top.replace("px","")}else{var matrix=computed.transform.match(/\(([^)]+)\)/);var values=matrix&&matrix[1]&&matrix[1].split(",");X=values?+values[values.length-2]:0;Y=values?+values[values.length-1]:0}return{X:X,Y:Y}}function __dragElement(HandlerEl,options={}){var $self=this;var destroyItems=[];options=Object.assign({},defaults,options);$self.events=events();$self.on=function(n,cb){$self.events.on(n,cb);return $self};var elements=HandlerEl.length?HandlerEl:[HandlerEl];for(var i=0;i<elements.length;i++)(function(element){var pos1=0,pos2=0,pos3=0,pos4=0,X=0,Y=0;var drag=new init(element,options);drag.on("down",(function(e){e.ev.preventDefault();var comp=getComputed(element,options);X=comp.X,Y=comp.Y;pos3=e.x;pos4=e.y;$self.events.dispatch("down",e)})).on("move",(function(e){e.ev.preventDefault();pos1=pos3-e.x;pos2=pos4-e.y;pos3=e.x;pos4=e.y;var newX=X-pos1;var newY=Y-pos2;if(options.dragElementConstraint(newX,newY,pos1,pos2)){return}X=newX;Y=newY;if(options.dragNoTransform){element.style.top=Y+"px";element.style.left=X+"px"}else element.style.transform="translate("+X+"px,"+Y+"px)";e.newX=X;e.newY=Y;$self.events.dispatch("move",e)})).on("up",(function(e){$self.events.dispatch("up",e)}));destroyItems.push(drag)})(elements[i]);$self.destroy=function(){destroyItems.forEach((function(v){v.destroy()}))};return $self}window.__dragElement=function(HandlerEl,options){return new __dragElement(HandlerEl,options)};let dragListDefaults={noDrop:false,convalidate:()=>true,convalidateStart:()=>true,handlerSelector:""};function __dragList(el,options){var $self=this;options=Object.assign({},dragListDefaults,options);$self.events=events();$self.el=el;$self.on=function(n,cb){$self.events.on(n,cb);return $self};var d=__drag(el,{handle:"li "+options.handlerSelector,noBorderWindowEscape:true});var target,triggered,targetExDisplay,areSequential,targetExCssProperty,targetClone,targetCloneToAppend,started;d.on("down",(e=>{var newX=e.ev.clientX||e.x;var newY=e.ev.clientY||e.y;var originalEl=e.ev.target.ownerDocument.elementFromPoint(newX,newY);var elStart=originalEl.closest("li");var convalidate=options.convalidateStart(elStart,originalEl);if(convalidate){started=true;triggered=true;target=convalidate.multiselection||[elStart]}}));d.on("up",(e=>{if(!started)return;started=false;e.ev.preventDefault();if(targetClone){targetClone.parentNode.removeChild(targetClone);targetClone=null}if(targetExCssProperty)target.forEach((n=>n.style[targetExCssProperty]=""));if(targetCloneToAppend){if(targetCloneToAppend[0].parentNode){var prev=targetCloneToAppend[0].previousElementSibling;var next=targetCloneToAppend[targetCloneToAppend.length-1].nextElementSibling;if(!options.noDrop)targetCloneToAppend.forEach(((n,i)=>n.replaceWith(target[i])));else targetCloneToAppend.forEach((n=>n.remove()));$self.events.dispatch("move",{target:target,prev:prev,next:next})}targetCloneToAppend=null}$self.events.dispatch("up")}));d.on("move",(e=>{if(!started)return;e.ev.preventDefault();var newX=e.ev.clientX||e.x;var newY=e.ev.clientY||e.y;var el=e.ev.target.ownerDocument.elementFromPoint(newX,newY);if(!el)return;el=el.closest("li");if(!el||el==targetCloneToAppend)return;var isInTarget=target.find((v=>v.contains(el)));if(isInTarget){return}var bounding=el.getBoundingClientRect();var mediumEl=el.ownerDocument.defaultView.scrollY+bounding.bottom-bounding.height/2;var positionBefore=e.y<mediumEl;if(triggered){targetCloneToAppend=target.map((v=>v.cloneNode(true)));targetClone=target[0].ownerDocument.createElement("div");targetClone.append(...target.map((v=>v.cloneNode(true))));targetClone.classList.add("targetClone");targetCloneToAppend.forEach((v=>v.classList.add("cloneToAppend")));target.forEach(((v,i)=>{v.style.opacity="0.4";targetExCssProperty="opacity";if(i==0)areSequential=true;else if(areSequential)areSequential=target[i-1]==v.previousElementSibling||target[i-1]==v.nextElementSibling}));target[0].ownerDocument.body.appendChild(targetClone);triggered=false}targetClone.style.transform=`translate(${e.x}px,${e.y}px)`;if(targetCloneToAppend.find((n=>n.contains(el))))return;var whereInsert=positionBefore?el:el.nextSibling;var toCompare=positionBefore?el:el.nextElementSibling;var isNotAppendingOnItself=!toCompare?true:target.length==1?toCompare!=target[0]&&target[0].nextElementSibling!=toCompare:areSequential?toCompare!=target[0]&&target[target.length-1].nextElementSibling!=toCompare:true;if(options.convalidate(el,positionBefore,target)&&isNotAppendingOnItself){if(whereInsert)whereInsert.before(...targetCloneToAppend);else el.after(...targetCloneToAppend)}else{targetCloneToAppend[0].parentNode&&targetCloneToAppend.forEach((n=>n.remove()))}}));return $self}window.__dragList=function(el,options){return new __dragList(el,options)};function __dropElement(HandlerEl,options={}){var $self=this;options=Object.assign({},defaults,options);var destroyItems=[],target;$self.events=events();$self.on=function(n,cb){$self.events.on(n,cb);return $self};var ownerDoc=HandlerEl.ownerDocument||HandlerEl[0].ownerDocument;var dummy=ownerDoc.querySelector("body>dummy-drag");if(!dummy){dummy=ownerDoc.createElement("dummy-drag");ownerDoc.body.appendChild(dummy)}var elements=HandlerEl.length?HandlerEl:[HandlerEl];for(var i=0;i<elements.length;i++){(element=>{var pos1=0,pos2=0,pos3=0,pos4=0,originalPosition;var X=0,Y=0;var drag=new init(element,Object.assign(defaults,options));drag.on("down",(function(e){var ev=e.ev;ev.preventDefault();var target=e.target;var originalPosition=offset(target);X=originalPosition.left;Y=originalPosition.top;pos3=e.x;pos4=e.y;dummy.innerHTML=element.outerHTML;$self.events.dispatch("down",e)})).on("move",(function(e){var ev=e.ev;ev.preventDefault();pos1=pos3-e.x;pos2=pos4-e.y;pos3=e.x;pos4=e.y;X=X-pos1;Y=Y-pos2;dummy.style.transform="translate3d("+X+"px,"+Y+"px,0)";var isTarget=e.target.matches(options.target)?e.target:e.target.closest(options.target);if(options.drop&&isTarget){target=isTarget;target.classList.add(options.styleDrop)}else target&&target.classList.remove(options.styleDrop);$self.events.dispatch("move",e)})).on("up",(function(e){var isTarget=e.target.matches(options.target)?e.target:e.target.closest(options.target);if(options.drop&&isTarget)isTarget.insertAdjacentHTML(options.insertElement,dummy.innerHTML);target.classList.remove(options.styleDrop);dummy.style.transform="translate3d(-9999px,-9999px,0)";dummy.innerHTML="";$self.events.dispatch("up",e)}));destroyItems.push(drag)})(elements[i])}$self.destroy=function(){destroyItems.forEach((function(v){v.destroy()}))};return $self}window.__dropElement=function(HandlerEl,options){return new __dropElement(HandlerEl,options)}})();const opener=window.opener||window.parent;window.opener=opener;const app=opener.tilepieces;const alertDialog=opener.alertDialog;window.tilepieces=app;window.TT=opener.TT;const copyButton=document.getElementById("copy-button");const moveButton=document.getElementById("move-button");const copyMoveAction="";const elementSumSection=document.getElementById("element-sum");const insidePath=document.getElementById("inside-path");const wrapper=document.getElementById("wrapper");let mainTab=tilepieces_tabs({el:document.getElementById("tabs")});let pathTab=tilepieces_tabs({el:elementSumSection,noAction:true});const attributesView=document.getElementById("attributes");const addAttrButton=document.getElementById("add-attribute");const delNodeAttribute=document.getElementById("remove-element");let attributeSelected;let elementToChange;let elementToChangeTarget;let modelAttributes={attributes:[],nodeName:"",isVisible:"none"};let attrsTemplate=new opener.TT(attributesView,modelAttributes,{interpolation:/\$\{\{([\s\S]+?)\}\}/});const interfacesAssociatedSection=document.getElementById("component-interface");let componentsModel={interfacesAssociated:"",interfaces:[]};let componentsTemplate=new opener.TT(interfacesAssociatedSection,componentsModel);const classes=document.getElementById("classes");let classesModel={classes:[]};let classesTemplate=new opener.TT(classes,classesModel,{interpolation:/\$\{\{([\s\S]+?)\}\}/});let associatedClasses=[];let flagForInternalModifications;let newClassForm=document.getElementById("new-class");const childrenElementUL=document.querySelector("#children ul");const childrenGrabberSVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><g><g><g><path style="fill:#727272;" d="M17.5,8.4c-0.4,0-0.7-0.1-1-0.4L12,3.4L7.5,7.8C7,8.4,6.1,8.4,5.6,7.8C5,7.3,5,6.4,5.6,5.9L11,0.5c0.5-0.5,1.4-0.5,1.9,0L18.4,6C19,6.6,19,7.4,18.4,8C18.2,8.2,17.8,8.4,17.5,8.4z"/></g><g><path style="fill:#727272;" d="M12,11c-0.8,0-1.4-0.6-1.4-1.4l0-8.2c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4l0,8.2C13.4,10.4,12.8,11,12,11z"/></g></g><g><g><path style="fill:#727272;" d="M6.5,15.6c0.4,0,0.7,0.1,1,0.4l4.5,4.6l4.5-4.5c0.5-0.5,1.4-0.5,1.9,0c0.5,0.5,0.5,1.4,0,1.9L13,23.5c-0.5,0.5-1.4,0.5-1.9,0L5.6,18C5,17.4,5,16.6,5.6,16C5.8,15.8,6.2,15.6,6.5,15.6z"/></g><g><path style="fill:#727272;" d="M12,13c0.8,0,1.4,0.6,1.4,1.4l0,8.2c0,0.8-0.6,1.4-1.4,1.4c-0.8,0-1.4-0.6-1.4-1.4l0-8.2C10.6,13.6,11.2,13,12,13z"/></g></g></g></svg>`;const tagComponents=[{path:"tag-components/TABLE",name:"TABLE",selector:"table",interface:"interface.html",specificity:1}];function assignComponentsToElement(el){if([1].indexOf(el.nodeType)==-1)el=el.parentNode;var comps=[];for(var k in app.localComponentsFlat){var v=app.localComponentsFlat[k];var selector=v.selector||`[${app.componentAttribute}="${v.name}"]`;if(v.interface&&selector&&el.matches(selector)){var componentBundle=Object.assign({},v);componentBundle.specificity=cssSpecificity(selector);componentBundle.path=v.path;comps.push(v)}}return comps.concat(tagComponents.filter((v=>el.matches(v.selector)))).sort(((a,b)=>b.specificity-a.specificity))}childrenElementUL.addEventListener("click",(e=>{if(e.target.classList.contains("children-grabber"))return;var link=e.target.closest("li");if(!link)return;var el=app.elementSelected.children[link.dataset.index];app.core.selectElement(el)}));childrenElementUL.addEventListener("mousemove",(e=>{var link=e.target.closest("li");if(!link){app.highlight=null;return}app.highlight=app.elementSelected.children[link.dataset.index]}));childrenElementUL.addEventListener("mouseout",(e=>{app.highlight=null}));const dragList=__dragList(childrenElementUL,{handlerSelector:".children-grabber",convalidate:function(el){if(el.querySelector(".children-grabber")){return true}}});dragList.on("move",(e=>{var nodes=e.target;for(var i=nodes.length-1;i>=0;i--){var node=nodes[i];var index=+node.dataset.index;var el=app.elementSelected.children[index];if(e.prev){var indexP=+e.prev.dataset.index;var prevEl=app.elementSelected.children[indexP];app.core.htmlMatch.move(prevEl,el,"after")}else{var indexN=+e.next.dataset.index;var nextEl=app.elementSelected.children[indexN];app.core.htmlMatch.move(nextEl,el,"before")}}[...childrenElementUL.children].forEach(((v,i)=>v.dataset.index=i))}));insidePath.addEventListener("click",(e=>{var link=e.target.closest("a");if(!link)return;var el=app.cssSelectorObj.composedPath[link.dataset.index];app.core.selectElement(el)}));insidePath.addEventListener("mousemove",(e=>{var link=e.target.closest("a");if(!link){app.highlight=null;return}app.highlight=app.cssSelectorObj.composedPath[link.dataset.index]}));insidePath.addEventListener("mouseout",(e=>{app.highlight=null}));opener.addEventListener("deselect-element",(e=>{wrapper.setAttribute("hidden","");elementSumSection.style.display="none"}));opener.addEventListener("WYSIWYG-start",(e=>{wrapper.setAttribute("hidden","");elementSumSection.style.display="none"}));opener.addEventListener("WYSIWYG-end",(()=>{if(app.elementSelected){wrapper.removeAttribute("hidden");elementSumSection.style.display="block"}}));opener.addEventListener("content-editable-end",(()=>{}));opener.addEventListener("frame-unload",(()=>{wrapper.setAttribute("hidden","");elementSumSection.style.display="none"}));function onSelected(dontSetInterfaces){if(app.elementSelected.nodeType==1){wrapper.removeAttribute("hidden");setAttrsTemplate(app.elementSelected,app.selectorObj.match);!dontSetInterfaces&&setInterfaces();setClasses()}else wrapper.setAttribute("hidden","")}if(app.elementSelected){onSelected()}opener.addEventListener("highlight-click",(()=>onSelected()));attributesView.addEventListener("dropzone-dropping",onDropFiles,true);opener.addEventListener("tilepieces-mutation-event",(e=>{var mutationList=e.detail.mutationList;console.log("[element panel log mutationList and flagForInternalModifications]->",mutationList,flagForInternalModifications);if(flagForInternalModifications){flagForInternalModifications=false;return}var findAttributeMutation,removedNode,childrenList;mutationList.forEach((mutation=>{if(mutation.type=="childList"&&mutation.target==app.elementSelected)childrenList=true;if(mutation.type=="attributes"&&mutation.target==app.elementSelected)findAttributeMutation=true;mutation.removedNodes.forEach((v=>{if(v==app.elementSelected)removedNode=true}))}));if(removedNode){wrapper.setAttribute("hidden","")}else if(childrenList){setChildrenElements()}else if(findAttributeMutation)onSelected(true)}));window.addEventListener("window-popup-open",(e=>{}));window.addEventListener("window-popup-close",(e=>{}));function setAttrsTemplate(target,match){modelAttributes.attributes=[...target.attributes].reverse().map(((a,i)=>{var name=a.nodeName;var value=a.nodeValue;var tagName=target.tagName;var parentNode=target.parentNode;var classSrc=(tagName.match(/^(VIDEO|AUDIO|IMG)$/)||parentNode?.tagName?.match(/^(VIDEO|AUDIO|IMG)$/)&&tagName=="SOURCE")&&name.toLowerCase()=="src"?"src-box":"";var disabled=!match.match||match.match.getAttribute(name)!=value?"disabled":"";return{name:name,value:value,disabled:disabled,index:i,classSrc:classSrc,dropzone:classSrc&&!disabled?"data-dropzone":""}}));modelAttributes.nodeName=target.tagName;modelAttributes.nodenamedisabled=match.match?"":"disabled";modelAttributes.isVisible="block";modelAttributes.notmatch=!match.match||!match.attributes||!match.HTML?"":"hidden";modelAttributes.not_matching_phrase=!match.match?"cannot find the element in the original tree":!match.attributes&&!match.HTML?"A match was found for the element, but both HTML and attributes are different.":!match.attributes?"A match was found for the element, but attributes are different.":!match.HTML?"A match was found for the element, but HTML is different.":"";modelAttributes.nodenameinvalid="hidden";attrsTemplate.set("",modelAttributes);addAttrButton.disabled=false;attributeSelected&&attributeSelected.parentNode.classList.remove("attr-sel");insidePath.innerHTML=app.cssSelectorObj.composedPath.reduce(((filtered,v,i)=>{if(v.tagName&&i>0)filtered.push(`<a href='#' data-index='${i}'>${app.utils.elementSum(v)}</a>`);return filtered}),[]).reverse().join("");elementSumSection.style.display="block";setChildrenElements()}function setChildrenElements(){childrenElementUL.innerHTML=[...app.elementSelected.children].map(((v,i,a)=>{var isNodeMatch=!v.tagName.match(/^(HTML|BODY|HEAD|THEAD|TBODY|TFOOT)$/)&&app.core.htmlMatch.find(v);var grabber=isNodeMatch&&a.length>1?`<span class="children-grabber">${childrenGrabberSVG}</span>`:"";return`<li data-index=${i}>${grabber}<a href='#'>${app.utils.elementSum(v)}</a></li>`})).join("")}function setClasses(){var target=app.elementSelected;var classesTokens=target.classList;var iterator=classesTokens.values();classesModel.classes=[];for(var name of iterator){classesModel.classes.push({name:name,checked:true})}var associated=associatedClasses.find((v=>v.el==target));if(associated)classesModel.classes=classesModel.classes.concat(associated.classes);classesModel.classes.forEach(((v,i)=>v.index=i));var match=app.selectorObj.match;classesModel.canadd=!match.match||match.match.getAttribute("class")!=app.elementSelected.getAttribute("class")?"disabled":"";classesModel.newClassName="";classesModel.classinvalid="hidden";classesTemplate.set("",classesModel)}function setInterfaces(){componentsTemplate.set("interfaces",[]);cacheSelector=app.elementSelected;var componentsToElement=assignComponentsToElement(app.elementSelected);var interfaces=componentsToElement.map(((value,i)=>{if(i==0&&componentsModel.interfaceAssociated!=value.name){componentsModel.interfaceAssociated=value.name}var isTagComponent=tagComponents.find((v=>v.name==value.name));var interfacePath=isTagComponent?value.path+"/"+value.interface:("/"+tilepieces.frameResourcePath()+"/"+value.path+"/"+value.interface).replace(/\/\//g,"/");return{interface:interfacePath,name:value.name}}));var interfacesInherited=app.selectorObj.composedPath.reduce(((acc,v)=>{if(v==app.elementSelected)return acc;if(!(typeof v=="object"&&"nodeType"in v&&v.nodeType===1&&v.cloneNode))return acc;var arr=assignComponentsToElement(v);arr=arr.reduce(((accu,value,index)=>{var foundInInterface=interfaces.find((i=>i.name==value.name));var foundInAccu=acc.find((a=>a.name==value.name));if(!foundInInterface&&!foundInAccu){var accuIndex=index+interfaces.length;var isTagComponent=tagComponents.find((v=>v.name==value.name));var absoluteStart=isTagComponent?"":"/";var interfacePath=isTagComponent?value.path+"/"+value.interface:("/"+tilepieces.frameResourcePath()+"/"+value.path+"/"+value.interface).replace(/\/\//g,"/");accu.push({interface:interfacePath,name:value.name})}return accu}),[]);return acc.concat(arr)}),[]);interfaces=interfaces.concat(interfacesInherited).map(((v,index)=>Object.assign(v,{index:index,selected:index==0?"selected":""})));if(!interfaces){interfacesAssociatedSection.classList.add("hidden")}else interfacesAssociatedSection.classList.remove("hidden");componentsTemplate.set("interfaces",interfaces)}addAttrButton.addEventListener("click",(e=>{modelAttributes.attributes.forEach((v=>v.index+=1));modelAttributes.attributes.unshift({name:"",value:"",disabled:"",index:0});attrsTemplate.set("attributes",modelAttributes.attributes);var attributes=attributesView.querySelectorAll(".attribute-name");attributes[0].focus()}));attributesView.addEventListener("click",(e=>{var t=e.target;if(!t.classList.contains("remove-attr"))return;var index=t.dataset.index;var attr=modelAttributes.attributes[index];app.core.htmlMatch.removeAttribute(app.elementSelected,attr.name);var match=tilepieces.core.htmlMatch.find(app.elementSelected)}));attributesView.addEventListener("focus",(e=>{elementToChange=app.elementSelected;elementToChangeTarget=e.target.cloneNode(true)}),true);attributesView.addEventListener("input",(e=>{elementToChangeTarget=e.target.cloneNode(true)}),true);attributesView.addEventListener("change",(e=>{var currentElement=elementToChange;var target=elementToChangeTarget;var isAttributeName=target.classList.contains("attribute-name");var isAttributeValue=target.classList.contains("attribute-value");if(!isAttributeValue&&!isAttributeName)return;if(isAttributeName){target.dataset.prev&&app.core.htmlMatch.removeAttribute(currentElement,target.dataset.prev);try{app.core.htmlMatch.setAttribute(currentElement,target.value,target.dataset.value)}catch(e){alertDialog(e.toString(),true)}}else if(isAttributeValue){try{app.core.htmlMatch.setAttribute(currentElement,target.dataset.key,target.value)}catch(e){alertDialog(e.toString(),true)}}}),true);classes.addEventListener("template-digest",(e=>{var target=e.detail.target;if(target.closest("#new-class")){if(classesModel.classinvalid=="")classesTemplate.set("classinvalid","hidden");return}var className=target.dataset.value;var index=+target.dataset.index;var classStructure=classesModel.classes[index];var isInAssociated=associatedClasses.find((v=>v.el=app.elementSelected));if(target.checked){app.core.htmlMatch.addClass(app.elementSelected,className);var exAssociated=isInAssociated.classes.findIndex((v=>v.name==classStructure.name));isInAssociated.classes.splice(exAssociated,1)}else{classStructure.checked=false;if(!isInAssociated)associatedClasses.push({el:app.elementSelected,classes:[classStructure]});else if(!isInAssociated.classes.find((v=>v.name==classStructure.name)))isInAssociated.classes.push(classStructure);app.core.htmlMatch.removeClass(app.elementSelected,className)}var classAttribute=modelAttributes.attributes.find((v=>v.name=="class"));classAttribute.value=app.elementSelected.getAttribute("class");attrsTemplate.set("",modelAttributes);flagForInternalModifications=true}));newClassForm.addEventListener("submit",(e=>{e.preventDefault();try{app.core.htmlMatch.addClass(app.elementSelected,classesModel.newClassName)}catch(e){classesModel.classinvalid="";classesModel.classinvalid_phrase=e;classesTemplate.set("",classesModel);return}setClasses();flagForInternalModifications=true}));attributesView.addEventListener("nodeName",(e=>{if(app.elementSelected!=elementToChange){console.warn("[element panel] returning from nodeName change, because app.elementSelected != elementToChange");return}var currentElement=app.elementSelected;var newNodeName=e.detail.target.value.toUpperCase();var composedPath=app.selectorObj.composedPath.slice(1,app.selectorObj.composedPath.length);var isNotAdmitted=app.utils.notAdmittedTagNameInPosition(newNodeName,composedPath);if(isNotAdmitted){modelAttributes.nodenameinvalid="";attrsTemplate.set("",modelAttributes);return}var treeWalker=document.createTreeWalker(app.elementSelected,NodeFilter.SHOW_ELEMENT);var currentNode=treeWalker.currentNode;while(currentNode){if(currentNode!==app.elementSelected){var swap=currentNode.parentNode;var subComposedPath=[];while(swap){subComposedPath.push(swap);swap=swap.parentNode}if(app.utils.notAdmittedTagNameInPosition(currentNode.tagName,subComposedPath)){modelAttributes.nodenameinvalid="";attrsTemplate.set("",modelAttributes);return}}currentNode=treeWalker.nextNode()}modelAttributes.nodenameinvalid="hidden";attrsTemplate.set("",modelAttributes);var newNode=currentElement.ownerDocument.createElement(newNodeName);for(var i=0,l=currentElement.attributes.length;i<l;++i){var nodeName=currentElement.attributes.item(i).nodeName;var nodeValue=currentElement.attributes.item(i).nodeValue;newNode.setAttribute(nodeName,nodeValue)}[...currentElement.childNodes].forEach((c=>newNode.appendChild(c)));app.core.htmlMatch.replaceWith(currentElement,newNode);newNode.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}))}));document.getElementById("node-name").addEventListener("blur",(e=>{if(modelAttributes.nodenameinvalid==""){modelAttributes.nodenameinvalid="hidden";modelAttributes.nodeName=app.elementSelected.nodeName;attrsTemplate.set("",modelAttributes)}}));function onDropFiles(e){e.preventDefault();var dropzone=e.detail.target;var file=e.detail.files[0];if(!file)return;var tagName=modelAttributes.nodeName;var tagParentName=app.elementSelected.parentNode.tagName;var isSOURCE=tagName=="SOURCE";var isIMG=(tagName=="IMG"||isSOURCE&&tagParentName=="IMG")&&file.type.startsWith("image/");var isVIDEO=(tagName=="VIDEO"||isSOURCE&&tagParentName=="VIDEO")&&file.type.startsWith("video/");var isAUDIO=(tagName=="AUDIO"||isSOURCE&&tagParentName=="AUDIO")&&file.type.startsWith("audio/");var allowed=isIMG||isVIDEO||isAUDIO;if(allowed){app.utils.processFile(file).then((res=>{var sel=app.elementSelected;app.core.htmlMatch.setAttribute(sel,"src",res);if(isVIDEO||isAUDIO)isSOURCE?sel.parentNode.load():sel.load()}))}}attributesView.addEventListener("click",(e=>{if(!e.target.closest(".search-button"))return;var tagName=modelAttributes.nodeName;var tagParentName=app.elementSelected.parentNode.tagName;var isSOURCE=tagName=="SOURCE";var typeSearch=isSOURCE?tagParentName.toLowerCase():tagName.toLowerCase();var dialogSearch=opener.dialogReader(typeSearch);dialogSearch.then((dialog=>{dialog.on("submit",(src=>{var sel=app.elementSelected;app.core.htmlMatch.setAttribute(isSOURCE?sel.parentNode:sel,"src",src)}))}))}));delNodeAttribute.addEventListener("click",(e=>{app.core.htmlMatch.removeChild(app.elementSelected);if(app.multiselected){var index=app.multiselections.findIndex((v=>v.el==app.elementSelected));app.removeItemSelected(index)}else app.core.deselectElement()}));interfacesAssociatedSection.addEventListener("interfaceAssociated",(e=>{console.log("[interfaceAssociated]",e,e.detail,e.detail.target.value);var exSelectedIndex=componentsModel.interfaceAssociated?componentsModel.interfaces.findIndex((v=>v.name==componentsModel.interfaceAssociated)):0;componentsModel.interfaces[exSelectedIndex].selected="";var newSelected=componentsModel.interfaces.find((v=>v.name==e.detail.target.value));newSelected.selected="selected";componentsTemplate.set("",componentsModel)}));