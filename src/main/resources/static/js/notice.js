"use strict";

$(".notice").click(function(){
	
	var noticeList = ""
	
	$.ajax({
			url: "../putNotice",
			type: "post",
			contentType: "application/json",
			data: JSON.stringify({taskNo: taskNo,
								  userEmail: userEmail,
								  teamNo: teamNo}),
			success: function(result){
				
				for(var i = 0; i < result.length; i++){
					
					replyList += '<div class="card_content">'; 
					replyList += '<div class="profile_box">';
					replyList += '<img class="profile" src="/img/avatar/avatar-illustrated-02.png" alt="User name">';
					replyList += '</div>';
					replyList += '<span class="comment_box">'+ result[i].comment +'</span>'; 
					replyList += '</div>'; 
				
					$("#comment_list").html(replyList);
	
				}
				
			},
			error: function(err){
				alert("댓글 조회 실패!");
			}
		
	})
	

})