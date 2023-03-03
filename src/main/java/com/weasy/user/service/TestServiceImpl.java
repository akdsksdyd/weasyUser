package com.weasy.user.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.weasy.user.command.UserVO;


@Service("testService")
public class TestServiceImpl implements TestService {
	
	@Autowired
	private TestMapper testMapper;
	
	@Override
	public int userSignup(UserVO vo) {
		// TODO Auto-generated method stub
		return 0;
	}

}
