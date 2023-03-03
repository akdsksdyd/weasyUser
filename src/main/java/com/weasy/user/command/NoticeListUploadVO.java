package com.weasy.user.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeListUploadVO { //공지사항 업로드 VO
	
	private int uploadNo;
	private int noticeNo;
	private String fileName;
	private String filePath;
	private String UUID;

}
//uploadNo  	int primary key	auto_increment,
//noticeNo  	int	NOT NULL,
//fileName  	varchar(100) not null,
//filePath  	varchar(100) not null,
//UUID  	varchar(100) not null