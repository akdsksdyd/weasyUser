package com.weasy.user.command;

import java.util.ArrayList;

import com.weasy.user.util.UserCriteria;

import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@Data
public class UserPageVO {
	//페이지네이션을 계산하는 클래스
		
	//페이지네이션 개수
	final static int PAGE_COUNT = 10;
	
	//페이지네이션을 계산하는 클래스
	private int start; //첫패이지번호
	private int end; //끝페이지번호
	private boolean prev; //이전버튼
	private boolean next; //다음버튼

	private int page; //조회하는 페이지번호
	private int amount; //데이터개수
	private int total;//전체게시굴수 
	private int realEnd; //실제끝번호


	private int pageCount = PAGE_COUNT; 

	private UserCriteria cri;
	private ArrayList<Integer> pageList; //화면에 반복시킬 페이지 번호


	public UserPageVO(UserCriteria cri, int total) {
		this.page = cri.getPage();
		this.amount = cri.getAmount();
		this.total = total;
		this.cri = cri; 

		//끝페이지 번호 - (int)Math.ceil(조회하는페이지번호 / 페이지네이션개수) * 페이지네이션개수
		this.end = (int)Math.ceil(this.page / (double)pageCount) * pageCount;

		//시작페이지 번호 - 끝페이지 번호 - 페이지네이션개수 + 1
		this.start = end - pageCount + 1;

		//실제끝번호 
		//데이터가 141개 라면 -> 마지막페이지 번호는 15번
		//(int)Math.ceil( 전체게시글 수 / 데이터개수 )
		this.realEnd = (int)Math.ceil( this.total / (double)this.amount);


		//실제끝번호 재계산
		//데이터가 141개라면 -> 1~10 end=10번, realEnd=15,
		//				 ->11~20 end=15번, realend=15
		this.end = this.end > this.realEnd ? this.realEnd : this.end;

		//이전버튼 활성화
		//start는 1, 11, 21...
		this.prev = this.start > 1; 

		//다음버튼 활성화
		//데이터가 141개라면 -> 1~10 end=10번, realEnd=15, 이때 true
		this.next = this.realEnd > this.end;

		//화면에서 반복시킬 페이지데이터 
		this.pageList = new ArrayList<>();
		for(int i = this.start; i <= this.end; i++) {
			pageList.add(i);
		}



	}
}
