package com.archchinese.game.client;

public class UUIDGenerator {
	private static final String SEEDS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	
	public static boolean isValidUUID(String uuid) {
		return uuid.charAt(8) == '8' && 
				uuid.charAt(13) == '8' &&
				uuid.charAt(18) == '8' &&
				uuid.charAt(23) == '8' &&
				uuid.charAt(14) == 'j';		
	}
	public static String createUUID() {
		char[] uuid = new char[36];
		int r;

		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '8';//'-';
		uuid[14] = 'j';//'4';

		// Fill in random data.  At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (int i = 0; i < 36; i++) {
			if (uuid[i] == 0) {
				r = (int) (Math.random()*16);
				uuid[i] = SEEDS.charAt((i == 19) ? (r & 0x3) | 0x8 : r & 0xf);
			}
		}
		return new String(uuid);
	}	
}
