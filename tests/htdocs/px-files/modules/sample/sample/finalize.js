/**
 * finalize.js
 */
module.exports = function(html, callback, supply){

    /* ここに加工するコードを書く。 */

    // 完成したHTMLは、callback() に渡して返します。
    callback('<div>----------</div>' + html + '<div>----------</div>');
    return true;
}