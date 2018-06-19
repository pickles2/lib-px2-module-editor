# pickles2-module-editor

Pickles 2 のコンテンツ編集インターフェイスを提供します。

## Usage

### Server Side

```js

var express = require('express'),
	app = express();
var server = require('http').Server(app);
var Px2ME = require('pickles2-module-editor');

app.use( '/your/api/path', function(req, res, next){

	var px2me = new Px2ME();
	px2me.init(
		{
			'appMode': 'web', // 'web' or 'desktop'. default to 'web'
			'entryScript': require('path').resolve('/path/to/.px_execute.php'),
			'log': function(msg){
				// エラー発生時にコールされます。
				// msg を受け取り、適切なファイルへ出力するように実装してください。
				fs.writeFileSync('/path/to/error.log', {}, msg);
			},
			'commands'{
				'php': {
					// PHPコマンドのパスを表すオブジェクト
					// または、 文字列で '/path/to/php' とすることも可 (この場合、 php.ini のパスは指定されない)
					'bin': '/path/to/php',
					'ini': '/path/to/php.ini'
				}
			}
		},
		function(){
			px2me.gpi(JSON.parse(req.body.data), function(value){
				res
					.status(200)
					.set('Content-Type', 'text/json')
					.send( JSON.stringify(value) )
					.end();
			});
		}
	);

	return;
} );

server.listen(8080);



// Pickles2 preview server
var expressPickles2 = require('express-pickles2');
var appPx2 = express();
appPx2.use( require('body-parser')() );

appPx2.use( '/*', expressPickles2(
	path.resolve('/path/to/.px_execute.php'),
	{
		'processor': function(bin, ext, callback){
			if( ext == 'html' ){
				bin += (function(){
					var scriptSrc = fs.readFileSync('node_modules/pickles2-module-editor/dist/libs/broccoli-html-editor/client/dist/broccoli-preview-contents.js').toString('utf-8');
					var fin = '';
						fin += '<script data-broccoli-receive-message="yes">'+"\n";
						fin += 'window.addEventListener(\'message\',(function() {'+"\n";
						fin += 'return function f(event) {'+"\n";
						fin += 'if(window.location.hostname!=\'127.0.0.1\'){alert(\'Unauthorized access.\');return;}'+"\n";
						fin += 'if(!event.data.scriptUrl){return;}'+"\n";
						fin += scriptSrc+';'+"\n";
						fin += 'window.removeEventListener(\'message\', f, false);'+"\n";
						fin += '}'+"\n";
						fin += '})(),false);'+"\n";
						fin += '</script>'+"\n";
					return fin;
				})();
			}
			callback(bin);
			return;
		}
	}
) );
appPx2.listen(8081);

```

### Client Side

```html
<div id="canvas"></div>

<!-- Pickles 2 Module Editor -->
<link rel="stylesheet" href="/path/to/pickles2-module-editor.css" />
<script src="/path/to/pickles2-module-editor.js"></script>

<script>
var pickles2ModuleEditor = new Pickles2ModuleEditor();
pickles2ModuleEditor.init(
	{
		'elmCanvas': document.getElementById('canvas'), // <- 編集画面を描画するための器となる要素
		'lang': 'en', // language
		'preview':{ // プレビュー用サーバーの情報を設定します。
			'origin': 'http://127.0.0.1:8081'
		},
		'gpiBridge': function(input, callback){
			// GPI(General Purpose Interface) Bridge
			// broccoliは、バックグラウンドで様々なデータ通信を行います。
			// GPIは、これらのデータ通信を行うための汎用的なAPIです。
			$.ajax({
				"url": '/your/api/path',
				"type": 'post',
				'data': {'data':JSON.stringify(input)},
				"success": function(data){
					callback(data);
				}
			});
			return;
		},
		'complete': function(){
			alert('完了しました。');
		},
		'onMessage': function( message ){
			// ユーザーへ知らせるメッセージを表示する
			console.info('message: '+message);
		}
	},
	function(){
		// スタンバイ完了したら呼び出されるコールバックメソッドです。
		console.info('standby!!');
	}
);
</script>
```

## License

MIT License

## for developer

```
$ npm install
```
開発環境をセットアップします。

```
$ npm run submodule-update
```
サブモジュールを更新します。

```
$ npm start
```
アプリケーションをスタートします。

```
$ npm run up
```
サーバーを起動します。(`npm start` と同じ)

```
$ npm run preview
```
ブラウザで開きます。(Macのみ)

```
$ gulp
```
ビルドします。

```
$ gulp watch
```
更新を監視して自動的にビルドします。

```
$ npm run test
```
テストスクリプトを実行します。


## 更新履歴 - Change log

### pickles2-module-editor@0.1.0 (2018年6月22日)

- Initial Release.


## License

MIT License


## Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <http://www.pxt.jp/>
- Twitter: @tomk79 <http://twitter.com/tomk79/>
