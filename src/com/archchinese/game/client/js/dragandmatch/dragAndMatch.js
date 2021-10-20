// the central place to define the shared functions specific to this game. 
var dragAndMatch = (function(){
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
	
	moduleReturn.getGameGlassId = function() {
		return "gameGlass";
	};

	moduleReturn.getAsset = function(name) {
		return fn_getAsset("dragandmatch", name);
	};
	
    return moduleReturn;
})();
