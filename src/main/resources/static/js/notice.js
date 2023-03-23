"use strict";
/**** 공지사항 목록 ****/
//사이드바에서 공지사항 클릭 시, 공지사항목록이 보임
let searchType = $("#notice-option option:selected").val();
let keyword = $("#search-keyword").val();

//사이드 바에서 공지사항 클릭 시, 공지사항 목록&페이지네이션 가져오기  
$(".noticeSidebar").click(function(){
	
	$("#teamProjectBoard").css("display","none");
	$("#mainBoardPage").css("display","none");
	$("#noticePage").css("display","block");
	
	//
	$("#notice-option").val('all');
	$("#search-keyword").val('');
	
	searchType = 'all';
	keyword = '';
	
	
	//공지사항 목록
	$.ajax({			
		url: "../get_notice_list",
		type: "get",
		contentType: "application/json",
		success:ajaxNoticeList,
		error: function(err){
			alert("조회에 실패했습니다.")
		}
	});
	//페이지네이션
	notice_pagination();

})


/**
 * @function DB에서 가져온 공지사항 목록을 화면에 띄우는 함수
 * @returns html 목록태그
 */
function ajaxNoticeList(data){
  	var html=""; 		
  	$.each(data, (index, obj)=>{ 
		  if(obj.noticeLevel == '1'){
			  html+="<tr>";
  	  		  html+="<td class='upImg'></td>";
  	  		  html+="<th class='th-title' value="+obj.noticeNo+">"+obj.noticeTitle+"</th>";
  	  		  html+="<td>"+obj.noticeRegdate+"</td>";
  	  		  html+="</tr>";
			  
		  }else {
			  html+="<tr>";
  	  		  html+="<td>"+(index+1)+"</td>";
  	  		  html+="<th class='th-title' value="+obj.noticeNo+">"+obj.noticeTitle+"</th>";
  	  		  html+="<td>"+obj.noticeRegdate+"</td>";
  	  		  html+="</tr>"; 
		  }
  	})  		
  	$("#ajaxNoticeList").html(html);
} 
/**
 * @function 화면에 페이지네이션 뿌리는 함수 
 */
function notice_pagination(){
	
	$.ajax({			
		url: "../user_pagenation",
		data:{'searchType':searchType, 'keyword':keyword},
		type: "get",
		contentType: "application/json",
		success: function(result){
			let amount = Number(result.amount);
			let start = Number(result.start);
			let end = Number(result.end);
			let realEnd = Number(result.realEnd);
			let prev_page = start-1;
			let next_page = end+1;
			//console.log("이전페이지로 "+prev_page);
			//console.log("다음페이지로 "+next_page);
			var html ="";
			/*맨앞으로 */
			html+="<li><a href='#' onclick='get_pagination(page=1, amount="+amount+")'>";
			html+="<i class='bi bi-chevron-double-left'></i></a></li>";	
			/*이전*/
			html+="<li><a href='#' onclick='get_pagination(page="+prev_page+", amount="+amount+")'>";
			html+="<i class='bi bi-chevron-left'></i></a></li>";	
			
			for(var i=result.start; i<=result.end; i++){
				html+="<li class=''>";
				html+="<a href='#' onclick='get_pagination("+ i +", amount="+amount+")'>"+i+"</a>";
				html+="</li>";
			}
		  	
		  	/*다음*/
		  	html+="<li><a href='#' onclick='get_pagination(page="+next_page+", amount="+amount+")'>";
			html+="<i class='bi bi-chevron-right'></i></a></li>";	
			/*맨뒤로*/
			html+="<li><a href='#' onclick='get_pagination(page="+realEnd+", amount="+amount+")'>";
			html+="<i class='bi bi-chevron-double-right'></i></a></li>";
		  	
			$("#user_pagination").html(html);
			
		},
		error: function(err){
			alert("페이지네이션에 실패했습니다.")
		}
	});
	
	
}

/**
 *페이지네이션 클릭 시 실행되는 함수
 * @returns ajaxNoticeList()
 */
function get_pagination(page){
	
	$.ajax({
		url: "../get_notice_list",
		data: {'page':page, 'searchType':searchType, 'keyword':keyword},
		type: 'get',
		async: 'true',
		contentType: "application/json",
		success: function(data){
			//페이지네이션 화살표 제한 걸어주기
			if(data == ""){
				alert("페이지가 없습니다");
			}else {
				//테이블 초기화
				$('.board-table > tbody').empty();
				ajaxNoticeList(data);
			}			
		},
		error: function(err){
			alert("페이지 에러")
		}
	})
	


}

/**
 * 검색 버튼 클릭 시, 실행되는 함수/
 * 공지사항 목록과 페이지네이션 가져오는 함수가 실행된다
 * 
 */
function getSearchList(){
	//검색어값: $("#search-keyword").val()
	//옵션 값2: $("#notice-option option:selected").val()
	
	 searchType = $("#notice-option option:selected").val();
	 keyword = $("#search-keyword").val();
	
	$.ajax({
		url : "../get_search_notice",
		data : JSON.stringify({'searchType':searchType, 'keyword':keyword}),
		type: 'post',
		contentType: "application/json",
		success: function(result){
			//테이블 초기화
			$('.board-table > tbody').empty();
			ajaxNoticeList(result);
			notice_pagination();
		},
		error: function(err){
			alert("조회에 실패했습니다.")
		}
	})
	
}



/**** 공지사항 상세페이지 ****/
$("#ajaxNoticeList").on('click', "th", function(e){
	$("#noticeModal").css("display", "flex");
	$("html").css("overflow", "hidden");
	
	//console.log("클릭한 목록: "+$(e.target).attr('value'));
	var noticeNo = Number($(e.target).attr('value'));
	//상세페이지 가져오는 함수
	$.ajax({
		url: "../get_detail_notice",
		data: JSON.stringify({'noticeNo':noticeNo}),
		type: "post",
		contentType: "application/json",
		success:noticeDetailHtml,
		error: function(err){
			alert("조회에 실패했습니다.")
		}
	});
	
	$.ajax({
		url: "../get_notice_img",
		data: {'noticeNo':noticeNo},
		type: "get",
		contentType: "application/json",
		success: function(result){
			
			var html = "";
			for(var i=0; i<result.length; i++){
				html += "<li><img alt='첨부이미지' class='img_test' src='"+ result[i].filePath +"'></li>"
			}
			$(".get_notice_img").html(html);
		}, 
		error: function(err){
			alert("첨부파일 조회에 실패했습니다.");
		}
	})
	
})


/**
 * 공지사항 상세페이지(모달) 띄우기
 */
function noticeDetailHtml(data){
  	var html=""; 		
  	$.each(data, (index, obj)=>{
		  html+="<div class='notice-title'>"+obj.noticeTitle+"</div>";
  	  	  html+="<hr/>";
  	  	  html+="<div class='notice-info'><span>"+obj.noticeRegdate+"</span></div>";
  	  	  html+="<hr/>";
  	  	  html+="<div style='white-space:pre;' class='notice-content'>"+obj.noticeContent+"</div>";
  	})
  		
  	$("#noticeDetailHtml").html(html);
} 

/**
 * 모달창 끄기 기능
 */
function closeNoticeModal() {
	$("#noticeModal").css("display", "none");
	$("html").css("overflow", "auto");
}















