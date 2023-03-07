package com.weasy.user.service;

import org.apache.ibatis.annotations.Mapper;

import com.weasy.user.command.UserVO;

@Mapper
public interface UserMapper {

	//회원가입
	public void userSignup(UserVO userVo);
	//이메일 중복체크
	public void doubleCheck();
}
