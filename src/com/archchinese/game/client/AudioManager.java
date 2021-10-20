package com.archchinese.game.client;

import java.util.HashMap;
import java.util.Map;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.http.client.URL;

public class AudioManager {
	private static Map<String,String> uuidMembershipMap = new HashMap<String,String>();
	private static VocabManager vocabManager = new VocabManager();
	
	private static String mapStrokeName(String shortName) {
		String mappedStrokeName = "";
		if ("d".equalsIgnoreCase(shortName)) {
			mappedStrokeName ="dian3";
		} else if ("h".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2";
		} else if ("s".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="shu4";
		} else if ("p".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="pie3";
		} else if ("n".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="na4";
		} else if ("t".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="ti2";
		} else if ("hg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2gou1";
		} else if ("sg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="shu4gou1";
		} else if ("xg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="xie2gou1";
		} else if ("hz".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2zhe2";
		} else if ("sz".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="shu4zhe2";
		} else if ("hp".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2pie3";
		} else if ("pd".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="pie3dian3";
		} else if ("hzzzg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2zhe2zhe2zhe2gou1";
		} else if ("hxwg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2xie2wang1gou1";
		} else if ("swg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="shu4wang1gou1";
		} else if ("hzwg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2zhe2wang1gou1";
		} else if ("szwg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="shu4zhe2wang1gou1";
		} else if ("wg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="wang1gou1";
		} else if ("hzg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2zhe2gou1";
		} else if ("hzt".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2zhe2ti2";
		} else if ("hzzp".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2zhe2zhe2pie3";
		} else if ("hpwg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2pie3wang1gou1";
		} else if ("pz".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="pie3zhe2";
		} else if ("st".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="shu4ti2";
		} else if ("szp".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="shu4zhe2pie3";
		} else if ("szz".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="shu4zhe2zhe2";
		} else if ("hzzz".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2zhe2zhe2zhe2";
		} else if ("hzw".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2zhe2wang1";
		} else if ("bxg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="bian3xie2gou1";
		} else if ("hxg".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2xie2gou1";
		} else if ("hzz".equalsIgnoreCase(shortName)) {			
			mappedStrokeName ="heng2zhe2zhe2";
		} 
		return mappedStrokeName;
	}
	public static void playStroke(String strokeName) {
		String mappedStrokeName = mapStrokeName(strokeName);
		if (mappedStrokeName == null || mappedStrokeName.length() < 1) {
			return;//invalid
		}
		String soundURL = "https://www.archchinese.com/audio/" + mappedStrokeName.trim() + ".mp3";
		
		Utils.playAudioURL(soundURL);
	}
		
	public static void playPinyin(String py) {
		if (py == null || py.length() < 1) {
			return;//invalid
		}

		if (py.indexOf(',') > 0) {			
			 String[] fields = py.split(",");
			 if (fields.length > 0) {
				 String soundURL =  Utils.createPinyinURL(fields[0]);//only play the first one
				 Utils.playAudioURL(soundURL);
			 }
		} else {
			String soundURL = Utils.createPinyinURL(py);
			Utils.playAudioURL(soundURL);		
		}
	}
	
	public static void playChineseWordByUUID(final String vocabChinese, final String pinyin, final String uuid) {		
		final String codes = Utils.buildChineseCodes(vocabChinese,"|");
		if (codes.length() == 0) {
			return;
		} 
		String isUUIDOwnerMember = uuidMembershipMap.get(uuid);
		if (isUUIDOwnerMember != null) {//made remote call before...
			//no remote calls
			handlePostUUIMembershipCheck(vocabChinese,pinyin, uuid, codes, isUUIDOwnerMember);
		} else {
			//this is the first time, no remote call is made yet
			Callback callback = new Callback() {
				@Override
				public void execute(String data) {
					uuidMembershipMap.put(uuid, data);
					handlePostUUIMembershipCheck(vocabChinese, pinyin, uuid, codes, data);
				}			
			};
			
			new GenericGetLoader().load("https://www.archchinese.com/checkUUIDOwner?uuid=" + uuid, callback);			
		}
	}
	public static void memberValidCheckByUUID(final String uuid, final Callback callback) {
		String isUUIDOwnerMember = uuidMembershipMap.get(uuid);
		if (isUUIDOwnerMember != null) {//made remote call before...
			//we are good
			callback.execute(isUUIDOwnerMember);//will be "Y" if it is valid
		} else {
			//check server now
			Callback handler = new Callback() {
				@Override
				public void execute(String data) {
					//cache it
					uuidMembershipMap.put(uuid, data);
					callback.execute(data);
				}			
			};
			
			new GenericGetLoader().load("https://www.archchinese.com/checkUUIDOwner?uuid=" + uuid, handler);
		}
	}
	private static void handlePostUUIMembershipCheck(String vocabChinese, String pinyin,
			final String uuid, final String codes, String isUUIDOwnerMember) {
		if ("Y".equals(isUUIDOwnerMember)) {
			//the membership of the owner of the list identified by the UUID is still valid
			//proceed to play the sound
			postUUIDMembershipCheck(vocabChinese, pinyin, uuid, codes);
		} else {
			//Utils.showMsg("The sound of " + vocabChinese + " cannot be played. The vocab list owner's membership has expired. Please ask the owner of this vocab list to <a href='https://www.archchinese.com/arch_membership.html'>renew his/her membership</a>. ");
			AudioChainHelper.play(vocabChinese, pinyin);
		}
	}
	private static void postUUIDMembershipCheck(final String vocabChinese, final String pinyin, final String uuid,
			final String codes) {
		if (Utils.isiOS()) {//FIX IOS SOUND ISSUES
			String soundURL= "https://www.archchinese.com/getMobileSimpCoreSoundByUUID?unicode="+codes + "&uuid="+uuid;
			Utils.playAudioURL(soundURL);			
			return;
		}
		
		//check to see if the audio exist first
		String url = "https://www.archchinese.com/checkSimpCoreAudio?c=" + codes;
		try {
			new RequestBuilder(RequestBuilder.GET, url).sendRequest(null, new RequestCallback() {
		    public void onError(Request request, Throwable exception) {
		    }
		    public void onResponseReceived(Request request, Response response) {		    
		      if (200 == response.getStatusCode()) {
		    	  	String result = response.getText();
		    	  	if ("y".equalsIgnoreCase(result)) {
		    	  		//good, play the audio
		    			String soundURL= "https://www.archchinese.com/getMobileSimpCoreSoundByUUID?unicode="+codes + "&uuid="+uuid;
		    			Utils.playAudioURL(soundURL);
		    	  	} else {
		    	  		//no audio for this chinese word (character compound)
		    	  		//show the message to the user
		    	  		//Utils.showMsg("The native-speaker recording of this word is currently not available. Please try again later.");
		    	  		//todo: need to find the simple word  if it is a trad word s		    	  	
		    	  		AudioChainHelper.play(vocabChinese, pinyin);
		    	  	}
		      } else {
		      }
		    }			
		  });
		} catch (RequestException e) {
		}
	}
		
	private static void convertTradToSimp(String tradChinese, final Callback callback) {
		String url = "https://service.archchinese.com/FlashCardMaker/ChineseTextSegmenter";
		String paramList = "t2s="+URL.encodeQueryString(tradChinese);
		try {
			RequestBuilder builder = new RequestBuilder(RequestBuilder.POST, url);			
			builder.setHeader("content-type","application/x-www-form-urlencoded");
			builder.sendRequest(paramList, new RequestCallback() {
		    public void onError(Request request, Throwable exception) {				    	
		    }
		    public void onResponseReceived(Request request, Response response) {		    	
		      if (200 == response.getStatusCode()) {
		    	    String data = response.getText();
		    	    callback.execute(data);
		      } else {
		      }
		    }			
		  });		 		
		} catch (RequestException e) {			
		}		
	}
}
