// the central place to define the shared functions specific to this game. 
var wordHunter = (function(){
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
	
	moduleReturn.getGameOptionsId = function() {
		return "gameOptions";
	};
	
	moduleReturn.getGameGlassId = function() {
		return "gameGlass";
	};
	
	moduleReturn.isMusicOn = function() {
		return fn_getLocal("wordHunter_musicOn") != "0";
	};

	moduleReturn.setMusicOn = function(musicOn) {
		var isOn = musicOn? "1" : "0";
		fn_saveLocal("wordHunter_musicOn", isOn);
	};

	moduleReturn.isMobileControlOn = function() {
		return fn_getLocal("wordHunter_controlOn") == "1"
	};
	
	moduleReturn.setMobileControlOn = function(controlOn) {
		var isOn = controlOn? "1" : "0";
		fn_saveLocal("wordHunter_controlOn", isOn);
	};
	//options related ends.
	moduleReturn.getAsset = function(name) {
		return fn_getAsset("wordhunter", name);
	};

    return moduleReturn;
})();
