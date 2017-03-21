$(window).load(function(){
	var conf = require('../../../../config/default.json');
	// console.log(conf);
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
						"url": "/apis/px2me",
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


});
