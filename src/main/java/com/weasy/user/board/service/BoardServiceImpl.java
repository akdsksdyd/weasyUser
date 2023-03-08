package com.weasy.user.board.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;

@Service("boardService")
public class BoardServiceImpl implements BoardService{

	@Autowired
	private BoardMapper boardMapper;
	
	@Override
	public int insertTeam(TeamVO vo) {
		
		return boardMapper.insertTeam(vo);
	}
	
	@Override
	public ArrayList<TeamVO> getTeamList(String userEmail) {
		System.out.println(userEmail);
		return boardMapper.getTeamList(userEmail);
	}
	
	@Override
	public int addTask(TaskVO vo) {
		return boardMapper.addTask(vo);
	}
	
	@Override
	public ArrayList<TaskVO> getTaskList(int teamNo) {
		
		return boardMapper.getTaskList(teamNo);
	}
	
	@Override
	public int getTeamNo(String teamName) {
		return boardMapper.getTeamNo(teamName);
	}
	
}
