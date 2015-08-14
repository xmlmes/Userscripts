// ==UserScript==
// @name        referidos-forocoches
// @namespace   https://bitbucket.org/goagmx/referidos-forocoches/
// @description Elimina los referidos insertados automáticamente en Forocoches
// @include     http://forocoches.com/foro/*
// @include     http://*.forocoches.com/foro/*
// @version     1
// @author      https://bitbucket.org/goagmx/referidos-forocoches/
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// ==/UserScript==

$("a[href^='http://www.forocoches.com/link.php?url=']")
.each(function () {
    this.href = decodeURIComponent(this.href.replace("http://www.forocoches.com/link.php?url=http", "http"));
});