// the central place to define the shared functions specific to this game. 
var virtualBingo = (function(){
	////////////////////////////////////
	//publicly accessible, but not globally
	var moduleReturn = {};
	
	moduleReturn.getGameOverId = function() {
		return "gameOver";
	};

	moduleReturn.getGameTitleId = function() {
		return "gameTitle";
	};
	
	moduleReturn.getGameSceneOneId = function() {
		return "gameScene1";
	};

	moduleReturn.getGameHelpId = function() {
		return "gameHelp";
	};

	moduleReturn.getAsset = function(name) {
		return fn_getAsset("virtualbingo", name);
	};
		
    return moduleReturn;
})();
