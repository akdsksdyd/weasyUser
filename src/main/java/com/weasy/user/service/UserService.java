package com.weasy.user.service;

import com.weasy.user.command.UserVO;

public interface UserService {

	//회원가입
	public void userSignup(UserVO vo);
	//이메일 중복체크
	public int doubleCheck(String email);
	
}
