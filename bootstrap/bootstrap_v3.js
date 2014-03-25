/*
 * * WSU TRACKING BOOTSCRIPT
 * * Version 0.1
 * * Copyright (c) 2011-12 Jeremy Bass
 * * Licensed under the MIT license:
 * * http://www.opensource.org/licenses/mit-license.php
 * */
function async_load_js(url){var headID = document.getElementsByTagName("head")[0];var s = document.createElement('script');s.type = 'text/javascript';s.async = true;s.src = url;var x = document.getElementsByTagName('script')[0];headID.appendChild(s);}
function param( name , process_url ){if(typeof(process_url)==='undefined'){process_url=window.location.href;}name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var regexS = "[\\?&]"+name+"=([^&#]*)";var regex = new RegExp( regexS );var results = regex.exec( process_url );if( results == null ){ return false;}else{return results[1];}}

url = document.getElementById('tracker_agent').src;
ver_jquery=(param( 'jquery' , url )!=false?param( 'jquery' , url ):'1.7.2');
var loadJquery = param("loadJquery", url );
var pause = 0;
load_base(url);

function load_base(url) {
	setTimeout(function(){
		if( loadJquery !="no" && (typeof(jQuery) === 'undefined' || !window.jQuery) ){
			async_load_js('//ajax.googleapis.com/ajax/libs/jquery/'+ver_jquery+'/jquery.min.js');
			pause= pause>0?100:0;
			setTimeout(function(){
				load_base(url);
			},pause);
		}else{
			if (window.Prototype)jQuery.noConflict();
			(function($) {
				if( !jQuery.migrateReset && /^([1]\.([9]|[1-9][0-9])(\.?[1-9]?)+)|^([2-9])/.test(jQuery.fn.jquery ))async_load_js('//images.wsu.edu/javascripts/jquery-migrate-1.2.1.min.js');
				scriptArray = [ // this is where we'd load the scriptArray list dynamicly.  Right now it's hard coded
					{
						src:"//repo.wsu.edu/jtrack/jquery.jTrack.0.2.1.js",
						exc:function(){
							var url = document.getElementById('tracker_agent').src;
							var GAcode = param("gacode", url );
							var _load  = param("loading", url );
							var _DN    = param("domainName", url );
							var _CP    = param("cookiePath", url );

							var url='//images.wsu.edu/javascripts/tracking/configs/pick.asp';
							jQuery.getJSON(url+'?callback=?'+(_load!=false?'&loading='+_load:''), function(data){
								jQuery.jtrack.defaults.debug.run = false;
								jQuery.jtrack.defaults.debug.v_console = false;
								jQuery.jtrack.defaults.debug.console = true;
								jQuery.jtrack({ load_analytics:{account:GAcode},options:jQuery.extend({},(_DN!=false?{'domainName':_DN}:{}),(_CP!=false?{'cookiePath':_CP}:{})), trackevents:data });
							});
						}
					}
				];
				jQuery.each(scriptArray, function(i,v){
					jQuery.ajax({
						type:"GET",dataType:"script",cache:true,url:v.src,
						success: function() {v.exc();}
					});
				});
			}(jQuery));
		}
	},50);
}