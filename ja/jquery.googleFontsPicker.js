/*
 * jQuery.googleFontsPicker - A composite font picker for the Google Web Fonts api
 * 
 * Copyright (c) 2019 Hirohide Honda, hhonda@mamelogi.com
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 *
 * @version 0.1
*/
const webFontsHome = "https://www.googleapis.com/webfonts/v1/webfonts";		// Web Google Fonts一覧用
const webFontLink  = "https://fonts.googleapis.com/css?family=";		// Web Google Fonts link用
const apiKey = 'xxx';								// Web Google Fonts API-KEY

const exceptionFamily = ['Open Sans Condensed','---'];				// 除外するGoogle Fonts ファミリー名
const D = true;

function doubleGoogleFontsPicker(left,top,defaultFamilyFont,opt){
	let jsonObj;							// Json Object
	let defaultPrimaryFont, defaultSecondaryFont 			// キャンセル時に戻すフォント初期設定
	let familyFont;							// ファミリーフォント設定文字列
	// promiseオブジェクトを返却
	return new Promise(function(resolve, reject){
		if(apiKey === 'xxx'){
			if(D) console.log("you need api-key");
			reject("api-key");
			return false;
		}
		if(D) console.log("double Google Fonts Picker has started.");
		// Web Google Fontsから、リストを取得する
		$.ajax({
			type: 'GET',
			url: webFontsHome + "?key=" + apiKey + "&sort=" + opt.sort,
			success: function(obj){
				jsonObj = obj;
				if(D) console.log("Google Fontsファミリー数= " + (jsonObj.items).length);

				// 設定済みのフォントファミリーがあれば、取得しキャンセルに備える
				let array = defaultFamilyFont.replace(/\"/g,'').split(/\s*,\s*/);
				defaultPrimaryFont = array[0];
				defaultSecondaryFont = (array.length==2)? array[1]: array[0];
				// select要素内のoption要素の初期値に設定済フォントを投入
				familyFont = defaultFamilyFont;		// 何もせず、「設定釦」が押された場合の対策
				if(D) console.log("defaultPrime=" + defaultPrimaryFont + 
						",defaultSeond=" + defaultSecondaryFont);
				// select要素内のoption要素の構築
				let category = $(opt.selector.category.replace(':radio',':checked')).val();
				console.log("default category: " + category);
				buildSelectOptions(opt,jsonObj,category,defaultPrimaryFont,defaultSecondaryFont);
				// Popup用div要素なら、表示位置を設定して表示状態に切り替える
				$(opt.selector.dialog).css("left",left);
				$(opt.selector.dialog).css("top",top);
				$(opt.selector.dialog).show();
			}
		});


		// キャンセル釦イベントの場合、フォント設定を元に戻し、Popup用divならば隠す
		$(document).on('click',opt.selector.cancel,function(e){
			if(D) console.log('canceldetect!');
			// 多重イベント回避し、ダイアログオフ
			$(document).off('click',opt.selector.cancel);
			$(opt.selector.dialog).hide();
			// フォント選択用のリンクとオプションを削除
			removeSelectOptions();
			// 呼び出し前のフォントに戻す
			$(opt.selector.preview).css('font-family',defaultFamilyFont);
			// promiseオブジェクトをrejectで返却
			reject("cancel");
		});

		// 設定釦イベントの場合
		$(document).on('click',opt.selector.submit,function(e){
			if(D) console.log('submit detect!');
			// 多重イベント回避し、ダイアログをオフ
			$(document).off('click',opt.selector.submit);
			$(opt.selector.dialog).hide();
			// 確定したフォントファミリーのみのリンクを設定
			insertFixedFamilyFonts(familyFont,jsonObj);
			// フォント選択用のリンクとオプションを削除
			removeSelectOptions();
			// promiseオブジェクトをresolveで返却
			resolve(familyFont);
		});

		// 一次言語の選択イベントの場合
		$(document).on('change',opt.selector.primaryFont + ',' + opt.selector.secondaryFont,function(e){
			// 言語の設定状態を調べる
			let primaryFontVal   = $(opt.selector.primaryFont).val();
			let primaryInValid = (primaryFontVal == null || primaryFontVal === "none");
			let secondaryFontVal = $(opt.selector.secondaryFont).val();
			let secondaryInValid = (secondaryFontVal == null || secondaryFontVal === "none");
			if(primaryInValid && secondaryInValid){
				familyFont = defaultFamilyFont;
			} else if(secondaryInValid){
				// 第二言語が無効ならば、第一言語のみのフォントファイル名を取得
				let primaryFont   = $("option:selected",opt.selector.primaryFont).text();
				familyFont = '"' + primaryFont + '","' + defaultSecondaryFont + '"';
			} else if(primaryInValid){
				// 第一言語が無効ならば、第二言語のみのフォントファイル名を取得
				let secondaryFont = $("option:selected",opt.selector.secondaryFont).text();
				if(defaultPrimaryFont === defaultSecondaryFont)
					// デフォルトが第一言語のみの場合は、デフォルトフォントは使用しない
					familyFont = '"'  + secondaryFont + '"';
				else
					// 以外は、デフォルトの第一言語に指定の第二言語を組み合わせる
					familyFont = '"' + defaultPrimaryFont +  '","'  + secondaryFont + '"';
			} else {
				// その他は、両言語をカンマで結合しフォントファイル名として組立
				let primaryFont   = $("option:selected",opt.selector.primaryFont).text();
				let secondaryFont = $("option:selected",opt.selector.secondaryFont).text();
				familyFont = '"' + primaryFont + '","' + secondaryFont + '"';
			}
			// プレビューのフォント設定
			$(opt.selector.preview).css('font-family', familyFont);
			if(D) console.log("font family after: " + $(opt.selector.preview).css('font-family'));

		});

		// カテゴリー選択イベントの場合
		$(document).on('change',opt.selector.category, function() {
			let category = $(this).val();
			if(D) console.log("radioval= " + category);
			// 再構築のために、挿入したlink要素とoption要素を削除
			removeSelectOptions();
			// select要素内のoption要素の構築
			buildSelectOptions(opt,jsonObj,category,defaultPrimaryFont,defaultSecondaryFont);
		});
	});
}

function buildSelectOptions(opt,jsonObj,cat,defaultPrimaryFont,defaultSecondaryFont){
	// リスト登録数を取得
	if(D) console.log("buildSelectOptions: cat=" + cat + ",prime=" + defaultPrimaryFont + ",second=" + defaultSecondaryFont);
	let length = (jsonObj.items).length;
	// 登録アイテムから、第一、第二言語選択用のlink要素と、select要素の子要素option作成し追加する
	let primaryLangCnt = 0, secondaryLangCnt = 0;
	let primaryMaxmum  = (opt.primaryFont   == undefined || opt.primaryFont.maxmum == null)?   10000: opt.primaryFont.maxmum;
	let secondaryMaxmum =(opt.secondaryFont == undefined || opt.secondaryFont.maxmum == null)? 10000: opt.secondaryFont.maxmum;

	if(D) console.log("primaryMaxmum=" + primaryMaxmum + ",secondaryMaxmum=" + secondaryMaxmum);
	for(let i=0; i< length; i++){
		let family   = jsonObj.items[i].family;
		let subsets  = jsonObj.items[i].subsets;
		let category = jsonObj.items[i].category;
		// 除外フォントでなれれば、以下でlink要素とoption要素を挿入
		if( exceptionFamily.indexOf(family) < 0){
			let linkStr = "<link class='link4DGFP' href='" + webFontLink + family.replace(/ /g, '+') + "' rel='stylesheet'/>";
			// 一次フォント用サブセット(二次フォントサブセットを除く)で、最大数を超えていない場合。
			if(opt.primaryFont != undefined &&subsets.indexOf(opt.primaryFont.subsets) >=0 && 
			   (opt.secondaryFont == undefined || subsets.indexOf(opt.secondaryFont.subsets) < 0) &&
			   (cat === 'all' || cat === category) &&
			   primaryLangCnt < primaryMaxmum){
				$("head").append(linkStr);
				let selected = (family === defaultPrimaryFont)? ' selected': '';
				let option = "<option class='font4DGFP' value='" + i + "' style=\"font-family:'" + family + "'\"" + selected + ">" + family + "</option>";
				$(opt.selector.primaryFont).append(option);
				primaryLangCnt++;
			// 二次フォント用サブセットで、最大数を超えていない場合
			} else if(opt.secondaryFont != undefined && subsets.indexOf(opt.secondaryFont.subsets) >= 0 &&
				  (cat === 'all' || cat === category) &&
				  secondaryLangCnt < secondaryMaxmum){
				$("head").append(linkStr);
				let selected = (family === defaultSecondaryFont)? ' selected': '';
				let option = "<option class='font4DGFP' value='" + i + "' style=\"font-family:'" + family + "'\"" + selected + ">" + family + "</option>";
				$(opt.selector.secondaryFont).append(option);
				secondaryLangCnt++;
			}
		}
	}
	if(D) console.log ('primary=', primaryLangCnt, ',secondary=', secondaryLangCnt);
}

function removeSelectOptions(){
	// head要素内のリンク要素を削除
	$('link.link4DGFP').remove();
	// select要素内のoption要素を削除
	$('option.font4DGFP').remove();
}

function insertFixedFamilyFonts(familyFonts,jsonObj){
	if(familyFonts == undefined)	return;
	let family = familyFonts.replace(/\"/g,'').replace(/\s*,\s*/,'|');
	let href   = webFontLink + family.replace(/ /g, '+') ;
	let href2;
	let linkStr = "<link class='linked4DGFP' href='" + href + "' rel='stylesheet'/>";
	let length = (jsonObj.items).length;
	let familyArray = family.split('|');

	if(D)console.log("insert font: " + familyFonts + ",family[0]=" + familyArray[0] + ",length=" + length);

	// link要素に追加する対象のフォントが、google fonts内にあるか調べる
	// 初回のフォントが、ローカルマシンフォントの場合は、link要素が不要な為の処置
	for(let i=0; i<length; i++){
		let googlfontfamily   = jsonObj.items[i].family;
//		if(D) console.log("googlefontfamily: " + googlfontfamily + ",familyArray[0]: " + familyArray[0]);
		if(googlfontfamily === familyArray[0]){
			// google fonts内にあれば、既にlink要素にあればスキップ
			let find = false;
			$('link.linked4DGFP').each(function(i,elem){
				href2 = $(elem).attr('href');	//型が異なる? 一旦コピー後比較
				if(href === href2){
					if(D) console.log("already exist");
					find = true;
					return false;
				}
			});
			if(find == false){
				$("head").append(linkStr);
				if(D) console.log("insert fixed family font link: " + linkStr);
			}
			break;
		}
	}
}