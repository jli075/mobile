package com.archchinese.game.client;

import java.util.List;
import java.util.Random;
import java.util.Collections;

import com.google.gwt.user.client.Window;


public class Utils {		
	private static final String DELIMITER = "~";

	public static boolean isProduction() {
		String href = Window.Location.getHref();
		return href.toLowerCase().indexOf("archchinese") > 0;
	}
	
	public static boolean isTesting() {
		String href = Window.Location.getHref();
		return href.toLowerCase().indexOf("_test") > 0;
	}
	public static native void showMsg(String msg) /*-{				
		$wnd.alert(msg);		
	}-*/;
	
	public static void playWordSound(String chinese, String pinyin) {
		String listUUID = GameConfig.getListId();
		if (listUUID.length() > 7) {//it is zero length is it is not valid
			AudioManager.playChineseWordByUUID(chinese, pinyin, listUUID);
		}
	}
	public static String cleanAndShortenEnglish(String english) {
		String  eng = english.replace(";", ",");
		eng = eng.replace(",", ", ");
		String[] fields = eng.split(",");
		if (fields.length > 2) {
			return fields[0] + ", " + fields[1] + ", " + fields[2] + ", ..."; 
		} 
		return eng;//return original 
		
	}
	public static String getSecImgURL(String rawURLFromServer, String targetSize) {		
		int size = Integer.valueOf(targetSize);
		return normalizeImageURL(rawURLFromServer, size);
	}
	public static String normalizeImageURL(String rawURLFromServer, int targetSize) {
		if (rawURLFromServer.length() < 10) {
			return " "; //not valid imag url 
		}		
		String imageURL = rawURLFromServer;
		int scaleIndex = imageURL.indexOf("=s");//saved image may already have the =s
		if (scaleIndex > 0) {
			imageURL = imageURL.substring(0, scaleIndex);
  		}

		imageURL = imageURL + "=s" + targetSize;
		if (imageURL.indexOf("http:") == 0) {//replace http with https
			imageURL = "https:" + imageURL.substring(5);
		}
		return imageURL;
	}
	
	public static native void setGameVocabLists(String gameDisplayName, String chineseArray,
			String pinyinArray, String englishArray,
			String imgURLArray) /*-{				
		fn_gameVocabListsReady(gameDisplayName, chineseArray, pinyinArray, englishArray, imgURLArray);		
	}-*/;

	public static native void setGameLeaderboard(String leaderboard) /*-{				
		fn_gameLeaderboardReady(leaderboard);		
	}-*/;

	public static void shuffle(List<?> entries) {
		//shuffle
		Random random = new Random(entries.size());  
		for(int index = 0; index < entries.size(); index += 1) {  
		    Collections.swap(entries, index, index + random.nextInt(entries.size() - index));  
		}
	}
	
	public static String getGameAssetPath() {
		if (Utils.isProduction()) {
			//production env, the path is as following: https://www.archchinese.com/assets/mypicture.png for word hunter project
			//for other projects, https://www.archchinese.com/assets/projectname/mypicture.png
			return "https://www.archchinese.com/";
		}
		return "";//local path is inside the archclearninggame folder.
	}
	
	public static String getGameUUID() {
		String uuid = "";
		String query = Window.Location.getParameter("g");//game id, used to retrieve the list id, game creator and game configuration info.
		if (query != null && query.trim().length() == 36 && UUIDGenerator.isValidUUID(query.trim())) {
			uuid = query.trim();	
		}
		return uuid;
	}	
	
	public static native void generalDisplay(String id, String html)/*-{
		if($doc.getElementById(id)){
			$doc.getElementById(id).innerHTML = html;
		}
	}-*/;

	public static native void getLocal(String key)/*-{
		var storage = $wnd.localStorage;
		if (storage) {
			return storage.getItem(key);
		}
		return "";
	}-*/;

	public static native void saveLocal(String key, String value)/*-{
		var storage = $wnd.localStorage;
		if (storage) {
			storage.setItem(key, value);
		}
    }-*/;

	private static boolean isChinese(char c) {
		//CJK Symbols and Punctuation, such as 。 in the block 3000 to 303F block
		//Range: 3000–303F
		return c >= 0x2e81 && c <= 0xfa29 && !(c >=0x3000 && c <=0x303F);
	}
	
	public static boolean hasChineseText(String text) {
		for(int i = 0; i < text.length(); i++) {
			if (isChinese(text.charAt(i))) {
				return true;
			}
		}
		return false;
	}
	
	
	public static native boolean isiOS()/*-{
		if(/iPhone|iPad|iPod/i.test($wnd.navigator.userAgent)){
			return true;
		}
		return false;    
	}-*/;
	
	public static String buildChineseCodes(String chinese, String separator) {
		String unicodes = "";//pipe separated
		for(int i = 0; i < chinese.length(); i++) {
			if (chinese.charAt(i) >= 0x2e81 && chinese.charAt(i)  <=0xfa29) {
				if (unicodes.length() > 0) {
					unicodes +=separator;
				}
				unicodes += Integer.toHexString(chinese.charAt(i));
			} 		
		}
		return unicodes;
	}
	
	public static native void playAudioURL(String url) /*-{
		$wnd.archPlayer.stopAll();;
		$wnd.archPlayer.play(url);    
	}-*/;      

	public static String createPinyinURL(String py) {
		
		String pinyin = py.trim().replace("u:", "v");
		pinyin = pinyin.toLowerCase();
		
		if (py.length() > 1) {
			if (py.charAt(py.length()-1) == '5' || py.charAt(py.length()-1) == '0') {
				String letterPart = py.substring(0,py.length()-1);
				 
				if (PinyinMapper.neutralList.contains(letterPart)) {
					//well-known neutral tone Pinyin
					//does nothing. we created those Pinyin recording 9/28/15
					pinyin = pinyin.replace("0", "5");
				} else {
					pinyin = pinyin.replace("5", "1");
					pinyin = pinyin.replace("0", "1");
				}
			}
		}
		
		if (pinyin.length() < 1) {
			return "";
		}
		
		String archAudio = "abcdefghijklmnopq";
		String soundURL = "https://www.archchinese.com/swf/";
		//all moved to the same archchinese-hd, not in arch4 any more 2/18/2016
		if (archAudio.indexOf(pinyin.charAt(0)) < 0) {
			soundURL = "https://www.archchinese.com/audio/";
		}
		soundURL +=pinyin + ".mp3";
		return soundURL;
	}
	
	//audioFileNames = "zha4.mp3,zheng4.mp3,zuo1.mp3";
	public static native void playAudioChain(String audionameslist)/*-{
		try{
			var audionamesarray = audionameslist.split(',');
			var audio = new Audio();
			audio.src=audionamesarray.shift();
			audio.play();
	
			audio.onended = function() {
			if(audionamesarray.length > 0){
				audio.src=audionamesarray.shift();
				audio.play();
				}
			};
		}catch(e) {
		}
	}-*/;
	
	public static native void post_form(String url,String[] keys,String[] values, String target)/*-{
		//$wnd.sec_post(url, keys, values, target);
		//post in a new window
	  var form = $doc.createElement("form");
	  form.action = url;
	  form.method = 'POST';
	  form.target = target || "_blank";
	  if (keys) {
	    for (var i =0; i < keys.length;i++) {
	      var input = $doc.createElement("textarea");
	      input.name = keys[i];
	      input.value = values[i];
	      form.appendChild(input);
	    }
	  }
	  form.style.display = 'none';
	  $doc.body.appendChild(form);
	  form.submit();
	  $doc.body.removeChild(form);
	}-*/;
	
	public static String convertWordListToString(String[] words) {
		String result = "";
		for(int i = 0; i < words.length; i++) {
			if (result.length() > 0) {
				result +=DELIMITER;
			}
			result += words[i].replaceAll(DELIMITER, "");//remove the delimiter in the words			
		}
		return result;
	}
			
	public static native void refreshPage()/*-{
		$doc.location.reload();   
	}-*/;

	public static native boolean isMobile()/*-{
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Tablet|IEMobile|Opera Mini|Windows Phone/i.test($wnd.navigator.userAgent)){
			return true;
		}
		return false;    
	}-*/;
		
	public static native void forceToHttps()/*-{
		if ("http:" == $doc.location.protocol) {
			$wnd.location.href = "https:" + $wnd.location.href.substring(5);
		} else if ($wnd.location.href.toLowerCase().indexOf(
				"https://archchinese.com") == 0) {
			$wnd.location.href = "https://www.archchinese.com"
					+ $wnd.location.href.substring(23);
		}
	}-*/;
	 
}
