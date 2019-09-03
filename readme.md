# A composite font picker for the Google Web Fonts api
* * *
## Overview

This is a dynamic Web font picker from fonts available on the Google Web Fonts server.
[See the Google Fonts](https://developers.google.com/fonts/).
By using Web fonts, the fonts specified by the Web designer can be displayed without depending on the client's terminal environment.

The target user is:
- jQuery developer by using Web Font feature
- focus on the non-Latin language application which needs a composite font feature
- need the latest font list available on the Google Web Fonts server
- use a popup dialog which easily be customized to select fonts.
- utilize the dialog as a single font picker if you want.

## Description
The Google Fonts is the free web fonts which assures the Web designer to maintain the sophisticated and uniform web text stream. Sometimes, the Non-Latin Web application hopes to use a composite fonts to achieve that high quality look & feel. The combination of the vast variety of Latin font families as primary and certain non-Latin font families as secondary, such as Japanese, makes the article more attractive to readers.
Fortunately, using css font-family, you can assign multiple font families and map code ranges in order:

    $(selector).css('font-family', 'Primary-font, Secondary-font');

This plug-in supports to select the primary font family and secondary one from the dynamic font list offered by the Google Fonts Api.

## Demo
[movie](./demo/movie.en.mp4), [demo page](./index.html)  

Caution: If you use the demo page, you should get the APi-Key in advance. See the requirement.
## VS.
This plug-in has the following features compared to other similar plug-ins.
* build the font list up dynamically. So, you can get the latest fonts family whenever you want.
* The minimum required link elements thanks to the removing unnecessary candidate font family link elements after setting/canceling.
* you can select the Google fonts Api parameters such as subsets, sort and category. It allows you to find the preferable font family quickly.

## Requirement
1. You need to get the Google Fonts Api key from [the Web site](https://developers.google.com/fonts/docs/developer_api). After that, you should rewrite the following line in 'jquery.googleFontsPicker.js'.

        line 10: const apiKey = 'xxx';

 Replace the 'xxx' to your own APi key string. For example, if you get the key 'AAABBBCCCDDDEEEFFF', it should be changed like below.

        line 10: const apiKey = 'AAABBBCCCDDDEEEFFF';
2. Web browser which supports Promise feature.  
I have confirmed the operation with the following browsers.
 * Google Chrome, Version: 76.0.3809.132
 * FireFox, Version: 68.0.2
 * Opera, Version: 63.0.3368.66



## Usage

Call this Promise function.

        doubleGoogleFontsPicker(
            left-position-4-popUp,
            top-posiitono-4-popUp,
            default-Font-Family,
            options
        ).then(function(selectedFontFamilyString){ // Promise resolve
          // The selected font-family string is available. 
          // You can set that to any place like,
          // $(selector).css('font-family',selectedFontFamilyStrig);
        },function(abortMessage){ // Promise reject
          // "api-key" means you need your API-Key for Google Fonts API.
          // "cancel" means you pushed the cancel button.
        }).catch(function(error))
          // some error has been occured.
        }

Options is one Json object:

        {
          sort: $sort-parameter-4-api,           // For example, 'popularity'
          primaryFont:{
            subsets: $subsets-parameter-4-api,   // For example, 'Latin'
            maxmum: $number-of-maxmum-list-line, // There is no limit when omitted.
          }
          secondaryFont:{
            subsets: $subsets-parameter-4-api,   // For example, 'Japanese'
            maxmum: $number-of-maxmum-list-line, // There is no limit when omitted.
          }
          selector:{
            dialog: $dialog-block-element-selector,
            primaryFont: $select-element-selector-4-primaryFont,
            secondaryFont: $select-element-selector-4-secondaryFont,
            preview: $preview-block-element-selector,
            category: $radio-type-input-name-selector,
            cancle: $cancel-button-selector,
            submit: $submit-button-selector
          }
        }

See the Google Fonts Api documentation for getting the detail information of the Google Fonts Api parameter such as 'sort' and 'subsets'.
You may want to look into the index.html codes for that actual sample.

## Installation
1. copy this github repository to your local any folder.
2. set API-Key to the specific line. See above ('Requirement').
3. browse 'index.html' for English user or 'index.jp.html' for Japanese.

## License
* MIT
  * see LICENSE

## Examples for single font picker
There are three examples for setting a single font.
* Single font setting as primary - [html page](./examples/index4PrimarySingle.html)
* Single font setting as secondary with the browser default font - [html page](./examples/index4SecondarySingle.html)
* Single font setting as secondary with a predefined composite fonts - [html page](./examples/index4SecondaryComposite.html)
