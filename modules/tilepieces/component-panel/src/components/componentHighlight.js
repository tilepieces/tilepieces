componentSection.addEventListener("click",e=>{
  var t = e.target;
  if(!t.classList.contains("component-highlight"))
    return;
  e.preventDefault();
  var c = t.__component;
  var rDS = app.utils.getResourceAbsolutePath
  ;
  var template = `
    <ul>
    <li><h2>${c.name}<h2></li>
    <li>description:<b>${c.name}</b></li>
    <li>version: <b>${c.version}</b></li>
    ${c.website ? `<li>website: <a href="${c.website}" target="_blank">${c.website}</a></li>` : ""}
    <li>${c.html ? 
    `<iframe src=${rDS(c.path + "/" + c.html)} style="width:100%;min-height: 400px;"></iframe></li><li><b>HTML is fixed:</b><span>${c.fixedHTML}</span></li>` : 
    "</li>"}
    ${c.bundle.stylesheet.href ? `<h3>Bundle stylesheet</h3>
<li><a href="${rDS(c.path + "/" + c.bundle.stylesheet.href)}" target="_blank">${c.bundle.stylesheet.href}</a></li>
<li><pre><code>&lt;link ${Object.keys(c.bundle.stylesheet).map(s=>`${s}=${c.bundle.stylesheet[s]}`).join(" ")}/&gt;</code></pre></li>` : ""}
    ${c.bundle.script.src ? `<h3>Bundle script</h3>
<li><a href="${rDS(c.path + "/" + c.bundle.script.src)}" target="_blank">${c.bundle.script.src}</a></li>
<li><pre><code>&lt;script ${Object.keys(c.bundle.script).map(s=>`${s}=${c.bundle.script[s]}`).join(" ")}/&gt;&lt;/script&gt;</code></pre></li>` : ""}
    </ul>`
  dialog.open(template);
})