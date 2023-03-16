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
import com.weasy.user.command.noticeListVO;

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
		ArrayList<TeamVO> teamList = boardService.getTeamListWithRole(user_id);
		model.addAttribute("teamList", teamList);
		ArrayList<TaskVO> taskList = boardService.getTaskList(taskVo);
		model.addAttribute("taskList", taskList);
		
		return "board/board";
	}
	
	@PostMapping("/addTeam")
	public String addTeam(TeamVO vo,
						  RedirectAttributes ra) {
		
		int teamNo = boardService.getTeamNo(vo.getTeamName());
		//해당 팀no로 지정한 teamLeader 권한 주기
		AuthorityVO authVO = AuthorityVO.builder().userEmail(vo.getUserEmail())
							 .teamNo(teamNo)
							 .role(0)
							 .build();
		int result = 0;
		if(vo.getTeamNo() != 0) {
			/* 기존에 있는 팀이라면 update & 권한도 업데이트 teamLeader가 변경되었을수 있으므로 */
			result = boardService.updateTeam(vo);
			boardService.updateAuthority(authVO);
		}else {
			/* 기존에 없는 팀이면 insertTeam & teamLeader에 권한 insert */
			result = boardService.insertTeam(vo);
			boardService.addAuthority(authVO);
		}
		
		String msg = result == 1 ? "정상 입력되었습니다" : "등록에 실패했습니다";
		ra.addFlashAttribute("msg", msg);
		return "redirect:/board/board";
	}
	
	

	
	@GetMapping("/index")
	public String index() {
		
		return "board/index";
	}
	
	
	
//	@GetMapping("/noticeSidebar")
//	public String noticeSidebar() {	
//		
//		return "board/board";
//	}
//	//공지사항 리스트
//	@GetMapping("/getNoticeList")
//	public String getNoticeList(noticeListVO noticeVo){
//		System.out.println("공지사항 리스트: "+ boardService.getNoticeList());		
//		return "board/board";
//	}
		
}
















