package com.weasy.user.board.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.weasy.user.command.AuthorityVO;
import com.weasy.user.command.ReplyVO;
import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;

@Service("boardService")
public class BoardServiceImpl implements BoardService{

	@Autowired
	private BoardMapper boardMapper;
	
	@Override
	public int insertTeam(TeamVO vo) {
		
		System.out.println("서비스" + vo.toString());
		
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
	public ArrayList<TaskVO> getTaskList(TaskVO taskVo) {
		
		return boardMapper.getTaskList(taskVo);
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

	public void updateTask(TaskVO taskVo) {
		
		boardMapper.updateTask(taskVo);
	}
	
	@Override
	public void insertReply(ReplyVO replyVo) {
		
		boardMapper.insertReply(replyVo);
	}
	
	@Override
	public TaskVO putTask(int taskNo) {
		
		return boardMapper.putTask(taskNo);
	}
	
	@Override
	public ArrayList<ReplyVO> putReply(int taskNo) {
		
		return boardMapper.putReply(taskNo);
	}
	
}










