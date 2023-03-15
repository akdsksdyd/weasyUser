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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.gson.JsonParser;
import com.weasy.user.board.service.BoardService;
import com.weasy.user.command.AuthorityVO;
import com.weasy.user.command.ReplyVO;
import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;
import com.weasy.user.command.UserVO;
import com.weasy.user.command.noticeListVO;

@RestController
public class BoardAjaxController {
	
	@Autowired
	BoardService boardService;
	
	//teamNo, userEmail 가져오기
	@PostMapping("/getTeamNo")
	@ResponseBody
	public ResponseEntity<List<TaskVO>> getTeamNo(@RequestBody TaskVO vo,
								  				  Model model) {
		
		System.out.println(vo.getTeamNo());
		System.out.println(vo.getTitle());
		System.out.println(vo.getTaskNo());
		
		return new ResponseEntity<>(boardService.getTaskList(vo), HttpStatus.OK);
//		return null;
	}
	
	//팀 선택 시 그 해당하는 팀의 task불러오기
	@PostMapping("/getTeamTask")
	@ResponseBody
	public List<TaskVO> getTeamTask(@RequestBody TaskVO taskVo) {
		//팀번호로 해당 팀의 task들 리스트 가져오기
		List<TaskVO> list = boardService.getTaskList(taskVo);
		return list;
	}
	
	@GetMapping("/getWorkspace")
	@ResponseBody
	public List<TeamVO> getWorkspace(HttpSession session) {
		//세션에 연결된 이메일의 user가 들어가 있는 team과 user의 권한 읽어오기
		String userEmail = (String)session.getAttribute("Email");
		return boardService.getTeamListWithRole(userEmail);
	}
	
	//업무 추가
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
	
	//회원 권한가지고 오기
	@ResponseBody
	@PostMapping("/getAuthority")
	public AuthorityVO getAuthority(@RequestBody Map<String, Object> param, HttpSession session) {
		JsonParser parser = new JsonParser();
		int teamNo = Integer.parseInt(param.get("teamNo").toString());
		String email = session.getAttribute("Email").toString();
		
		TeamVO vo = TeamVO.builder().teamNo(teamNo)
						.userEmail(email)
						.build();
		return boardService.getAuthority(vo);
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
	
	//업무 update
	@PostMapping("/updateTask")
	@ResponseBody
	public void updateTask(@RequestBody TaskVO taskVo){
		
		System.out.println(taskVo.getTitle());
		System.out.println(taskVo.getTaskNo());
		System.out.println("컨트롤러 putTask이메일: " + taskVo.getUserEmail());
		
		boardService.updateTask(taskVo);
	}
	
	//댓글 추가
	@PostMapping("/insertReply")
	@ResponseBody
	public void insertReply(@RequestBody ReplyVO replyVo) {
		boardService.insertReply(replyVo);
	}
	
	//상세페이지에 값 넣기
	@PostMapping("/putTask")
	@ResponseBody
	public TaskVO putTask(@RequestBody TaskVO taskVo) {
		
		return boardService.putTask(taskVo.getTaskNo());
	}
	
	//상세페이지에 댓글 넣기(가지고오기)
	@PostMapping("/putReply")
	@ResponseBody
	public List<ReplyVO> putReply(@RequestBody ReplyVO replyVo) {
		return boardService.putReply(replyVo.getTaskNo());
	}
	
	//공지사항
	@PostMapping("/notice")
	public List<noticeListVO> putoticeList(){
		return boardService.getNoticeList();
	}
	
	@PostMapping("/closeTeamStatus")
	@ResponseBody
	public int closeTeamStatus(@RequestBody Map<String, Object> param) {
		JsonParser parser = new JsonParser();
		int teamNo = Integer.parseInt(param.get("teamNo").toString());
		
		return boardService.closeTeamStatus(teamNo);
	}
	
	//task status 바꿔주기
	@PostMapping("/taskStatusChange")
	@ResponseBody
	public void taskStatusChange(@RequestBody TaskVO taskVo) {
		
		boardService.taskStatusChange(taskVo);
	}
	



















}