package com.archchinese.game.client;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.user.client.Window;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class ArchLearningGame implements EntryPoint {
	private DataService dataService = new DataService();	
	private static int sequenceNumber = 0;// global unique id generator
	
	//query string ids
	//game id
	
	public void onModuleLoad() {
		Utils.forceToHttps();
	
		initJS();
		
		//check if we have a valid game id
		if (Utils.isProduction()) {
			final String gameId = Utils.getGameUUID();
			if (gameId.trim().length() == 0) {
				//we don't have a valid game id. use some info
				//and list the popular games we have 
				Utils.generalDisplay("inf", "<br/><h2>Online Chinese Learning Games</h2>");//info block
				
				//popular games created, show them in the "pg" div
				//need to figure how to lay out pinterest like boxes to show popular games.
				Utils.generalDisplay("pg", "<span style='font-size: 18px;padding-left:20px;padding-right: 20px;'>Looking for a fun and engaging Chinese learning game? Ask your teacher to create one using <a href='online_games.html'>Chinese Online Game Creator</a></span>.");
				
				return;
			}
		}
		
		ArchLearningGameHelper.injectCSS();
		
		ArchLearningGameHelper.initEngine();// engine loaded first

		ArchLearningGameHelper.initGame(new Callback() {//note. not to call initGame more than once.
			@Override
			public void execute(String data) {//game script loaded successfully from the server
				ArchLearningGameHelper.displayGame();

				ArchLearningGameHelper.styleGameCanvas();				
			}			
		});
		
		//moved from inside callback to here
		Window.addResizeHandler(new ResizeHandler() {			
			public void onResize(ResizeEvent event) {
				ArchLearningGameHelper.displayGame();
			}
		});
	}
	
	private void saveScore(String name, String score) {
		dataService.saveScore(name,score);
	}
	
	private String generateShuffledIndexes(String countStr) {
		int cnt = Integer.valueOf(countStr);		
		List<Integer> indexes = new ArrayList<Integer>();
		for(int i = 0; i < cnt; i++) {
			indexes.add(i);
		}
		Utils.shuffle(indexes);
		String result = "";
		//joined by "~";
		for(int j = 0; j < indexes.size(); j++) {
			if (j > 0) {
				result +="~";
			}
			result += indexes.get(j);
		}
		
		return result;
	}
	
	private boolean hasChineseText(String text) {
		return Utils.hasChineseText(text);
	}
	
	private String getGameTextColor() {
		String value = "00FF00";		
		String userValue = GameConfig.getTextColor().trim();
		if (userValue.length() > 0) {
			value = userValue;
		}
		return "#" + value;
	}
	private String getGameVisitedTextColor() {
		String value = "0000FF";		
		String userValue = GameConfig.getVisitedTextColor().trim();
		if (userValue.length() > 0) {
			value = userValue;
		}
		return "#" + value;
	}
	
	
	private int getGameMatchType() {
		String value = "0";
		String userValue = GameConfig.getMatchType().trim();
		if (userValue.length() > 0) {
			value = userValue;
		}
		//this is the external match type
		//0: random; 1: chinese-pinyin; 2: chinese-english; 3: pinyin-english;
		//based on the external type, generate an internal match type. Internal match types are:
		
		//0: front chinese, back, pinyin
		//1: front pinyin, back, chinese
		
		//2: front chinese, back, english
		//3: front english, back, chinese
		
		//4: front pinyin, back, english
		//5: front english, back, pinyin
		
		if ("0".equals(value)) {//random
			return new Random().nextInt(4);// zero to 3; not Pinyin to English, too simple
		}
		
		if ("1".equals(value)) {//chinese to pinyin or pinyin to chinese			
			 if (new Random().nextInt(2) == 0) {
				 return 0;
			 } else {
				 return 1;
			 }
		}
		
		if ("2".equals(value)) {//chinese english or english to chinese
			 if (new Random().nextInt(2) == 0) {
				 return 2;
			 } else {
				 return 3;
			 } 
		}
		
		if ("3".equals(value)) {//pinyin to english or english to pinyin
			 if (new Random().nextInt(2) == 0) {
				 return 4;
			 } else {
				 return 5;
			 } 
		}
		
		return 0;
	}

	private boolean getGameWordAudio() {
		boolean value = true;
		String userValue = GameConfig.getWordAudio().trim();
		if (userValue.length() > 0) {
			value = Boolean.valueOf(userValue).booleanValue();
		}
		return value;
	}

	
	private String getGameTextBackgroundColor() {
		String value = "CCCCCC";		
		String userValue = GameConfig.getGameTextBackgroundColor().trim();
		if (userValue.length() > 0) {
			value = userValue;
		}
		return "#" + value;
	}		
	
	private String getGameMatchedTextColor() {
		String value = "FFFFFF";		
		String userValue = GameConfig.getMatchedTextColor().trim();
		if (userValue.length() > 0) {
			value = userValue;
		}
		return "#" + value;
	}		

	
	private float getBackgroundMusicVolume() {
		String  value = "2";//medium		
		String userValue = GameConfig.getBackgroundMusic().trim();
		if (userValue.length() > 0) {
			value = userValue;
		}
		int size = Integer.valueOf(value);
		//remove the mute option  
		//0, 1, 2, 3, default is 1. 0 will mute the background music
		return (size + 1) * 0.15f;//min 0, and max is 0.6
	}
	
	private String getDifficultyLevel() {
		//0-easy, 1-medium, 2-hard
		String level = "1";
		String userValue = GameConfig.getDifficultyLevel().trim();
		if (userValue.length() > 0) {
			level = userValue;
		}
		return level;
	}
	
	private int getBatchSize() {
		String batchSize = "12";
		String userValue = GameConfig.getBatchSize().trim();
		if (userValue.length() > 0) {
			batchSize = userValue;
		}
		return Integer.valueOf(batchSize);
	}
		
	private int getGameTextSize() {
		int size = 1;
		String userValue = GameConfig.getFontSize().trim();
		if (userValue.length() > 0) {
			size = Math.abs(Integer.valueOf(userValue));	
		}
		switch(size) {
			case 0://tiny
				return 42;
			case 1://small
				return 48;
			case 2://medium
				return 56;
			case 3://large
				return 64;
			case 4://huge
				return 72;				
			default:
				return 50;
		}
	}
	
	private void loadGameVocabListsByUUID() {
		//at this point, the game info has been loaded and stored in the 
		//GameConfig object.
		dataService.loadVocabListByUUID(GameConfig.getListId());
	}

	private void loadGameLeaderboard() {
		//at this point, the game info has been loaded and stored in the 
		//GameConfig object.
		dataService.loadLeaderboard(GameConfig.getGameId());
	}

	private String processPinyin(String wordPinyinWithToneNumber){
		return PinyinMapper.processPinyinForChinese(wordPinyinWithToneNumber);		
	}

	private String createUniqueId() {
		return "" + (++sequenceNumber);
	}

	private boolean isMobile() {
		return Utils.isMobile();
	}
	
	private int getCanvasHeight() {
		return 1080;
	}

	private int getCanvasWidth() {
		return 1920;
	}
	
	private native void initJS() /*-{
		var _this = this;
		_this.dataAgent = null;
		
		//game and gwt code in the same iframe, not the main document $wnd!!!!
		fn_getConfig = function() {
			return {
				type : Phaser.AUTO,// we need
				backgroundColor : 0x87ceeb,//default background
				width : 1920,
				height : 1080,
				scale : {
					mode : Phaser.Scale.FIT,
					autoCenter : Phaser.Scale.CENTER_BOTH
				},
				autoRound : false,
				parent : "archlearninggame",
				dom: {
        			createContainer: true
    			},
				physics : {
					'default' : 'arcade',
					arcade : {
						gravity : {
							y : 300
						},
						debug : false
					}
				},
				scene : []
			}
		};

 
 
		fn_setToFullScreen = function(scene) {
			scene.scene.scene.scale.startFullscreen();
		};

		fn_loadJoyStick = function(scene) {
			scene.load.plugin('joystick', 'joystick.js', true);
 		};
 		
 		fn_createJoyStick = function(scene, baseImgId, thumbImgid) {
 			scene.joystick = scene.plugins.get("joystick").add(scene, {
			    x: 160,
			    y: fn_getCanvasHeight()- 160,
			    radius: 160,
			    base: scene.add.image(160, fn_getCanvasHeight()-160, baseImgId),
			    thumb: scene.add.image(200, fn_getCanvasHeight()-120, thumbImgid),
			    // dir: '8dir',
			    // forceMin: 16,
			    // fixed: true,
			    // enable: true
			}); 			
 		}

		fn_stopFullScreen = function(scene) {
			scene.scene.scene.scale.stopFullscreen();
		};

		fn_initPinyinFont = function(scene) {
			scene.add.text(0, 0, '', {
				fontFamily : fn_getPinyinFont(),
				fontSize : 10,
			});
		};

		fn_registerDataAgent = function(agent) {
			_this.dataAgent = agent;
		};

		fn_gameVocabListsReady = function(gameDisplayName,chineseArray, pinyinArray, englishArray, imgURLArray) {
			if (_this.dataAgent) {
				_this.dataAgent.setGameVocabLists(gameDisplayName, chineseArray, pinyinArray, englishArray, imgURLArray);
			}else {
				//console.log("Game agent is not ready for receiving data...");
			}
		};

		fn_gameLeaderboardReady = function(leaderboard) {
			if (_this.dataAgent) {
				_this.dataAgent.setGameLeaderboard(leaderboard);
			}else {
				//console.log("Game agent is not ready for receiving data...");
			}
		};
		
		fn_navigateTo = function(scene, srcId, targetId) {
			scene.scene.stop(srcId);
			scene.scene.start(targetId);
			scene.scene.moveAbove(srcId, targetId);					
		};
	
		fn_saveName = function(score) {
			var name = fn_getElementById("nameInput").value;
			name = name.replace("~", "");
			name = name.replace("@", "");
			name = name.replace("^", "");
			name = name.replace("&", "");
			name = name.replace(" ", "");
			if (name.length > 20) {
				name = name.substring(0, 20);
			}
			if (name.length == 0) {
				name = "Anonymous";
			}
						
			fn_getElementById("nameDisplay").innerText = name;
			fn_getElementById("nameInputBlk").style.display = "none";
			
			fn_saveScore(name,score);
		}
				
		fn_setFocus = function(id) {
			if (fn_getElementById(id)) {
				fn_getElementById(id).focus();
			}
		};
		
		fn_createFrontText = function(scene, chinese, pinyin, english,minFontsize,currentMatchType) {
			return fn_createFrontText_generic(scene,chinese,pinyin,english,minFontsize, 1.8,currentMatchType);//used in balloon pop
		}
		
		fn_createFrontText_generic = function(scene, chinese, pinyin, english,minFontsize,chineseFontRatio,currentMatchType) {
			  var pinyinFontFamily = fn_getPinyinFont();
			  var chineseFontFamily = fn_getChineseFont(); 
			  var englishFontFamily = fn_getEnglishFont();
				
			  var userFontSize = parseInt(fn_getGameTextSize());
			  if (userFontSize < minFontsize) {
				  userFontSize = minFontsize;
			  }			
				
			  var frontWord = "";
			  var frontFontSize = userFontSize;
			  var frontFontFamily = chineseFontFamily;
			  //0: front chinese, back, pinyin
			  //1: front pinyin, back, chinese		
			  //2: front chinese, back, english
			  //3: front english, back, chinese		
			  //4: front pinyin, back, english
			  //5: front english, back, pinyin										
			  switch(currentMatchType) {
					case 0://chinese
					case 2://chinese
						frontFontFamily = chineseFontFamily;
						frontFontSize = userFontSize*chineseFontRatio;
						frontWord = chinese;
						break;
					case 1://pinyin
					case 4://pinyin
						frontFontFamily  = pinyinFontFamily;
						var convertedFronWord = fn_processPinyin(pinyin);//convert Pinyin from tone numbers to tone marks.
						frontWord = convertedFronWord;							
						break;
					case 3://english
					case 5://english	
						frontFontFamily  = englishFontFamily;
						frontFontSize = userFontSize *0.8;
						frontWord = english;
						if (frontWord.length > 60) {
							frontWord = frontWord.substring(0,60) + "...";
						}
						break;
			  }							
			  var frontText = scene.add.text(0, 0, frontWord, {
					fontFamily : frontFontFamily,
					backgroundColor: "#FFFFFF", 					
					fontWeight : 'bold',
					fontSize : frontFontSize,
					color : fn_getGameVisitedTextColor()
					//wordWrap: { width: fn_getCanvasWidth()/12, useAdvancedWrap: true }
			  }).setOrigin(0.5);
			  
			//////////////////
			var backWord = "";
			var backFontFamily = chineseFontFamily;
			var backFontSize = userFontSize;
			//0: front chinese, back, pinyin
			//1: front pinyin, back, chinese		
			//2: front chinese, back, english
			//3: front english, back, chinese		
			//4: front pinyin, back, english
			//5: front english, back, pinyin										
			switch(currentMatchType) {
				case 0://pinyin
				case 5://pinyin	
					backFontFamily  = pinyinFontFamily;
					backWord = pinyin;
					backWord = fn_processPinyin(backWord);//convert Pinyin from tone numbers to tone marks.						
					break;
				case 2://english
				case 4://english	
					backFontFamily  = englishFontFamily;
					backFontSize = userFontSize*0.8;
					backWord = english;
					if (backWord.length > 60) {
						backWord = backWord.substring(0,60) + "...";
					}				
					break;
				case 1://chinese
				case 3://chinese
						backFontFamily  = chineseFontFamily;
						backFontSize = userFontSize*chineseFontRatio;
						backWord = chinese;
						break;
			}			
			var backText = scene.add.text(0, 0, backWord, {
				fontFamily : backFontFamily,
				fontWeight : 'bold',
				fontSize : backFontSize,
				color : fn_getGameMatchedTextColor()
				//wordWrap: { width: fn_getCanvasWidth()/4, useAdvancedWrap: true }
			}).setOrigin(0.5);
			
			backText.setVisible(false);
			frontText.chinese = chinese;
			frontText.pinyin = pinyin;
			frontText.backText = backText;
			
			return frontText;
		}
		
		fn_overLap = function(gameObjectA, gameObjectB) {
			return Phaser.Geom.Rectangle.Overlaps(gameObjectA.getBounds(), gameObjectB.getBounds()); 		
		}
		
		fn_getElementById = function(id) {
			return $doc.getElementById("archlearninggame").contentDocument.getElementById(id);
		};

		fn_showMsg = function(msg) {
			@com.archchinese.game.client.Utils::showMsg(Ljava/lang/String;)(msg);
		};

		fn_isInternetExplorer = function(id) {
		    var ua = $wnd.navigator.userAgent;
		    var msie = ua.indexOf("MSIE ");	
		    return (msie > 0 || !!ua.match(/Trident.*rv\:11\./)) 
		};
						
		fn_styleCanvas = function(game) {
			game.canvas.id = 'ArchChinese'
			game.canvas.style.border = "1px solid gray";
			game.canvas.style['border-radius'] = "0.5em";// for hyphen, Use key notation		
		};


		fn_setBackgroundAlpha = function(scene, imageId, alpha) {
			var background = fn_setBackground(scene, imageId);
			background.alpha = alpha;
			return background;
		};
		
		fn_setBackground = function(scene, imageId) {
			//the scene is a the Scene object
			//use a white, opaque background to blocking the back scences from showing through
			var whiteBackoundId = fn_createId();			
			fn_createGradient(scene,whiteBackoundId,"#FFFFFF", "#FFFFFF");
			scene.add.image(fn_getCanvasWidth() / 2,
					fn_getCanvasHeight() / 2, whiteBackoundId);
			//end white backvround
						
			var background = scene.add.image(fn_getCanvasWidth() / 2,
					fn_getCanvasHeight() / 2, imageId);
			if (fn_isUserBackgroundImgUsed()) {
				background.setAlpha(0.6);//lighten custom background.
			}
			background.setDisplaySize(scene.sys.canvas.width,
					scene.sys.canvas.height);
			return background;
		};

		//auto adjust font size to fit the box defined by width w and height h.
		fn_findMaxFontInBox = function(scene, text,fontFamily,initFontSize, w, h) {
			if (text.length == 0) {
				return initFontSize;
			}
			//we have some text
			var fontSize = initFontSize;		
		 	var helpText = scene.add.text(0, 0, text , {
					fontFamily : fontFamily,
					fontSize : fontSize,
					align: "center",
					wordWrap: { width: w, useAdvancedWrap: true }		
			});		
			helpText.setVisible(false);
			
			while(helpText.getBounds().width > w || helpText.getBounds().height > h || fontSize < 15) {
				fontSize -= 20;//font size reduce 3 each time
				helpText.destroy();
				helpText = scene.add.text(0, 0, text , {
					fontFamily : fontFamily,
					fontSize : fontSize,
					align: "center",
					wordWrap: { width: w, useAdvancedWrap: true }		
				});			
				helpText.setVisible(false);			
			}
			helpText.destroy();
			
			return fontSize; 
		};
		
		fn_flashingElement = function(scene, element) {			
			scene.tweens.add({
			        targets: element,
			        scaleX: '+=.2',
            		scaleY: '+=.2',
            		ease: 'Sine.easeInOut',
            		delay: 0,
            		paused: false,
			        duration: 1500,
			        yoyo: true,
			        repeat: -1
			    });
    	};
    	
    	fn_createRadientBtn = function(scene, size, startColor, targetColor) {
    		var btnId = fn_createId();
		    var radius = size/2;
		    var centerX = size/2;
		    var centerY = size/2;
		    
			var canvasTexture = scene.textures.createCanvas(btnId, size, size);
		    var src = canvasTexture.getSourceImage();
		    
		    var context = src.getContext('2d');
		    //context.shadowBlur = radius/50;
		    context.shadowColor = "rgba(0,0,0,0.25)";//black with alpha 0.3
		    context.shadowOffsetX = radius/50;
		    context.shadowOffsetY = radius/50;
	
		    //x0,y0,r0,x1,y1,r1
		    //x0: The x-coordinate of the starting circle of the gradient
		    //y0	The y-coordinate of the starting circle of the gradient
		    //r0	The radius of the starting circle
		    //x1	The x-coordinate of the ending circle of the gradient
		    //y1	The y-coordinate of the ending circle of the gradient
		    //r1	The radius of the ending circle
		    var gradientStartCircleRatio = 2;//where to place the starting circle (the white circle);
		    var gradient = context.createRadialGradient(centerX-radius/gradientStartCircleRatio, centerY-radius/gradientStartCircleRatio, 0, centerX, centerY, radius);
	        gradient.addColorStop(0, startColor);
	        gradient.addColorStop(0.2, "#F44");
	        gradient.addColorStop(1, targetColor);        
	        context.fillStyle = gradient;
	        context.beginPath();
	        context.arc(centerX, centerY, radius, 0, 2*Math.PI, false);//draw a circle
	        context.fill();
	        	    
	        //Below is required only when running the game in WEBGL
		     canvasTexture.refresh();
		     
		     return scene.add.image(0,0,btnId);
    	};
    	
    	fn_createRing = function(scene, size, ringColor) {
			var radius = size/2;
			var id = fn_createId();
			var frameSize = size * 1.05;			
		    var centerX = frameSize/2;
		    var centerY = frameSize/2;
		    		    		    
			var canvasTexture = scene.textures.createCanvas(id, frameSize, frameSize);
		    var src = canvasTexture.getSourceImage();		    
		    var context = src.getContext('2d');
		    context.shadowBlur = radius/50;	    
		    context.shadowColor = "rgba(0,0,0,0.4)";//black with alpha 0.4	    
		    context.shadowOffsetX = radius/80;
		    context.shadowOffsetY = radius/80;
		    		    
		    var gradient = context.createLinearGradient(0, radius, radius*2, radius);
	        gradient.addColorStop(0, "#FFFF00");
	        gradient.addColorStop(0.3, fn_getGameMatchedTextColor());
	        gradient.addColorStop(0.6, fn_getGameVisitedTextColor());
	        gradient.addColorStop(1, ringColor);        
	        context.fillStyle = gradient;
	        
	        context.strokeStyle = "#881111";
		    context.beginPath();
		    context.arc(centerX, centerY, radius*1.02, 0, 2*Math.PI, true);
		    context.arc(centerX, centerY, radius*0.98, 0, 2*Math.PI, false);
		   // context.fillStyle = ringColor;
		    context.fill();
		    context.stroke();
	
		    //Below is required only when running the game in WEBGL
		     canvasTexture.refresh();
		     
		     return scene.add.image(0,0,id);
		};
	
    	fn_createProgressBar = function(scene, x, y, w, h) {
    		scene.progressLabel = fn_createStatusLabel(scene, x, y, "Progress: ");    		
    		scene.progressBar = scene.add.graphics();    		
    		scene.progressBar.fillStyle(0xCCCCCC, 0.5);
    		//use dynatmic property to store the x, y, w and h info. We need them to update the progress.
    		scene.progressBar.xx = x;
    		scene.progressBar.yy = y;
    		scene.progressBar.ww = w;
    		scene.progressBar.hh = h;
            scene.progressBar.fillRect(scene.progressBar.xx + scene.progressLabel.getBounds().width, y, 0, h);
            scene.progressBar.lineStyle(0.8, fn_getGameTextColor(), 0.7);
            scene.progressBar.strokeRect(scene.progressBar.xx + scene.progressLabel.getBounds().width, scene.progressBar.yy, scene.progressBar.ww, scene.progressBar.hh);
                                        
			scene.percentText = scene.make.text({y: y+scene.progressLabel.getBounds().height/2, text: '0%',style: {fontFamily: fn_getEnglishFont(), fontSize: '18px',  fill: fn_getGameMatchedTextColor()}});
			scene.percentText.x = scene.progressBar.xx +scene.progressLabel.getBounds().width + w/2;
			scene.percentText.alpha = 0.6; 
			scene.percentText.setOrigin(0.5, 0.5);			    		
    	};
    	
    	fn_updateProgressBar = function(scene, pct) {
    		//pct is a value such as, 0.65
    		scene.progressBar.clear();
    		
    		scene.progressBar.fillStyle(0xCCCCCC, 0.5);    		
    		scene.progressBar.fillRect(scene.progressBar.xx + scene.progressLabel.getBounds().width, scene.progressBar.yy, scene.progressBar.ww*pct, scene.progressBar.hh);
    		
            scene.progressBar.lineStyle(0.8, fn_getGameTextColor(), 0.7);
            scene.progressBar.strokeRect(scene.progressBar.xx + scene.progressLabel.getBounds().width, scene.progressBar.yy, scene.progressBar.ww, scene.progressBar.hh);
                		
    		scene.percentText.text = "" + Math.floor(pct*100) + "%";
    	}
    	
		fn_createGradient = function(scene, objectId, startColor, endColor) {
			var texture = scene.textures.createCanvas(objectId,
					fn_getCanvasWidth(), fn_getCanvasHeight());
			var context = texture.getContext();
			var grd = context.createLinearGradient(0, 0, 0,
					fn_getCanvasHeight());
			grd.addColorStop(0, startColor);
			grd.addColorStop(1, endColor);
			context.fillStyle = grd;
			context.fillRect(0, 0, fn_getCanvasWidth(), fn_getCanvasHeight());
			texture.refresh();//needed for WebGL only.  
		};

		//0. Chinese - Pinyin
		//1. Chinese - English
		//2. Pinyin - Chinese
		//3. English - Chinese
		fn_createWordTextObjects = function(chineseList, pinyinList, level, matchType, frontList, backList, scene,
				liveWords) {
			var canvasWidth = fn_getCanvasWidth();
			var canvasHeight = fn_getCanvasHeight();
			var pinyinFontFamily = fn_getPinyinFont();
			var chineseFontFamily = fn_getChineseFont(); 
			var englishFontFamily = fn_getEnglishFont();
			
			var count = frontList.length;
			var userFontSize = parseInt(fn_getGameTextSize());
			if (userFontSize < 42) {
				userFontSize = 42;
			}
			
			if (count > 0) {
				for ( var i = 0; i < frontList.length; i++) {
					//set the correct font family for the displayed word text(Chinese, Pinyin or English)
					//note that prompt text font needs to be match type sensitive as well
					var frontWord = frontList[i];
					var frontFontSize = userFontSize;
					var frontFontFamily = chineseFontFamily;
					//0: front chinese, back, pinyin
					//1: front pinyin, back, chinese		
					//2: front chinese, back, english
					//3: front english, back, chinese		
					//4: front pinyin, back, english
					//5: front english, back, pinyin		
					switch(matchType) {
						case 0:
						case 2:
							frontFontFamily = chineseFontFamily;
							frontFontSize = userFontSize + 5;
							break;
						case 1:
						case 4:
							frontFontFamily  = pinyinFontFamily;
							var convertedFronWord = fn_processPinyin(frontWord);//convert Pinyin from tone numbers to tone marks.
							frontWord = convertedFronWord;							
							break;
						case 3:
						case 5:
							frontFontFamily  = englishFontFamily;
							frontFontSize = userFontSize *0.65;
							break;
					}
									
					var frontText = scene.add.text(0, 0, frontWord, {
						fontFamily : frontFontFamily,
						fontWeight : 'bold',
						fontSize : frontFontSize,
						//color : "#FF0000"
						color : fn_getGameTextColor()
					}).setOrigin(0.5);
					var container = scene.add.container(10,100, [ frontText ]);//one word per container
					
					//reset size
					container.setSize(frontText.getBounds().width,
							frontText.getBounds().height);//container has the same size as the text
					scene.physics.world.enableBody(container);

					container.body.setBounce(1);
					container.body.setCollideWorldBounds(true);
					
					var startX = 50;
					var endX = canvasWidth-startX <= 0? startX : canvasWidth-50;
					container.x = Phaser.Math.Between(startX,endX);
					container.y = Phaser.Math.Between(10,20);	
					//velocity is based on the level, higher the level, the faster the word moves
					//no speed change for level 2	
					var speedRatio = 1.0;
					if (level > 2) {
						  speedRatio += (level-2)*0.1;
					}								
					container.body.setVelocity(Phaser.Math.Between(-160,160)*speedRatio, Phaser.Math.Between(40,150)*speedRatio);
					container.body.allowGravity = false;
					//done setting up the front text
					
					//process the back side value. They are invisibile intially until this word is matched
					var backWord = backList[i];
					container.answer = backWord;//original value, used to do the match check.
					
					var backFontFamily = chineseFontFamily;
					var backFontSize = userFontSize;
					//0: front chinese, back, pinyin
					//1: front pinyin, back, chinese		
					//2: front chinese, back, english
					//3: front english, back, chinese		
					//4: front pinyin, back, english
					//5: front english, back, pinyin							
					switch(matchType) {
						case 0://pinyin
						case 5://pinyin
							backFontFamily  = pinyinFontFamily;
							backWord = fn_processPinyin(backWord);//convert Pinyin from tone numbers to tone marks.						
							break;
						case 2://english
						case 4://english
							backFontFamily  = englishFontFamily;
							backFontSize = userFontSize*0.65;
							break;
						case 1://chinese
						case 3://chinese
							backFontFamily  = chineseFontFamily;
							backFontSize = userFontSize + 5;
							break;
					}
					
					var backText = scene.add.text(0, 0, backWord, {
						fontFamily : backFontFamily,
						fontWeight : 'bold',
						fontSize : backFontSize,
						//color : "#FF0000"
						color : fn_getGameTextColor()
					}).setOrigin(0.5);
					backText.setVisible(false);
					container.backText = backText;//attach it to the container object. will be used when it is hit by the player 
					//done processing back side text
					
					//now attach the Chinese word and raw Pinyin to the container as well so that
					//we can load and play the audio of this word.
					container.chinese =  chineseList[i];
					container.pinyin = pinyinList[i];
					/////////////////////
														
					liveWords.push(container);
										
					//Note that the Pinyin font must be triggered before this scene because
					//it won't be available immediately. It needs to be loaded from the server in advance.
					//this is done in Game Title page by loading a dummy empty text using the Pinyin font. 
				}
			}
		};

		//set up and play the given audio. Return the music handle.
		fn_setUpAndPlayMusic = function(scene, audioId) {
			var music = scene.sound.add(audioId);
			var musicConfig = {
				mute : false,
				//volume : 0.4,
				volume : fn_getBackgroundMusicVolume(),				
				rate : 1,
				detune : 0,
				seek : 0,
				loop : true,
				delay : 0
			}
			music.play(musicConfig);
			return music;
		};
                
        fn_loopPlayMusic = function(scene, audioId, volume) {
			var music = scene.sound.add(audioId);
			var musicConfig = {
				mute : false,
				//volume : 0.4,
				volume : volume,				
				rate : 1,
				detune : 0,
				seek : 0,
				loop : true,
				delay : 0
			}
			music.play(musicConfig);
			return music;
		};
		        
        fn_createTileSprite = function(scene, imgId) {
			var sprite = scene.add.tileSprite(0, 0, fn_getCanvasWidth(), fn_getCanvasHeight(), imgId);
        	sprite.setOrigin(0, 0);
        	return sprite;
		};
		
		fn_createRepeatAni = function(scene, aniKey, frmId, startFrm, endFrm) {
			scene.anims.create({
                key: aniKey,
                frames: scene.anims.generateFrameNumbers(frmId, {start:startFrm, end:endFrm}),
                frameRate: 20,
                repeat: -1
            });        				
		};
	
	    fn_createStatusLabel = function(scene, x, y, text) {
			return scene.add.text(x, y, text, {
				fontSize : '30px',
				fontFamily : fn_getChineseFont(),
				fill : fn_getGameMatchedTextColor()
			});
		};
		
		fn_copyList = function(targetList, sourceList) {
			for (i = 0; i < sourceList.length; i++) {
				targetList.push(sourceList[i]);
			}
		};
		
		fn_rand = function(min, max) {
			return Phaser.Math.Between(min, max);
		}
		
		fn_createGameOverLabel = function(scene) {
			return scene.add.text(165, 100, 'Game Over', { fontFamily: fn_getEnglishFont(), fontSize: 100, color: '#FFFFBB'}); 
		};
		
		fn_createFinalScoreLabel = function(scene, score) {
			return scene.add.text(280, 225, "Score: " + score, { fontFamily: fn_getEnglishFont(), fontSize: 60, color: '#FFFFBB' }); 
		};

		fn_createFinalTimeLabel = function(scene, mytime) {
			return scene.add.text(280, 225, "Time: " + mytime, { fontFamily: fn_getEnglishFont(), fontSize: 60, color: '#FFFFBB' }); 
		};
		
		fn_findOverlap = function(array, container) {
			var overlappedObject = null;        	
 			for(var i = 0; i < array.length; i++) {
 				var anotherContainer = array[i];
 				if (anotherContainer != container) {
 					if (fn_overLap(container, anotherContainer)) {
 						overlappedObject = anotherContainer;
 						break;
 					}
 				}
 			}
 			return overlappedObject
		}
		
		fn_destroy = function(object) {
			if (object) {
				object.destroy();
			}
		}
		fn_getTypeCanvas = function() {
			//Phaser.AUTO
			return Phaser.CANVAS;
		}
		
		fn_getCharPinyin = function(wordPinyin, characterIndex) {
			var pinyin = wordPinyin.split(" ")[characterIndex];
	    	if (pinyin.indexOf(',') > 0) {
	    		pinyin = pinyin.split(",")[0];
	    	}
	    	return pinyin;
		}
		
		fn_removeElement = function(array, object) {
			var index = array.indexOf(object);
			if (index >= 0) {
				array.splice(index, 1);
			}
		}
		
		fn_drawSandWave = function(scene) {
			var graphics2 = scene.add.graphics(0, 0);//graphics instance
			graphics2.clear();
			graphics2.lineStyle(1, 0x0000FF, 0.5);
			graphics2.fillStyle(0xFFFF00, 1.0);
			graphics2.alpha = 0.9;
			
		    var points = [];
		    points.push(fn_vector(0, fn_getCanvasHeight()));
		    
		    for(var i = 0; i <9; i++) {
		    	points.push(fn_vector(fn_getCanvasWidth()*((i+1)*0.1), fn_getCanvasHeight()*(0.8 + Math.random()*0.2)));
		    }	    
		    points.push(fn_vector(fn_getCanvasWidth(), fn_getCanvasHeight()));
		    
		    var curve = fn_spline(points);
		    curve.draw(graphics2, 64);
		    graphics2.fillPath();
		};
		
		
		fn_fadeOut = function(scene, time, gameObject) {
			scene.tweens.add({
				targets : gameObject,
				alpha : 0,
				duration : time,
				yoyo : false,
				repeat : 0
			});
		}
		
		fn_deg2Rad = function(deg) {
			return Phaser.Math.DegToRad(deg);	
		}
		
		fn_rgb2Str = function(r,g,b) {
			return Phaser.Display.Color.RGBToString(r,g,b);
		}
		
		fn_drawRedPointer = function(scene, width, height, colorStr) {
			var id = fn_createId();			
			var canvasTexture = scene.textures.createCanvas(id, width*1.1, height*1.1);
		    var src = canvasTexture.getSourceImage();		    
		    var context = src.getContext('2d');
		    		    
		    context.shadowBlur = width/20;	    
		    context.shadowColor = "rgba(0,0,0,0.2)";//black with alpha 0.2	    
		    context.shadowOffsetX = width/70;
		    context.shadowOffsetY = width/70;	    
	        context.strokeStyle = colorStr;
	        context.fillStyle = colorStr;
	        
		    context.beginPath();	    
		    
		    context.moveTo(0, height/2+5);
		    context.lineTo(width-height/2, 0);
		    context.arc(width-height/2, height/2, height/2, fn_deg2Rad(90), fn_deg2Rad(270), true);
		    context.lineTo(width-height/2, height);	    
		    context.lineTo(0, height/2+5);	    
		    context.fill();
		    context.stroke();
		    
		    //Below is required only when running the game in WEBGL
		     canvasTexture.refresh();
				
		    return scene.add.image(0,0,id);		
		}
	
		fn_roundRect = function(scene, width, height, buttonColor) {
			var id = fn_createId();
			var canvasTexture = scene.textures.createCanvas(id, width*1.1, height*1.1);
		    var src = canvasTexture.getSourceImage();		    
		    var context = src.getContext('2d');
		    		     
//		   	var gradient = context.createRadialGradient(width/4, height/4, 0, width/2, height/2, height);
//	        gradient.addColorStop(0, "#FFFFFF");
//	        gradient.addColorStop(0.2, buttonColor);
//	        gradient.addColorStop(1, buttonColor);        
//	        context.fillStyle = gradient;
		    		     
		    context.shadowBlur = width/20;	    
		    context.shadowColor = "rgba(0,0,0,0.2)";//black with alpha 0.2	    
		    context.shadowOffsetX = width/70;
		    context.shadowOffsetY = width/70;	    
	        context.strokeStyle = buttonColor;
	        context.fillStyle = buttonColor;
	        context.lineWidth = 10;
	                
	        //draw a rounded rectangle button
	        var radius  = 20;
	        var x = 10;
	        var y = 10;
	        
	        context.beginPath();
	        
	        context.moveTo(x + radius, y);
	        context.lineTo(x + width - radius, y);
	        context.quadraticCurveTo(x + width, y, x + width, y + radius);
	        context.lineTo(x + width, y + height - radius);
	        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	        context.lineTo(x + radius, y + height);
	        context.quadraticCurveTo(x, y + height, x, y + height - radius);
	        context.lineTo(x, y + radius);
	        context.quadraticCurveTo(x, y, x + radius, y);
	        context.closePath();
	
	        context.fill();
		    context.stroke();
		    	    
		    //Below is required only when running the game in WEBGL
		    canvasTexture.refresh();
		    
		    return scene.add.image(0,0,id);	    
		}
		
		fn_drawX = function(scene, toBeXedGameObject, colorStr) {
			var id = fn_createId();
			
			var width = toBeXedGameObject.displayWidth/3;
			var height = toBeXedGameObject.displayHeight * 0.75;		
			var canvasTexture = scene.textures.createCanvas(id, width, height);
		    var src = canvasTexture.getSourceImage();		    
		    var context = src.getContext('2d');
		    		    
		    context.shadowBlur = width/20;	    
		    context.shadowColor = "rgba(0,0,0,0.2)";//black with alpha 0.2	    
		    context.shadowOffsetX = width/70;
		    context.shadowOffsetY = width/70;	    
	        context.strokeStyle = colorStr;
	        context.fillStyle = colorStr;
	        context.lineWidth = 12;
	        
		    context.beginPath();	    	    
		    context.moveTo(0, 0);
		    context.lineTo(width, height);
		    context.moveTo(width, 0);
		    context.lineTo(0, height);	    
		    context.stroke();
		    
		    //Below is required only when running the game in WEBGL
		     canvasTexture.refresh();
				
		    return scene.add.image(0,0,id);		
		}
		
		
		fn_drawCheckMark = function(scene, toBeCheckedGameObject, colorStr) {
		var id = fn_createId();
		
		var width = toBeCheckedGameObject.displayWidth/3;
		var height = toBeCheckedGameObject.displayHeight * 0.75;		
		var canvasTexture = scene.textures.createCanvas(id, width, height);
	    var src = canvasTexture.getSourceImage();		    
	    var context = src.getContext('2d');
	    		    
	    context.shadowBlur = width/20;	    
	    context.shadowColor = "rgba(0,0,0,0.2)";//black with alpha 0.2	    
	    context.shadowOffsetX = width/70;
	    context.shadowOffsetY = width/70;	    
        context.strokeStyle = colorStr;
        context.fillStyle = colorStr;
        context.lineWidth = 12;
        
	    context.beginPath();	    	    
	    context.moveTo(width/6, height/2);
	    context.lineTo(width/2, height-10);
	    context.lineTo(width, 0);	    
	    context.stroke();
	    
	    //Below is required only when running the game in WEBGL
	     canvasTexture.refresh();
			
	    return scene.add.image(0,0,id);		
	}
	
		fn_drawFrameBackground = function(scene, frame, color) {
			var id = fn_createId();		
			var width = frame.displayWidth;
			var height = frame.displayHeight;		
			var canvasTexture = scene.textures.createCanvas(id, width, height);
		    var src = canvasTexture.getSourceImage();		    
		    var context = src.getContext('2d');	    		    
		    context.shadowBlur = width/20;	    
		    context.shadowColor = "rgba(0,0,0,0.2)";//black with alpha 0.2	    
		    context.shadowOffsetX = width/70;
		    context.shadowOffsetY = width/70;	    
	        context.strokeStyle = color;
	        context.fillStyle = color;
	        context.lineWidth = 12;
	        
		    context.beginPath();	    	    
		    context.moveTo(10, 10);
		    context.lineTo(width-10, 10);
		    context.lineTo(width-10, height-10);
		    context.lineTo(10, height-10);
		    context.lineTo(10, 10);
		    context.fill();
		    context.stroke();
		    
		    //Below is required only when running the game in WEBGL
		     canvasTexture.refresh();
			
		    var image =  scene.add.image(0,0,id);
		    fn_nestedInCenter(image,frame);
		    
		    scene.children.bringToTop(frame);
	
		    return image;
		};
			
		fn_showLeaderboard = function(scene, leaderboard, myscore, mydocument) {
			//leaderboard
			scene.divLeaderboard = mydocument.createElement('div');		
			scene.divLeaderboard.style = "width:600px; height: 270px; font:28px Arial; font-weight: bold;color:#F6FA04;";
							
			scene.divLeaderboard.innerHTML = '';
			scene.add.dom(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2, scene.divLeaderboard);
	
			var names = [];
			var scores = [];
			var myscoreUsed = false;
			if (leaderboard.length > 0) {
				var entries = leaderboard.split("~");
				for(var i = 0; i < entries.length; i++) {
					var fields = entries[i].split("@");
					var name = fields[0];
					var score = parseInt(fields[1]);
					if (myscore > 0 && myscore >= score && !myscoreUsed) {
						myscoreUsed =true;
						names.push("<span id='nameDisplay'></span><span id='nameInputBlk'><input type='text' maxlength='20' id='nameInput' style='font-size:22px;' placeholder='Enter a fun & friendly name'>&nbsp;<br/><a class='circle-btn' href='javascript:void(0);' onclick='event.preventDefault(); fn_saveName(" + myscore + ");'>Save</a></span>");
						scores.push(myscore);
					}
					names.push(name);
					scores.push(score);				
				}
			}
			
			if (!myscoreUsed && myscore > 0) {
				names.push("<span id='nameDisplay'></span><span id='nameInputBlk'><input type='text' id='nameInput' maxlength='20'  style='font-size:22px;' placeholder='Enter a fun & friendly name'>&nbsp;<br/><a class='circle-btn' href='javascript:void(0);' onclick='event.preventDefault(); fn_saveName(" + myscore+ ");'>Save</a></span>");
				scores.push(myscore);
			}
					
			if (names.length < 5) {
				var dummyCount = 5 - names.length;
				for(var j = 0; j < dummyCount; j++) {
					names.push("");
					scores.push("");							
				}
			}
			var rank = 0; 
			var board = "<table style='border-spacing: 1;border-collapse: collapse;background:#0058B5;border-radius:6px;overflow:hidden;width:100%;margin:0 auto;position:relative;'>" +
					"<thead><tr style='height:60px;background:#B97A57;font-size:22px;text-align:center;'><td>Rank</td><td>Name</td><td>Score</td></tr></thead><tbody>";
			for(var k = 0; k < 5; k++) {			
				board += "<tr style='height:48px; border-bottom:1px solid #E3F1D5;text-align:center;'><td>" + (++rank) + "</td><td>" + names[k] + "</td><td>" + scores[k] + "</td></tr>";
			}		
			board +="</tbody></table>";
			
			scene.divLeaderboard.innerHTML = board;
			//focus on the enter-your-name field
			scene.time.delayedCall(1000, fn_setFocus, ['nameInput'], scene);			
		};
		
		fn_showTimeLeaderboard = function(scene, leaderboard, mytime, mydocument) {
			
			//leaderboard
			scene.divLeaderboard = mydocument.createElement('div');		
			scene.divLeaderboard.style = "width:600px; height: 270px; font:28px Arial; font-weight: bold;color:#F6FA04;";
							
			scene.divLeaderboard.innerHTML = '';
			scene.add.dom(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2, scene.divLeaderboard);
	
			var names = [];
			var scores = [];
			var mytimeUsed = false;
			if (leaderboard.length > 0) {
				var entries = leaderboard.split("~");
				for(var i = 0; i < entries.length; i++) {
					var fields = entries[i].split("@");
					var name = fields[0];
					var time = "";
					if (isNaN(fields[1])) {
						time = 0;//a big number
					} else {
						time = parseInt(fields[1]);
					}
					
					if (mytime > 0 && mytime <= time && !mytimeUsed) {
						mytimeUsed =true;
						names.push("<span id='nameDisplay'></span><span id='nameInputBlk'><input type='text' maxlength='20' id='nameInput' style='font-size:22px;' placeholder='Enter a fun & friendly name'>&nbsp;<br/><a class='circle-btn' href='javascript:void(0);' onclick='event.preventDefault(); fn_saveName(" + mytime + ");'>Save</a></span>");
						scores.push(mytime);
					}
					names.push(name);
					scores.push(time);				
				}
			}
			
			if (!mytimeUsed && mytime > 0) {
				names.push("<span id='nameDisplay'></span><span id='nameInputBlk'><input type='text' id='nameInput' maxlength='20'  style='font-size:22px;' placeholder='Enter a fun & friendly name'>&nbsp;<br/><a class='circle-btn' href='javascript:void(0);' onclick='event.preventDefault(); fn_saveName(" + mytime+ ");'>Save</a></span>");
				scores.push(mytime);
			}
					
			if (names.length < 5) {
				var dummyCount = 5 - names.length;
				for(var j = 0; j < dummyCount; j++) {
					names.push("");
					scores.push("0");							
				}
			}
			
			//order the names/scores, low to high
			var tempNames = [];
			var tempScores = [];
			while(names.length > 0) {
				var name = names.pop();
				var score = scores.pop();
				if (name.length > 0) {
					tempNames.push(name);
					tempScores.push(score);
				}
			}
			if (tempNames.length < 5) {
				var dummyCount = 5 - tempNames.length;
				for(var j = 0; j < dummyCount; j++) {
					tempNames.push("");
					tempScores.push("0");							
				}
			}
			names = tempNames;
			scores = tempScores;	
			//done order the scores, from lowest to highest
								
			var rank = 0; 
			var board = "<table style='border-spacing: 1;border-collapse: collapse;background:#0058B5;border-radius:6px;overflow:hidden;width:100%;margin:0 auto;position:relative;'>" +
					"<thead><tr style='height:60px;background:#B97A57;font-size:22px;text-align:center;'><td>Rank</td><td>Name</td><td>Time</td></tr></thead><tbody>";
			for(var k = 0; k < 5; k++) {
				var formattedDisplayTime = "";				
				if (isNaN(scores[k])) {
					//not a number.
				} else { 
					if (scores[k] != "0") {//no name, no score
						formattedDisplayTime = fn_formatMilliSeconds(scores[k]); 
					}
				}			
				board += "<tr style='height:48px; border-bottom:1px solid #E3F1D5;text-align:center;'><td>" + (++rank) + "</td><td>" + names[k] + "</td><td>" + formattedDisplayTime + "</td></tr>";
			}		
			board +="</tbody></table>";
			
			scene.divLeaderboard.innerHTML = board;
			//focus on the enter-your-name field
			scene.time.delayedCall(1000, fn_setFocus, ['nameInput'], scene);			
		};
			
		fn_createTitlePageBtn = function(scene,btnText, handler) {						
			return fn_createBtn(scene,btnText, 68, handler);
		};

		fn_createGame = function(cfg) {
			return new Phaser.Game(cfg);
		};
		
		fn_formatMilliSeconds = function(totalTime) {
			var displayTime = "";
			if (totalTime > 0) {
				displayTime = fn_formatSeconds(Math.floor(totalTime/10)) + ':'+ totalTime%10;
			}
			return displayTime;
		}
		
		fn_shuffle = function(array) {
			for(var i = array.length - 1; i > 0; i--) {
  				var j = Math.floor(Math.random() * i)
  				var temp = array[i]
  				array[i] = array[j]
  				array[j] = temp
			}
		}
		
		fn_syncShuffle = function(arrayList) {
			var count =  arrayList[0].length;
			//synchroizally shuffle multi arrays
			//arrayList is an array of arrays. We use the first array to get the size of the child array.
			//note that all the child arrays has the same size, A typcial use is for Chinese, pinyin, english and urlImage lists
			var randomIndexArray = fn_generateShuffledIndexes("" + count).split("~");
			var tempArrayOfArrays =[];
			for(var i = 0; i < arrayList.length; i++) {
				tempArrayOfArrays[i] = arrayList[i];				
			}
			
			var resultArrays =[];
			for(var j = 0; j < arrayList.length; j++) {
				resultArrays[j] = [];				
			}
			
			for(var k = 0; k < count; k++) {
				var index = parseInt(randomIndexArray[k]);
				for( var m = 0; m < arrayList.length; m++) {
					resultArrays[m].push(tempArrayOfArrays[m][index]);
				}
			}
			
			return resultArrays;
		}
		
		fn_formatSeconds = function(totalTime) {
			if (totalTime.length == 0) {
				return "";
			}
			var minutes = Math.floor(totalTime/60);
			
			var minutesText =""; 
			if (minutes < 10) { 
				minutesText ="0"; 
			}
			 
			minutesText += minutes;
			 
			// Seconds 
			var partInSeconds = totalTime%60; 
			
			// adds left zeros to seconds 
			var secondsText = partInSeconds < 10? "0" + partInSeconds : "" + partInSeconds;
			
			return minutesText + ":" + secondsText
		}
		
		fn_spaceKey = function() {
			return Phaser.Input.Keyboard.KeyCodes.SPACE;
		}
		
		fn_createScene = function(id) {
			return new Phaser.Scene(id);
		};
		
		fn_createEllipse = function(x, y, w, h) {
			return new Phaser.Geom.Ellipse(x, y, w, h);
		};
		
		fn_loadAndPlay = function(scene, key, audioURL, volume) {
			var soundConfig = {
					mute : false,
					volume : volume,
					rate : 1,
					detune : 0,
					seek : 0,
					loop : false,
					delay : 0
			};			
		  //if already loaded, just play it.
		  var instance = scene.sound.get(key);
		  if (instance) {
			 instance.play(soundConfig);
			 return;
		  }
		  //otherwise, load it and then play.
		  var songLoader = scene.load.audio(key, [audioURL]);
		  songLoader.on('filecomplete', function(){
			  this.sound.add(key).play(soundConfig);  
		  }.bind(scene));
		  
		  songLoader.start();
		};
			
		fn_createEllipseCurve = function(x, y, xRadius, yRadius, startAngle, endAngle, clockwise) {
			return new Phaser.Curves.Ellipse(x, y, xRadius, yRadius, startAngle, endAngle, clockwise);
		};
		
		fn_playSound = function(sound, volume, repeat) {
			var soundConfig = {
					mute : false,
					volume : volume,
					rate : 1,
					detune : 0,
					seek : 0,
					loop : repeat,
					delay : 0
			};			
			sound.play(soundConfig);
		};
		
		fn_createBtn = function(scene,btnText, fontSize, handler) {			
			var button = scene.add.text(400, 300, btnText, {
				fontFamily : fn_getEnglishFont(),
				fontSize : fontSize,
				align: "center",
				color : '#FFFF00'
			}).setInteractive({useHandCursor: true}).on('pointerup', handler).on(
				'pointerover', function(){button.setStyle({fill : '#FF00FF'});}).on('pointerout', function(){button.setStyle({fill : '#FFFF00'});});
			return button;
		};

		fn_createStaticBtn = function(scene,btnText,fontFamily,fontSize,color) {			
			return scene.add.text(400, 300, btnText, {
				fontFamily : fontFamily,
				fontSize : fontSize,
				color : color
			});
		};
		
		fn_createPlayAgainBtn=function(scene, btnBackgroundImgId) {
			scene.playAgainBtnBg = scene.add.sprite(100, 200, btnBackgroundImgId).setScale(1.25).setInteractive({useHandCursor: true}).on('pointerup', function() {fn_startOver();});
			fn_centerObject(scene, scene.playAgainBtnBg, -3);		
			scene.tryAgainText = scene.add.text(280, 400, 'Play Again', { fontFamily: fn_getEnglishFont(), fontSize: 50, color: '#FFFF00' }).setInteractive({useHandCursor: true})
			.on('pointerup', function() {fn_startOver();})
			.on('pointerover', function(){scene.tryAgainText.setStyle({fill : '#FF00FF'});}, scene)
			.on('pointerout', function(){scene.tryAgainText.setStyle({fill : '#FFFF00'});}, scene);
			fn_nestedInCenter(scene.tryAgainText,scene.playAgainBtnBg);		
		};
		
        fn_createNonRepeatAni = function(scene, aniKey, frmId) {
	        scene.anims.create({
	            key: aniKey,
	            frames: scene.anims.generateFrameNumbers(frmId),
	            frameRate: 20,
	            repeat: 0,
	            hideOnComplete: true
	        });
		};
		    
		fn_getAlternativeMatchType = function(currentMatchType) {
			//0: front chinese, back, pinyin
			//1: front pinyin, back, chinese		
			//2: front chinese, back, english
			//3: front english, back, chinese		
			//4: front pinyin, back, english
			//5: front english, back, pinyin
			switch(currentMatchType) {
				case 0:
					return 1;
				case 1: 
					return 0;
				case 2:
					return 3;
				case 3:
					return 2;
				case 4: 
					return 5;
				case 5:
					return 4;
			}			
			return 0;
		}
		    
		fn_centerText = function(text) {
			text.x = fn_getCanvasWidth() * 0.5 - text.getBounds().width * 0.5;//center the text
		};


		//explode image particles at the given X/y position
		fn_createAndExplodParticles = function(scene, xPos, yPos, imageId) {
			var explosion = scene.add.particles(imageId).createEmitter({
				x : xPos,
				y : yPos,
				speed : {
					min : -800,
					max : 800
				},
				angle : {
					min : 0,
					max : 360
				},
				scale : {
					start : 0.4,
					end : 0
				},
				blendMode : 'SCREEN',
				//active: false,
				lifespan : 500,
				gravityY : 2000
			});
			for ( var i = 0; i < 40; i++) {
				explosion.explode();
			}
		};

		fn_createId = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::createUniqueId()();
		};

		fn_getCanvasHeight = function() {
			if (_this.gameAgent) {//game is raedy
				return _this.gameAgent.runTimeCanvasHeight();
			} else {
				return _this.@com.archchinese.game.client.ArchLearningGame::getCanvasHeight()();
			}
		};
		fn_getCanvasWidth = function() {
			if (_this.gameAgent) {//game is ready
				return _this.gameAgent.runTimeCanvasWeight();
			} else {
				return _this.@com.archchinese.game.client.ArchLearningGame::getCanvasWidth()();
			}
		};
		
		fn_processPinyin = function(pinyinWithToneNumber){
			return _this.@com.archchinese.game.client.ArchLearningGame::processPinyin(Ljava/lang/String;)(pinyinWithToneNumber);
		}
		fn_hasChineseText = function(text){
			return _this.@com.archchinese.game.client.ArchLearningGame::hasChineseText(Ljava/lang/String;)(text);
		}
		
		fn_saveLocal = function(key, value){			
			@com.archchinese.game.client.Utils::saveLocal(Ljava/lang/String;Ljava/lang/String;)(key,value);
		}
		
		fn_getLocal = function(key){
			return @com.archchinese.game.client.Utils::getLocal(Ljava/lang/String;)(key);
		}
		
		fn_isIOS = function(){
			return @com.archchinese.game.client.Utils::isiOS()();
		}
				
		fn_startOver = function() {
			@com.archchinese.game.client.Utils::refreshPage()();
		};
		
		fn_playWordSound = function(chinese,pinyin){
			@com.archchinese.game.client.Utils::playWordSound(Ljava/lang/String;Ljava/lang/String;)(chinese,pinyin);
		}
		
		fn_isMobile = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::isMobile()();
		};
		fn_getAssetPath = function() {
			return @com.archchinese.game.client.Utils::getGameAssetPath()();
		};

		fn_getAsset = function(gameName, assetName) {
			return fn_getAssetPath() + "assets/" + gameName +  "/" + assetName;
		};
		
		fn_vector = function(x,y) {
			return new Phaser.Math.Vector2(x,y);
		}
		fn_spline = function(points) {
			return new Phaser.Curves.Spline(points);
		}
		fn_rotateAroundDistance = function(items, point, angle, distance) {
			Phaser.Actions.RotateAroundDistance(items, point, angle, distance);
		};
		fn_point = function(x,y) {
			return new Phaser.Geom.Point(x,y);
		}
		fn_phaseOut = function(scene,target,duration) {
			scene.tweens.add({
				targets : target,
				alpha : 0,
				duration : duration,
				yoyo : false,
				repeat : 0
			});			
		};
		
		fn_easeRotate = function(scene,target, x, y, angle, duration) {
			 scene.tweens.add({
 				targets : target,
 				//onStart: function () {},
 				x: x,
 				y: y,
 				angle: angle,
 				duration : duration,
 				ease: 'Elastic',
 				yoyo : false,
 				repeat : 0
 				//onComplete: callback
 			});
		};
		
		fn_easeMove = function(scene,target, x, y, callback) {
			 scene.tweens.add({
 				targets : target,
 				//onStart: function () {},
 				x: x,
 				y: y,
 				duration : 1000,
 				ease: 'Elastic',
 				yoyo : false,
 				repeat : 0,
 				onComplete: callback
 			});
		};
		
		fn_getPinyinFont = function() {
			return "ArchPinyinFont";
		};
		fn_getEnglishFont = function() {
			return "ArchEnglishFont, Impact, Arial";
		};
		fn_getChineseFont = function() {
			return "KaiTi,STKaiti,DFKai-SB,BiauKai,Arial";
		};
		
		fn_loadGameVocabListsByUUID = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::loadGameVocabListsByUUID()();
		};
		fn_loadGameLeaderboard = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::loadGameLeaderboard()();
		};
		
		///////////////////Game configuration loaded from the server////////////////
		fn_getGameTextColor = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::getGameTextColor()();
		};
		
		fn_getGameTextColorInt = function() {
			return parseInt('0x' + fn_getGameTextColor().replace('#', ''));
		}
		
		fn_getGameTextSize = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::getGameTextSize()();
		};
		
		fn_getGameVisitedTextColor = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::getGameVisitedTextColor()();
		};
		fn_getGameMatchedTextColor = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::getGameMatchedTextColor()();
		};
		
		fn_getGameMatchType = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::getGameMatchType()();
		};
		
		fn_getGameWordAudio = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::getGameWordAudio()();
		};

		fn_getTextBackgroundColor = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::getGameTextBackgroundColor()();
		};
				
		fn_getBackgroundMusicVolume = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::getBackgroundMusicVolume()();
		};		
								
		fn_getDifficultyLevel = function() {
			var level = _this.@com.archchinese.game.client.ArchLearningGame::getDifficultyLevel()();
			return level;
		};
		
		fn_getBatchSize = function() {
			return _this.@com.archchinese.game.client.ArchLearningGame::getBatchSize()(); 
		};
		fn_getCreator = function() {
			return @com.archchinese.game.client.GameConfig::getCreator()(); 
		};
		fn_isTesting = function() {
			return @com.archchinese.game.client.Utils::isTesting()(); 
		};		
		
		fn_getSecImgURL = function(url, size) {
			var goodURL = @com.archchinese.game.client.Utils::getSecImgURL(Ljava/lang/String;Ljava/lang/String;)(url,size);
			if (goodURL.length > 10) {
				return goodURL;
			} else {
				return "";
			}						
		};
		
		fn_getUserBackgroundImageURL = function() {
			var userImageURL = @com.archchinese.game.client.GameConfig::getImageURL()();
			if (userImageURL.length > 10) {
				return userImageURL;
			} else {
				return "";
			}			
		};
		
		
		fn_isUserBackgroundImgUsed = function() {
			var userImageURL = @com.archchinese.game.client.GameConfig::getImageURL()();
			return userImageURL.length > 10;
		}				
		//////////////////////////
		fn_generateShuffledIndexes = function(count) {
			return _this.@com.archchinese.game.client.ArchLearningGame::generateShuffledIndexes(Ljava/lang/String;)(count);
		};

		fn_saveScore = function(name,score) {
			_this.@com.archchinese.game.client.ArchLearningGame::saveScore(Ljava/lang/String;Ljava/lang/String;)(name,score);
		};						
			
		fn_centerObject=function(scene, object, offsetY) {
			Phaser.Display.Align.In.Center(
				object,
			    scene.add.zone(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2 - offsetY * 100, fn_getCanvasWidth(), fn_getCanvasHeight()));
		};	
		
		fn_nestedInCenter=function(object, container) {
			Phaser.Display.Align.In.Center(object,container);
		};		
	}-*/;
}
