package com.weasy.user.command;

import java.sql.Timestamp;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskVO { //업무 VO
	
	private int taskNo;
	private int teamNo;
	private String userEmail;
	private String title;
	private String content;
	
	@NotBlank(message = "공백일 수 없습니다")
	@Pattern(regexp = "[0-9]{4}-[0-9]{2}-[0-9]{2}")
	private Timestamp startDate;
	private int progressRate;
	
	@NotBlank(message = "공백일 수 없습니다")
	@Pattern(regexp = "[0-9]{4}-[0-9]{2}-[0-9]{2}")
	private Timestamp targetDate;
	private Timestamp realEndDate;
	private int status;

}
//taskNo  		int PRIMARY KEY auto_increment,
//teamNo  		int	NOT NULL,
//userEmail  		varchar(50)	NULL,
//title  			varchar(100) NULL, #한글기준 50자 이내
//content  		varchar(2000)	NULL, #한글 기준 1000자 이내
//startDate  		timestamp	NULL,
//progressRate  	int	NULL,
//targetDate  	timestamp	NULL,
//realEndDate  	timestamp	NULL,
//status  		int	NULL