// ==UserScript==
// @name        Eliminar pillo sitio en Forocoches
// @namespace   *
// @include     http://www.forocoches.com/foro/showthread.php?*
// @include     https://www.forocoches.com/foro/showthread.php?*
// @version     1
// @grant       none
// @description Eliminar los tipicos comentarios flood de pillo sitio
// ==/UserScript==

var words_to_be_removed = ['sitio', 'sitio que interesa', 'gracias!', 'pillo sitio', 'pillando sitio', 'sitiando', 'sitio pillo', 'pillo simio', 'pole chollera', 'pillo timo',
                          'pillo sitio, me interesa', 'sirio', 'pillo sitio.', 'mis dies'];

$("table[id^=post]").each(function(){
  // extrae el texto del mensaje
  post = $(this).find('tbody > tr > td').eq(3).find('div > div').text().trim().toLowerCase();
  for each (word in words_to_be_removed){
    if (post == word){
      // elimina el post si es pillo sitio
      $(this).remove();
      break;
    }
  }
});