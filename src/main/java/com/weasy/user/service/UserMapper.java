package com.weasy.user.service;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.weasy.user.command.UserVO;

@Mapper
public interface UserMapper {

	//회원가입
	public void userSignup(UserVO userVo);
	//이메일 중복체크
	public int doubleCheck(String email);
	//로그인
	public UserVO login(UserVO vo);
	//승인여부
	public int permissionId(UserVO vo);
	//검색키워드로 직원찾기
	public List<UserVO> searchUser(String keyword);
}
