package com.weasy.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.weasy.user.board.service.BoardMapper;
import com.weasy.user.command.TeamVO;

@SpringBootTest
public class TestCode {
	
	@Autowired
	BoardMapper boardMapper;
	
	@Test
	public void test01() {
		
		for(int i = 6; i <= 20; i++) {
			
			TeamVO vo = TeamVO.builder().endDate("2023-03-04")
							.teamName("testTeam" + i)
							.teamGoal("success" + i)
							.userEmail("user")
							.teamStatus("N")
							.build();
			
			boardMapper.insertTeam(vo);
			
		}
		
	}

}
