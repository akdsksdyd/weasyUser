"use strict";
/**** 공지사항 목록 ****/
//사이드바에서 공지사항 클릭 시, 공지사항목록이 보임
$(".noticeSidebar").click(function(){
	/*모달창 키기*/
	$("#teamProjectBoard").css("display","none");
	$("#mainBoardPage").css("display","none");
	$("#noticePage").css("display","block");
	//공지사항 목록가져오는 함수
	$.ajax({			
		url: "../getNoticeList",
		type: "post",
		contentType: "application/json",
		success:ajaxHtml,
		error: function(err){
			alert("조회에 실패했습니다.")
		}
	});

})
//공지사항 목록 함수
function ajaxHtml(data){
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
  	  		  html+="<td>"+index+"</td>";
  	  		  html+="<th class='th-title' value="+obj.noticeNo+">"+obj.noticeTitle+"</th>";
  	  		  html+="<td>"+obj.noticeRegdate+"</td>";
  	  		  html+="</tr>"; 
		  }
  	})  		
  	$("#ajaxNoticeList").html(html);
} 


/**** 공지사항 상세페이지 ****/
$("#ajaxNoticeList").on('click', "th", function(e){
	$("#noticeModal").css("display", "flex");
	$("html").css("overflow", "hidden");
	
	//console.log("클릭한 목록: "+$(e.target).attr('value'));
	var noticeNo = Number($(e.target).attr('value'));
	//상세페이지 가져오는 함수
	$.ajax({
		url: "../getDetailNotice",
		data: JSON.stringify({'noticeNo':noticeNo}),
		type: "post",
		contentType: "application/json",
		success:noticeDetailHtml,
		error: function(err){
			alert("조회에 실패했습니다.")
		}
	});
})
//공지사항 상세페이지 함수
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


/*모달창 끄기*/
function closeNoticeModal() {
	$("#noticeModal").css("display", "none");
	$("html").css("overflow", "auto");
}

/**** 모달창 검색 ****/
function getSearchList(){
	console.log("값: "+ $("#search-keyword").val());
	console.log("값2: "+ $("#notice-option option:selected").val());
	
	
	var keyword = $("#search-keyword").val();
	var searchType = $("#notice-option option:selected").val();
	
	$.ajax({
		url : "../getSearchNotice",
		data : JSON.stringify({'searchType':searchType, 'keyword':keyword}),
		type: 'post',
		contentType: "application/json",
		success: function(result){
			//테이블 초기화
			$('.board-table > tbody').empty();
			ajaxHtml(result);
		},
		error: function(err){
			alert("조회에 실패했습니다.")
		}
	})
	
}
/*function getSearchList(){
	$.ajax({
		url : "../getSearchNotice",
		type: 'get',
		data : $("form[name=search-form-notice]").serialize(),
		success : function(result){
			
			console.log("성공이닷!!!!!!!!");
			
			//테이블 초기화
			$('.board-table > tbody').empty();
			ajaxHtml(result);
		}
	})
}*/














