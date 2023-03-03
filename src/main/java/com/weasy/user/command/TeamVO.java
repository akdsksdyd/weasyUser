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
public class TeamVO { //팀 VO
	
	private int teamNo;
	private Timestamp teamRegdate;
	private Timestamp endDate;
	private String teamName;
	private String teamGoal;
	private String userEmail;

}
//teamNo  	int PRIMARY KEY auto_increment,
//teamRegdate   timestamp DEFAULT NOW(),
//endDate   timestamp NULL,
//teamName   varchar(100)	NULL,
//teamGoal  	varchar(100)	NULL,
//userEmail  	varchar(50)	NULL