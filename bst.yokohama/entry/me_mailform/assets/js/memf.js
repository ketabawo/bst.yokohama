/**
 * MicroEngine MailForm
 * http://microengine.jp/mailform/
 *
 * Copyright 2014, MicroEngine Inc. (http://microengine.jp)
 *
 * @copyright Copyright (C) 2014 MicroEngine Inc.
 * @version 1.0.0
 */
var memf={};!function(a){var n="";memf.zipAddr=function(e,t,i,o,r,c){var f=a("[name="+e+"]").val().replace(/-/,"");t&&(f+=a("[name="+t+"]").val()),7===f.length&&n!==f&&(a.ajax({type:"GET",url:window.location.pathname+"?zipcode="+f,dataType:"json",success:function(n){if(n){var e="";!function(t){for(var i in t)n[i]&&(e=n[i]+e),t[i]&&(a("[name="+t[i]+"]").val(e),e="")}({st:c,town:r,city:o,pref:i})}}}),n=f)}}(jQuery);