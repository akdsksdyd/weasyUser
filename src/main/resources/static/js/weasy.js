"use strict";
/* gender 체크박스 - only one */
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
		url:"../user/checkEmail", //컨트롤러
		type:"post",
		data:JSON.stringify({userEmail: email}),
		contentType:"application/json",
		success:function(result){
			if(result == "0"){
				$(".id_ok").css("display", "inline-block");
				$(".id_already").css("display", "none");
			}else{
				$(".id_already").css("display", "inline-block");
				$(".id_ok").css("display", "none");
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
		
	$.ajax({
			
		url: "../addTask",
		data: JSON.stringify({teamNo: taskValue, title: inputTask}),
		type: "post",
		contentType: "application/json",
		success: function(result){
			
			/* 해당 페이지 reload*/	
			getTeamTask(taskValue);

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
	$("html").css("overflow", "hidden");
})

/* 팀 프로젝트 모달창 닫기 */
function closeAddModal() {
	modal.style.display = "none"
	$("html").css("overflow", "auto");
}

/* 보드리스트의 카드 모달창 */

/* 존재하는 모든 카드들에 대해 클릭시 모달창을 열어줄 수 있도록 해주었다.*/
/* 추후에 task add 버튼을 통해 생성된 카드들도 모달창을 열수 있도록 on으로 위임시켜주었다.*/
$(".listBox").on('click', 'article', function(e){
	$("#card_modal").css("display", "flex");
	$("html").css("overflow", "hidden");
})

/* 보드 리스트 카드 모달창 닫기 */
function closeCardModal() {
	card_modal.style.display = "none"
	$("html").css("overflow", "auto");
}

/* task card의 description 글자 크기만큼 자동 늘리기 */
const description = document.getElementById("description");
function resize() {
	if(description.scrollHeight > description.clientHeight){
		description.style.height = '1px';
    	description.style.height = (description.scrollHeight) + 'px';
	}
}

/* task card의 description cancle버튼 클릭시 원래 크기로 돌려놓기 */
const description_cancle = document.getElementById("description_cancle");
description_cancle.addEventListener("click", e=>{
	description.value='';
	description.style.height ='5em';
});

/*
description save시
textarea / cancle 버튼 / save 버튼 안보이게 숨기기
edit 버튼 / 입력된 description 부분 보이게 변경 
*/
$('#description_save').click(function(){
	$('#description').hide();
	$('#description_cancle').hide();
	$('#description_save').hide();
	$('#description_edit').show();
	$('#description_content').show();
	
	var description = '<p>' + $('#description').val() + '</p>';
	$('#description_content').html(description);
});

/*
description edit시
textarea / cancle 버튼 / save 버튼 보이게 변경
edit 버튼 / 입력된 description 부분 안보이게 변경
*/
$('#description_edit').click(function(){
	$('#description').show();
	$('#description_cancle').show();
	$('#description_save').show();
	$('#description_edit').hide();
	$('#description_content').hide();
});

/* file 등록시 선택한 파일 이름 뜨도록 해주기 */
$("#file").on('change',function(){
  var fileName = $("#file").val();
  $(".upload-name").val(fileName);
});

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
	content += '<button type="button" class="checkbox_btn save add_checkbox">ADD ITEM</button>';
	content += '<button type="button" class="checkbox_btn cancle delete_checkbox">DELETE</button>';
	content += '</div>';
	content += '<div class="card_content">';
	content += '<span class="pr10">20%</span>';
	content += '<progress class="progressbar" value="20" max="100"></progress>';
	content += '</div>';
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

/* board side bar 클릭시 메인 보드 보여주고 */
$("#mainBoardSideBar").click(function(e){
	e.preventDefault();
	$("#teamProjectBoard").css("display","none");
	$("#mainBoardPage").css("display","block");
})

/* 
팀/프로젝트 명 클릭시 
1. 메인 보드 페이지 안보이게 처리하고, team/project 보드 페이지는 보여지게 변경
2. 클릭한 보드의 팀명으로 getTeamTask ajax를 날려서 
   해당 팀의 task card를 가져와서 status 레벨에 맞게 배치해주기 
   (최신등록한 카드가 상단으로 배치)
*/
$(".cat-sub-menu").on('click', 'a', function(e){
	e.preventDefault();

	/* 보드의 상단에 타이틀을 팀명으로 변경 */
	var teamName = $(e.target).html();
	$("#boardName").html("# "+teamName);
	
	/* 클릭한 메뉴 teamNo로 보드 task 조회*/
	var teamNo = $(e.target).parent().next().val();
	getTeamTask(teamNo);
	
})

function getTeamTask(teamNo){
	var todo_task = "";
	var doing_task = "";
	var done_task = "";
			
	/* team task 가져오는거 function으로 빼서 사용해야할듯.. (addTask 후에도 사용)*/
	$.ajax({
		url: "../getTeamTask",
		type: "post",
		data: JSON.stringify({"teamNo": teamNo}), //데이터
		contentType: "application/json", //보내는 데이터 타입
		success: function(result){
			$("#mainBoardPage").css("display","none");
			$("#teamProjectBoard").css("display","block");
			
				/* 요청으로 받아온 리스트 들을 화면에 task 단게에 맞게 뿌려준다. */
			for(var i = 0; i < result.length; i++){
				
				/* todo에 넣을것 */
				if(result[i].status == 0){
					todo_task += '<article class="card">';
					todo_task += '<header>'+ result[i].title +'</header>';
					todo_task += '<div class="detail">'+ '디테일 추후에 넣어줘' +'</div>';
					todo_task += '</article>';
				}
				
				/* doing에 넣을것 */
				else if(result[i].status == 1){
					doing_task += '<article class="card">';
					doing_task += '<header>'+ result[i].title +'</header>';
					doing_task += '<div class="detail">'+ '디테일 추후에 넣어줘' +'</div>';
					doing_task += '</article>';
				}
				
				/* done에 넣을것 */
				else if(result[i].status == 2){
					done_task += '<article class="card">';
					done_task += '<header>'+ result[i].title +'</header>';
					done_task += '<div class="detail">'+ '디테일 추후에 넣어줘' +'</div>';
					done_task += '</article>';
				}
			} //for문의 끝
			
			$("#to-do-content").html(todo_task);
			$("#doing-content").html(doing_task);
			$("#done-content").html(done_task);
			
		},
		error: function(err){
			alert("보드 조회에 실패했습니다. 관리자에게 문의 부탁드립니다.🙏");
		}
	});
}

function loadMainBoard(){
	$(document).ready(function(){
		var email = "koal@naver.com";
		$.ajax({
			url: "../getWorkspace",
			type: "post",
			data: JSON.stringify({"Email" : email}), //데이터
			contentType: "application/json", //보내는 데이터 타입
			success: function(result){
				console.log(result);
			},
			error: function(err){
				
			}
		});
	})
}










