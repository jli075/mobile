//the last scene of this game
virtualBingo.gameOver = (function() {
	var scene = fn_createScene(virtualBingo.getGameOverId());
	
	scene.init = function() {
		//set the ids heres
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
	}

	scene.preload = function() {
		this.load.image(this.btnBackgroundImgId, virtualBingo.getAsset("button-bg.png"));
	}

	scene.create = function() {
		fn_stopFullScreen(this);
		
		//use the same background as the game title and game title is created before this scene is created
		//so we are safe here.
		fn_createGradient(this, this.backgroundImgId,'#000000', '#000000');//black background
		fn_setBackground(this, this.backgroundImgId);
		
		//game over text
		fn_centerObject(this, fn_createGameOverLabel(this), 0);

		fn_createPlayAgainBtn(this,this.btnBackgroundImgId);		
	}

	scene.update = function() {
	}	
	///////////////////////
	return scene;
})();





