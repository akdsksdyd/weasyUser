package com.weasy.user.board.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.weasy.user.command.AuthorityVO;
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
	public ArrayList<TeamVO> getTeamList(String user_id) {
		System.out.println(user_id);
		return boardMapper.getTeamList(user_id);
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
	
	@Override
	public ArrayList<AuthorityVO> getTeamMember(TeamVO vo) {
		return boardMapper.getTeamMember(vo);
	}
	
	@Override
	public int addAuthority(AuthorityVO vo) {
		return boardMapper.addAuthority(vo);
	}
	
	@Override
	public int checkAuthority(AuthorityVO vo) {
		return boardMapper.checkAuthority(vo);
	}
	
	@Override
	public int updateAuthority(AuthorityVO vo) {
		return boardMapper.updateAuthority(vo);
	}
	
	@Override
	public int deleteAuthority(AuthorityVO vo) {
		int deletekey = boardMapper.getAuthNo(vo);
		System.out.println("삭제할 authNo" + deletekey);
		return boardMapper.deleteAuthority(deletekey);
	}
}
