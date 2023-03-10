package com.weasy.user.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorityVO { //권한 VO
	
	private int authNo;
	private String userEmail;
	private int teamNo;
	private int role;
	private String nickName;
}
//authNo   INT primary key auto_increment,
//userEmail   VARCHAR(30) NOT NULL,
//teamNo   INT NOT NULL,
//role   INT NOT NULL