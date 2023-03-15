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
public class noticeListVO { //공지사항 리스트 VO
	
	private int noticeNo;
	private String noticeTitle;
	private String noticeContent;
	private String noticeRegdate;
	private String noticeLevel;
	private String userEmail;

}
//noticeNo   INT primary key auto_increment,
//noticeTitle   VARCHAR(30) NULL,
//noticeContent   VARCHAR(200) NULL,
//noticeRegdate   TIMESTAMP DEFAULT NOW(),
//noticeLevel   VARCHAR(30) NULL,
//userEmail   VARCHAR(30) NULL