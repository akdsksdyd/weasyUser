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
	//로그인 날짜 저장
	public int addLoginDate(String email);
	//검색키워드로 팀내의 직원찾기
	public List<UserVO> searchTaskUser(int teamNo, String keyword);
	//회원정보 가지고오기
	public UserVO getUserInfo(String email);
	//유저 정보 수정
	public int updateUser(UserVO userVo);
}
