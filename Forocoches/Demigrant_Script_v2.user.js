// ==UserScript==
// @name         Demigrant Script v2
// @namespace    http://plataformalol.tk/demigrantScript/
// @version      0.4
// @description  Script para mejorar la experiencia en forocoches creado por cerdosaurio y actualizado por Kolter para añadir la funcionalidad de citas
//               Script actualizado eliminando algunas funciones ya existentes en el foro y añadido el filtro para no mostrar mensajes tipo pillo sitio
// @author       cerdosaurio y Kolter
// @include      http://www.forocoches.com*
// @include      http://forocoches.com*
// @grant           GM_log
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_getResourceURL
// @grant           GM_getMetadata
// @require      http://code.jquery.com/jquery-latest.js
// @require http://plataformalol.tk/resources/jquery.cookie.js
// @resource 	fontawesome http://fonts.googleapis.com/css?family=Fjalla+One
// @require   http://plataformalol.tk/resources/uri/src/URI.js
// @resource  carme //fonts.googleapis.com/css?family=Carme
// ==/UserScript==
 var newCSS = GM_getResourceText ("fontawesome");
GM_addStyle (newCSS);
var url = null;
var hilo = new URI (location.href);
hilo = URI.parseQuery(hilo.query());
hilo = hilo.t;
var pagina = 1;
var botonNuevosPosts = null;
var numNuevosPosts = 0;
var hrefOp = null;
var op = null;
var user= '';
var tema=[];
var autor=[];
var cita=null;
var pagina=null;
var words_to_be_removed = ['sitio', 'sitio que interesa', 'gracias!', 'pillo sitio', 'pillando sitio', 'sitiando', 'sitio pillo', 'pillo simio', 'pole chollera', 'pillo timo',
                          'pillo sitio, me interesa', 'sirio', 'pillo sitio.', 'mis dies'];

// eliminar pilo sitio
$("table[id^=post]").each(function(){
    post = $(this).find('tbody > tr > td').eq(3).find('div > div').text().trim().toLowerCase();
    for each (word in words_to_be_removed){
        if (post == word){
            $(this).remove();
            break;
        }
    }
});
 
function procesaPrimeraPagina(html) {
    var enlace = $("a.bigusername", html).first();
    hrefOp = enlace.attr("href");
    op = enlace.text();
}
 
function despliegaNuevosPosts() {
    $(".postInvisible").show();
    botonNuevosPosts.remove();
    botonNuevosPosts = null;
        numNuevosPosts = 0;
    if(document.title.charAt(0) == "*")
        document.title = document.title.substr(2);
}
 
function buscaNuevosPosts() {
    $.get(document.URL, function(data) {
        var html = $.parseHTML(data);
        var nuevos = [];
        var nuevo = true;
        
        $("table.tborder[id^=post]", html).each(function() {
            if(!$("table#" + $(this).attr("id")).length) {
                  // INICIO eliminar posts pillo sitio
                  post = $(this).find('tbody > tr > td').eq(3).find('div > div').text().trim().toLowerCase();
                  for each (word in words_to_be_removed){
                    if (post == word){
                      nuevo = false;
                        break;
                    }
                  }
                  if (nuevo){
                      numNuevosPosts++;
                      nuevos.push($(this).parent().parent().parent().addClass("postInvisible").hide());
                  }
                  // FIN eliminar posts pillo sitio
            }
        });
        if(numNuevosPosts) {
            if(document.title.charAt(0) != "*")
                    document.title = "* " + document.title;
            var mensajeNuevos = "Hay " + numNuevosPosts + (numNuevosPosts == 1 ? " post nuevo" : " posts nuevos");
            if(!botonNuevosPosts) {
                botonNuevosPosts = $("<div></div>").attr("style", "cursor:pointer;color:#fff;font-weight:bold;font-size:18px;background-color:#2b4;margin:16px 0;padding:8px;text-align:center");
                    $("div#posts").append(botonNuevosPosts);
                botonNuevosPosts.click(despliegaNuevosPosts);
            }
            botonNuevosPosts.text(mensajeNuevos);
            $("div#posts").append(nuevos);
        }
        if($(".pagenav a[href$='&page=" + (pagina + 1) + "']", html).length) {
            if(document.title.charAt(0) != "*")
                    document.title = "* " + document.title;
            botonNuevaPagina = $("<div></div>").attr("style", "cursor:pointer;color:#fff;font-weight:bold;font-size:18px;background-color:#2b4;margin:16px 0;padding:8px;text-align:center").
                text("Hay una nueva página")
            if(botonNuevosPosts)
                    botonNuevaPagina.addClass("postInvisible").hide();
            botonNuevaPagina.click(function() {
                window.location.href = url + "?t=" + hilo + "&page=" + (pagina + 1);
            });
            $("div#posts").append(botonNuevaPagina);
        }
        else
                setTimeout(buscaNuevosPosts, 60000);
    });
}

  
function obtenerUrlTemaMencionado(tempDom){
            var limit3 = 0;
     var appContainer3 = $('.inlineimg', tempDom).each(function(){
              if (limit3<22 && limit3>0){
              if (limit3%2==0){
                tema.push($(this).parent('div').children('a')); 
              }
            
              }  ++limit3;
                     });   

}

function getHilo(){
var urlTema = null;
var limite=0;
    $('body').find('.alt1').each(function(){

        if (limite==2){
         urlTema =$(this).children('a').attr('href');  
         urlTema=urlTema.replace('&highlight='+user.toLowerCase(),'');
         urlTema=urlTema.replace('showthread.php?t=','');
        }
        ++limite;
    })
    return urlTema;
}

$(document).ready(function() {
    var trozosURL = document.URL.split("?", 2);
    if(trozosURL.length == 2 && (trozosURL[0] == "http://www.forocoches.com/foro/showthread.php" || trozosURL[0] == "http://forocoches.com/foro/showthread.php")) { 

        
        url = trozosURL[0];
        var trozosGET = trozosURL[1].split("&");
        var varsGET = {};
        for(var indice in trozosGET) {
            var varGET = trozosGET[indice].split("=");
            if(varGET.length == 2)
                varsGET[varGET[0]] = varGET[1];
        } 
          
        if(varsGET["page"] !== undefined){
            pagina = Number(varsGET["page"]); 
        
        }
        if(!$(".pagenav a[href$='&page=" + (pagina + 1) + "']").length){
                    setTimeout(buscaNuevosPosts, 60000);
        }
     $("table[class*='tborder-author']").css({"border":"3px solid #F00"});
        }
});