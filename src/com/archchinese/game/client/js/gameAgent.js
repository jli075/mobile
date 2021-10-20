//This is the only middle man that GWT code can use to make calls into our game code. GWT code should not directly access
//the game scence objects, such as game title, game over etc.
var gameAgent = (function(){
	//the main game scene, for example gameScene1.
	var mainGameScene;
	var gameOverScene;
	/////////////////public methods...
	var moduleReturn = {};
	moduleReturn.runTimeCanvasWidth = function () {
		return mainGameScene.sys.canvas.Width;
	};
	moduleReturn.runTimeCanvasHeight = function () {
		return mainGameScene.sys.canvas.height;
	};
	moduleReturn.setMainGameScene = function (scene) {
		mainGameScene = scene;
	};	
	moduleReturn.setGameOverScene = function (scene) {
		gameOverScene = scene;
	};	
	moduleReturn.setGameVocabLists = function (displayName, chineseArray, pinyinArray, englishArray, imgURLArray) {
		mainGameScene.setGameVocabLists(displayName, chineseArray, pinyinArray, englishArray, imgURLArray);
	};	

	moduleReturn.setGameLeaderboard = function (leaderboard) {
		gameOverScene.setGameLeaderboard(leaderboard);
	};	
	
    return moduleReturn;
})();
