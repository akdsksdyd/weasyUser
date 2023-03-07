package com.weasy.user.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

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
		// TODO Auto-generated method stub
		return 0;
	}

}
