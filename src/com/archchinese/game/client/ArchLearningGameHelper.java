package com.archchinese.game.client;

import java.util.Random;

import com.google.gwt.core.client.ScriptInjector;
import com.google.gwt.dom.client.BodyElement;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.IFrameElement;
import com.google.gwt.dom.client.StyleElement;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONParser;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Frame;

public class ArchLearningGameHelper {		
	public static void injectCSS() {
		Frame frame = Frame.wrap(DOM.getElementById("archlearninggame"));
		IFrameElement iframe = IFrameElement.as(frame.getElement());		
		Document document = iframe.getContentDocument(); 
		StyleElement se = document.createStyleElement();
        se.setType("text/css");
        //1. Pinyin font
        String pinyinFont = "@font-face {font-family: 'ArchPinyinFont';src: url('../fonts/ArchChinesePinyinFont.eot');src: url('../fonts/ArchChinesePinyinFont.eot') format('embedded-opentype')," +
        		"url('../fonts/ArchChinesePinyinFont.woff2') format('woff2'),url('../fonts/ArchChinesePinyinFont.woff') format('woff'), " +
        		"url('../fonts/ArchChinesePinyinFont.ttf') format('truetype'),url('../fonts/ArchChinesePinyinFont.svg#ArchChinesePinyinFont') format('svg');}" + 
        		"@font-face {font-family: 'ArchEnglishFont';src: url('../fonts/Roboto-Bold.eot');src: url('../fonts/Roboto-Bold.eot?#iefix') format('embedded-opentype'), url('../fonts/Roboto-Bold.otf') format('opentype'), url('../fonts/Roboto-Bold.svg') format('svg'), url('../fonts/Roboto-Bold.ttf') format('truetype'), url('../fonts/Roboto-Bold.woff') format('woff'), url('../fonts/Roboto-Bold.woff2') format('woff2'); font-weight: normal;font-style: normal;}";
        
        //2. Circle button
        String btnCSS1 = ".circle-btn {color: #FFFF00; display: inline-block;text-decoration: none;border: solid 3px #B97A57;border-radius: 1em;margin-top:4px;padding-left: 18px;padding-right: 18px;padding-bottom: 2px;padding-top: 2px;margin-bottom: 4px;-webkit-transition: width 2s, height 2s;transition: width 2s, height 2s;-webkit-transform: scale(1);transform: scale(1);-webkit-transition: .3s ease-in-out;transition: .3s ease-in-out;}";
        String btnCSS2 =".circle-btn:hover {color: #FF00FF;text-decoration: none;-webkit-transform: scale(1.02);-ms-transform: scale(1.02);-moz-transform: scale(1.02);transform: scale(1.02);}";

        String css = pinyinFont + btnCSS1 + btnCSS2;
        
		se.setInnerHTML(css); 
        BodyElement body = document.getBody();
        body.getParentNode().getChild(0).appendChild(se);		
	}
 
	
	public static void displayGame() {//by default, the GWT iframe size is zero
		// the phaser canvas is in the iframe
		int height = Window.getClientHeight();
		int width = Window.getClientWidth();

		Frame frame = Frame.wrap(DOM.getElementById("archlearninggame"));
		frame.setHeight("" + height + "px");
		frame.setWidth("" + width + "px");
		frame.getElement().getStyle().setProperty("position", "relative");
		frame.getElement().getStyle().setProperty("overflow", "hidden");
	}
	
	public static void initGame(final com.archchinese.game.client.Callback gameInjectedCallback) {
		if (!Utils.isProduction()) {//dev environment, use the current project 
			injectGameScript(BuildConfig.getCurrentGameType(), gameInjectedCallback);
			return;
		}
		
		//production env
		final String gameId = Utils.getGameUUID();		
		if (gameId.trim().length() > 0) {
			new GenericGetLoader().load("https://www.archchinese.com/gg20ById?gameid=" + gameId, new Callback(){
				@Override
				public void execute(String data) {
					if(data.trim().length() < 10) {
						//invalid id or the ID is expired because of the user is expired
						Utils.generalDisplay("inf", "<br/><h2>The system cannot find a matched game. Contact your teacher to send you a new game link.</h2>");//info block
						return;
					}
					//gamename~listname~comment~config
					//Jason Class 1 game~{"list": "506337888BC328j7A78AF478C2E7651E72AB","type": "0","backgroundMusic": "1","fontSize": "1","batchSize": "1","textColor": "00FF00","visitedTextColor": "0000FF"}
					String[] fields = data.split("~");
					String gameName = fields[0];
					
					//String listName = fields[1];//not used in game, but it is used in editing a game in ArchChinese when designing a game
					//String comment = fields[2];//not used in game, but it is used in editing a game in ArchChinese when designing a game
					
					String config = fields[3];
					
					JSONValue configValue = JSONParser.parseStrict(config);
					JSONObject json = configValue.isObject();
					
					JSONString gameTypeJson = json.get("type").isString();
					GameConfig.setGameType(gameTypeJson.stringValue());
							
					JSONString listIdJson = json.get("list").isString();
					GameConfig.setListId(listIdJson.stringValue());
					
					GameConfig.setGameId(gameId);
					GameConfig.setGameName(gameName);
					
					JSONString backgroundMusicJson = json.get("backgroundMusic").isString();
					GameConfig.setBackgroundMusic(backgroundMusicJson.stringValue());

					JSONString fontSizeJson = json.get("fontSize").isString();
					GameConfig.setFontSize(fontSizeJson.stringValue());

					JSONString batchSizeJson = json.get("batchSize").isString();
					GameConfig.setBatchSize(batchSizeJson.stringValue());

					JSONString textColorJson = json.get("textColor").isString();
					GameConfig.setTextColor(textColorJson.stringValue());
					
					JSONString visitedTextColorJson = json.get("visitedTextColor").isString();
					GameConfig.setVisitedTextColor(visitedTextColorJson.stringValue());

					JSONString matchedTextColorJson = json.get("matchedTextColor").isString();
					GameConfig.setMatchedTextColor(matchedTextColorJson.stringValue());
					
					JSONString difficultyLevelJson = json.get("difficultyLevel").isString();
					GameConfig.setDifficultyLevel(difficultyLevelJson.stringValue());

					JSONString creatorJson = json.get("creator").isString();
					GameConfig.setCreator(creatorJson.stringValue());

					JSONString imageURLJson = json.get("imageURL").isString();
					GameConfig.setImageURL(imageURLJson.stringValue());

					//new options
					try {
						JSONString matchTypeJson = json.get("matchType").isString();
						GameConfig.setMatchType(matchTypeJson.stringValue());
	
						JSONString wordAudioJson = json.get("wordAudio").isString();
						GameConfig.setWordAudio(wordAudioJson.stringValue());
	
						JSONString textBackgroundColorJson = json.get("textBackgroundColor").isString();
						GameConfig.setGameTextBackgroundColor(textBackgroundColorJson.stringValue());//use setTextBackgroundColor will cause issues!!!!, renamed to setGameTextBackgroundcolor
					}catch(Throwable t) {
						//new entries. Existing config may not have those!!!
					}
					injectGameScript(GameConfig.getGameType(), gameInjectedCallback);					
				}
			});	
		}
	}
	
	private static void injectGameScript(String gameType, 
			final com.archchinese.game.client.Callback gameInjectedCallback) {
				
		String script = BuildConfig.getScriptFile(gameType);
		
		ScriptInjector.fromUrl(script).setCallback(
			   new com.google.gwt.core.client.Callback<Void, Exception>() {
			   public void onFailure(Exception reason) {					   
			   }
			   public void onSuccess(Void result) {
				   gameInjectedCallback.execute("");
			   }
			 }).inject();
	}				

	public static void initEngine() {
		ScriptInjector.fromString(
				EngineResource.INSTANCE.engineScript().getText()).inject();		
	}

	
	public static native void styleGameCanvas()/*-{
		//style the html element, set overflow to hidden, etc, using JQuery		
		$wnd.sec_findElement("archlearninggame", "html").css("overflow",
				"hidden");
		$wnd.sec_findElement("archlearninggame", "body").css("margin", "0px");
	}-*/;
}
