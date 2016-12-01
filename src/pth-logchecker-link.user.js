// ==UserScript==

// @name           PassTheHeadphones Logchecker Link
// @author         SavageCore
// @namespace      https://savagecore.eu
// @description    Inserts a logchecker.php link in main menu.
// @include        http*://*passtheheadphones.me/*
// @version        0.1.1
// @date           2016-11-29
// @grant          none

// ==/UserScript==

var menu = document.getElementById('userinfo_minor');

var logchecker = createLink('Logchecker','logchecker.php');
var logcheckerLi = createLi('Logchecker', logchecker);

menu.appendChild(logcheckerLi);

function createLi(x, y) {
    var li = document.createElement('li');
    li.id = 'nav_' + x;
    li.appendChild(y);
    return li;
}

function createLink(x, y) {
    var a = document.createElement('a');

    a.innerHTML = x;
    a.href = y;
    return a;
}
