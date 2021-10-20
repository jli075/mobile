package com.archchinese.game.util;

import java.io.File;
import java.io.IOException;
import java.util.List;

import com.archchinese.game.client.BuildConfig;
import com.google.gwt.core.ext.LinkerContext;
import com.google.gwt.core.ext.TreeLogger;
import com.google.gwt.core.ext.UnableToCompleteException;
import com.google.gwt.core.ext.linker.AbstractLinker;
import com.google.gwt.core.ext.linker.ArtifactSet;
import com.google.gwt.core.ext.linker.LinkerOrder;
import com.google.gwt.thirdparty.guava.common.base.Charsets;
import com.google.gwt.thirdparty.guava.common.io.Files;

@LinkerOrder(LinkerOrder.Order.POST)
public class ScriptOptimizer extends AbstractLinker {

    @Override
    public String getDescription() {
        return "Optimizes external JavaScript files.";
    }
    
    @Override
    public ArtifactSet link(TreeLogger logger, LinkerContext context,
            ArtifactSet artifacts) throws UnableToCompleteException {

        // This is some arbitrary JavaScript code you'd probably want to read
        // from a static file in your classpath
    	String[] jsFiles = new String[]{
    		//	"phaser/archlearninggame_embeddable.js"
    	};//no post processing be default
    	
    	String gameOutputFile = BuildConfig.getScriptFile(BuildConfig.getCurrentGameType());
    	if (BuildConfig.isWordHunter()) {//0
	    		jsFiles = new String[]{
		    		"gameAgent.js",//agent for receiving data from GWT and data server
		    		"wordhunter/wordHunter.js",
		    		"wordhunter/wordHunter_gameTitle.js",
		    		"wordhunter/wordHunter_gameHelp.js",
		    		"wordhunter/wordHunter_gameOptions.js",
		    		"wordhunter/wordHunter_gameGlass.js",
		    		"wordhunter/wordHunter_gameScene1.js",//more scenes if needed
		    		"wordhunter/wordHunter_gameOver.js",
		    		"wordhunter/wordHunter_gameMaster.js"    			
	    		}; 
    	} else if (BuildConfig.isWordStrike()) {//1
    		jsFiles = new String[]{
		    		"gameAgent.js",//agent for receiving data from GWT and data server
		    		"wordstrike/wordStrike.js",
		    		"wordstrike/wordStrike_gameTitle.js",
		    		"wordstrike/wordStrike_gameHelp.js",
		    		"wordstrike/wordStrike_gameOptions.js",
		    		"wordstrike/wordStrike_gameGlass.js",
		    		"wordstrike/wordStrike_gameScene1.js",//more scenes if needed
		    		"wordstrike/wordStrike_gameOver.js",
		    		"wordstrike/wordStrike_gameMaster.js"    			
	    		};   
    	} else if (BuildConfig.isVirtualBingo()) {//2
    		jsFiles = new String[]{
		    		"gameAgent.js",//agent for receiving data from GWT and data server
		    		"virtualbingo/virtualBingo.js",
		    		"virtualbingo/virtualBingo_gameTitle.js",
		    		"virtualbingo/virtualBingo_gameHelp.js",
		    		"virtualbingo/virtualBingo_gameScene1.js",//more scenes if needed
		    		"virtualbingo/virtualBingo_gameOver.js",
		    		"virtualbingo/virtualBingo_gameMaster.js"    			
	    		};   
    	} else if (BuildConfig.isWhackAMole()) {//3
    		jsFiles = new String[]{
		    		"gameAgent.js",//agent for receiving data from GWT and data server
		    		"whackamole/whackAMole.js",
		    		"whackamole/whackAMole_gameTitle.js",
		    		"whackamole/whackAMole_gameHelp.js",
		    		"whackamole/whackAMole_gameGlass.js",
		    		"whackamole/whackAMole_gameScene1.js",//more scenes if needed
		    		"whackamole/whackAMole_gameOver.js",
		    		"whackamole/whackAMole_gameMaster.js"    			
	    		};   
    	} else if (BuildConfig.isDragAndMatch()) {//4
    		jsFiles = new String[]{
		    		"gameAgent.js",//agent for receiving data from GWT and data server
		    		"dragandmatch/dragAndMatch.js",
		    		"dragandmatch/dragAndMatch_gameTitle.js",
		    		"dragandmatch/dragAndMatch_gameHelp.js",
		    		"dragandmatch/dragAndMatch_gameGlass.js",
		    		"dragandmatch/dragAndMatch_gameScene1.js",//more scenes if needed
		    		"dragandmatch/dragAndMatch_gameOver.js",
		    		"dragandmatch/dragAndMatch_gameMaster.js"    			
	    		};   
    	} else if (BuildConfig.isJigsawPuzzle()) {//5
    		jsFiles = new String[]{
		    		"gameAgent.js",//agent for receiving data from GWT and data server
		    		"jigsawpuzzle/jigsawPuzzle.js",
		    		"jigsawpuzzle/jigsawPuzzle_gameTitle.js",
		    		"jigsawpuzzle/jigsawPuzzle_gameHelp.js",
		    		"jigsawpuzzle/jigsawPuzzle_gameOptions.js",		    		
		    		"jigsawpuzzle/jigsawPuzzle_gameGlass.js",
		    		"jigsawpuzzle/jigsawPuzzle_gameScene1.js",//more scenes if needed
		    		"jigsawpuzzle/jigsawPuzzle_gameOver.js",
		    		"jigsawpuzzle/jigsawPuzzle_gameMaster.js"    			
	    		};   
    	}  else if (BuildConfig.isBalloonPop()) {//6
    		jsFiles = new String[]{
		    		"gameAgent.js",//agent for receiving data from GWT and data server
		    		"balloonpop/balloonPop.js",
		    		"balloonpop/balloonPop_gameTitle.js",
		    		"balloonpop/balloonPop_gameHelp.js",
		    		"balloonpop/balloonPop_gameOptions.js",		    		
		    		"balloonpop/balloonPop_gameGlass.js",
		    		"balloonpop/balloonPop_gameScene1.js",//more scenes if needed
		    		"balloonpop/balloonPop_gameOver.js",
		    		"balloonpop/balloonPop_gameMaster.js"    			
	    		};   
    	} else if (BuildConfig.isWordEater()) {//7
    		jsFiles = new String[]{
		    		"gameAgent.js",//agent for receiving data from GWT and data server
		    		"wordeater/wordEater.js",
		    		"wordeater/wordEater_gameTitle.js",
		    		"wordeater/wordEater_gameHelp.js",
		    		"wordeater/wordEater_gameOptions.js",		    		
		    		"wordeater/wordEater_gameGlass.js",
		    		"wordeater/wordEater_gameScene1.js",//more scenes if needed
		    		"wordeater/wordEater_gameOver.js",
		    		"wordeater/wordEater_gameMaster.js"    			
	    		};   
    	} else if (BuildConfig.isWheelOfWords()) {//8
    		jsFiles = new String[]{
		    		"gameAgent.js",//agent for receiving data from GWT and data server
		    		"wheelofwords/wheelOfWords.js",
		    		"wheelofwords/wheelOfWords_gameTitle.js",
		    		"wheelofwords/wheelOfWords_gameHelp.js",
		    		"wheelofwords/wheelOfWords_gameOptions.js",		    		
		    		"wheelofwords/wheelOfWords_gameGlass.js",
		    		"wheelofwords/wheelOfWords_gameScene1.js",//more scenes if needed
		    		"wheelofwords/wheelOfWords_gameOver.js",
		    		"wheelofwords/wheelOfWords_gameMaster.js"    			
	    		};   
    	} else if (BuildConfig.isSentenceUnscrambler()) {//8
    		jsFiles = new String[]{
		    		"gameAgent.js",//agent for receiving data from GWT and data server
		    		"sentenceunscrambler/sentenceUnscrambler.js",
		    		"sentenceunscrambler/sentenceUnscrambler_gameTitle.js",
		    		"sentenceunscrambler/sentenceUnscrambler_gameHelp.js",
		    		"sentenceunscrambler/sentenceUnscrambler_gameOptions.js",		    		
		    		"sentenceunscrambler/sentenceUnscrambler_gameGlass.js",
		    		"sentenceunscrambler/sentenceUnscrambler_gameScene1.js",//more scenes if needed
		    		"sentenceunscrambler/sentenceUnscrambler_gameOver.js",
		    		"sentenceunscrambler/sentenceUnscrambler_gameMaster.js"    			
	    		};   
    	} else if (BuildConfig.isTarsiaPuzzle()) {//8
    		jsFiles = new String[]{
		    		"gameAgent.js",//agent for receiving data from GWT and data server
		    		"tarsiapuzzle/tarsiaPuzzle.js",
		    		"tarsiapuzzle/tarsiaPuzzle_gameTitle.js",
		    		"tarsiapuzzle/tarsiaPuzzle_gameHelp.js",
		    		"tarsiapuzzle/tarsiaPuzzle_gameOptions.js",		    		
		    		"tarsiapuzzle/tarsiaPuzzle_gameGlass.js",
		    		"tarsiapuzzle/tarsiaPuzzle_gameScene1.js",//more scenes if needed
		    		"tarsiapuzzle/tarsiaPuzzle_gameOver.js",
		    		"tarsiapuzzle/tarsiaPuzzle_gameMaster.js"    			
	    		};   
    	}
    	
    	
    	String scripts = "";    	    	
    	for(String fileName : jsFiles) {
			try {
				List<String> lines = Files.readLines(new File("C:/mobile/ArchLearningGame/src/com/archchinese/game/client/js/" + fileName), Charsets.UTF_8);
		    	for(String line : lines) {
		    		scripts += line +"\n";
		    	}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	}
    	
        String script = scripts;  

        // Do the optimizations, not for dev phase
        //script = context.optimizeJavaScript(logger, script);

        // Create an Artifact from the optimized JavaScript string
        ArtifactSet newArtifacts = new ArtifactSet(artifacts);
        
        newArtifacts.add(emitString(logger, script, "../../war/archlearninggame/" + gameOutputFile));
        
        return newArtifacts;
    }
}