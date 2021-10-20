package com.archchinese.game.client;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.http.client.URL;

public class AudioChainHelper {
	
	public static void downloadAudioForWordNotInDictionary(final String chinese, final String serialKey){
		String url = "https://service.archchinese.com/FlashCardMaker/ChineseTextSegmenter";
		String paramList = "c2p="+URL.encodeQueryString(chinese);
		try {
			RequestBuilder builder = new RequestBuilder(RequestBuilder.POST, url);			
			builder.setHeader("content-type","application/x-www-form-urlencoded");
			builder.sendRequest(paramList, new RequestCallback() {
		    public void onError(Request request, Throwable exception) {				    	
		    }
		    public void onResponseReceived(Request request, Response response) {		    	
		      if (200 == response.getStatusCode()) {
		    	    String data = response.getText();
		    	    String[] newPinyinList = data.split("\\|");
	    	    	//clear up for pinyin for single characters, could have multiples
	    	    	for(int i = 0; i < newPinyinList.length; i++) {
	    	    		if (newPinyinList[i].indexOf(",") > 0) { //has multiple Pinyin, use the primary pinyin only
	    	    			newPinyinList[i] = newPinyinList[i].split(",")[0].trim();
	    	    		}
	    	    	}
	    	    	List<String> pList = new ArrayList<String>();
	    	    	for(String p : newPinyinList) {
	    	    		String[] fields = p.split(" ");
	    	    		for(String field : fields) {
	    	    			pList.add(field);
	    	    		}
	    	    	}
	    	    	String[] pArray = new String[pList.size()];
	    	    	for(int i = 0; i < pArray.length; i++) {
	    	    		pArray[i] = pList.get(i);
	    	    	}
	    	    	downloadSyntheticAudioForPinyin(pArray, chinese, serialKey);	    	    	
		      } else {		    	  
		      }
		    }			
		  });		 		
		} catch (RequestException e) {			
		}
	}
		
	protected static void downloadSyntheticAudioForPinyin(final String[] pArray, final String chinese, final String serialKey) {
		String py = "";
		for(String p : pArray) {
			if (py.length() > 0) {
				py += " ";
			}
			py += p;
		}
		String url = "https://service.archchinese.com/FlashCardMaker/getAudio";
		String[] keys = new String[3];
		keys[0] = "p";
		keys[1] = "c";
		keys[2] = "userId";
		
		String[] values = new String[3];
		values[0] = py;
		values[1] = chinese;
		values[2] = serialKey;
		
		Utils.post_form(url, keys, values, "_blank");		
	}

	private static void playPinyinForWordNotInDictionary(
			final String chinese) {
		String pipedChineseText= chinese;//one word
		if (pipedChineseText.length() == 0) {
			return;
		}
		
		String url = "https://service.archchinese.com/FlashCardMaker/ChineseTextSegmenter";
		String paramList = "c2p="+URL.encodeQueryString(pipedChineseText);
		try {
			RequestBuilder builder = new RequestBuilder(RequestBuilder.POST, url);			
			builder.setHeader("content-type","application/x-www-form-urlencoded");
			builder.sendRequest(paramList, new RequestCallback() {
		    public void onError(Request request, Throwable exception) {				    	
		    }
		    public void onResponseReceived(Request request, Response response) {		    	
		      if (200 == response.getStatusCode()) {
		    	    String data = response.getText();
		    	    String[] newPinyinList = data.split("\\|");
	    	    	//clear up for pinyin for single characters, could have multiples
	    	    	for(int i = 0; i < newPinyinList.length; i++) {
	    	    		if (newPinyinList[i].indexOf(",") > 0) { //has multiple Pinyin, use the primary pinyin only
	    	    			newPinyinList[i] = newPinyinList[i].split(",")[0].trim();
	    	    		}
	    	    	}
	    	    	List<String> pList = new ArrayList<String>();
	    	    	for(String p : newPinyinList) {
	    	    		String[] fields = p.split(" ");
	    	    		for(String field : fields) {
	    	    			pList.add(field);
	    	    		}
	    	    	}
	    	    	String[] pArray = new String[pList.size()];
	    	    	for(int i = 0; i < pArray.length; i++) {
	    	    		pArray[i] = pList.get(i);
	    	    	}
	    	    	playPinyinList(pArray);	    	    	
		      } else {		    	  
		      }
		    }			
		  });		 		
		} catch (RequestException e) {			
		}
	}
	
	public static void play(final String chinese, final String pinyin) {
		if (pinyin.trim().length() > 0 && pinyin.trim().split(" ").length == chinese.length()) {
			//provided pinyin, play the pinyin immediately
			playPinyinList(pinyin.trim().split(" "));
			return;
		}
		
		//no Pinyin provided, need to find the Pinyin for the word first!
		String codes = Utils.buildChineseCodes(chinese, "|").toLowerCase();
		String url = "https://www.archchinese.com/getSimpCorePinyinByCode?codes=" +codes;				 		 
		try {
			new RequestBuilder(RequestBuilder.GET, url).sendRequest(null, new RequestCallback() {
		    public void onError(Request request, Throwable exception) {
		    }
		    public void onResponseReceived(Request request, Response response) {		    
		      if (200 == response.getStatusCode()) {		    	  
		    	  String data = response.getText();		    
		    	  if (data.trim().length() > 0) {
		    		  //find the matched pinyin, for example, ni3 hao3
		    		  //need to convert the Pinyin to audio URLs:
		 			 String[] pyList = data.trim().split(" ");
		 			 
		 			 playPinyinList(pyList);		    		  
		    	  } else {
		    		  //not a word found in our dictionary. 
		    		  //use service.archchinese.com text segenter to find pinyin
		    		  //and play the pinyin
		    		  if (chinese.length() < 5) {
		    			  playPinyinForWordNotInDictionary(chinese);
		    		  }
		    	  }		    	  
		      } else {
		      }
		    }			
		  });
		} catch (RequestException e) {
		}		
	}
	
	private static void playPinyinList(String[] pyList) {
		String urls = "";
		 if (pyList.length > 0) {
			 for(String py : pyList) {
				 String soundURL =  Utils.createPinyinURL(py);
				 if (soundURL != null && soundURL.trim().length() > 2) {
					 if (urls.length() > 0) {
						 urls +=",";
					 }
					 urls +=soundURL;
				 }
			 }
		 }
		 if (urls.length() > 0) {
			 Utils.playAudioChain(urls);
		 }
	}		

	// NOTE THIS IS SYNTHETIC SOUND USING HTML 5 AUDIO
	// NOTE SOME BROWSERS MAY NOT SUPPORT THIS FEATURE AND IT WILL FAIL SILENTLY.
}
