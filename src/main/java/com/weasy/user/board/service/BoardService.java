package com.weasy.user.board.service;

import java.util.ArrayList;
import java.util.Map;

import com.weasy.user.command.AuthorityVO;
import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;

public interface BoardService {
	
	public int insertTeam(TeamVO vo);
	
	public ArrayList<TeamVO> getTeamList(String user_id);
	
	public int addTask(TaskVO vo);
	
	public ArrayList<TaskVO> getTaskList(int teamNo);
	
	public int getTeamNo(String teamName);
	
	//현재 팀에 추가되어있는 멤버 권한 리스트 가져오기
	public ArrayList<AuthorityVO> getTeamMember(TeamVO vo);
		
	//팀원 추가 (권한 테이블)	
	public int addAuthority(AuthorityVO vo);
	
	//기존에 있는 팀원인지 체크
	public int checkAuthority(AuthorityVO vo);
	
	//기존 팀원 정보 update
	public int updateAuthority(AuthorityVO vo);
	
	//기존 팀원 정보 delete
	public int deleteAuthority(AuthorityVO vo);
}
