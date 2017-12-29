'use strict';
const Alexa = require('alexa-sdk');
var bodyParser = require('body-parser');
var client = require('cheerio-httpcli');
var util = require('util');

// APP_ID : optionalらしくundefinedでも問題ないっぽい
const APP_ID = undefined;
const HANKYU_URL = 'http://www.hankyu.co.jp/railinfo/';

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  'LaunchRequest': function() {
    const speechOutput = 'こんにちは！電車の運行情報をお知らせします。やめる時は終了と言ってください。';
    this.emit(':ask', speechOutput);
    },
  'TrainStatusIntent': function () {
    console.log('[REQUEST]', util.inspect(this.event.request,false,null));

    var train = this.event.request.intent.slots.Train;
    var speechOutput = train.value + 'の運行情報を取得できませんでした。';
    // SlotにSynonymが設定されているかをチェックして鉄道会社ごとにサイトをチェックする
    
    if ('resolutions' in train) {
      if (train.resolutions["resolutionsPerAuthority"][0]["status"]["code"] == 'ER_SUCCESS_MATCH') {
        var slotId = train.resolutions["resolutionsPerAuthority"][0]["values"][0]["value"]["id"];
        
        if ( slotId==='HANKYU' ) {//#railinfo_02 > div:nth-child(2) > div > p
          var result = client.fetchSync(HANKYU_URL);
          speechOutput = result.$('.all_route > p', '#railinfo').text();
          if (speechOutput === '') {
            //遅れがある時だけ以下が取得できる
            speechOutput = result.$('#railinfo_02 > div:nth-child(2) > div > p').text();
          }
        } else if ( slotId==='HANSHIN' ) {
          // todo 阪神の処理を書く
        }
      }
    }

    console.log(speechOutput);
    this.emit(':tell', speechOutput);
  },
  'AMAZON.HelpIntent': function () {
      const speechOutput = '電車の運行情報をお知らせします。やめる時は終了と言ってください。';
      this.emit(':ask', speechOutput);
  },
  'AMAZON.CancelIntent': function () {
      this.emit(':tell', '必要な時はまた呼び出してください。');
  },
  'AMAZON.StopIntent': function () {
      this.emit(':tell', '必要な時はまた呼び出してください。');
  }
};
