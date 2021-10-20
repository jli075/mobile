//the first scene of this game. 
virtualBingo.gameTitle = (function() {
/////////////////////////////////////////////////	
	// public accessible
	var scene = fn_createScene(virtualBingo.getGameTitleId());
	
	function handleStartBtnDown() {
		fn_navigateTo(scene, virtualBingo.getGameTitleId(), virtualBingo.getGameSceneOneId());
	}
	
	function handleHelpBtnDown() {
		fn_navigateTo(scene, virtualBingo.getGameTitleId(), virtualBingo.getGameHelpId());
	}
	
	scene.init = function() {
		this.backgroundImgId = fn_createId();
//		this.btnBackgroundImgId = fn_createId();						
	};

	scene.preload = function() {
//		var backgroundImageURL = virtualBingo.getAsset("background.jpg");
//		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
//		if (userBackgroundImageURL.length > 0) {
//			this.load.image(this.backgroundImgId, userBackgroundImageURL);	
//		} else {
//			this.load.image(this.backgroundImgId, backgroundImageURL);
//		}								
//		
//		this.load.image(this.btnBackgroundImgId, virtualBingo.getAsset("button-bg.png"));
		this.load.image(this.backgroundImgId, "assets/virtualbingo/background.jpg");
	};

	scene.create = function() {
		//style the game canvas
		virtualBingo.gameMaster.styleCanvas();
		
		fn_setBackground(this, this.backgroundImgId);
  
		
		fn_centerObject(this, fn_createTitlePageBtn(this, "Start", handleStartBtnDown), 1);
		
//		//set start button
//		this.startBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(1.25).setInteractive();
//		fn_centerObject(this, this.startBtnBg, 1);		
//		fn_nestedInCenter(fn_createTitlePageBtn(this, "Start", handleStartBtnDown),this.startBtnBg);		
//		
//		//set help button
//		this.helpBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(1.25).setInteractive();
//		fn_centerObject(this, this.helpBtnBg, -1);		
//		fn_nestedInCenter(fn_createTitlePageBtn(this, "Help", handleHelpBtnDown),this.helpBtnBg);		
				
		//load a dummy pinyin text to trigger loading the Pinyin font in advance.
		//otherwise, Pinyin font won't be immediately available on the main scene screen.
		fn_initPinyinFont(this);
	};

	scene.update = function() {
	};

	return scene;

})();
