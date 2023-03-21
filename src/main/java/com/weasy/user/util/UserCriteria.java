package com.weasy.user.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
@AllArgsConstructor
@Builder
@Data
public class UserCriteria {
	//SQL에 전달할 page, amount을 가지고 다니는 클래스
	private int page; //조회하는 페이지번호
	private int amount; //데이터개수
	
	private int total;

	final static int PAGE_NUM = 1;
	final static int AMOUNT = 10;

	//검색키워드
	private String searchType;
	private String keyword;


	public UserCriteria() {
		this.page = PAGE_NUM;
		this.amount = AMOUNT;
	}

	public UserCriteria(int page, int amount) {
		super();
		this.page = page;
		this.amount = amount;
	}


	public int getPageStart() {
		return (page - 1 ) * amount;
	}


}
