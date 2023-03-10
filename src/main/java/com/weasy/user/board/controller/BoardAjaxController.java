package com.weasy.user.board.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.weasy.user.board.service.BoardService;
import com.weasy.user.command.AuthorityVO;
import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;
import com.weasy.user.command.UserVO;

@RestController
public class BoardAjaxController {
	
	@Autowired
	BoardService boardService;
	
	@PostMapping("/getTeamNo")
	@ResponseBody
	public ResponseEntity<List<TaskVO>> getTeamNo(@RequestBody TaskVO vo,
								  				  Model model) {
		
		System.out.println(vo.getTeamNo());
		System.out.println(vo.getTitle());
		
//		return new ResponseEntity<>(boardService.getTaskList(vo), HttpStatus.OK);
		return null;
	}
	
	@PostMapping("/getTeamTask")
	@ResponseBody
	public List<TaskVO> getTeamTask(@RequestBody TeamVO vo) {
		//팀번호로 해당 팀의 task들 리스트 가져오기
		List<TaskVO> list = boardService.getTaskList(vo.getTeamNo());
		
		return list;
	}
	
	@GetMapping("/getWorkspace")
	@ResponseBody
	public List<TeamVO> getWorkspace(HttpSession session) {
		//세션에 연결된 이메일의 user가 들어가 있는 team전부 읽어오기
		String userEmail = (String)session.getAttribute("Email");
		List<TeamVO> teamList = boardService.getTeamList(userEmail);
		return teamList;
	}
	
	@PostMapping("/addTask")
	@ResponseBody
	public ResponseEntity<Integer> addTask(@RequestBody TaskVO taskVo,
										   TeamVO teamVo){
		
		System.out.println(taskVo.getTeamNo());
		System.out.println(taskVo.getTitle());
		System.out.println(teamVo.getUserEmail());
		
		return new ResponseEntity<>(boardService.addTask(taskVo), HttpStatus.OK);
	}
	
	@PostMapping("/getTeamMember")
	@ResponseBody
	public List<AuthorityVO> getTeamMember(@RequestBody TeamVO vo){
		return boardService.getTeamMember(vo);
	}
	
	@PostMapping("/addAuthority")
	@ResponseBody
	public int addAuthority(@RequestBody AuthorityVO vo){
		//기존에 존재하던 권한이라면 update
		if(boardService.checkAuthority(vo) != 0) { //기존회원 있음
			//업데이트 진행
			return boardService.updateAuthority(vo);
		}
		//아니라면 insert 해주도록 변경
		return boardService.addAuthority(vo);
	}
	
	@PostMapping("/deleteAuthority")
	@ResponseBody
	public int deleteAuthority(@RequestBody AuthorityVO vo){
		//기존에 존재하던 권한이라면 삭제
		if(boardService.checkAuthority(vo) != 0) { //기존회원 있음
			return boardService.deleteAuthority(vo);
		}
		//아니라면 유지
		return 0;
	}
	
}


















