package com.archchinese.game.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

public class PinyinMapper {
	private static Map<String, String> mapper = new HashMap<String, String>();
	private static Map<String, String> markMapper = new HashMap<String, String>();
	
	private static String invalidPinyin = "pa3,ta2,na1,ga3,ka2,ha3,ha4,cha3,sha2,za4,sa2,ca2,ca3,ca4," + 
			"mai1,dai2,tai3,nai1,lai1,lai3,gai2,kai2,chai3,chai4,shai2,shai3,zai2,sai2,sai3," + 
			"ban2,pan3,man1,dan2,lan1,gan2,kan2,zhan2,shan2,ran1,ran4,zan3,san2," + 
			"bang2,pang3,mang1,mang4,dang2,gang2,kang3,zhang2,shang2,rang1,zang2,zang3,cang3,cang4,sang2," + 
			"dao2,gao2,kao2,rao1,sao2," + 
			"me2,me3,me4,de3,de4,te1,te2,te3,ne3,le2,le3,he3,che2,re1,re2,ze1,ze3,ce1,ce2,ce3,se1,se2,se3," + 
			"bei2,pei3,mei1,dei2,dei4,nei1,nei2,gei1,gei2,gei4,hei2,hei3,hei4,shei1,shei3,shei4,zei1,zei3,zei4," + 
			"ben2,pen4,den1,den2,den3,nen1,nen2,nen3,ken1,ken2,hen1,zhen2,chen3,ren1,zen1,zen2,zen4,cen3,cen4,sen2,sen3,sen4," + 
			"deng2,teng1,teng3,teng4,neng1,neng3,neng4,leng1,geng2,keng2,keng4,heng3,zheng2,reng3,reng4,zeng2,zeng3,ceng1,ceng3,seng2,seng3,seng4," + 
			"er1," + 
			"ri1,ri2,ri3,zi2,si2,dia1,dia2,dia4,lia1,lia2,lia4,qia2,xia3,bian2,mian1,dian2,lian1,jian2,niang1,niang3,liang1,jiang2," + 
			"biao2,diao2,niao1,niao2,pie2,pie4,mie2,mie3,die3,die4,tie2,nie3,lie2, lie3,bin2,bin3,min1,min4,nin1,nin4,lin1,jin2,xin2,xin3," + 
			"bing2,ping3,ping4,ming1,ding2,ting4,ning1,jing2,yo2,yo3,yo4,jiong1,jiong2,jiong4,qiong1,qiong3,qiong4,xiong3,xiong4," + 
			"miu2,miu3,diu2,diu3,diu4,jiu2,qiu3,qiu4,xiu2," + 
			"fo1,fo3,fo4,lo2,lo3,lo4," + 
			"weng2,dong2,nong1,nong3,long1,gong2,kong2,zhong2,rong1,rong4,zong2,cong3,cong4,song2," + 
			"pou4,mou4,fou1,fou4,dou2,tou3,nou1,nou2,nou3,lou1,gou2,kou2,rou1,rou3,zou1,zou2,cou1,cou2,cou3,sou2," + 
			"mu1,nu1,ku2,ru1,cu3,su3," + 
			"gua2,kua2,hua3,zhua2,zhua4,shua2,shua4," + 
			"wai2," + 
			"guai2,kuai2,huai1,huai3,chuai2,shuai2," + 
			"duan2,tuan3,tuan4,nuan1,nuan2,nuan4,luan1,kuan2,kuan4,zhuan2,shuan2,shuan3,ruan1,ruan2,ruan4,zuan2,cuan3,suan2,suan3," + 
			"guang2,zhuang2,zhuang3,shuang2,shuang4," + 
			"yue2,yue3,nve2, nve3, lve2, lve3,gon1,gon4, nue1,nue2,nue3,lue1,lue2,lue3,jue3,que3," + 
			"dui2,dui3,gui2,zhui2,zhui3,chui3,chui4,shui1,rui1,rui2,rui3,zui1,zui2,cui2," + 
			"dun2,gun2,kun2,zhun2,zhun4,chun4,shun1,shun2,run1,run2,run3,zun2,zun4,sun2,sun4," + 
			"wo2,nuo1,kuo1,kuo2,zhuo3,zhuo4,chuo2,chuo3,shuo2,shuo3,ruo1,ruo3,cuo3,suo2,suo4,nv1,nv2,lv1," + 
			"jun2,qun1,qun3,qun4,xun3,juan2,a2,a3,a4,an2,ang3,ei2,ei3,ei4,en2,en3,o2,o3,ou2,hang3";
	
	private static String[] invalidList = invalidPinyin.split(",");
	public static List neutralList = Arrays.asList("le,ma,me,men,ya,ne,de".split(","));
	
	static {
		mapper.put("a1","&#257;");
		mapper.put("a2","&#xe1;");
		mapper.put("a3","&#x1ce;");
		mapper.put("a4","&#xe0;");
		
		mapper.put("ai1","&#257;i");	
		mapper.put("ai2","&#xe1;i");
		mapper.put("ai3","&#x1ce;i");	
		mapper.put("ai4","&#xe0;i");	
		
		mapper.put("ao1","&#257;o");	
		mapper.put("ao2","&#xe1;o");
		mapper.put("ao3","&#x1ce;o");
		mapper.put("ao4","&#xe0;o");	
		
		mapper.put("an1","&#257;n");
		mapper.put("an2","&#xe1;n");	
		mapper.put("an3","&#x1ce;n");
		mapper.put("an4","&#xe0;n");	
			
		mapper.put("ang1","&#257;ng");	
		mapper.put("ang2","&#xe1;ng");
		mapper.put("ang3","&#x1ce;ng");
		mapper.put("ang4","&#xe0;ng");
			
		mapper.put("e1","&#x113;");	
		mapper.put("e2","&#xe9;");	
		mapper.put("e3","&#x11b;");	
		mapper.put("e4","&#xe8;");	
			
		mapper.put("ei1","&#x113;i");
		mapper.put("ei2","&#xe9;i");
		mapper.put("ei3","&#x11b;i");
		mapper.put("ei4","&#xe8;i"	);
		
		mapper.put("en1","&#x113;n");	
		mapper.put("en2","&#xe9;n");
		mapper.put("en3","&#x11b;n");
		mapper.put("en4","&#xe8;n"	);
			
		mapper.put("eng1","&#x113;ng");	
		mapper.put("eng2","&#xe9;ng");
		mapper.put("eng3","&#x11b;ng");	
		mapper.put("eng4","&#xe8;ng");	    
				     	
		mapper.put("o1","&#x14d;");
		mapper.put("o2","&#xf3;");
		mapper.put("o3","&#x1d2;");
		mapper.put("o4","&#xf2;");
		mapper.put("ong1","&#x14d;ng");
		mapper.put("ong2","&#xf3;ng");
		mapper.put("ong3","&#x1d2;ng");
		mapper.put("ong4","&#xf2;ng");	

		mapper.put("ou1","&#x14d;u");
		mapper.put("ou2","&#xf3;u");
		mapper.put("ou3","&#x1d2;u");	
		mapper.put("ou4","&#xf2;u");
		
		mapper.put("i1","&#x12b;");	
		mapper.put("i2","&#xed;");
		mapper.put("i3","&#x1d0;");	
		mapper.put("i4","&#xec;");
		
	      		mapper.put("ia1","i&#x101;");
	      		mapper.put("ia2","i&#xe1;");
	      		mapper.put("ia3","i&#x1ce;");
	      		mapper.put("ia4","i&#xe0;");      
	      		 
	      		mapper.put("iao1","i&#x101;o");	
	      		mapper.put("iao2","i&#xe1;o");	
	      		mapper.put("iao3","i&#x1ce;o");	
	      		mapper.put("iao4","i&#xe0;o");			   
	      		
		mapper.put("iu1","i&#x16b;");	
		mapper.put("iu2","i&#xfa;");
		mapper.put("iu3","i&#x1d4;");	
		mapper.put("iu4","i&#xf9;");
		      
		mapper.put("ian1","i&#x101;n");	
		mapper.put("ian2","i&#xe1;n");
		mapper.put("ian3","i&#x1ce;n");	
		mapper.put("ian4","i&#xe0;n");	
			
		mapper.put("in1","&#x12b;n");	
		mapper.put("in2","&#xed;n");
		mapper.put("in3","&#x1d0;n");	
		mapper.put("in4","&#xec;n");	
		mapper.put("ing1","&#x12b;ng");
		mapper.put("ing2","&#xed;ng");
		mapper.put("ing3","&#x1d0;ng");	
		mapper.put("ing4","&#xec;ng");	
		    	
		mapper.put("ui1","u&#x12b;");
		mapper.put("ui2","u&#xed;");
		mapper.put("ui3","u&#x1d0;");
		mapper.put("ui4","u&#xec;");    
		  	
		mapper.put("iang1","i&#x101;ng");
		mapper.put("iang2","i&#xe1;ng");	
		mapper.put("iang3","i&#x1ce;ng");
		mapper.put("iang4","i&#xe0;ng");	
		  	
		mapper.put("ua1","u&#x101;");
		mapper.put("ua2","u&#xe1;");
		mapper.put("ua3","u&#x1ce;");	
		mapper.put("ua4","u&#xe0;");	
	   	
		mapper.put("uai1","u&#x101;i");	
		mapper.put("uai2","u&#xe1;i");	
		mapper.put("uai3","u&#x1ce;i");	
		mapper.put("uai4","u&#xe0;i");     
		    	
		mapper.put("uan1","u&#x101;n");	
		mapper.put("uan2","u&#xe1;n");	
		mapper.put("uan3","u&#x1ce;n");	
		mapper.put("uan4","u&#xe0;n");	
		  	
		mapper.put("uang1","u&#x101;ng");
		mapper.put("uang2","u&#xe1;ng");	
		mapper.put("uang3","u&#x1ce;ng");
		mapper.put("uang4","u&#xe0;ng");    
			
		mapper.put("uang1","u&#x101;ng");	
		mapper.put("uang2","u&#xe1;ng");
		mapper.put("uang3","u&#x1ce;ng");	
		mapper.put("uang4","u&#xe0;ng");
		
		mapper.put("u:an1","&#xfc;&#x101;n");
		mapper.put("u:an2","&#xfc;&#xe1;n");
		mapper.put("u:an3","&#xfc;&#x1ce;n");
		mapper.put("u:an4","&#xfc;&#xe0;n");  
		  	
		mapper.put("v1","&#x1d6;");	
		mapper.put("v2","&#x1d8;");
		mapper.put("v3","&#x1da;");		
		mapper.put("v4","&#x1dc;");
		mapper.put("u:1","&#x1d6;");		
		mapper.put("u:2","&#x1d8;");	
		mapper.put("u:3","&#x1da;");	
		mapper.put("u:4","&#x1dc;");	
				
		mapper.put("ve1","&#xfc;&#x113;");		
		mapper.put("ve2","&#xfc;&#xe9;");		
		mapper.put("ve3","&#xfc;&#x11b;");	
		mapper.put("ve4","&#xfc;&#xe8;"	);   
		     		
		mapper.put("u:e1","&#xfc;&#x113;");	
		mapper.put("u:e2","&#xfc;&#xe9;");		
		mapper.put("u:e3","&#xfc;&#x11b;");		
		mapper.put("u:e4","&#xfc;&#xe8;");
		     		
		mapper.put("ven1","&#xfc;&#x113;n");	
		mapper.put("ven2","&#xfc;&#xe9;n");		
		mapper.put("ven3","&#xfc;&#x11b;n");	
		mapper.put("ven4","&#xfc;&#xe8;n");
		
		mapper.put("u:en1","&#xfc;&#x113;n");		
		mapper.put("u:en2","&#xfc;&#xe9;n");		
		mapper.put("u:en3","&#xfc;&#x11b;n");	
		mapper.put("u:en4","&#xfc;&#xe8;n"	);		
					
		mapper.put("iong1","i&#x14d;ng");		
		mapper.put("iong2","i&#xf3;ng");	
		mapper.put("iong3","i&#x1d2;ng");		
		mapper.put("iong4","i&#xf2;ng");     
				
		mapper.put("uo1","u&#x14d;");	
		mapper.put("uo2","u&#xf3;");	
		mapper.put("uo3","u&#x1d2;");		
		mapper.put("uo4","u&#xf2;");	
				
		mapper.put("u1","&#x16b;");
		mapper.put("u2","&#xfa;");	
		mapper.put("u3","&#x1d4;");	
		mapper.put("u4","&#xf9;");
		
		mapper.put("un1","&#x16b;n");
		mapper.put("un2","&#xfa;n");		
		mapper.put("un3","&#x1d4;n");	
		mapper.put("un4","&#xf9;n");   
		     		
		mapper.put("ueng1","u&#x113;ng");
		mapper.put("ueng2","u&#xe9;ng");	
		mapper.put("ueng3","u&#x11b;ng");	
		mapper.put("ueng4","u&#xe8;ng");		
		      		
		mapper.put("er1","&#x113;r");	
		mapper.put("er2","&#xe9;r");		
		mapper.put("er3","&#x11b;r");			
		mapper.put("er4","&#xe8;r");	
			
		mapper.put("5","");		
		mapper.put("0","");
		
		buildMarkap();
	}
	
	private static void buildMarkap() {
		markMapper.put("a1","ā");
		markMapper.put("a2","á");
		markMapper.put("a3","ǎ");
		markMapper.put("a4","à");
		
		markMapper.put("ai1","āi");
		markMapper.put("ai2","ái");
		markMapper.put("ai3","ǎi");
		markMapper.put("ai4","ài");
		
		markMapper.put("ao1","āo");
		markMapper.put("ao2","áo");
		markMapper.put("ao3","ǎo");
		markMapper.put("ao4","ào");
		
		markMapper.put("an1","ān");
		markMapper.put("an2","án");
		markMapper.put("an3","ǎn");
		markMapper.put("an4","àn");
		
		markMapper.put("ang1","āng");
		markMapper.put("ang2","áng");
		markMapper.put("ang3","ǎng");
		markMapper.put("ang4","àng");
		
		markMapper.put("e1","ē");
		markMapper.put("e2","é");
		markMapper.put("e3","ě");
		markMapper.put("e4","è");
		 
		markMapper.put("ei1","ēi");
		markMapper.put("ei2","éi");
		markMapper.put("ei3","ěi");
		markMapper.put("ei4","èi");
		
		markMapper.put("en1","ēn");
		markMapper.put("en2","én");
		markMapper.put("en3","ěn");
		markMapper.put("en4","èn");
							 
		markMapper.put("eng1","ēng");
		markMapper.put("eng2","éng");
		markMapper.put("eng3","ěng");
		markMapper.put("eng4","èng");     
    
		markMapper.put("o1","ō");
		markMapper.put("o2","ó");
		markMapper.put("o3","ǒ");
		markMapper.put("o4","ò");	 
		
		markMapper.put("ong1","ōng");
		markMapper.put("ong2","óng");
		markMapper.put("ong3","ǒng");
		markMapper.put("ong4","òng");	
		 
		markMapper.put("ou1","ōu");
		markMapper.put("ou2","óu");
		markMapper.put("ou3","ǒu");
		markMapper.put("ou4","òu");	       
     
		markMapper.put("i1","ī");
		markMapper.put("i2","í");
		markMapper.put("i3","ǐ");
		markMapper.put("i4","ì");	 
		
		markMapper.put("ia1","iā");
		markMapper.put("ia2","iá");
		markMapper.put("ia3","iǎ");
		markMapper.put("ia4","ià");
		
		markMapper.put("iao1","iāo");
		markMapper.put("iao2","iáo");
		markMapper.put("iao3","iǎo");
		markMapper.put("iao4","iào");
		      
		markMapper.put("iu1","iū");
		markMapper.put("iu2","iú");
		markMapper.put("iu3","iǔ");
		markMapper.put("iu4","iù");			      		
		
		 
		markMapper.put("ian1","iān");
		markMapper.put("ian2","ián");
		markMapper.put("ian3","iǎn");
		markMapper.put("ian4","iàn");	
		
		markMapper.put("in1","īn");
		markMapper.put("in2","ín");
		markMapper.put("in3","ǐn");
		markMapper.put("in4","ìn");
		
		markMapper.put("ing1","īng");
		markMapper.put("ing2","íng");
		markMapper.put("ing3","ǐng");
		markMapper.put("ing4","ìng");
		
		markMapper.put("ui1","uī");
		markMapper.put("ui2","uí");
		markMapper.put("ui3","uǐ");
		markMapper.put("ui4","uì");
    
		markMapper.put("iang1","iāng");
		markMapper.put("iang2","iáng");
		markMapper.put("iang3","iǎng");
		markMapper.put("iang4","iàng");
		
		markMapper.put("ua1","uā");
		markMapper.put("ua2","uá");
		markMapper.put("ua3","uǎ");
		markMapper.put("ua4","uà");
		
		markMapper.put("uai1","uāi");
		markMapper.put("uai2","uái");
		markMapper.put("uai3","uǎi");
		markMapper.put("uai4","uài");
     
		markMapper.put("uan1","uān");
		markMapper.put("uan2","uán");
		markMapper.put("uan3","uǎn");
		markMapper.put("uan4","uàn");
		
		markMapper.put("uang1","uāng");
		markMapper.put("uang2","uáng");
		markMapper.put("uang3","uǎng");
		markMapper.put("uang4","uàng");
     
		markMapper.put("uang1","uāng");
		markMapper.put("uang2","uáng");
		markMapper.put("uang3","uǎng");
		markMapper.put("uang4","uàng");
		
		markMapper.put("u:an1","üān");
		markMapper.put("u:an2","üán");
		markMapper.put("u:an3","üǎn");
		markMapper.put("u:an4","üàn");
     
		markMapper.put("v1","ǖ");
		markMapper.put("v2","ǘ");
		markMapper.put("v3","ǚ");
		markMapper.put("v4","ǜ");	 
		 
		markMapper.put("u:1","ǖ");
		markMapper.put("u:2","ǘ");
		markMapper.put("u:3","ǚ");
		markMapper.put("u:4","ǜ");	
		
		markMapper.put("ve1","üē");
		markMapper.put("ve2","üé");
		markMapper.put("ve3","üě");
		markMapper.put("ve4","üè");	
    
		markMapper.put("u:e1","üē");
		markMapper.put("u:e2","üé");
		markMapper.put("u:e3","üě");
		markMapper.put("u:e4","üè");	
		
		markMapper.put("ven1","üēn");
		markMapper.put("ven2","üén");
		markMapper.put("ven3","üěn");
		markMapper.put("ven4","üèn");
		
		markMapper.put("u:en1","üēn");
		markMapper.put("u:en2","üén");
		markMapper.put("u:en3","üěn");
		markMapper.put("u:en4","üèn");	
		
		markMapper.put("iong1","iōng");
		markMapper.put("iong2","ióng");
		markMapper.put("iong3","iǒng");
		markMapper.put("iong4","iòng");
      
		markMapper.put("uo1","uō");
		markMapper.put("uo2","uó");
		markMapper.put("uo3","uǒ");
		markMapper.put("uo4","uò");
		
		markMapper.put("u1","ū");
		markMapper.put("u2","ú");
		markMapper.put("u3","ǔ");
		markMapper.put("u4","ù");	 
		
		markMapper.put("un1","ūn");
		markMapper.put("un2","ún");
		markMapper.put("un3","ǔn");
		markMapper.put("un4","ùn");	
     
		markMapper.put("ueng1","uēng");
		markMapper.put("ueng2","uéng");
		markMapper.put("ueng3","uěng");
		markMapper.put("ueng4","uèng");	
		
		markMapper.put("er1","ēr");
		markMapper.put("er2","ér");
		markMapper.put("er3","ěr");
		markMapper.put("er4","èr");
		
		markMapper.put("5","");
		markMapper.put("0","");
	}
	
	//only public method!!
	public static String processPinyinForChinese(String rawPinyin) {
		String processedPinyin = "";
		
		String[] pyList = rawPinyin.split(" ");
		if (pyList.length ==1) {//no space, single chinese character
			//check if a character has multiple pinyin, separated by a comma
			String[] pyFields = rawPinyin.split(",");
			if (pyFields.length == 1) {//no comma separator, single pinyin for single character
				processedPinyin +=PinyinMapper.getPinyinPureMark(pyFields[0]);				
			} else {
				//multiple pinyin for a single character, use the first one only.
				processedPinyin +=PinyinMapper.getPinyinPureMark(pyFields[0]);
			}
		} else {//more than one pinyin syllables, must be character compounds
			for(int i = 0; i < pyList.length; i++) {
//				if (processedPinyin.length() > 0) {
//					processedPinyin +=" ";
//				}
				processedPinyin +=PinyinMapper.getPinyinPureMark(pyList[i]);
			}			
		}
		
		return processedPinyin;
	}
	
	private static String getPinyinPureMark(String value) {
		return getPinyinInternal(value,true);
	}
	private static String getPinyin(String value) {
		return getPinyinInternal(value,false);
	}
	private static String getPinyinInternal(String value, boolean pureMark) {
		int index = 0;
		String substring;
		String pinyin = value.toLowerCase();
		while (index < pinyin.length()) {
			substring = pinyin.substring(index, value.length());
			String mappedValue = pureMark? markMapper.get(substring): mapper.get(substring);
			if (mappedValue != null) {				
					return pinyin.substring(0, index)
							+ mappedValue;				
			}
			index++;
		}
		return value;
	}
}
