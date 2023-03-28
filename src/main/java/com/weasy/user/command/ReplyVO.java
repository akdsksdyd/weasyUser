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
public class ReplyVO { //댓글 VO

	private int replyNo;
	private int taskNo;
	private int teamNo;
	private String userEmail;
	private Timestamp replyDate;
	private String comment;
	private String profile;
	
}
//replyNo  	int PRIMARY KEY auto_increment,
//taskNo  	int	NOT NULL,
//teamNo  	int	NOT NULL,
//userEmail  	varchar(50)	NULL,
//replyDate  	timestamp DEFAULT NOW(),
//comment  	varchar(2000)	NULL #한글 기준 1000자 이내