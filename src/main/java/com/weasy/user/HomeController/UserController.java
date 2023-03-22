package com.weasy.user.HomeController;

import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.expression.MapAccessor;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.weasy.user.command.UserLogVO;
import com.weasy.user.command.UserVO;
import com.weasy.user.service.UserService;
import com.weasy.user.util.UserSha256;

@Controller
@RequestMapping("/user")
public class UserController {
	//쿠키유지시간
	final static int SETMAXAGE = 300;
	
	//서비스 연결
	@Autowired
	@Qualifier("userService")
	UserService userService;
	
	//로그인, 아이디 기억하기
	String rememberId;
	
	//회원가입 화면
	@GetMapping("/signup")
	public String signup() {
		return "user/signup";
	}
	
	int num = 0;
	//이메일 중복 검사
	@ResponseBody
	@PostMapping("/checkEmail")
	public int doubleCheck(@RequestBody UserVO vo) {
		return userService.doubleCheck(vo.getUserEmail());
	}
		
	//회원가입 유효성검사 
	@PostMapping("/signup_valid")
	public String signup(@Valid UserVO userVo, Errors error, Model model) {
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
			model.addAttribute("vo", userVo);
			return "user/signup";
		}
		
			System.out.println("성별:"+userVo.getGender());
			
		
			//비밀번호 암호화
			String encryptPassword = UserSha256.encrypt(userVo.getUserPw());
			userVo.setUserPw(encryptPassword);
			//회원가입 메소드 호출
			userService.userSignup(userVo);
		
		return "user/signin"; //회원가입 성공
	}
	

	
	//로그인
	@GetMapping("/signin")
	public String singin() {
		return "user/signin";
	}
	
	//로그인 기능
	@PostMapping("/login")
	public String login(UserVO userVo, HttpSession session, RedirectAttributes ra, HttpServletResponse response, HttpServletRequest request){	
			
		//입력한 pw를 암호화 & UserVO에 checkPw로 저장
		userVo.setCheck_pw(UserSha256.encrypt(userVo.getCheck_pw()));
		//로그인 메소드 
		UserVO result = userService.login(userVo);
		System.out.println("로그인 값:"+result);
		/* 로그인 실패 */
		if(userService.login(userVo) == null) { //아이디 비번 오류
			String failMessage = "아이디 혹은 비밀번호가 잘못 되었습니다.";
			ra.addFlashAttribute("failMessage", failMessage);
			return "redirect:/user/signin";
			
		} else if(userService.permissionId(userVo) != 0){ //승인 안됨
			String failMessage = "계정이 승인되지 않았습니다. 잠시만 기다료~~";
			ra.addFlashAttribute("failMessage", failMessage);
			return "redirect:/user/signin";
		}
		
		/* 로그인 성공 */
		//쿠키 생성
		if(request.getParameter("rememberId") != null) {
			Cookie cookie = new Cookie("lastlogin", result.getUserEmail());
			cookie.setMaxAge(SETMAXAGE); //테스트를 위해 5분으로 설정, 추후에 시간 변경
			response.addCookie(cookie);
		}
		
		
		//세션 저장
		session.setAttribute("Email", result.getUserEmail());
		
		//로그인 일자 insert
		userService.addLoginDate(result.getUserEmail());
				
		return "redirect:/board/board";
	}
	
	//로그아웃 
	@RequestMapping("logOut")
	public String logOut(HttpSession session) {
		session.removeAttribute("Email");
		return "redirect:/user/signin";
	}

	//검색어로 회원 검색
	@ResponseBody
	@PostMapping("/searchUserList")
	public List<UserVO> searchUserList(@RequestBody Map<String, Object> param) {
		JsonParser parser = new JsonParser();
		String keyword = param.get("searchKeyWord").toString();
		return userService.searchUser(keyword);
	}
	
	//검색어로 회원 검색 (팀내의 회원들 안에서만 검색)
	@ResponseBody
	@PostMapping("/searchTaskUserList")
	public List<UserVO> searchTaskUserList(@RequestBody Map<String, Object> param) {
		JsonParser parser = new JsonParser();
		int teamNo = Integer.parseInt(param.get("teamNo").toString());
		String keyword = param.get("searchKeyWord").toString();
		
		System.out.println(teamNo);
		System.out.println(keyword);
		
		return userService.searchTaskUser(teamNo, keyword);
	}
	
}