package com.weasy.user.board.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
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
import com.weasy.user.service.UserService;
import com.weasy.user.util.UserSha256;

@Controller
@RequestMapping("/board")
public class BoardController {
	
	@Autowired
	private BoardService boardService;

	@Autowired
	private UserService userService;

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
		
		int result = 0;
		if(vo.getTeamNo() != 0) {
			/* 기존에 있는 팀이라면 update & 권한도 업데이트 teamLeader가 변경되었을수 있으므로 */
			result = boardService.updateTeam(vo);
			
			//해당 팀no로 지정한 teamLeader 권한 주기
			AuthorityVO authVO = AuthorityVO.builder().userEmail(vo.getUserEmail())
								 .teamNo(vo.getTeamNo())
								 .role(0)
								 .build();
			boardService.updateAuthority(authVO);
			
		}else {
			/* 기존에 없는 팀이면 insertTeam & teamLeader에 권한 insert */
			result = boardService.insertTeam(vo);
			
			int teamNo = boardService.getTeamNo(vo.getTeamName());
			//해당 팀no로 지정한 teamLeader 권한 주기
			AuthorityVO authVO = AuthorityVO.builder().userEmail(vo.getUserEmail())
								 .teamNo(teamNo)
								 .role(0)
								 .build();
			boardService.addAuthority(authVO);
		}
		
		String msg = result == 1 ? "정상 입력되었습니다" : "등록에 실패했습니다";
		ra.addFlashAttribute("msg", msg);
		return "redirect:/board/board";
	}
	
	//프로필 
	@RequestMapping("profile")
	public String profile(HttpSession session, Model model) {
		String email = session.getAttribute("Email").toString();
		
		//유저정보 가져와서 뿌려주기
		UserVO vo = userService.getUserInfo(email);
		model.addAttribute("uservo", vo);
		
		System.out.println(vo.toString());
		return "board/profile";
	}
	
	@RequestMapping("/updateUser")
	public String updateUser(@Valid UserVO vo, Errors error, Model model) {
		//유효성검사 
		if(error.hasErrors()) {
			
			//에러 목록
			List<FieldError> list =  error.getFieldErrors(); 
				
			for( FieldError err : list) {
				if(err.isBindingFailure()) { //유효성 검사 에러X, 자바 내부에러O
					model.addAttribute("valid_"+ err.getField(), "자바 에러");
				} else { //유효성 검사 실패
					model.addAttribute("valid_"+ err.getField(), err.getDefaultMessage());
				}
			}
			//사용자가 작성한 내용 유지
			model.addAttribute("uservo", vo);
			return "board/profile";
		}
		
		if(vo.getUserPw() != null) {
			//비밀번호 암호화
			String encryptPassword = UserSha256.encrypt(vo.getUserPw());
			vo.setUserPw(encryptPassword);
		}
		//update
		userService.updateUser(vo);
		
		return "redirect:/board/board";
	}
	
}
