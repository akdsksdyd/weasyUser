package com.weasy.user.service;

import java.util.List;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.weasy.user.command.UserVO;

public interface UserService {

	//회원가입
	public void userSignup(UserVO vo);
	//이메일 중복체크
	public int doubleCheck(String email);
	//로그인
	public UserVO login(UserVO vo);
	//승인여부
	public int permissionId(UserVO vo);
	//검색키워드로 직원찾기
	public List<UserVO> searchUser(String keyword);
}
