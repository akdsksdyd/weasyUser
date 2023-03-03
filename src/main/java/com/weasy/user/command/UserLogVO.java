package com.weasy.user.command;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLogVO { //유저 로그 VO
	
	private int loginNo;
	private Timestamp loginDate;
	private boolean loginSuccess;
	private String userEmail;

}
//`loginNo` INT primary key auto_increment,
//`loginDate` TIMESTAMP DEFAULT NOW(),
//`loginSuccess` BOOL NULL,
//`userEmail` VARCHAR(30) NOT NULL