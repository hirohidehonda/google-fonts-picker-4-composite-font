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
const webFontsHome = "https://www.googleapis.com/webfonts/v1/webfonts";		// Web Google Fonts Home
const webFontLink  = "https://fonts.googleapis.com/css?family=";		// Web Google Fonts link page
const apiKey = 'xxx';								// Web Google Fonts API-KEY

const exceptionFamily = ['Open Sans Condensed','---'];				// exclude Google Fonts Family names
const D = true;

function doubleGoogleFontsPicker(left,top,defaultFamilyFont,opt){
	let jsonObj;							// Json Object storing the response data from the WebFontsHome
	let defaultPrimaryFont, defaultSecondaryFont 			// Font default settings to be restored when canceling
	let familyFont;							// 
	// return promise object
	return new Promise(function(resolve, reject){
		if(apiKey === 'xxx'){
			if(D) console.log("you need api-key");
			reject("api-key");
			return false;
		}
		if(D) console.log("double Google Fonts Picker has started.");
		// Retrieve the list from the Web Google Fonts Home.
		$.ajax({
			type: 'GET',
			url: webFontsHome + "?key=" + apiKey + "&sort=" + opt.sort,
			success: function(obj){
				jsonObj = obj;
				if(D) console.log("Google Fonts Family list count= " + (jsonObj.items).length);

				// If there is a set font family, get it and prepare for cancellation
				let array = defaultFamilyFont.replace(/\"/g,'').split(/\s*,\s*/);
				defaultPrimaryFont = array[0];
				defaultSecondaryFont = (array.length==2)? array[1]: array[0];
				// Insert the set font to the initial value of the option element in the select element
				familyFont = defaultFamilyFont;		// Preparations when the “Setting button”is pressed without doing anything
				if(D) console.log("defaultPrime=" + defaultPrimaryFont + 
						",defaultSeond=" + defaultSecondaryFont);
				// Construction of option element in select element
				let category = $(opt.selector.category.replace(':radio',':checked')).val();
				console.log("default category: " + category);
				buildSelectOptions(opt,jsonObj,category,defaultPrimaryFont,defaultSecondaryFont);
				// If it is a block element for Popup, set the display position and switch to the display state
				$(opt.selector.dialog).css("left",left);
				$(opt.selector.dialog).css("top",top);
				$(opt.selector.dialog).show();
			}
		});


		// In the case of a cancel button event, restore the font setting and hide the popup dialog
		$(document).on('click',opt.selector.cancel,function(e){
			if(D) console.log('canceldetect!');
			// off the dialog related event.
			$(document).off('click',opt.selector.cancel);
			$(opt.selector.dialog).hide();
			// Remove font selection links and options
			removeSelectOptions();
			// Restore to the font before calling
			$(opt.selector.preview).css('font-family',defaultFamilyFont);
			// Return promise object with reject
			reject("cancel");
		});

		// For set button events
		$(document).on('click',opt.selector.submit,function(e){
			if(D) console.log('submit detect!');
			// off the dialog related event.
			$(document).off('click',opt.selector.submit);
			$(opt.selector.dialog).hide();
			// Set links only for confirmed font families
			insertFixedFamilyFonts(familyFont,jsonObj);
			// Remove font selection links and options
			removeSelectOptions();
			// Return promise object with resolve
			resolve(familyFont);
		});

		// For primary language selection events
		$(document).on('change',opt.selector.primaryFont + ',' + opt.selector.secondaryFont,function(e){
			// Check the language settings
			let primaryFontVal   = $(opt.selector.primaryFont).val();
			let primaryInValid = (primaryFontVal == null || primaryFontVal === "none");
			let secondaryFontVal = $(opt.selector.secondaryFont).val();
			let secondaryInValid = (secondaryFontVal == null || secondaryFontVal === "none");
			if(primaryInValid && secondaryInValid){
				familyFont = defaultFamilyFont;
			} else if(secondaryInValid){
				// If the second language is invalid, get the font file name for the first language only
				let primaryFont   = $("option:selected",opt.selector.primaryFont).text();
				familyFont = '"' + primaryFont + '","' + defaultSecondaryFont + '"';
			} else if(primaryInValid){
				// If primary language is invalid, get font file name for secondary language only
				let secondaryFont = $("option:selected",opt.selector.secondaryFont).text();
				if(defaultPrimaryFont === defaultSecondaryFont)
					// If the default is only the primary language, do not use the default font
					familyFont = '"'  + secondaryFont + '"';
				else
					// Otherwise, combine the default secondary language with the specified secondary language
					familyFont = '"' + defaultPrimaryFont +  '","'  + secondaryFont + '"';
			} else {
				// For others, combine both languages with commas and assemble them as font file names.
				let primaryFont   = $("option:selected",opt.selector.primaryFont).text();
				let secondaryFont = $("option:selected",opt.selector.secondaryFont).text();
				familyFont = '"' + primaryFont + '","' + secondaryFont + '"';
			}
			// Preview font settings
			$(opt.selector.preview).css('font-family', familyFont);
			if(D) console.log("font family after: " + $(opt.selector.preview).css('font-family'));

		});

		// For category selection events
		$(document).on('change',opt.selector.category, function() {
			let category = $(this).val();
			if(D) console.log("radioval= " + category);
			// Delete inserted link and option elements for reconstruction
			removeSelectOptions();
			// insert option elements in select element
			buildSelectOptions(opt,jsonObj,category,defaultPrimaryFont,defaultSecondaryFont);
		});
	});
}

function buildSelectOptions(opt,jsonObj,cat,defaultPrimaryFont,defaultSecondaryFont){
	// Get list registration count
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
		// If it is not excluded fonts, insert link element and option element below
		if( exceptionFamily.indexOf(family) < 0){
			let linkStr = "<link class='link4DGFP' href='" + webFontLink + family.replace(/ /g, '+') + "' rel='stylesheet'/>";
			// The primary font subset (excluding the secondary font subset) does not exceed the maximum number。
			if(opt.primaryFont != undefined &&subsets.indexOf(opt.primaryFont.subsets) >=0 && 
			   (opt.secondaryFont == undefined || subsets.indexOf(opt.secondaryFont.subsets) < 0) &&
			   (cat === 'all' || cat === category) &&
			   primaryLangCnt < primaryMaxmum){
				$("head").append(linkStr);
				let selected = (family === defaultPrimaryFont)? ' selected': '';
				let option = "<option class='font4DGFP' value='" + i + "' style=\"font-family:'" + family + "'\"" + selected + ">" + family + "</option>";
				$(opt.selector.primaryFont).append(option);
				primaryLangCnt++;
			// A secondary font subset that does not exceed the maximum number
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
	// Delete link elements in the head element
	$('link.link4DGFP').remove();
	// Delete option elements in select element
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

	// Check if the target font to be added to the link element is in google fonts
	// If the first font is a local machine font, handle for not requiring the link element
	for(let i=0; i<length; i++){
		let googlfontfamily   = jsonObj.items[i].family;
//		if(D) console.log("googlefontfamily: " + googlfontfamily + ",familyArray[0]: " + familyArray[0]);
		if(googlfontfamily === familyArray[0]){
			// skip if already in link element
			let find = false;
			$('link.linked4DGFP').each(function(i,elem){
				href2 = $(elem).attr('href');
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