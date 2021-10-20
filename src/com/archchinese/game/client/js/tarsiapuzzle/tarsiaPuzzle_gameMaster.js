//global variable. This variable can be accessed anywhere. 
//All other variables and functions on this page are scoped to this gameMaster.
//The Module Pattern
tarsiaPuzzle.gameMaster = (function(){
	//private section
	function config(){//private function
		var conf = fn_getConfig();
		//add the scenes here. Note that GWT stuff is loaded first and 
		//scene objects are not available until Phaser stuff is loaded.
		conf.scene.push(tarsiaPuzzle.gameTitle);
		conf.scene.push(tarsiaPuzzle.gameHelp);
		conf.scene.push(tarsiaPuzzle.gameOptions);
		conf.scene.push(tarsiaPuzzle.gameGlass);
		conf.scene.push(tarsiaPuzzle.gameScene1);
		conf.scene.push(tarsiaPuzzle.gameOver);
		
		//remove gravity for Drag and Match
		conf.physics.arcade.gravity.y = 0;
		return conf;
	}

	//Note that Game code can call into GWT through fn_ prefixed functions , 
	//but we use this agent to receive data from server side.
	//Why not just use the fn-* functions to receive data from server? they cannot because GWT server
	//calls are asynchronous. We don't know when the result will be back. Essentially we 
	//use the fn_* functions to call out to servers, but use this agent to handle the data from server. 
	gameAgent.setMainGameScene(tarsiaPuzzle.gameScene1);
	gameAgent.setGameOverScene(tarsiaPuzzle.gameOver);
	
	////////////////////////////////////
	//publicly accessible, but not globally
	var moduleReturn = {};
	moduleReturn.game = fn_createGame(config());//initialize the game
	
	//tell GWT that game data agent is ready
	fn_registerDataAgent(gameAgent);
	///////////
	
	moduleReturn.styleCanvas = function () {//export the styleCanvas function
		fn_styleCanvas(this.game);
	};
    return moduleReturn;
})();


