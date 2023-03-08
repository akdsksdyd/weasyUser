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
import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;

@Controller
@RequestMapping("/board")
public class BoardController {
	
	@Autowired
	private BoardService boardService;

	@GetMapping("/board")
	public String board(Model model,
						HttpSession session) {

		session.setAttribute("userEmail", "user");
		String userEmail = (String)session.getAttribute("userEmail");
		ArrayList<TeamVO> teamList = boardService.getTeamList(userEmail);
		model.addAttribute("teamList", teamList);

		return "board/board";
	}
	
	@GetMapping("/boardTest")
	public String boardTest(Model model,
							HttpSession session) {
		
		session.setAttribute("userEmail", "user");
		String userEmail = (String)session.getAttribute("userEmail");
		ArrayList<TeamVO> teamList = boardService.getTeamList(userEmail);
		model.addAttribute("teamList", teamList);
		
		return "board/boardTest";
	}
	
	@PostMapping("/addTeam")
	public String addTeam(TeamVO vo,
						  RedirectAttributes ra) {
		
		int result = boardService.insertTeam(vo);
		String msg = result == 1 ? "정상 입력되었습니다" : "등록에 실패했습니다";
		ra.addFlashAttribute("msg", msg);
		
		return "redirect:/board/board";
	}
	
//	@PostMapping("/addTask")
//	public String addTask(TaskVO vo,
//						  RedirectAttributes ra) {
//		
//		int result = boardService.addTask(vo);
//		
//		return "redirect:/board/board";
//	}
	
}
















