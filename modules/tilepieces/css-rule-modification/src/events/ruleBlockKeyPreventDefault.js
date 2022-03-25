function onKeyDown(e,t,model){
    if (e.target.classList.contains("rule-block__key")) {
        if (e.key == "Enter") {
            e.preventDefault();
            e.target.blur();
            e.target.nextElementSibling.nextElementSibling.focus();
        }
    }
    if(e.target.classList.contains("rule-block__value")){
        if (e.key == "Enter" || (e.key == "Tab" && !e.shiftKey)) {
            e.preventDefault();
            var ruleEl = e.target.closest(".rule-block__list");
            e.target.blur();
            if(e.target.parentNode.nextElementSibling){
                var key = e.target.parentNode.nextElementSibling.querySelector(".rule-block__key");
                setTimeout(()=>{
                    key.focus();
                })
            }
            else
                setTimeout(()=> {
                    addProperty(ruleEl,t,model);
                })
        }
    }
}