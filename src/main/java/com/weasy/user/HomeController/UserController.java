package com.weasy.user.HomeController;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.expression.MapAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
import com.weasy.user.command.UserVO;
import com.weasy.user.service.UserService;
import com.weasy.user.service.UserSha256;

@Controller
@RequestMapping("/user")
public class UserController {
	
	//서비스 연결
	@Autowired
	@Qualifier("userService")
	UserService userService;
	
	//회원가입 화면
	@GetMapping("/signup")
	public String signup() {
		return "user/signup";
	}
	
	//이메일 중복 검사
	@ResponseBody
	@PostMapping("/checkcheckEmail")
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
		
		//비밀번호 확인
		System.out.println("첫번째:" + userVo.getUserPw() );
		//비밀번호 암호화
		String encryptPassword = UserSha256.encrypt(userVo.getUserPw());
		userVo.setUserPw(encryptPassword);
		System.out.println("두번째:" + userVo.getUserPw());
		
		//회원가입 메소드 호출
		userService.userSignup(userVo);
		
		return "user/signin";
	}
	
	
	//로그인
	@GetMapping("/signin")
	public String singin() {
		return "user/signin";
	}
	
	//로그인 기능
	@PostMapping("/login")
	public String signin(UserVO vo, Model model, HttpSession session, RedirectAttributes ra){	
			
		//입력한 pw를 암호화 & UserVO에 checkPw로 저장
		vo.setCheck_pw(UserSha256.encrypt(vo.getCheck_pw()));
		//로그인 메소드 
		UserVO result = userService.login(vo);
		
		if(userService.login(vo) == null) { //아이디 비번 오류
			String failMessage = "아이디 혹은 비밀번호가 잘못 되었습니다.";
			ra.addFlashAttribute("failMessage", failMessage);
			return "redirect:/user/signin";
			
		} else if(userService.permissionId(vo) != 0){ //승인 안됨
			String failMessage = "계정이 승인되지 않았습니다. 잠시만 기다료~~";
			ra.addFlashAttribute("failMessage", failMessage);
			return "redirect:/user/signin";
		}
		
		session.setAttribute("Email", result.getUserEmail());
		session.setAttribute("loginUser", result);
		System.out.println("세션:"+session.getAttribute("Email"));
		System.out.println("보드로 가기");
		return "redirect:/board/board";
	}

	//검색어로 회원 검색
	@ResponseBody
	@PostMapping("/searchUserList")
	public List<UserVO> searchUserList(@RequestBody Map<String, Object> param) {
		JsonParser parser = new JsonParser();
		String keyword = param.get("searchKeyWord").toString();
		
		return userService.searchUser(keyword);
	}
}