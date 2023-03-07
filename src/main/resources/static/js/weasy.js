"use strict";
/* 성별 체크박스- 하나만 */
$("input[name='gender']").on('click', function(){
    if(this.checked) {
        const checkboxes = $("input[name='gender']");
        for(let ind = 0; ind < checkboxes.length; ind++){
            checkboxes[ind].checked = false;
        }
        this.checked = true;
    } else {
        this.checked = false;
    }
});

/* 이메일 중복확인 기능 */
$(".doubleCheck_btn").on('click', function(){

	var email = $("input[name='userEmail']").val();
	
	$.ajax({
		url:'./checkEmail', //컨트롤러
		type:'post',
		data:{email, email},
		success:function(cnt){
			if(cnt == 0){
				$(".id_ok").css("display", "inline-block");
			}else{
				$(".id_id_already").css("display", "inline-block");
			}
		}, 
		error: function(){
			alert("에러입니다");
		}		
	})
	
	
	
});