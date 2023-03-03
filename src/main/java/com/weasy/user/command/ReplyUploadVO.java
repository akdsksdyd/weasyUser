package com.weasy.user.command;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder	
public class ReplyUploadVO { //댓글 업로드 VO
	
	private int uploadNo;
	private int taskNo;
	private int teamNo;
	private String userEmail;
	private String fileName;
	private String fileNath;
	private String UUID;

}
//uploadNo  	int PRIMARY KEY auto_increment,
//taskNo  	int	NOT NULL,
//teamNo  	int	NOT NULL,
//userEmail  	varchar(50)	NULL,
//fileName  	varchar(100)	NULL,
//filePath  	varchar(100)	NULL,
//UUID  	varchar(50)	NULL