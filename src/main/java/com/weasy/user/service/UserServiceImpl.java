package com.weasy.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.weasy.user.command.UserVO;


@Service("userService")
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserMapper userMapper;
	
	//회원가입
	@Override
	public void userSignup(UserVO userVo) {
		userMapper.userSignup(userVo);
	}
	
	//이메일 중복
	@Override
	public int doubleCheck(String email) {	
		return userMapper.doubleCheck(email);
	}
	
	//로그인
	@Override
	public UserVO login(UserVO vo) {		
		return userMapper.login(vo);	
	}
	//승인여부
	@Override
	public int permissionId(UserVO vo) {
		return userMapper.permissionId(vo);
	}
	//로그인 날짜 저장
	@Override
	public int addLoginDate(String email) {
		return userMapper.addLoginDate(email);
	}

	//검색키워드로 직원찾기
	@Override
	public List<UserVO> searchUser(String keyword) {
		return userMapper.searchUser(keyword);
	}
	
	@Override
	public List<UserVO> searchTaskUser(int teamNo, String keyword) {
		return userMapper.searchTaskUser(teamNo, keyword);
	}
	
	//유저 정보 가지고 오기
	@Override
	public UserVO getUserInfo(String email) {
		return userMapper.getUserInfo(email);
	}
	
	//유저 정보 업데이트
	@Override
	public int updateUser(UserVO userVo) {
		return userMapper.updateUser(userVo);
	}
}
