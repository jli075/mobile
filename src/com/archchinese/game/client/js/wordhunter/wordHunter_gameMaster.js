//global variable. This variable can be accessed anywhere. 
//All other variables and functions on this page are scoped to this gameMaster.
wordHunter.gameMaster = (function(){
	//private section
	function config(){//private function
		var conf = fn_getConfig();
		//add the scenes here. Note that GWT stuff is loaded first and 
		//scene objects are not available until Phaser stuff is loaded.
		conf.scene.push(wordHunter.gameTitle);
		conf.scene.push(wordHunter.gameHelp);
		conf.scene.push(wordHunter.gameOptions);
		conf.scene.push(wordHunter.gameGlass);
		conf.scene.push(wordHunter.gameScene1);
		conf.scene.push(wordHunter.gameOver);
		
		return conf;
	}

	//Note that Game code can call into GWT through fn_ prefixed functions , 
	//but we use this agent to receive data from server side.
	//Why not just use the fn-* functions to receive data from server? they cannot because GWT server
	//calls are asynchronous. We don't know when the result will be back. Essentially we 
	//use the fn_* functions to call out to servers, but use this agent to handle the data from server. 
	gameAgent.setMainGameScene(wordHunter.gameScene1);
	gameAgent.setGameOverScene(wordHunter.gameOver);
	
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

//The Module Pattern
// The return statement of the Module contains our public functions. The private
// functions are just those that are not returned. Not returning functions makes
// them inaccessible outside of the Module namespace. But our public functions
// can access our private functions which make them handy for helper functions,
/*
var Module = (function() {
    function privateMethod() {
        // do something
    }

    return {
        publicMethod: function() {
            // can call privateMethod();
        }
    };
})();
*/
