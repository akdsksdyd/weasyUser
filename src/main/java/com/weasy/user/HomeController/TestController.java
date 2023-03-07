package com.weasy.user.HomeController;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.weasy.user.command.UserVO;
import com.weasy.user.service.UserService;
import com.weasy.user.service.UserSha256;

@Controller
@RequestMapping("/user")
public class TestController {
	
	//서비스 연결
	@Autowired
	@Qualifier("userService")
	UserService userService;

	//로그인
	@GetMapping("/signin")
	public String singin() {
		return "user/signin";
	}
	
	//회원가입 화면
	@GetMapping("/signup")
	public String signup() {
		return "user/signup";
	}
	
	//이메일 중복 검사
	@ResponseBody
	@PostMapping("/checkEmail")
	public String doubleCheck(@RequestParam("email") String email) {
		userService.doubleCheck(email);
		return "";
	}
	
	
	//회원가입 유효성검사 
	@PostMapping("/signup_valid")
	public String signup(@Valid UserVO userVo, Errors error, Model model, HttpServletRequest request) {
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
	
}
