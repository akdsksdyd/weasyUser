package com.weasy.user.board.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.weasy.user.command.AuthorityVO;
import com.weasy.user.command.ReplyVO;
import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;
import com.weasy.user.command.noticeListVO;

public interface BoardService {
	
	/* 팀 */
	public int insertTeam(TeamVO vo);
	
	public ArrayList<TeamVO> getTeamList(String user_id);
	
	//user가 속한 팀 리스트와 권한을 함께 가지고 온다.
	public ArrayList<TeamVO> getTeamListWithRole(String user_id);
	
	public int getTeamNo(String teamName);
	
	//현재 팀에 추가되어있는 멤버 권한 리스트 가져오기
	public ArrayList<AuthorityVO> getTeamMember(TeamVO vo);
	
	public int closeTeamStatus(int teamNo);
	
	/* 권한(팀원) */
	
	//팀원 추가 (권한 테이블)	
	public int addAuthority(AuthorityVO vo);
	
	//팀원 권한 조회	
	public AuthorityVO getAuthority(TeamVO vo);

	//기존에 있는 팀원인지 체크
	public int checkAuthority(AuthorityVO vo);
	
	//기존 팀원 정보 update
	public int updateAuthority(AuthorityVO vo);
	
	//기존 팀원 정보 delete
	public int deleteAuthority(AuthorityVO vo);
	
	/* task */
	
	public int addTask(TaskVO vo);
	
	public ArrayList<TaskVO> getTaskList(TaskVO taskVo);
	
	public void updateTask(TaskVO taskVo);
	
	public void insertReply(ReplyVO replyVo);
	
	public TaskVO putTask(int taskNo);
	
	public ArrayList<ReplyVO> putReply(int taskNo);
	//공지사항 리스트 가져오기
	public List<noticeListVO> getNoticeList();
	
}












