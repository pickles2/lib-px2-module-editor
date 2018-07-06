<?php
/**
 * Pickles 2 module editor
 */
namespace pickles2\libs\moduleEditor;

/**
 * Pickles 2 module editor core class
 *
 * @author Tomoya Koyanagi <tomk79@gmail.com>
 */
class main{

	/** Filesystem Utility */
	private $fs;

	/** Langage Bank object */
	private $lb;

	/** Entry Script path */
	private $entryScript;

	/** page path */
	private $page_path;

	/** Initialize Options */
	private $options;

	/** PHP Command Settings */
	private $php_command;

	/** Project Info */
	private $pjInfo;
	private $px2conf;
	private $pageInfo;
	private $documentRoot;
	private $contRoot;
	private $packages;
	private $realpathDataDir;
	private $pathResourceDir;


	/**
	 * Constructor
	 */
	public function __construct(){
	}

	/**
	 * Initialize
	 */
	public function init($options){
		// var_dump($options);
		if(!$options){
			$options = array();
		}
		if(!@$options['appMode']){
			$options['appMode'] = 'web'; // web | desktop
		}
		if(!is_callable(@$options['log'])){
			$options['log'] = function($msg){
				// var_dump($msg);
			};
		}

		$this->fs = new \tomk79\filesystem();
		$this->entryScript = $options['entryScript'];

		// PHP Command setting
		if( !@$options['commands'] ){
			$options['commands'] = array();
		}
		if( !@$options['commands']['php'] ){
			$options['commands']['php'] = array();
		}
		$this->php_command = array(
			'php' => @$options['commands']['php']['bin'],
			'php_ini' => @$options['commands']['php']['ini'],
			'php_extension_dir' => @$options['commands']['php']['php_extension_dir'],
		);
		if( !strlen($this->php_command['php']) ){
			$this->php_command['php'] = 'php';
		}

		$this->options = $options;

		// Language Bank
		$this->lb = new \tomk79\LangBank(__DIR__.'/../data/language.csv');
		$this->lb->setLang('en'); // TODO: 仮実装

		// var_dump($this->options);
		$pjInfo = $this->getProjectInfo();

		// var_dump($pjInfo);
		$this->pjInfo = $pjInfo;
		$this->px2conf = $pjInfo->conf;
		$this->pageInfo = $pjInfo->pageInfo;
		$this->documentRoot = $pjInfo->documentRoot;
		$this->contRoot = $pjInfo->contRoot;
		$this->packages = $pjInfo->packages;
		$this->realpathDataDir = $pjInfo->realpathDataDir;
		$this->pathResourceDir = $pjInfo->pathResourceDir;

		// configを初期化
		$this->px2conf->plugins = $this->px2conf->plugins;
		$this->px2conf->plugins->px2dt = $this->px2conf->plugins->px2dt;
		$this->px2conf->plugins->px2dt->paths_module_template = $this->px2conf->plugins->px2dt->paths_module_template;
		$this->px2conf->plugins->px2dt->path_module_templates_dir = $this->px2conf->plugins->px2dt->path_module_templates_dir;

		return;
	}

	/**
	 * $lb
	 * @return object LangBank Object.
	 */
	public function lb(){
		return $this->lb;
	}

	/**
	 * $px2conf
	 * @return object Pickles 2 Config object.
	 */
	public function get_px2conf(){
		return $this->px2conf;
	}

	/**
	 * プロジェクトの設定情報を取得する
	 */
	public function getProjectConf(){
		$val = $this->px2query($this->page_path.'?PX=api.get.config', array('output'=>'json'));
		return $val;
	}

	/**
	 * アプリケーションの実行モード設定を取得する (同期)
	 * @return string 'web'|'desktop'
	 */
	public function getAppMode(){
		$rtn = $this->options['appMode'];
		switch($rtn){
			case 'web':
			case 'desktop':
				break;
			default:
				$rtn = 'web';
				break;
		}
		return $rtn;
	}

	/**
	 * 編集可能なパスか調べる
	 */
	public function isEditablePath($path){
		// TODO: vendor, node_modules の中にないか確認する。
		if( preg_match('/vendor/', $path) ){
			return false;
		}
		if( preg_match('/node_modules/', $path) ){
			return false;
		}
		return true;
	}

	/**
	 * プロジェクト情報をまとめて取得する
	 */
	public function getProjectInfo(){
		$pjInfo = json_decode('{}');
		$page_info = $this->page_path;
		if(!$page_info){
			$page_info = '/px2me-dummy.html';
		}
		$px2query_options = array(
			"output" => "json",
		);

		$allData = $this->px2query($page_info.'?PX=px2dthelper.get.all', $px2query_options);

		if( @is_object($allData) && @is_object($allData->config) ){
			$pjInfo->conf = $allData->config;
			$pjInfo->pageInfo = $allData->page_info;
			$pjInfo->contRoot = $allData->path_controot;
			$pjInfo->documentRoot = $allData->realpath_docroot;
			$pjInfo->realpathFiles = $allData->realpath_files;
			$pjInfo->pathFiles = $allData->path_files;
			$pjInfo->realpathDataDir = $allData->realpath_data_dir;
			$pjInfo->pathResourceDir = $allData->path_resource_dir;
			$pjInfo->realpath_homedir = $allData->realpath_homedir;
			$pjInfo->packages = $allData->packages;
			return $pjInfo;
		}

		$pjInfo->conf = $this->px2query($page_info.'?PX=api.get.config', $px2query_options);

		$pjInfo->pageInfo = $this->px2query($page_info.'?PX=api.get.page_info', $px2query_options);

		$pjInfo->documentRoot = $this->px2query($page_info.'?PX=api.get.realpath_docroot', $px2query_options);

		$realpathDataDir = $this->px2query($page_info.'?PX=api.get.realpath_files', $px2query_options);
		$realpathDataDir = $this->fs->get_realpath( './guieditor.ignore/', $realpathDataDir );
		$pjInfo->realpathDataDir = $realpathDataDir;

		$pathResourceDir = $this->px2query($page_info.'?PX=api.get.path_files', $px2query_options);

		$pathResourceDir = $this->fs->get_realpath('resources/', $pathResourceDir);
		$pathResourceDir = $this->fs->normalize_path($pathResourceDir);
			// Windows でボリュームラベル "C:" などが含まれるようなパスを渡すと、
			// broccoli-html-editor内 resourceMgr で
			// 「Uncaught RangeError: Maximum call stack size exceeded」が起きて落ちる。
			// ここで渡すのはウェブ側からみえる外部のパスでありサーバー内部パスではないので、
			// ボリュームラベルが付加された値を渡すのは間違い。

		$pjInfo->pathResourceDir = $pathResourceDir;

		return $pjInfo;
	}

	// /**
	//  * create broccoli-html-editor object
	//  */
	// this.createBroccoli = function(options, callback){
	// 	options = options||{};
	// 	callback = callback||function(){};
	// 	this.createPickles2ContentsEditor(function(px2ce){
	// 		px2ce.createBroccoliInitOptions(function(broccoliInitOptions){
	// 			// var_dump(broccoliInitOptions);
	// 			var broccoli = new (require('broccoli-html-editor'))();
	// 			// var_dump(options);
	// 			var parsedModuleId = broccoli.parseModuleId( options.moduleId );
	// 			var previewContentName = options.previewContentName||'default';
	// 			// var_dump(parsedModuleId);
	// 			if( parsedModuleId !== false ){
	// 				broccoliInitOptions.documentRoot = require('path').resolve(broccoliInitOptions.paths_module_template[parsedModuleId.package]+'/'+parsedModuleId.category+'/'+parsedModuleId.module+'/coding-example/')+'/';
	// 				broccoliInitOptions.pathHtml = require('path').resolve('/'+previewContentName+'.html');
	// 				broccoliInitOptions.pathResourceDir = require('path').resolve('/'+previewContentName+'_files/resources/')+'/';
	// 				broccoliInitOptions.realpathDataDir = broccoliInitOptions.documentRoot+previewContentName+'_files/guieditor.ignore/';
	// 			}
	// 			// var_dump(broccoliInitOptions);
	// 			_this.initPreviewContent(options.moduleId, broccoliInitOptions, function(){
	// 				broccoli.init(
	// 					broccoliInitOptions,
	// 					function(){
	// 						// var_dump(broccoli);
	// 						callback(broccoli);
	// 					}
	// 				);
	// 			});
	// 		});
	// 	});
	// 	return;
	// }

	/**
	 * create pickles2-contents-editor object
	 */
	public function createPickles2ContentsEditor(){
		$px2ce = new \pickles2\libs\contentsEditor\main();

		$px2ce->init(
			array(
				'page_path' => '/px2me-dummy.html', // <- 編集対象ページのパス
				'appMode' => $this->getAppMode(), // 'web' or 'desktop'. default to 'web'
				'entryScript' => $this->entryScript,
				'customFields' => array() ,
				'log' => function($msg){},
				'commands' => @$this->options['commands'],
			)
		);

		return $px2ce;
	}

	// /**
	//  * プレビュー用コンテンツを初期化する
	//  */
	// this.initPreviewContent = function(modId, broccoliInitOptions, callback){
	// 	callback = callback||function(){};
	// 	if( !modId ){
	// 		callback();return;
	// 	}
	// 	if( utils79.is_file( broccoliInitOptions.realpathDataDir+'/data.json' ) ){
	// 		callback();return;
	// 	}

	// 	fsx.mkdirpSync( broccoliInitOptions.realpathDataDir );
	// 	fs.writeFileSync( broccoliInitOptions.realpathDataDir+'/data.json', JSON.stringify({
	// 		"bowl": {
	// 		 	"main": {
	// 				"modId": "_sys/root",
	// 				"fields": {
	// 					"main": [
	// 						{
	// 						 	"modId": modId,
	// 						 	"fields": {},
	// 						 	"anchor": "",
	// 						 	"dec": ""
	// 						}
	// 					]
	// 				},
	// 				"anchor": "",
	// 				"dec": ""
	// 			}
	// 		}
	// 	}, null, 1) );

	// 	callback();
	// 	return;
	// }

	/**
	 * 汎用API
	 */
	public function gpi($data){
		$data = json_decode(json_encode($data), true);
		$this->page_path = @$data['page_path'];
		// var_dump($this->page_path);
		$gpi = new gpi( $this );
		$rtn = $gpi->gpi( $data );
		return $rtn;
	}

	/**
	 * ログファイルにメッセージを出力する
	 */
	public function log($msg){
		$this->options['log']($msg);
		return;
	}

	/**
	 * Pickles 2 にリクエストを発行し、結果を受け取る
	 *
	 * @param string $request_path リクエストを発行する対象のパス
	 * @param array $options Pickles 2 へのコマンド発行時のオプション
	 * - output = 期待する出力形式。`json` を指定すると、リクエストに `-o json` オプションが加えられ、JSON形式で解析済みのオブジェクトが返されます。
	 * - user_agent = `HTTP_USER_AGENT` 文字列。 `user_agent` が空白の場合、または文字列 `PicklesCrawler` を含む場合には、パブリッシュツールからのアクセスであるとみなされます。
	 * @param int &$return_var コマンドの終了コードで上書きされます
	 * @return mixed リクエストの実行結果。
	 * 通常は 得られた標準出力をそのまま文字列として返します。
	 * `output` オプションに `json` が指定された場合、 `json_decode()` された値が返却されます。
	 *
	 * リクエストから標準エラー出力を検出した場合、 `$px->error( $stderr )` に転送します。
	 */
	public function px2query($request_path, $options = null, &$return_var = null){
		if(!is_string($request_path)){
			// $this->error('Invalid argument supplied for 1st option $request_path in $px->internal_sub_request(). It required String value.');
			return false;
		}
		if(!strlen($request_path)){ $request_path = '/'; }
		if(is_null($options)){ $options = array(); }
		$php_command = array();
		array_push( $php_command, addslashes($this->php_command['php']) );
			// ↑ Windows でこれを `escapeshellarg()` でエスケープすると、なぜかエラーに。

		if( strlen(@$this->php_command['php_ini']) ){
			$php_command = array_merge(
				$php_command,
				array(
					'-c', escapeshellarg(@$this->php_command['php_ini']),// ← php.ini のパス
				)
			);
		}
		if( strlen(@$this->php_command['php_extension_dir']) ){
			$php_command = array_merge(
				$php_command,
				array(
					'-d', escapeshellarg(@$this->php_command['php_extension_dir']),// ← php.ini definition
				)
			);
		}
		array_push($php_command, escapeshellarg( realpath($this->entryScript) ));
		if( @$options['output'] == 'json' ){
			array_push($php_command, '-o');
			array_push($php_command, 'json');
		}
		if( @strlen($options['user_agent']) ){
			array_push($php_command, '-u');
			array_push($php_command, escapeshellarg($options['user_agent']));
		}
		array_push($php_command, escapeshellarg($request_path));


		$cmd = implode( ' ', $php_command );

		// コマンドを実行
		ob_start();
		$proc = proc_open($cmd, array(
			0 => array('pipe','r'),
			1 => array('pipe','w'),
			2 => array('pipe','w'),
		), $pipes);
		$io = array();
		foreach($pipes as $idx=>$pipe){
			$io[$idx] = stream_get_contents($pipe);
			fclose($pipe);
		}
		$return_var = proc_close($proc);
		ob_get_clean();

		$bin = $io[1]; // stdout
		if( strlen( $io[2] ) ){
			// $this->error($io[2]); // stderr
		}

		if( @$options['output'] == 'json' ){
			$bin = json_decode($bin);
		}

		return $bin;
	}



}
