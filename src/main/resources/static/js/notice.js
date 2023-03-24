"use strict";
let searchType = $("#notice-option option:selected").val();
let keyword = $("#search-keyword").val();
let prev = false; 
let check_page = 1;
/**** 공지사항 목록 ****/
//사이드바에서 공지사항 클릭 시, 공지사항목록이 보임
$(".noticeSidebar").click(function(){
	check_page =1;
	$("#teamProjectBoard").css("display","none");
	$("#mainBoardPage").css("display","none");
	$("#noticePage").css("display","block");
	
	
	
	$("#notice-option").val('all');
	$("#search-keyword").val('');
	
	searchType = 'all';
	keyword = '';
	
	
	//공지사항 목록
	$.ajax({			
		url: "../get_search_notice",
		data: JSON.stringify({'searchType': 'all', 'keyword':''}),
		type: "post",
		contentType: "application/json",
		success:ajaxNoticeList,
		error: function(err){
			alert("조회에 실패했습니다.")
		}
	});
	//페이지네이션
	notice_pagination(check_page);

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
let start = 0;
let check_realEnd;
function notice_pagination(check_page){
	
	$.ajax({			
		url: "../user_pagenation",
		data:{'page':check_page, 'searchType':searchType, 'keyword':keyword},
		type: "get",
		contentType: "application/json",
		success: function(result){
			let end = Number(result.end);
			let prev_page = result.start-1;
			let next_page = end+1;
			console.log("이전페이지 "+prev_page);
			console.log("start " + result.start);
			console.log("end: " + end);
			console.log("realEnd: " + result.realEnd);
			start = result.start;
			check_realEnd = result.realEnd; 
			var html ="";
			/*맨앞으로 */
			html+="<li><a href='#' onclick='get_pagination(page=1)'>";
			html+="<i class='bi bi-chevron-double-left'></i></a></li>";	
			/*이전*/
				html+="<li><a href='#' onclick='get_pagination(page="+prev_page+")'>";
				html+="<i class='bi bi-chevron-left'></i></a></li>";	
			for(var i=start; i<=result.end; i++){
				html+="<li class=''>";
				html+="<a href='#' onclick='get_pagination("+ i +")'>"+i+"</a>";
				html+="</li>";
			}
		  	
		  	/*다음*/
		  	html+="<li><a href='#' onclick='get_pagination(page="+next_page+")'>";
			html+="<i class='bi bi-chevron-right'></i></a></li>";	
			/*맨뒤로*/
			html+="<li><a href='#' onclick='get_pagination(page="+result.realEnd+")'>";
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
	
	check_page = page;
	console.log("화살표 오류 확인: "+check_page);
	if(check_page == 0){
		alert("첫 페이지입니다");
		return false;
	} else if(check_page > check_realEnd){
		alert("마지막 페이지입니다");
		return false;
	}else {
		//목록 가져옴
		$.ajax({
			url: "../get_search_notice",
			data: JSON.stringify({'page':check_page, 'searchType':searchType, 'keyword':keyword}),
			type: 'post',
			async: 'true',
			contentType: "application/json",
			success: function(data){
					//테이블 초기화
					$('.board-table > tbody').empty();
					ajaxNoticeList(data);
					notice_pagination(check_page);
							
			},
			error: function(err){
				alert("페이지 에러")
			}
		})
		
	}
	
	


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















