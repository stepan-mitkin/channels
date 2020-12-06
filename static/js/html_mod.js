// Created with Drakon Tech https://drakon.tech/

function html_mod() {

var module = {};

function addAfter(before, tag, className) {
    var element;
    element = document.createElement(tag)
    element.className = className || ""
    before.parentNode.insertBefore(
        element,
        before.nextSibling
    )
    return element
}

function addStyle(header, lines) {
    var addSemi, body, content, styleSheet;
    addSemi = function (line) {
        return "    " + line.trim() + ";"
    }
    body = lines.map(addSemi).join("\n")
    content = "\n" + header + " {\n" + body +
    "\n}\n"
    styleSheet = document.createElement(
        "style"
    )
    styleSheet.type = "text/css"
    styleSheet.innerHTML = content
    document.head.appendChild(styleSheet)
}

function addTag(parent, tag, text, className) {
    var element;
    element = make(parent, tag, className)
    setText(element, text)
    return element
}

function addText(div, text) {
    var node;
    node = document.createTextNode(text)
    div.appendChild(node)
}

function centerDiv(div) {
    div.style.position = "absolute"
    div.style.display = "inline-block"
    div.style.left = "50%"
    div.style.top = "50%"
    div.style.transform = "translate(-50%, -50%)"
}

function get(id) {
    var element;
    element = document.getElementById(id)
    if (element) {
        return element
    } else {
        throw new Error("get: element not found. id: " + id)
    }
}

function getRect(element) {
    var height, rect, width;
    rect = element.getBoundingClientRect()
    width = rect.right - rect.left
    height = rect.bottom - rect.top
    return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
    }
}

function make(parent, tag, className) {
    var element;
    element = document.createElement(tag)
    element.className = className || ""
    parent.appendChild(element)
    return element
}

function noSelect() {
    return "-webkit-user-select: none;" + "-moz-user-select: none;"
    + "-ms-user-select: none;" + "user-select: none"
}

function removeElement(element) {
    element.parentNode.removeChild(element)
}

function setCollectionContent(parent, items, maker) {
    parent.innerHTML = ""
    if (items) {
        items.forEach(
            function (item) {
                maker(parent, item)
            }
        )
    }
}

function setText(div, text) {
    div.innerHTML = ""
    addText(div, text)
}

module.addAfter = addAfter;

module.addStyle = addStyle;

module.addTag = addTag;

module.addText = addText;

module.centerDiv = centerDiv;

module.get = get;

module.getRect = getRect;

module.make = make;

module.noSelect = noSelect;

module.removeElement = removeElement;

module.setCollectionContent = setCollectionContent;

module.setText = setText;

return module;

}
