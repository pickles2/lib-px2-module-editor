# pickles2/lib-px2-module-editor

Pickles 2 のモジュール編集インターフェイスを提供します。

## Usage

### Server Side (PHP)

```php
<?php
/**
 * api.php
 */
require_once('vendor/autoload.php');
$px2ｍe = new pickles2\libs\moduleEditor\main( $px );
$px2ｍe->init(array(
	'appMode' => 'web', // 'web' or 'desktop'. default to 'web'
	'entryScript' => '/path/to/.px_execute.php',
	'log' => function($msg){
		// エラー発生時にコールされます。
		// $msg を受け取り、適切なファイルへ出力するように実装してください。
		error_log($msg, 3, '/path/to/error.log');
	},
	'commands'{
		'php': {
			// PHPコマンドのパスを表すオブジェクト
			// または、 文字列で '/path/to/php' とすることも可 (この場合、 php.ini のパスは指定されない)
			'bin': '/path/to/php',
			'ini': '/path/to/php.ini'
		}
	}
));
$value = $px2ｍe->gpi( json_decode( $_REQUEST['data'] ) );
header('Content-type: text/json');
echo json_encode($value);
exit;
```

### Client Side

```php
<div id="canvas"></div>

<!--
エディタが利用する CSS や JavaScript などのリソースファイルがあります。
`$px2ce->get_client_resources()` からリソースの一覧を取得し、読み込んでください。
-->

<?php
require_once('vendor/autoload.php');

$px2me = new pickles2\libs\moduleEditor\main( $px );
$px2me->init( /* any options */ );

$resources = $px2me->get_client_resources();
foreach($resources->css as $css_file){
	echo('<link rel="stylesheet" href="'.htmlspecialchars($css_file).'" />');
}
foreach($resources->js as $js_file){
	echo('<script src="'.htmlspecialchars($js_file).'"></script>');
}
?>

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


## 更新履歴 - Change log

### pickles2/lib-px2-module-editor v0.4.1 (2024年2月18日)

- 新規パッケージ作成のUI改善。

### pickles2/lib-px2-module-editor v0.4.0 (2023年8月29日)

- NodeJS版の提供を廃止した。
- 依存パッケージを更新した。

### pickles2/lib-px2-module-editor v0.3.3 (2023年2月11日)

- モジュールの `info.json` に `id` が明示されている場合に、一覧画面で表示されない問題を修正した。
- クリップモジュールには モジュールID を表示しないようにした。
- 細かいUI改善、内部コード改善など。

### pickles2/lib-px2-module-editor v0.3.2 (2022年11月3日)

- 細かいUI改善、内部コード改善など。

### pickles2/lib-px2-module-editor v0.3.1 (2022年6月5日)

- `$conf->plugins` 設定が正しく読み込まれない問題を修正。

### pickles2/lib-px2-module-editor v0.3.0 (2022年1月8日)

- サポートするPHPのバージョンを `>=7.3.0` に変更。
- PHP 8.1 に対応した。

### pickles2/lib-px2-module-editor v0.2.10 (2022年1月4日)

- Pickles 2 Contents Editor の初期化に関する不具合を修正。
- パフォーマンスに関する改善。

### pickles2/lib-px2-module-editor v0.2.9 (2021年7月10日)

- Broccoliの必須オプションが渡らない場合がある問題を修正。

### pickles2/lib-px2-module-editor v0.2.8 (2021年2月21日)

- Firefox で初期化が完了できない問題に対する修正。
- 依存ライブラリを更新。

### pickles2/lib-px2-module-editor v0.2.7 (2020年8月12日)

- 細かいUIの改善と不具合の修正。

### pickles2/lib-px2-module-editor v0.2.6 (2020年1月14日)

- 依存ライブラリを更新。

### pickles2/lib-px2-module-editor v0.2.5 (2020年1月2日)

- PHP 7.4 に対応した。
- 内部コードの更新。

### pickles2/lib-px2-module-editor v0.2.4 (2019年8月12日)

- 内部のライブラリ構成を調整した。

### pickles2/lib-px2-module-editor v0.2.3 (2019年6月15日)

- `broccoli.json` の `id` 属性に対応。
- その他いくつかのUI改善。

### pickles2/lib-px2-module-editor v0.2.2 (2018年8月20日)

- PHP版で、プラグインからモジュールパッケージをインポートできない不具合を修正。

### pickles2/lib-px2-module-editor v0.2.1 (2018年7月27日)

- PHP版で、`finalize.php` を編集できるようになった。
- PHP版で、カスタムフィールドが読み込まれない問題を修正した。
- `$px2me->get_client_resources()` を追加。
- その他いくつかの不具合を修正。

### pickles2-module-editor, pickles2/lib-px2-module-editor v0.2.0 (2018年7月11日)

- バックエンドスクリプトをPHPに移行した。 (NodeJS の実装は、しばらく残したのち、削除される予定)

### pickles2-module-editor v0.1.0 (2018年6月22日)

- Initial Release.


## License

MIT License


## Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <https://www.pxt.jp/>
- Twitter: @tomk79 <https://twitter.com/tomk79/>
