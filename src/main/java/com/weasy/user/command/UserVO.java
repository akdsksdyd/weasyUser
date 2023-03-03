package com.weasy.user.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVO { //유저 VO
	
	private String userEmail;
	private String userPw;
	private String userName;
	private int phoneNum;
	private String gender;
	private int birth;
	private String permission;
	private String nickname;

}
//userEmail   VARCHAR(30) primary key NOT NULL,
//userPw   VARCHAR(30) NOT NULL,
//userName   VARCHAR(30) NOT NULL,
//phoneNum   INT NOT NULL,
//gender   CHAR(1) DEFAULT  'M'  CHECK ( gender  IN ('M'  ,  'F' )),
//birth   INT NOT NULL,
//permission   CHAR(1) DEFAULT  'N'  CHECK ( permission  IN ('Y'  , 'N' )),
//nickname   VARCHAR(30) NOT NULL