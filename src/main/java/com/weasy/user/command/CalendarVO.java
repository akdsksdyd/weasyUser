package com.weasy.user.command;

import java.sql.Timestamp;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarVO {
	
	private int teamNo;
	private int taskNo;
	private String teamName;
	private String title;
	private Timestamp startDate;
	private Timestamp targetDate;
	private Timestamp realEndDate;
	
}
