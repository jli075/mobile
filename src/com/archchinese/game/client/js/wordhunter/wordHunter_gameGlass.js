//a scene to place the resume button for scene 1 after scene1 is paused.
wordHunter.gameGlass = (function() {
/////////////////////////////////////////////////
	// public accessible
	var scene = fn_createScene(wordHunter.getGameGlassId());
	scene.init = function() {
		this.btnBackgroundImgId = fn_createId();
	};

	scene.preload = function() {		
		this.load.image(this.btnBackgroundImgId, wordHunter.getAsset("button-bg.png"));		
	};

	scene.create = function() {
		//set resume button
		this.resumeBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.resumeGame);
		this.resumeBtnBg.alpha = 0.5;
		fn_centerObject(this, this.resumeBtnBg, -5);
		this.resumeBtnBg.x -= this.resumeBtnBg.getBounds().width/2 + 10;
		this.resumeBtn = fn_createBtn(this,"Resume", 24, this.resumeGame);
		this.resumeBtn.alpha = 0.7;
		fn_nestedInCenter(this.resumeBtn,this.resumeBtnBg);
		
		//stop button
		this.stopBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.stopGame);
		this.stopBtnBg.alpha = 0.5;
		fn_centerObject(this, this.stopBtnBg, -5);
		this.stopBtnBg.x += this.stopBtnBg.getBounds().width/2 + 10;		
		this.stopBtn = fn_createBtn(this,"Stop", 24, this.stopGame);
		this.stopBtn.alpha = 0.7;
		fn_nestedInCenter(this.stopBtn,this.stopBtnBg);		
	};

	scene.resumeGame = function() {
		scene.scene.sleep(wordHunter.getGameGlassId());
		scene.scene.resume(wordHunter.getGameSceneOneId());
		scene.scene.get(wordHunter.getGameSceneOneId()).enablePauseBtn();
		scene.scene.get(wordHunter.getGameSceneOneId()).resetCursors();					
	}.bind(scene);
	
	scene.stopGame = function() {
		scene.scene.stop(wordHunter.getGameSceneOneId());
		scene.scene.stop(wordHunter.getGameGlassId());
		scene.scene.start(wordHunter.getGameOverId());
	}.bind(scene);
	
	scene.update = function() {
	};
	
	return scene;
////////////////////////////////////////////
})();
