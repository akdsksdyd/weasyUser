package com.weasy.user.board.controller;

import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.weasy.user.board.service.BoardService;
import com.weasy.user.command.AuthorityVO;
import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;
import com.weasy.user.command.UserVO;

@Controller
@RequestMapping("/board")
public class BoardController {
	
	@Autowired
	private BoardService boardService;

	@GetMapping("/board")
	public String board(Model model,
						HttpSession session,
						UserVO userVo,
						TaskVO taskVo) {

		String user_id = (String)session.getAttribute("Email");
		ArrayList<TeamVO> teamList = boardService.getTeamList(user_id);
		model.addAttribute("teamList", teamList);
		ArrayList<TaskVO> taskList = boardService.getTaskList(taskVo);
		model.addAttribute("taskList", taskList);
		
		return "board/board";
	}

	@PostMapping("/addTeam")
	public String addTeam(TeamVO vo,
						  RedirectAttributes ra) {
		
		int result = boardService.insertTeam(vo);
		int teamNo = boardService.getTeamNo(vo.getTeamName());
		
		//해당 팀no로 지정한 teamLeader 권한 주기
		AuthorityVO authVO = AuthorityVO.builder().userEmail(vo.getUserEmail())
							 .teamNo(teamNo)
							 .role(0)
							 .build();
		boardService.addAuthority(authVO);
		
		String msg = result == 1 ? "정상 입력되었습니다" : "등록에 실패했습니다";
		ra.addFlashAttribute("msg", msg);
		
		return "redirect:/board/board";
	}
	
	
	@GetMapping("/test")
	public String test() {
		return "board/test";
	}
	
}
















