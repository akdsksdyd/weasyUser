package com.weasy.user.board.service;

import java.util.ArrayList;
import java.util.Map;

import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;

public interface BoardService {
	
	public int insertTeam(TeamVO vo);
	
	public ArrayList<TeamVO> getTeamList(String userEmail);
	
	public int addTask(TaskVO vo);
	
	public ArrayList<TaskVO> getTaskList(TaskVO vo);
	
}
