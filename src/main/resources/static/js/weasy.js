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

/* 팀 클릭 시 teamNo전달 */
$(".teamTask").click(function(e){
	
	console.log(e.target.parentElement.nextElementSibling.value);
	var teamNo = $(e.target.parentElement.nextElementSibling).val();
	
	e.preventDefault();
	
	var taskValue = "";
	var taskBox = "";
	
	$.ajax({
		
		url: "../getTeamNo",
		data: JSON.stringify({teamNo: teamNo}),
		type: "post",
		contentType: "application/json",
		success: function(result){
			
			taskValue += '<input type="hidden" name="teamNo" value="'+ teamNo +'">';
			
			$(".addTaskValue").html(taskValue);
			
			for(var i = 0; i < result.length; i++){
				
				taskBox += "<article class='card'>";
				taskBox += "<header>" + result[i].title + "</header>";
				taskBox += "<div class='detail'>detail 정보</div>";
				taskBox += "</article>";
				
			}
			
			$("#to-do-content").html(taskBox);
			
		},
		error: function(err){
			alert("조회에 실패했습니다.")
		}
		
	});
	
});

/* task card 추가 function */
$(".addTaskBtn").click(function(e){
	
	//input창에서 입력받은값
	var inputTask = $("#taskText").val();
	console.log(inputTask);
	var taskValue = $(e.target.nextElementSibling.lastChild).val();
	console.log(taskValue);
	e.preventDefault();
		
	var str = "";
		
	$.ajax({
			
		url: "../addTask",
		data: JSON.stringify({teamNo: taskValue, title: inputTask}),
		type: "post",
		contentType: "application/json",
		success: function(result){
				
				str += "<article class='card'>";
				str += "<header>" + inputTask + "</header>";
				str += "<div class='detail'>detail 정보</div>";
				str += "</article>";
				
			$("#to-do").append(str);
			$("#taskText").val("");
				
		},
		error: function(err){
			alert("조회에 실패했습니다.")
		}
			
		});
		
});


/* 팀 / 프로젝트 추가 - 모달창 */
/* 특정 버튼을 누르면 모달창이 켜지게 하기 */
$("#addTeamProject").click(function(){
	$("#modal").css("display", "flex");
})

/* 팀 프로젝트 모달창 닫기 */
function closeAddModal() {
	modal.style.display = "none"
}

/* 보드리스트의 카드 모달창 */

/* 존재하는 모든 카드들에 대해 클릭시 모달창을 열어줄 수 있도록 해주었다.*/
/* 추후에 task add 버튼을 통해 생성된 카드들도 모달창을 열수 있도록 on으로 위임시켜주었다.*/
$(".listBox").on('click', 'article', function(e){
	$("#card_modal").css("display", "flex");
})

/* 보드 리스트 카드 모달창 닫기 */
function closeCardModal() {
	card_modal.style.display = "none"
}

const description = document.getElementById("description");
function resize() {
	if(description.scrollHeight > description.clientHeight){
		description.style.height = '1px';
    	description.style.height = (description.scrollHeight) + 'px';
	}
}

const description_cancle = document.getElementById("description_cancle");
description_cancle.addEventListener("click", e=>{
	description.value='';
	description.style.height ='5em';
});

$('#description_save').click(function(){
	$('#description').hide();
	$('#description_cancle').hide();
	$('#description_save').hide();
	$('#description_edit').show();
	$('#description_content').show();
	
	var description = '<p>' + $('#description').val() + '</p>';
	$('#description_content').html(description);
});

$('#description_edit').click(function(){
	$('#description').show();
	$('#description_cancle').show();
	$('#description_save').show();
	$('#description_edit').hide();
	$('#description_content').hide();
});

$("#file").on('change',function(){
  var fileName = $("#file").val();
  $(".upload-name").val(fileName);
});

$("#addMember")

function checkbox_reload(){  
      $("#card_checkbox").load("#card_checkbox");
}

$("#card_checkbox").click(function(e){
	e.preventDefault();
	var content = '';
	content += '<div class="checkbox_box">';
	content += '<div class="card_content">';
	content += '<i data-feather="check-square" class="detail-icon"></i>';
	content += '<input placeholder="title" type="text" class="input_box input-prevent"/>';
	content += '<button type="button" class="checkbox_btn cancle delete_checkbox">DELETE</button>';
	content += '</div>';
	content += '<button type="button" class="checkbox_btn save add_checkbox">ADD ITEM</button>';
	content += '</div>';
	
	$("#checkbox_content").append(content);
});

$(".add_checkbox").click(function(e){
	var checkbox ='<input type="checkbox">';
	$(e.target).prev().append(checkbox);
});

//체크 박스가 몇개든지 새로 생길 수 있기때문에 위임을 통해 delete버튼과 additem버튼을 정상동작할 수 있게 해주었다.
$("#checkbox_content").on('click', 'button', function(e){
	var class_attr = $(e.target).attr("class");

	/* delete 버튼 작업 */
	if(class_attr.indexOf('delete_checkbox') != -1) {
		$(e.target).closest(".checkbox_box").remove();
	}
	
	/* add item 버튼 작업 */
	if(class_attr.indexOf('add_checkbox') != -1) {
		var addcheckbox = '';
		addcheckbox += '<div class="card_content">';
		addcheckbox += '<input type="checkbox">';
		addcheckbox += '<input type="text" class="input_box input-prevent"/>';
		addcheckbox += '</div>';
		
		$(e.target).closest(".checkbox_box").append(addcheckbox);
	}
});

$("#commentBtn").click(function(e){
	var write_comment = $(".comment_box>textarea").val(); 
	var comment = '';
	comment += '<div class="card_content">'; 
	comment += '<div class="profile_box">';
	comment += '<img class="profile" src="/img/avatar/avatar-illustrated-02.png" alt="User name">';
	comment += '</div>';
	comment += '<span>'+write_comment+'</span>'; 
	comment += '</div>'; 
	
	$("#comment_list").append(comment);
	$(".comment_box>textarea").val("");
});


