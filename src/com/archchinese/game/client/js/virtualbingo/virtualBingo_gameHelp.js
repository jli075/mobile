virtualBingo.gameHelp = (function() {
/////////////////////////////////////////////////
	function handleReturnBtnDown() {
		fn_navigateTo(scene, virtualBingo.getGameHelpId(), virtualBingo.getGameTitleId());
	}
	
	// public accessible
	var scene = fn_createScene(virtualBingo.getGameHelpId());
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.frameImgId = fn_createId();
	};

	scene.preload = function() {
		var backgroundImageURL = virtualBingo.getAsset("background.jpg");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);	
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}								
		
		this.load.image(this.btnBackgroundImgId, virtualBingo.getAsset("button-bg.png"));
		this.load.image(this.frameImgId, virtualBingo.getAsset("frame.png"));
	};

	scene.create = function() {
		//style the game canvas
		virtualBingo.gameMaster.styleCanvas();
		
		//set background image
		fn_setBackground(this, this.backgroundImgId);

        //set the the help text
		this.helpTextBg = this.add.sprite(100, 200, this.frameImgId).setScale(1.25)
		fn_centerObject(this, this.helpTextBg, 1.5);					
		var instructions = "Bingo help goes here.";		
		this.helpText = this.add.text(400, 100, instructions , {
			fontFamily : fn_getEnglishFont(),
			fontSize : 42,
			color : '#000000',
			align: "center",
			wordWrap: { width: 700, useAdvancedWrap: true }		
		});		
		fn_nestedInCenter(this.helpText,this.helpTextBg);
		
		//set start button
		this.returnBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(1.25).setInteractive();
		fn_centerObject(this, this.returnBtnBg, -4);		
		fn_nestedInCenter(fn_createTitlePageBtn(this, "Return", handleReturnBtnDown),this.returnBtnBg);			
	};

	scene.update = function() {
	};
	
	return scene;
////////////////////////////////////////////
})();
