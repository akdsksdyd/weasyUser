package com.weasy.user.board.service;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;

@Mapper
public interface BoardMapper {
	
	public int insertTeam(TeamVO vo);
	
	public ArrayList<TeamVO> getTeamList(String userEmail);
	
	public int addTask(TaskVO vo);
	
	public ArrayList<TaskVO> getTaskList(int teamNo);
	
	public int getTeamNo(String teamName);

}
