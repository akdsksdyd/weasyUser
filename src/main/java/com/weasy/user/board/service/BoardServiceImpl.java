package com.weasy.user.board.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.weasy.user.command.AuthorityVO;
import com.weasy.user.command.ReplyVO;
import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;
import com.weasy.user.command.noticeListVO;
import com.weasy.user.util.Criteria;

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
	public int updateTeam(TeamVO vo) {
		return boardMapper.updateTeam(vo);
	}
	
	@Override
	public TeamVO getTeamInfo(TeamVO vo) {
		return boardMapper.getTeamInfo (vo);
	}
	
	@Override
	public ArrayList<TeamVO> getTeamList(String user_id) {
		System.out.println(user_id);
		return boardMapper.getTeamList(user_id);
	}
	
	@Override
	public ArrayList<TeamVO> getTeamListWithRole(String user_id) {
		return boardMapper.getTeamListWithRole(user_id);
	}
	
	@Override
	public int addTask(TaskVO vo) {
		return boardMapper.addTask(vo);
	}
	
	@Override
	public ArrayList<TaskVO> getTaskList(TaskVO taskVo) {
		
		ArrayList<TaskVO> list = boardMapper.getTaskList(taskVo);
		System.out.println("서비스 getTeamTask이메일: " + taskVo.getUserEmail());
		
		System.out.println("서비스: "+list);
		
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
	public AuthorityVO getAuthority(TeamVO vo) {
		return boardMapper.getAuthority(vo);
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
		
		System.out.println("서비스 getTeamTask이메일: " + taskVo.getUserEmail());
		
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
	//공지사항 리스트 가져오기
	@Override
	public ArrayList<noticeListVO> getNoticeList() {
		return boardMapper.getNoticeList();
	}
	
	@Override
	public int closeTeamStatus(int teamNo) {
		return boardMapper.closeTeamStatus(teamNo);
	}
	
	
	@Override
	public void taskStatusChange(TaskVO taskVo) {
		boardMapper.taskStatusChange(taskVo);
	}
	//공지사항 글 개수 
	@Override
	public int getTotal(Criteria cri) {
		return boardMapper.getTotal(cri);
	}
	//공지사항 상세페이지
	@Override
	public ArrayList<noticeListVO> getDetailNotice(noticeListVO noticeVo) {
		return boardMapper.getDetailNotice(noticeVo);
	}
	//공지사항 검색
	@Override
	public ArrayList<noticeListVO> getSearchNotice(noticeListVO noticeVo) {
		return boardMapper.getSearchNotice(noticeVo);
	}
	
	@Override
	public int updateTaskUser(TaskVO taskVo) {
		return boardMapper.updateTaskUser(taskVo);
	}
	
}










