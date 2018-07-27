var it79 = require('iterate79');

$(window).load(function(){
	var conf = require('../../../../config/default.json');
	// console.log(conf);
	var params = parseUriParam(window.location.href);
	// console.log(params);
	var $canvas = $('#canvas');

	/**
	* window.resized イベントハンドラ
	*/
	var windowResized = function(callback){
		callback = callback || function(){};
		$canvas.height( $(window).height() - 50 );
		callback();
		return;
	}

	it79.fnc({}, [
		function(it1, arg){
			$.ajax({
				"url": "./apis.php",
				"type": 'get',
				'data': {'page_path':params.page_path, 'client_resources':1},
				"success": function(resources){
					// console.info('-------',resources);

					it79.ary(
						resources.css,
						function(it2, row, idx){
							var link = document.createElement('link');
							link.addEventListener('load', function(){
								it2.next();
							});
							$('head').append(link);
							link.rel = 'stylesheet';
							link.href = 'caches/'+row;
						},
						function(){
							it79.ary(
								resources.js,
								function(it3, row, idx){
									var script = document.createElement('script');
									script.addEventListener('load', function(){
										it3.next();
									});
									$('head').append(script);
									script.src = 'caches/'+row;
								},
								function(){
									it1.next(arg);
								}
							);
						}
					);

				}
			});
		},
		function(it1, arg){

			var pickles2ModuleEditor = new Pickles2ModuleEditor();
			windowResized(function(){
				pickles2ModuleEditor.init(
					{
						'elmCanvas': $canvas.get(0),
						'lang': 'ja',
						'gpiBridge': function(input, callback){
							// GPI(General Purpose Interface) Bridge
							// broccoliは、バックグラウンドで様々なデータ通信を行います。
							// GPIは、これらのデータ通信を行うための汎用的なAPIです。
							$.ajax({
								"url": "./apis.php",
								"type": 'post',
								'data': {'data':JSON.stringify(input)},
								"success": function(data){
									// console.log(data);
									callback(data);
								}
							});
							return;
						},
						'complete': function(){
							alert('完了しました。');
						},
						'onClickContentsLink': function( uri, data ){
							alert('編集: ' +  uri);
						},
						'onMessage': function( message ){
							console.info('message: '+message);
						}
					},
					function(){

						$(window).resize(function(){
							// このメソッドは、canvasの再描画を行います。
							// ウィンドウサイズが変更された際に、UIを再描画するよう命令しています。
							windowResized(function(){
								pickles2ModuleEditor.redraw();
							});
						});

						console.info('standby!!');
					}
				);

			});

		}
	]);

});

/**
 * GETパラメータをパースする
 */
var parseUriParam = function(url){
	var paramsArray = [];
	parameters = url.split("?");
	if( parameters.length > 1 ) {
		var params = parameters[1].split("&");
		for ( var i = 0; i < params.length; i++ ) {
			var paramItem = params[i].split("=");
			for( var i2 in paramItem ){
				paramItem[i2] = decodeURIComponent( paramItem[i2] );
			}
			paramsArray.push( paramItem[0] );
			paramsArray[paramItem[0]] = paramItem[1];
		}
	}
	return paramsArray;
}
