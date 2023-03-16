"use strict";

$(".noticeSidebar").click(function(){
	$("#teamProjectBoard").css("display","none");
	$("#mainBoardPage").css("display","none");
	$("#noticePage").css("display","block");
	
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

/*공지사항 리스트 화면에 뿌리는 함수*/
function ajaxHtml(data){
  	var html=""; 		
  	$.each(data, (index, obj)=>{ 
		  if(obj.noticeLevel == '1'){
			  html+="<tr>";
  	  		  html+="<td class='upImg'></td>";
  	  		  html+="<th class='th-title' value="+index+">"+obj.noticeTitle+"</th>";
  	  		  html+="<td>"+obj.noticeRegdate+"</td>";
  	  		  html+="</tr>";
			  
		  }else {
			  html+="<tr>";
  	  		  html+="<td>"+index+"</td>";
  	  		  html+="<th class='th-title' value="+index+">"+obj.noticeTitle+"</th>";
  	  		  html+="<td>"+obj.noticeRegdate+"</td>";
  	  		  html+="</tr>"; 
		  }
  	})
  		
  	$("#ajaxNoticeList").html(html);
} 


/*공지사항 목록 클릭시 상세페이지 함수 모달창 뜸*/
$("#ajaxNoticeList").on('click', "th", function(e){
	//console.log($(e.target).attr('value'));
	
	$("#noticeModal").css("display", "flex");
	$("html").css("overflow", "hidden");
	
	var noticeNo = Number($(e.target).attr('value'))+1;
	
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

/*공지사항 상세페이지 함수*/
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



