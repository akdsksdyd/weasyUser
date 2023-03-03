package com.weasy.user.command;

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
public class UserVO { //유저 VO
	
	@NotBlank(message = "이름은 필수 입력 값입니다.")
	private String userName;
	
	@NotBlank
	@Pattern(regexp = "^(?:\\w+\\.?)*\\w+@(?:\\w+\\.)+\\w+$", message = "이메일 형식이 올바르지 않습니다.")
	private String userEmail;

	@NotBlank
	@Pattern(regexp = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,16}", message = "비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.")
	private String userPw;
	
	@NotBlank
	@Pattern(regexp = "[0-9]{3}-[0-9]{4}-[0-9]{4}", message = "핸드폰 번호는 000-0000-0000 형식으로 작성하세요.")
	private String phoneNum;
	
	private String gender;	
	private Integer birth;
	private String permission;
	
	@NotBlank
	@Pattern(regexp = "^[ㄱ-ㅎ가-힣a-z0-9-_]{2,10}$", message = "닉네임은 특수문자를 제외한 2~10자리여야 합니다.")
	private String nickname;

}
//userEmail   VARCHAR(30) primary key NOT NULL,
//userPw   VARCHAR(30) NOT NULL,
//userName   VARCHAR(30) NOT NULL,
//phoneNum   INT NOT NULL,
//gender   CHAR(1) DEFAULT  'M'  CHECK ( gender  IN ('M'  ,  'F' )),
//birth   INT NOT NULL,
//permission   CHAR(1) DEFAULT  'N'  CHECK ( permission  IN ('Y'  , 'N' )),
//nickname   VARCHAR(30) NOT NULL