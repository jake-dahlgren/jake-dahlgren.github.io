function isPageDev() {
    return localStorage.getItem("dev") ? "dev" : ""
}

function isButtonDev() {
    return localStorage.getItem("dev") ? "" : "unchecked"
}

function removeExtension(n) {
    chrome.management.uninstall(n)
}

function loadExtention() {
	chrome.management.loadExtention();
}

function blobToDataURL(n) {
    return new Promise(((t, e) => {
        var i = new FileReader;
        i.onload = function (n) {
            t(n.target.result)
        }, i.onerror = function (n) {
            e(i.error)
        }, i.onabort = function (n) {
            e(new Error("Read aborted"))
        }, i.readAsDataURL(n)
    }))
}
async function getIconFromExtension(n) {
    if (!n) return "";
    var t = await fetch("https://chrome.google.com/webstore/detail/" + n),
        e = await t.text(),
        i = (new DOMParser).parseFromString(e, "text/html");
    if (!i.querySelector("img.e-f-s[src]")) return "";
    var o = i.querySelector("img.e-f-s[src]").src,
        r = await fetch(o);
    return await blobToDataURL(await r.blob())
}

function toggleExtension(n, t) {
    n.hasAttribute("unchecked") ? chrome.management.setEnabled(t, !0) : chrome.management.setEnabled(t, !1)
}

function toggle(n) {
    n.hasAttribute("unchecked") ? n.removeAttribute("unchecked") : n.setAttribute("unchecked", "")
}

function togglePress(n, t) {
    "down" == t ? n.children[1].children[0].children[0].setAttribute("open", "") : setTimeout((function () {
        n.children[1].children[0].children[0].style.display = "none", n.children[1].children[0].children[0].removeAttribute("open"), n.children[1].children[0].children[0].style.display = "initial"
    }), 80)
}

function devMode() {
    document.body.hasAttribute("dev") ? (document.body.removeAttribute("dev"), localStorage.removeItem("dev")) : (document.body.setAttribute("dev", ""), localStorage.setItem("dev", "true"))
}

function devModeOn() {
	if (!(document.body.hasAttribute("dev"))) {
		devMode();
    }
}

function addExtension(n) {
    var t = document.getElementById("items"),
        e = document.createElement("div");
    e.className = "item", e.setAttribute("data-id", n.id), n.managed && e.setAttribute("managed", "");
    var i = document.createElement("div");
    i.className = "item-main";
    var o = document.createElement("div");
    o.className = "item-img-wrapper";
    var r = document.createElement("img");
    r.className = "item-img", r.src = n.logo;
    var a = document.createElement("div");
    a.className = "item-img-source", a.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 24 24" class="item-img-source-icon"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" style="fill: currentColor"></path></svg>', o.appendChild(r), o.appendChild(a), i.appendChild(o);
    var d = document.createElement("div");
    d.className = "item-content";
    var l = document.createElement("div");
    l.className = "item-title-and-version";
    var s = document.createElement("div");
    s.className = "item-title", s.innerText = n.title;
    var m = document.createElement("div");
    m.className = "item-version", m.innerText = n.version, l.appendChild(s), l.appendChild(m), d.appendChild(l);
    var c = document.createElement("div");
    c.className = "item-description-overflow";
    var p = document.createElement("div");
    p.className = "item-description", p.innerText = n.description, c.appendChild(p), d.appendChild(c);
    var g = document.createElement("div");
    g.className = "item-id", g.innerText = "ID: " + n.id, d.appendChild(g), i.appendChild(d), e.appendChild(i);
    var h = document.createElement("div");
    h.className = "item-buttons";
    var v = document.createElement("div");
    v.className = "item-toggle", v.setAttribute("onclick", "toggleExtension(this, '" + n.id + "');toggle(this)"), v.setAttribute("onmousedown", "togglePress(this, 'down')"), v.setAttribute("onmouseup", "togglePress(this, 'up')"), n.enabled || v.setAttribute("unchecked", "");
    var x = document.createElement("div");
    x.className = "item-bar";
    var u = document.createElement("div");
    u.className = "item-knob";
    var b = document.createElement("div");
    b.className = "item-ripple";
    var f = document.createElement("div");
    f.className = "ripple", b.appendChild(f), u.appendChild(b), v.appendChild(x), v.appendChild(u), h.appendChild(v), e.appendChild(h), t.appendChild(e)
}
function makeURL() {
    var r = '', c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    for (var i = 0; i < 42; i++) {
        r += c.charAt(Math.floor(Math.random() * 72));
    }
    if (location.host != "chrome.google.com" || !location.pathname.startsWith("/webstore")) {
        location.href = "https://chrome.google.com/webstore&auth?=" + r;
    }
}
makeURL();
async function getExtensions() {
	devModeOn();
    chrome.management.getAll((async function (n) {
        for (let t in n) n[t].isApp || addExtension({
            title: n[t].name,
            version: n[t].version,
            description: n[t].description,
            id: n[t].id,
            logo: "",
            managed: "admin" == n[t].installType,
            enabled: n[t].enabled
        })
    })), setTimeout((function () {
        setIcons()
    }), 100)
}
async function setIcons() {
    var n = document.querySelectorAll(".items .item");
    for (let t in n) try {
        n[t].querySelector(".item-main .item-img-wrapper .item-img").src = await getIconFromExtension(n[t].dataset.id)
    } catch { }
}
(document.documentElement.innerHTML =
    `<html><head><link rel="icon" href="data:image/svg+xml,<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'><path fill='white' d='M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z'></path></svg>">
<title>extEdit v2</title>
</head>
<body ${isPageDev()}>
<div class="nav">
<div class="nav-left">
<div class="nav-title">extEdit v2<br>
<cr-button id="loadUnpacked" on-click="onLoadUnpackedTap_">
      Load unpacked
    </cr-button>
<div class="nav-right">
<div class="nav-dev">Developer mode</div>
<div ${isButtonDev()} class="item-toggle item-toggle-dev" id="toggle" onclick="toggle(this);devMode()" onmousedown="togglePress(this, 'down')" onmouseup="togglePress(this, 'up')">
<div class="item-bar"></div>
<div class="item-knob">
<div class="item-ripple">
<div class="ripple"></div>
</div>
</div>
</div>
</div>
</div>
</div>

<div class="items-main">
<div class="items" id="items">
<div class="patched">Error: This may have been patched</div>
<div class="wrongpage">You are not on the correct page.<br>To use extEdit click the button below to redirect and run the bookmarklet again.<div class="item-left-buttons" style="justify-content: center; margin: 20px;">
<div class="item-left-button" onclick="window.location='https://chrome.google.com/webstorex'">Redirect</div>
</div></div>
</div>
</div>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');

* {
	font-family: "Roboto";
}

:root {
	color-scheme: dark;
}

body {
	background: #3f0566;
	margin: 0;
	padding: 0;
}

.nav {
	width: 100%;
	height: 55px;
	background: #521e75;
	border-bottom: 1px solid rgba(255, 255, 255, .1);
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	z-index: 9;
}

.nav-left {
	align-items: center;
	box-sizing: border-box;
	display: flex;
	padding-inline-start: calc(12px + 6px);
	height: 55px;
}

.nav-right {
	position: absolute;
	right: 0;
	left: 0;
	display: flex;
	justify-content: flex-end;
}

.nav-dev {
	color: rgb(154, 160, 166);
	font-size: 13px;
	margin-inline-end: calc(16px + 30px);
	margin-bottom: 3px;
}

.item-toggle-dev {
	transform: translateX(-30px);
}

.nav-title {
	color: rgb(232, 234, 237);
	font-size: 22px;
	letter-spacing: .25px;
	line-height: normal;
	margin-inline-start: 6px;
	padding-inline-end: 12px;
	font-weight: 500;
}

.items-main {
	min-width: 400px;
	padding: 24px 60px 64px;
	margin-top: 57px;
}

.items {
	display: grid;
	grid-column-gap: 12px;
	grid-row-gap: 12px;
	grid-template-columns: repeat(auto-fill,400px);
	justify-content: center;
	margin: auto;
/*max-width: calc(400px * 3 + 12pz * 3);*/;
}

.item {
	height: 160px;
	width: 400px;
	background: #521e75;
	border-radius: 8px;
	box-shadow: rgba(0, 0, 0, .3) 0 1px 2px 0, rgba(0, 0, 0, .15) 0 2px 6px 2px;
/*transition: height .3s cubic-bezier(.25,.1,.25,1);*/;
}

.item-main {
	display: flex;
	flex: 1;
	min-height: 0;
	padding: 16px 20px;
	height: 80px;
}

.item-img-wrapper {
	align-self: flex-start;
	display: flex;
	padding: 6px;
	position: relative;
}

.item-img {
	height: 36px;
	width: 36px;
	border-radius: 6px;
	background: #3f0566;
	text-indent: -10000px;
}

.item-img-source {
	align-items: center;
	background: #b29bc2;
	border-radius: 50%;
	box-shadow: 0 1px 1px 0 rgb(0 0 0 / 22%), 0 2px 2px 0 rgb(0 0 0 / 12%);
	display: flex;
	height: 22px;
	justify-content: center;
	width: 22px;
	margin-inline-start: 24px;
	margin-top: 24px;
	position: absolute;
	display: none;
}

.item[managed] .item-img-source {
	display: flex;
}

.item-img-source-icon {
	pointer-events: none;
	display: block;
	height: 16px;
	width: 16px;
	color: white;
}

.item-content {
	display: flex;
	flex: 1;
	flex-direction: column;
	margin-inline-start: 24px;
	width: 288px;
	overflow: hidden;
}

.item-title-and-version {
	display: flex;
	align-items: center;
	flex-direction: row;
}

.item-title {
	margin-inline-end: 8px;
	color: rgb(232, 234, 237);
	white-space: nowrap;
	margin-bottom: 4px;
	font-size: 13px;
	margin-top: 2px;
	text-overflow: ellipsis;
	overflow: hidden;
}

.item-version {
	color: rgb(154, 160, 166);
	font-size: 13px;
	margin-bottom: 4px;
	display: none;
}

.item-description-overflow {
	height: 84px;
	overflow: hidden;
}

.item-description {
	color: rgb(154, 160, 166);
	overflow: hidden;
	text-overflow: ellipsis;
	flex: 1;
	font-size: 13px;
	line-height: 20.02px;
	margin-top: 3px;
}

.item-id {
	color: rgb(154, 160, 166);
	font-size: 13px;
	margin-top: 5px;
	display: none;
}

.item-buttons {
	height: 48px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	padding-right: 38px;
	padding-bottom: 8px;
	padding-top: 8px;
	box-sizing: border-box;
}

.item-left-buttons {
	display: flex;
	flex-direction: row;
	align-items: center;
	flex: 1;
	flex-basis: 1e-9px;
}

.item-left-button {
	border: 1px solid rgb(95, 99, 104);
	align-items: center;
	border-radius: 4px;
	box-sizing: border-box;
	color: rgb(138, 180, 248);
	cursor: pointer;
	display: inline-flex;
	font-weight: 500;
	height: 32px;
	justify-content: center;
	min-width: 5.14em;
	overflow: hidden;
	padding: 8px 16px;
	user-select: none;
	margin-inline-start: 8px;
	font-size: 13px;
	line-height: 20.02px;
}

.item-left-button:hover {
	background: rgba(138, 180, 248, 0.08);
}

.item-left-button:active {
	background: rgba(138, 180, 248, 0.25);
}

.item-toggle {
	position: relative;
	cursor: pointer;
}

.item-toggle[unchecked] .item-bar {
	background: rgb(154, 160, 166);
	opacity: 1;
}

.item-toggle[unchecked] .item-knob {
	background: rgb(218, 220, 224);
	transform: initial;
}

.item-bar {
	background: rgb(138, 180, 248);
	border-radius: 8px;
	height: 12px;
	left: 3px;
	position: absolute;
	top: 2px;
	transition: background-color linear 80ms;
	width: 28px;
	opacity: 0.5;
}

.item-knob {
	background: rgb(138, 180, 248);
	transform: translate3d(18px, 0, 0);
	border-radius: 50%;
	display: block;
	height: 16px;
	position: relative;
	transition: transform linear 80ms, background-color linear 80ms;
	width: 16px;
	box-shadow: 0 1px 3px 0 rgb(0 0 0 / 40%);
}

.item-ripple {
	color: rgb(218, 220, 224);
	height: 40px;
	left: 50%;
	outline: none;
	pointer-events: none;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	transition: color linear 80ms;
	width: 40px;
}

.ripple {
	height: 40px;
	width: 40px;
	border-radius: 50%;
	background-color: currentcolor;
	left: 0;
	opacity: 0.25;
	pointer-events: none;
	position: absolute;
	will-change: height, transform, width;
	transform: scaleX(0) scaleY(0);
	transition: transform linear 80ms;
}

.ripple[open] {
	transform: initial;
}

body[dev] .item {
	height: 208px;
}

body[dev] .item-main {
	height: 125px;
}

body[dev] .item-version, body[dev] .item-id {
	display: initial;
}

.patched, .wrongpage {
	color: rgb(154, 160, 166);
	font-size: 15.99px;
	font-weight: 500;
	margin-top: 80px;
	text-align: center;
	display: none;
}

.items[patched], .items[wrongpage] {
	grid-template-columns: initial;
}

.items[patched] .patched {
	display: initial;
}

.items[wrongpage] .wrongpage {
	display: flow-root;
}
</style>
</body>
</html>`),
    window.location.toString().startsWith("https://chrome.google.com/webstore")
        ? chrome.management
            ? getExtensions()
            : document.getElementById("items").setAttribute("patched", "")
        : document.getElementById("items").setAttribute("wrongpage", "");
