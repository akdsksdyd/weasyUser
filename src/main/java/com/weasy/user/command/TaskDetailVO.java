package com.weasy.user.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDetailVO { //상세업무 VO
	
	private int taskDetailNo;
	private int taskNo;
	private String taskDetail;
	private String userEmail;
	private int status;

}
//taskDetailNo  	int PRIMARY KEY auto_increment,
//boardNo  	int	NOT NULL,
//taskDetail   varchar(200) NULL, #한글 기준 100자 이내로 작성
//userEmail  	varchar(50)	NULL