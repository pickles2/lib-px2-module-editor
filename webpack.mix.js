const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
	.webpackConfig({
		module: {
			rules:[
				{
					test: /\.txt$/i,
					use: ['raw-loader'],
				},
				{
					test: /\.csv$/i,
					loader: 'csv-loader',
					options: {
						dynamicTyping: true,
						header: false,
						skipEmptyLines: false,
					},
				},
				{
					test:/\.twig$/,
					use:['twig-loader']
				}
			]
		},
		resolve: {
			fallback: {
				"fs": false,
				"path": false,
				"crypto": false,
				"stream": require.resolve("stream-browserify"),
			}
		}
	})


	// --------------------------------------
	// Pickles 2 Module Editor
	.js('src/pickles2-module-editor.js', 'dist/pickles2-module-editor.js')
	.sass('src/pickles2-module-editor.css.scss', 'dist/pickles2-module-editor.css')
	.copy('src/html/preview.html', 'dist/html/preview.html')
;
