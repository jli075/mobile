//a scene to place the resume button for scene 1 after scene1 is paused.
sentenceUnscrambler.gameGlass = (function() {
/////////////////////////////////////////////////	
	// public accessible
	var scene = fn_createScene(sentenceUnscrambler.getGameGlassId());
	scene.init = function() {
		this.btnBackgroundImgId = fn_createId();
	};

	scene.preload = function() {		
		this.load.image(this.btnBackgroundImgId, sentenceUnscrambler.getAsset("button-bg.png"));
	};

	scene.create = function() {		
		//stop button
		this.stopBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.stopGame);
		this.stopBtnBg.alpha = 0.5;
		fn_centerObject(this, this.stopBtnBg, -5);
		this.stopBtnBg.x = this.sys.canvas.width - this.stopBtnBg.getBounds().width - 10 + 70;
		this.stopBtn = fn_createBtn(this,"Stop", 24, this.stopGame);
		this.stopBtn.alpha = 0.7;
		fn_nestedInCenter(this.stopBtn,this.stopBtnBg);		
	};


	scene.stopGame = function() {
		scene.scene.stop(sentenceUnscrambler.getGameSceneOneId());
		scene.scene.stop(sentenceUnscrambler.getGameGlassId());
		scene.scene.start(sentenceUnscrambler.getGameOverId());
	}.bind(scene);

	scene.update = function() {
	};
	
	return scene;
////////////////////////////////////////////
})();
