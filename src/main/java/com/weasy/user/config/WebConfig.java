package com.weasy.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.weasy.user.util.UserAuthHandler;

@Configuration //개별적인 빈 설정
public class WebConfig implements WebMvcConfigurer {
	
	//빈 등록
	@Bean
	public UserAuthHandler userAuthHandler() {
		return new UserAuthHandler();
	}
		
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(userAuthHandler())
				.addPathPatterns("/board/*")
				.addPathPatterns("/user/*")
				.excludePathPatterns("/user/signin")
				.excludePathPatterns("/user/login")
				.excludePathPatterns("/user/signup");		
		
	}

	
	
	
}
