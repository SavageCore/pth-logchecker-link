// ==UserScript==
// @name           RED Logchecker Link
// @author         SavageCore
// @namespace      https://savagecore.eu
// @description    Inserts a logchecker.php link in main menu.
// @include        http*://*redacted.ch/*
// @version        3.0.0
// @date           2016-11-29
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM.getValue
// @grant          GM.setValue
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL	   https://github.com/SavageCore/pth-logchecker-link/raw/master/src/pth-logchecker-link.user.js
// ==/UserScript==

/*	global document GM window */

/* eslint new-cap: "off", no-redeclare: "off" */

(async function () {
	const position = await GM.getValue('position', 'userinfo');
	const cssFixId = 'sc_C5DeMKuu';
	cssFix(position);

	if (window.location.href.match('user.php\\?action=edit&userid=')) {
		const lastRow = document.querySelector('#site_tooltips_tr');

		const tr = document.createElement('tr');
		tr.id = 'red_logchecker_tr';
		const td = document.createElement('td');
		td.className = 'label tooltip';
		td.innerHTML = '<strong>Logchecker link location</strong>';
		tr.append(td);
		const td2 = document.createElement('td');
		tr.append(td2);
		const select = document.createElement('select');
		select.name = 'red_logchecker';
		select.id = 'red_logchecker';
		td2.append(select);
		const menuOptions = {
			0: {value: 'mainMenu', innerText: 'Main Menu'},
			1: {value: 'userinfo', innerText: 'User Info'},
			2: {value: 'userinfo_major', innerText: 'User Info Major'}
		};
		for (const key in menuOptions) {
			if ({}.hasOwnProperty.call(menuOptions, key)) {
				const optionElement = document.createElement('option');
				optionElement.value = menuOptions[key].value;
				optionElement.innerText = menuOptions[key].innerText;
				select.append(optionElement);
			}
		}

		lastRow.insertAdjacentElement('afterend', tr);

		const selectElem = document.querySelector('#red_logchecker');
		for (let i = 0; i < selectElem.options.length; i++) {
			if (selectElem.options[i].value === position) {
				selectElem.options[i].selected = 'selected';
			}
		}

		selectElem.addEventListener('change', e => {
			cssFix(e.target.value);
			switch (e.target.value) {
				case 'mainMenu':
					GM.setValue('position', 'mainMenu');
					updateLink(document.querySelector('#menu').children[1]);
					break;
				case 'userinfo':
					GM.setValue('position', 'userinfo');
					updateLink(document.querySelector('#userinfo_minor'));
					break;
				case 'userinfo_major':
					GM.setValue('position', 'userinfo_major');
					updateLink(document.querySelector('#userinfo_major'));
					break;
				default:
					GM.setValue('position', 'mainMenu');
					updateLink(document.querySelector('#menu').children[1]);
			}
		});
	}

	switch (position) {
		case 'mainMenu':
			appendLink(document.querySelector('#menu').children[1]);
			break;
		case 'userinfo':
			appendLink(document.querySelector('#userinfo_minor'));
			break;
		case 'userinfo_major':
			appendLink(document.querySelector('#userinfo_major'));
			break;
		default:
			appendLink(document.querySelector('#userinfo_minor'));
	}

	function appendLink(menu) {
		const logcheckerA = createLink('Logchecker', 'logchecker.php');
		const logcheckerLi = createLi('logchecker', logcheckerA);
		menu.append(logcheckerLi);
	}

	function createLi(x, y) {
		const li = document.createElement('li');
		li.id = 'nav_' + x;
		li.append(y);
		return li;
	}

	function createLink(x, y) {
		const a = document.createElement('a');

		a.innerHTML = x;
		a.href = y;
		return a;
	}

	function removeLi() {
		const element = document.querySelector('#nav_logchecker');
		element.parentNode.removeChild(element);
	}

	function updateLink(element) {
		removeLi();
		const logchecker = createLink('Logchecker', 'logchecker.php');
		const logcheckerLi = createLi('logchecker', logchecker);
		element.append(logcheckerLi);
	}

	function addCss(css) {
		const node = document.createElement('style');
		node.type = 'text/css';
		node.append(document.createTextNode(css));
		node.id = cssFixId;
		const heads = document.querySelectorAll('head');
		if (heads.length > 0) {
			heads[0].append(node);
		} else {
			// No head yet, stick it whereever
			document.documentElement.append(node);
		}
	}

	function removeCss(id) {
		const elem = document.querySelector(`#${id}`);
		if (elem) {
			elem.parentElement.removeChild(elem);
		}
	}

	function cssFix(position) {
		if (position === 'mainMenu') {
			const cssFixSel = '#nav_logchecker > a:nth-child(1) { background: none !important }';
			addCss(cssFixSel);
		} else {
			removeCss(cssFixId);
		}
	}
})();
