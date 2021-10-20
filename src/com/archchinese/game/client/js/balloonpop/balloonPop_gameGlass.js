//a scene to place the resume button for scene 1 after scene1 is paused.
balloonPop.gameGlass = (function() {
/////////////////////////////////////////////////	
	// public accessible
	var scene = fn_createScene(balloonPop.getGameGlassId());
	scene.init = function() {
		this.btnBackgroundImgId = fn_createId();
	};

	scene.preload = function() {		
		this.load.image(this.btnBackgroundImgId, balloonPop.getAsset("button-bg.png"));
	};

	scene.create = function() {
		//set resume button
		this.resumeBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.resumeGame);
		this.resumeBtnBg.alpha = 0.5;
		fn_centerObject(this, this.resumeBtnBg, -5);
		this.resumeBtnBg.x = this.sys.canvas.width - 2 * this.resumeBtnBg.getBounds().width -20 + 70;
		
		this.resumeBtn = fn_createBtn(this,"Resume", 24, this.resumeGame);
		this.resumeBtn.alpha = 0.7;
		fn_nestedInCenter(this.resumeBtn,this.resumeBtnBg);
		
		//stop button
		this.stopBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.stopGame);
		this.stopBtnBg.alpha = 0.5;
		fn_centerObject(this, this.stopBtnBg, -5);
		this.stopBtnBg.x = this.sys.canvas.width - this.stopBtnBg.getBounds().width - 10 + 70;
		this.stopBtn = fn_createBtn(this,"Stop", 24, this.stopGame);
		this.stopBtn.alpha = 0.7;
		fn_nestedInCenter(this.stopBtn,this.stopBtnBg);		
	};
	
	scene.resumeGame = function() {
		scene.scene.sleep(balloonPop.getGameGlassId());
		scene.scene.resume(balloonPop.getGameSceneOneId());
		scene.scene.get(balloonPop.getGameSceneOneId()).enablePauseBtn();//enable pause	
	}.bind(scene);

	scene.stopGame = function() {
		scene.scene.stop(balloonPop.getGameSceneOneId());
		scene.scene.stop(balloonPop.getGameGlassId());
		scene.scene.start(balloonPop.getGameOverId());
	}.bind(scene);

	scene.update = function() {
	};
	
	return scene;
////////////////////////////////////////////
})();
