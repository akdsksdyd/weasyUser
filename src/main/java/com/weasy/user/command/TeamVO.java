package com.weasy.user.command;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonFormat;

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
	@NotBlank(message = "공백일 수 없습니다")
	@Pattern(regexp = "[0-9]{4}-[0-9]{2}-[0-9]{2}")
	private String teamRegdate;
	
	@NotBlank(message = "공백일 수 없습니다")
	@Pattern(regexp = "[0-9]{4}-[0-9]{2}-[0-9]{2}")
	private String endDate;
	private String teamName;
	private String teamGoal;
	private String userEmail;
	private String teamStatus;

}
//teamNo  	int PRIMARY KEY auto_increment,
//teamRegdate   timestamp DEFAULT NOW(),
//endDate   timestamp NULL,
//teamName   varchar(100)	NULL,
//teamGoal  	varchar(100)	NULL,
//userEmail  	varchar(50)	NULL