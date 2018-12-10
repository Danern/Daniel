
function hasClass(element, searchedClassName) {
    
    var wholeClassName = element.className;
    var classNameArray = wholeClassName.split(" ");
    var found = false;
    var index = 0;
    while(!found && index < classNameArray.length) {
        if (classNameArray[index] == searchedClassName) {
            found = true
        }
        index++;
    }
    return found;
}
function getFirstClass(element) { 
    var wholeClassName = element.className;
    var classNameArray = wholeClassName.split(" ");
    var firstClass = classNameArray[0];
    return firstClass;
}
function addClass(element, toAddClassName) {
    if (element.className == "undefined") {
        element.className = toAddClassName;
    }
    else {
        element.className += " " + toAddClassName;
    }
}
function removeClass(element, toRemoveClassName) {
    var cn = element.className;
    if (cn != "undefined") {
        if (hasClass(element, toRemoveClassName)) {
            if (cn.indexOf(" ") != -1) { 
                if (cn.indexOf(toRemoveClassName) == 0) { 
                    element.className = cn.substring(toRemoveClassName.length)
                }
                else {
                    
                    var beforeRemovePosition = cn.indexOf(toRemoveClassName);
                    var beforeRemove = cn.substring(0, beforeRemovePosition - 1); 
                    var afterRemovePosition = beforeRemovePosition  + toRemoveClassName.length;
                    var afterRemove = cn.substring(afterRemovePosition);
                    element.className = beforeRemove + afterRemove;
                }
            }
        }
    }
}

//write text
function writeText(holder, text) {
    removeContent(holder);
    var textNode = document.createTextNode(text);
    holder.appendChild(textNode);
}
function removeContent(holder) {
    // http://snipplr.com/view/2312/remove-all-childnodes/
    while(holder.hasChildNodes()) {
        holder.removeChild(holder.lastChild);
    }
}


//Händelser
function addEvent(element, eventType, eventFunction) {

  
    element.onclick = eventFunction;
    if (element.captureEvents) element.captureEvents(Event.CLICK);

    
    if (eventType == "click") {
        addClass(element, "clickable");
    }

}
function removeEvent(element, eventType, eventFunction) {

    
    element.onclick = null;
   
    if (eventType == "click") {
        removeClass(element, "clickable");
    }
}
function getEventTarget(e) {
    
    var activeElement;
    if(e && e.target){ 
        activeElement = e.target;
    }
    else if(window.event && window.event.srcElement){ 
        activeElement = window.event.srcElement;
    }
    return activeElement;
}
