# Google Web Fonts APIによる複合フォントピッカー
* * *
## 概要

　このパッケージは、Google Web Fontsサーバーで使用可能なフォントを動的に利用するWebフォントピッカーです。
[Google Fonts 参照](https://developers.google.com/fonts/)
　Webフォントを使用すると、クライアントの端末環境に依存することなく、Webデザイナーが指定したフォントを表示できます。

対象の利用者:
- Webフォントを使用したjQuery開発者
- 複合フォント機能を必要とする非ラテン系言語アプリケーションを担当
- Google Web Fontsサーバーで利用可能な最新のフォントリスト取得が必要
- フォントを選択するために簡単にカスタマイズできるポップアップダイアログの利用を希望
- 必要に応じて、ダイアログを単一のフォントピッカーとしても使用したい

## 解説
Google Fontsは、Webデザイナーが洗練され均一なWebテキストストリームを維持できるようにする無料のWebフォントです。 非ラテン系Webアプリケーションは、複数のフォントを使用してその高品質のルックアンドフィールを実現することが可能です。 主要なラテン系フォントファミリと、日本語などのセカンダリな特定の非ラテン系フォントファミリを組み合わせることで、読者にとってより魅力的な記事を提供することができます。
幸いなことに、cssのfont-familyを利用すると、次のように複数のフォントファミリを割り当てて、コード範囲を順番にマッピングできます:

    $(selector).css('font-family', 'Primary-font, Secondary-font');

このプラグインは、Google Fonts Apiが提供する動的フォントリストからプライマリフォントファミリとセカンダリフォントファミリを選択することをサポートしています。

## デモ
[操作動画](./demo/movie.ja.mp4), [デモページ](./index.ja.html)

注意：デモページを使用する場合は、事前にAPi-Keyを入手する必要があります。 「要件」を参照してください。
## 類似パッケージとの違い
このプラグインには、他の同様のプラグインと比較して次の特徴があります。
* フォントリストを動的に作成します。 そのため、いつでも最新のフォントファミリを入手できます。
* 設定/キャンセル後に不要なフォントファミリー候補リンク要素を削除し、必要最小限なリンク要素のみ挿入しますのでコンパクトです。
* サブセット、ソート、カテゴリなどのGoogleフォントAPIパラメータを用意しています。 これにより、適切なフォントファミリをすばやく見つけることができます。

## 要件
1. [Webサイト](https://developers.google.com/fonts/docs/developer_api)からGoogle Fonts Apiキーを取得する必要があります。 その後、「jquery.googleFontsPicker.js」の次の行を書き換える必要があります。

        line 10: const apiKey = 'xxx';
    
    「xxx」を取得したAPiキー文字列に置き換えます。 たとえば、キー「 'AAABBBCCCDDDEEEFFF'」を取得した場合、以下のように変更する必要があります。

        line 10: const apiKey = 'AAABBBCCCDDDEEEFFF';
2. Promise機能をサポートするWebブラウザー。
以下のブラウザで動作を確認しています。
 * Google Chrome, Version: 76.0.3809.132
 * FireFox, Version: 68.0.2
 * Opera, Version: 63.0.3368.66



## 利用方法
以下のPromise型関数を呼び出します。

    doubleGoogleFontsPicker(
        left-position-4-popUp,　　　　　　　　　　//ダイアログ表示のx座標
        top-posiitono-4-popUp,                 //ダイアログ表示のy座標
        default-Font-Family,　　　　　　　　　　　 //ダイアログ呼出し前のフォント設定
        options
    ).then(function(selectedFontFamilyString){ // Promise resolve呼出し時の戻り
      // 選択したフォントファミリ文字列が利用可能です。 任意の場所に設定できます
      // 例)  $(selector).css('font-family',selectedFontFamilyStrig);
    },function(abortMessage){ // Promise reject 呼出し時の戻り
      // 「api-key」は、Google Fonts APIキーが必要であることを示します。
      // 「キャンセル」は、キャンセル釦が押されたことを示します。
    }).catch(function(error))
      // その他のエラー.
    }

Options は単一のJsonオブジェクトで以下を指定します。

    {
      sort: ソート用APパラメータ,               // 例) 'popularity'
      primaryFont:{
        subsets: 言語系指定用APIパラメータ,   　 // 例) 'Latin'
        maxmum: リスト件数最大数, 　　　　　　　　// 省略時は制限なし。
      }
      secondaryFont:{
        subsets: 言語系指定用APIパラメータ,   　 // 例) 'Japanese'
        maxmum: リスト件数最大数,　　　　　　　　 // 省略時は制限なし。
      }
      selector:{
        dialog: ダイアログ用ブロック要素のセレクター,
        primaryFont: プライマリフォント用select要素のセレクター,
        secondaryFont: セカンダリーフォント用select要素のセレクター,
        preview: プレビュー用ブロック要素のセレクター,
        category: カテゴリ指定用ラジオタイプのinput要素セレクター,
        cancle: キャンセル釦要素のセレクター,
        submit: 設定釦要素のセレクター
      }
    }

「sort」や「subsets」などのGoogle Fonts Apiパラメーターの詳細情報を取得するには、Google Fonts Apiの[ドキュメント](https://developers.google.com/fonts/docs/developer_api)を参照してください。
また、実際のサンプルindex.htmlコードで確認できます。

## インストール
1. このgithubリポジトリをローカルの任意フォルダーにコピーします。
2. API-Keyを特定の行に設定します。 上記「要件」を参照方。
3. 英語ユーザーの場合は「./index.html」、日本語ユーザーの場合は「./ja/index.jp.html」をブラウズします。

## ライセンス
* MIT
  * LICENSE.txt参照方。

## シングルフォントピッカーの利用例
単一のフォントを設定するための3つの例があります。
* プライマリとしての単一フォント設定 - [サンプル](./examples/index4PrimarySingle.ja.html)  
* ブラウザーのデフォルトフォントを使用したセカンダリとしての単一フォント設定 -  [サンプル](./examples/index4SecondarySingle.ja.html)  
* 定義済みの複合フォントを使用したセカンダリとしての単一フォント設定 - [サンプル](./examples/index4SecondaryComposite.ja.html)
