package com.weasy.user.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;

public class UserAuthHandler implements HandlerInterceptor{


	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		
		System.out.println("인터셉터실행");
		
		//현재세션을 얻음
		HttpSession session = request.getSession();
		System.out.println(session);
		String user_id = (String)session.getAttribute("Email");
		System.out.println("값 확인:"+user_id);

		if(user_id == null) { //로그인 안됨
			response.sendRedirect( request.getContextPath() + "/user/signin"); //로그인페이지로 리디렉션
			return false; 
			
		}
		
		return true; 
	}

	
}
