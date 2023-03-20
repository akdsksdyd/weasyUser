"use strict";
/* 로그인창에서 쿠키값이 있으면 이메일에 띄우기(내가 만든 쿠키~~) */
$(document).ready(function(){	
	$("input[name=check_id]").attr('value', document.cookie.replace("lastlogin=", ""));
	/* 쿠키 값이 있으면 체크박스 checked */
	if(document.cookie.replace("lastlogin=", "") !== ""){
		$('input:checkbox[name="rememberId"]').attr("checked", true);
	}
	
})


/* 팀 클릭 시 teamNo전달 */
$(".teamTask").click(function(e){
	
	var teamNo = $(e.target.parentElement.nextElementSibling).val();
	var userEmail = $(e.target.parentElement.nextElementSibling.nextElementSibling).val();
	
	e.preventDefault();
	
	/* 팀보드의 addTask버튼부분에 hidden 태그로 팀no 추가 */
	var taskValue = "";
	taskValue += '<input type="hidden" id="teamNo" name="teamNo" value="'+ teamNo +'">';
	taskValue += '<input type="hidden" id="userEmail" name="userEmail" value="'+ userEmail +'">';
	/*console.log("hidden태그의 teamNo: "+teamNo);*/
	taskValue += '<input type="hidden" class="userEmail" name="userEmail" value="'+ userEmail +'">';
	$(".addTaskValue").html(taskValue);
	
	/* 클릭한 메뉴 teamNo로 보드 task 조회*/
	getTeamTask(teamNo, userEmail);
});

/* task card 추가 function */
$(".addTaskBtn").click(function(e){
	//input창에서 입력받은값
	var inputTask = $("#taskText").val();
	/*입력안하면 입력안되도록*/
	if(inputTask == ''){
		return;
	}

	var teamNoValue = $(e.target.nextElementSibling.firstChild).val();
	var emailValue = $(e.target.nextElementSibling.lastChild).val();
	var teamNoValue = $(e.target.nextElementSibling.firstChild).val();
	var emailValue = $(e.target.nextElementSibling.lastChild).val();

	e.preventDefault();
		
	$.ajax({
			
		url: "../addTask",
		data: JSON.stringify({teamNo: teamNoValue, title: inputTask, userEmail: emailValue}),
		type: "post",
		contentType: "application/json",
		success: function(result){
			
			/* 해당 페이지 reload*/	
			getTeamTask(teamNoValue, emailValue);

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
	$("#modal").css("display", "none");
	$("html").css("overflow", "auto");
	
	/* 닫을시 모든 input태그의 정보 초기화 */
	$("#modal input").each(function(index, item){
		$(item).val("");
	});
	/* 검색 기록 삭제 */
	$("#modal .search-component").html("");
}

/* 보드리스트의 카드 모달창 */

/* 존재하는 모든 카드들에 대해 클릭시 모달창을 열어줄 수 있도록 해주었다.*/
/* 추후에 task add 버튼을 통해 생성된 카드들도 모달창을 열수 있도록 on으로 위임시켜주었다.*/
$(".listBox").on('click', 'article', function(e){
	$("#card_modal").css("display", "flex");
	$("html").css("overflow", "hidden");
	
	/* taskNo을 히든태그로 숨겨서 전달하기 위한 구문 */
	var taskNo = $(e.target).closest('article').attr("data-taskno");
	var taskNoHid = "";
	
	taskNoHid += '<input type="hidden" id="taskNo" name="taskNo" value="'+ taskNo +'">';
	
	$(".taskNoHid").html(taskNoHid);
	
	/* 상세페이지에 값을 전달 */
	$.ajax({
		
		url: "../putTask",
		type: "post",
		contentType: "application/json",
		data: JSON.stringify({"taskNo": taskNo}),
		success: function(result){
			$("#taskTitle").val(result.title);
			if(result.startDate != null){
				$("#startDate").val(result.startDate.substring(0, 11));
				$("#targetDate").val(result.targetDate.substring(0, 11));
			}
			
			/* 
			task 할당 받은 user가 없다면 +버튼을 보여지게
							   있다면 +버튼을 없애고 userEmail이 보여지게 처리
			*/
			if(result.userEmail == undefined){
				$("#plusBtn").removeClass("hiddenBtn");
				$("#taskuser").html(" ");
			}else{
				$("#plusBtn").attr("class", "hiddenBtn");
				$("#taskuser").html(result.userEmail);
			}
			
			/* content가 업데이트 시 제대로 안뜨는 부분 수정 */
			$('#description').val(result.content);
		
			/* hidden으로 status값 전달 */
			if(result.status == 0){
				$("#selectCheck").val('0').prop("selected", true);
			}else if(result.status == 1){
				$("#selectCheck").val('1').prop("selected", true);
			}else if(result.status == 2){
				$("#selectCheck").val('2').prop("selected", true);
			}
			
			/* task들어 갈 떄 진척률 반영 */	
			$(".pr10").html(result.progressRate + "%");
			$(".progressbar").val(result.progressRate);
		
		},
		error: function(err){
			alert("조회에 실패 했습니다.");
		}
	});
	
	var userEmail = $(".userEmail").val();
	var teamNo= $("#teamNoHidden").val();
	var taskNo = $("#taskNo").val();
	
	putReply(taskNo, teamNo);
	
	putTaskDetail(taskNo);
	$("add_checkbox_wrap").remove();
	
});

/* 댓글 조회 */
function putReply(taskNo, teamNo){
	
	var replyList = "";
	
	$.ajax({
		
		url: "../putReply",
		type: "post",
		contentType: "application/json",
		data: JSON.stringify({taskNo: taskNo,
							  teamNo: teamNo}),
		success: function(result){
			
			for(var i = 0; i < result.length; i++){
				
				replyList += '<div class="card_content">'; 
				replyList += '<div class="profile_box">';
				replyList += '<img class="profile" src="/img/avatar/avatar-illustrated-02.png" alt="User name">';
				replyList += '</div>';
				replyList += '<span class="comment_box">';
				replyList += '<strong>' + result[i].userEmail + '</strong>';
				replyList += '<button title="update" class="update_reply button-prevent reply_button" data-replyNo="'+ result[i].replyNo +'"><i class="bi bi-pencil-square"></i></button>'
				replyList += '<button title="delete" class="delete_reply button-prevent reply_button" data-replyNo="'+ result[i].replyNo +'"><i class="bi bi-trash"></i></button>'	
				replyList += '<br/>';
				replyList += '<input class="comment_box" value="'+ result[i].comment +'"/>'; 
				replyList +='</span>';
				replyList += '</div>'; 
			
				$("#comment_list").html(replyList);
			}
			
		},
		error: function(err){
			alert("댓글 조회 실패!");
		}
	})
	
}

$("#comment_list").on("click", "button", function(e){
	
	e.preventDefault();
	/* 삭제 후 다시 댓글 불러올 때 필요한 변수들 */
	var userEmail = $(".userEmail").val();
	var teamNo = $(".teamNo").val();
	var taskNo = $("#taskNo").val();
	
	/* 댓글 수정버튼 */
	if($(e.target).hasClass("update_reply")){
		var replyNo = $(e.target).attr("data-replyNo");
		var comment = $(e.target).prev().val();
		
		$.ajax({
			url: "../update_reply",
			type: "post",
			contentType: "application/json",
			data: JSON.stringify({"replyNo": replyNo,
								  "userEmail": userEmail,
								  "comment": comment}),
			success: function(result){
				console.log(result);
				putReply(taskNo, teamNo);
				
			},
			error: function(err){
				alert("댓글 수정 실패 !");
			}
		})
		
	}
	
	/* 댓글 삭제버튼 */
	if($(e.target).hasClass("delete_reply")){
		
		var replyNo = $(e.target).attr("data-replyNo");
		
		$.ajax({
			url: "../delete_reply",
			type: "post",
			contentType: "application/json",
			data: JSON.stringify({"replyNo": replyNo}),
			success: function(result){
				
				putReply(taskNo, teamNo);
				
			},
			error: function(err){
				alert("댓글 삭제 실패 !");
			}
		})
		
	}
	
})

/* task card modal창 안에서 멤버 버튼 클릭시 검색창 뜨도록 구현 */
$(".addMember").click(function(e){
	
	$(".searchTaskMember").css("top", e.pageY);
	$(".searchTaskMember").css("left", e.pageX);
	$(".searchTaskMember").css("display", "block");

})

/* 해당 팀 내의 멤버만 검색 */
$("#searchTaskMember").keyup(function(e){
	
	var teamNo = $("#teamNoHidden").val();
	var searchKeyword = $(e.target).val();
	var findUserList = '';
	
	$.ajax({
		url:"../user/searchTaskUserList", //컨트롤러
		type:"post",
		data:JSON.stringify({"teamNo": teamNo, "searchKeyWord": searchKeyword}),
		contentType:"application/json; charset=utf-8",
		success:function(result){
			
			for(var i = 0; i < result.length; i++){
				findUserList += '<li class="searchtitle chooseUser">';
				findUserList += '<span>'+result[i].nickname+'</span><br/>';
				findUserList += '<span class="subtitle">'+result[i].userEmail+'</span>';
			}
			
			$(".searchTaskMember .search-list").html(findUserList);
			
		}, 
		error: function(){
		}		
	});
})

/* 검색한 멤버의 이름을 클릭하면 */
$(".searchTaskMember .search-list").on('click', 'li', function(e){
	/* 검색어 초기화 & 사라지게 */
	$("#searchTaskMember").val("");
	$(".searchTaskMember").css("display", "none");
	
	/* 찾은 userlist 초기화 */
	$(".search-list").html("");
	
	/* nickname과 email을 구한다. */
	var email = $(this).children().last().html();
	if(email == $("#taskuser").html()){
		alert("이미 할당된 멤버 입니다.");
		return;
	}
	
	$("#taskuser").html(email);
	$("#plusBtn").attr("class", "hiddenBtn");
	
	var teamNo = $("#teamNoHidden").val();
	var taskNo = $("#taskNo").val();
	
	/* db에 값 업데이트 */
	$.ajax({
		url: "../updateTaskUser",
		type: "post",
		data: JSON.stringify({"userEmail": email, "teamNo": teamNo, "taskNo": taskNo}),
		contentType: "application/json",
		success: function(result){
			if(confirm(email + "에게 업무가 할당되었습니다.\n" + email + "에게 notice를 보낼까요?")){
				var msg = "[" + $("#taskTitle").val() + "] 업무가 할당되었습니다.";
				insertUserNotice(email, msg, 1);
			}
		},
		error: function(err){
			alert("");
		}
	})
})

/**
user에게 알림 보내기 (상단에 종 icon)

@param email : notice를 받는 사람
@param msg : notice 문구
@param status : 어떤 notice인지 종류

- 추후에 다양한 알림을 받을 수 있도록 status를 param값으로 받도록 해놓았습니다.
- 0 : 멤버 초대
- 1: 업무 할당
- 2 : 댓글 추가
*/
function insertUserNotice(email, msg, status){
	
	$.ajax({
		url: "../insertUserNotice",
		type: "post",
		data: JSON.stringify({"userEmail": email, "message": msg, "msgStatus": status}),
		contentType: "application/json",
		success: function(result){
			console.log(result);
		},
		error: function(err){
		}
	})
	
}

/* task card modal창에서 검색창 부분 사라지게 하는 부분 */
$('html').click(function(e) {

	if($(e.target).attr("class") == undefined){
		/* 콘솔창에 에러나는것 예외처리 */
		return;
	}
	/* addmember 버튼영역도 아니고 searchTaskMemeber input박스를 제외한 영역 클릭히 검색창 사라지게 처리 */
	if($(e.target).attr("class").indexOf("addMember") == -1 && $(e.target).attr("id") != "searchTaskMember"){
		/* 검색어 초기화 & 사라지게 */
		$("#searchTaskMember").val("");
		$(".searchTaskMember").css("display", "none");
	
		/* 찾은 userlist 초기화 */
		$(".search-list").html("");
		
		/* 화면에서 안보이게 처리 */
		$(".searchTaskMember").css("display", "none");
	}
});
function putTaskDetail(taskNo){
		
	$.ajax({
		url: "../put_taskdetail",
		type: "post",
		contentType: "application/json",
		data: JSON.stringify({"taskNo": taskNo}),
		success: function(result){
			
			var addcheckbox = '';
					
			for(var i = 0; i < result.length; i++){
				
					addcheckbox += '<div class="card_content add_checkbox_wrap">';
					if(result[i].status == 1){
						addcheckbox += '<input type="checkbox" class="checkValue">';
					}else{
						addcheckbox += '<input type="checkbox" class="checkValue" checked="checked">';
					}
					addcheckbox += '	<input type="text" class="input_box input-prevent taskDetailNo" value="'+ result[i].taskDetail +'" data-detailNo="'+ result[i].taskDetailNo +'"/>';
					addcheckbox += '	<button type="button" class="checkbox_btn save" id="checkboxUpdate">UPDATE</button>';
					addcheckbox += '	<button type="button" class="checkbox_btn cancle delete_checkbox">DELETE</button>';
					addcheckbox += '</div>';
					
					
					$("#detailContentBox").html(addcheckbox);
					progressUpdate(taskNo);
					
			}
			
		},
		error: function(err){
			alert("todo리스트 조회 실패 !");
		}	
	})

}

$("#detailContentBox").on("click", "input", function(e){
	
	if($(e.target).hasClass("checkValue")){
	
		var taskNo = $("#taskNo").val();
		var taskDetailNo = $(e.target).next().attr("data-detailNo");
		var taskDetail = $(e.target).next().val();
		var checkValue = "";
		if($(e.target).is(':checked') == true){
			checkValue = 2;
		}else{
			checkValue = 1;
		}
		
		$.ajax({
			url: "../update_todo",
			type: "post",
			contentType: "application/json",
			data: JSON.stringify({"taskDetailNo": taskDetailNo,
								  "taskDetail": taskDetail,
								  "status": checkValue,
								  "taskNo": taskNo}),
			success: function(result){
				
				progressUpdate(taskNo);
				
			},
			error: function(err){
				alert("체크리스트 업데이트 실패 !");
			}
		})
		
		
	}
	
})

/* 보드 리스트 카드 모달창 닫기 */
function closeCardModal(){
	$("#card_modal").css("display", "none");
	$("html").css("overflow", "auto");
	
	/* 닫을시 모든 input태그의 정보 초기화 */
	$("#card_modal input").each(function(index, item){
		$(item).val("");
	});
	
	/* 닫을시 모든 textarea태그의 정보 초기화 */
	$("#card_modal textarea").each(function(index, item){
		$(item).val("");
	});
	var teamNo = $("#teamNoHidden").val();
	var userEmail = $(".userEmail").val();
	getTeamTask(teamNo, userEmail);
	$(".add_checkbox_wrap").remove();
}

/* task card의 description 글자 크기만큼 자동 늘리기 */
const description = document.getElementById("description");
function resize() {
	if(description.scrollHeight > description.clientHeight){
		description.style.height = '1px';
    	description.style.height = (description.scrollHeight) + 'px';
	}
}

/* file 등록시 선택한 파일 이름 뜨도록 해주기 */
$("#file").on('change',function(){
  var fileName = $("#file").val();
  $(".upload-name").val(fileName);
});

function checkbox_reload(){  
      $("#card_checkbox").load("#card_checkbox");
}

//체크 박스가 몇개든지 새로 생길 수 있기때문에 위임을 통해 delete버튼과 additem버튼을 정상동작할 수 있게 해주었다.
$("#checkbox_content").on('click', 'button', function(e){
	var class_attr = $(e.target).attr("class");

	/* delete 버튼 작업 */
	if(class_attr.indexOf('delete_checkbox') != -1) {
		
		var taskDetailNo = $(e.target).prev().prev().attr("data-detailNo");
		var teamNo = $("#teamNoHidden").val();
		var userEmail = $(".userEmail").val();
		var taskNo = $("#taskNo").val();
		
		$.ajax({
			url: "../deletetodo",
			type: "post",
			contentType: "application/json",
			data: JSON.stringify({"taskDetailNo": taskDetailNo}),
			success: function(result){
				$(e.target).closest(".card_content").remove();
				progressUpdate(taskNo);
				getTeamTask(teamNo, userEmail);
			},
			error: function(err){
				alert("todo리스트 삭제에 실패 했습니다.");
			}		
		})
		
	}
	
	/* add item 버튼 작업 */
	var addcheckbox = "";
	if(class_attr.indexOf('add_checkbox') != -1) {
		var addcheckbox = '';
		addcheckbox += '<div class="card_content add_checkbox_wrap">';
		addcheckbox += '	<input type="checkbox" class="checkValue">';
		addcheckbox += '	<input type="text" class="input_box input-prevent"/>';
		addcheckbox += '	<button type="button" class="checkbox_btn save" id="checkboxSave">SAVE</button>';
		addcheckbox += '	<button type="button" class="checkbox_btn cancle delete_checkbox">DELETE</button>';
		addcheckbox += '</div>';
		
		$(e.target).closest(".checkbox_box").append(addcheckbox);
	}
});

/* todo리스트 추가하는 구문 */
$("#checkbox_content").on('click', 'button', function(e){
	if($(e.target).attr("id") == "checkboxSave"){
		
		var taskNo = $("#taskNo").val();
		var userEmail = $(".userEmail").val();
		var taskDetail = $(e.target).prev().val();
		var checkValue = "";
		if($(e.target).prev().prev().is(':checked') == true){
			checkValue = 2;
		}else{
			checkValue = 1;
		}
		
		var taskDetailNo = "";
		
		$.ajax({
	
			url: "../insertTodoList",
			type: "post",
			contentType: "application/json",
			data: JSON.stringify({"taskNo": taskNo,
								  "userEmail": userEmail,
								  "taskDetail": taskDetail,
								  "status": checkValue}),
			success: function(result){
				
				$("#checkboxSave").text("UPDATE");
				$("#checkboxSave").attr("id", "checkboxUpdate");
				progressUpdate(taskNo);
					
			},
			error: function(err){
				alert("체크리스트 저장 실패 !");
			}	
			
		});
		
	}
	
	if($(e.target).attr("id") == "checkboxUpdate"){
		
		var taskDetail = $(e.target).prev().val();
		var taskDetailNo = $(e.target).prev().attr("data-detailNo");
		var taskNo = $("#taskNo").val();
		var checkValue = "";
		if($(e.target).prev().prev().is(':checked') == true){
			checkValue = 2;
		}else{
			checkValue = 1;
		}
		
		$.ajax({
			url: "../update_todo",
			type: "post",
			contentType: "application/json",
			data: JSON.stringify({"taskDetailNo": taskDetailNo,
								  "taskDetail": taskDetail,
								  "status": checkValue}),
			success: function(result){
				
				$(".input_box").val();
				
				putTaskDetail(taskNo);
				progressUpdate(taskNo);
				
			},
			error: function(err){
				alert("체크리스트 업데이트 실패 !");
			}
		})
		
	}
	
});

function progressUpdate(taskNo){
	
	$.ajax({
		url: "../progress_update",
		type: "post",
		contentType: "application/json",
		data: JSON.stringify({"taskNo": taskNo}),
		success: result => {
		},
		error: err => {
			alert("진척률 업데이트 실패 !");
		}
	})
	
}

/* task card 모달창에서 댓글 등록하기 버튼 눌렀을 때 동작 */
/* 댓글 추가 버튼 누르면 댓글 업로드 */
$("#commentBtn").click(function(){
	
	var teamNo= $(".teamNo").val();
	var taskNo= $("#taskNo").val();
	
	var write_comment = $(".comment_box>textarea").val(); 
	var comment = '';
	
	$.ajax({
		url: "../insertReply",
		type: "post",
		data: JSON.stringify({"teamNo": teamNo,
							  "taskNo": taskNo,
							  "comment": write_comment}),
		contentType: "application/json",
		success: function(result){
			
			putReply(taskNo, teamNo);
			$(".comment_box>textarea").val("");
			
		},
		error: function(err){
			alert("댓글 입력 실패 !");
		}
	})	
	
});

/* board side bar 클릭시 메인 보드 보여주고 */
$("#mainBoardSideBar").click(function(e){
	e.preventDefault();
	$("#teamProjectBoard").css("display","none");
	$("#mainBoardPage").css("display","block");
	$("#noticePage").css("display","none");
	
})

/* 
팀/프로젝트 명 클릭시 
1. 메인 보드 페이지 안보이게 처리하고, team/project 보드 페이지는 보여지게 변경
2. 클릭한 보드의 팀명으로 getTeamTask ajax를 날려서 
   해당 팀의 task card를 가져와서 status 레벨에 맞게 배치해주기 
   (최신등록한 카드가 상단으로 배치)
3. 옵저버 권한으로 참여된 팀인 경우 수정권한 제한.
*/
$(".cat-sub-menu").on('click', 'button', function(e){
	e.preventDefault();
	/* 버티컬 버튼 (컨텍스트 메뉴) 선택시 예외처리*/
	if(!$(e.target).hasClass("teamTask")){
		return;
	}
	
	/* 보드의 상단에 타이틀을 팀명으로 변경 */
	var teamName = $(e.target).html();
	$("#boardName").html("# "+teamName);
	
	var teamNo = $(e.target).parent().next().val();
	$("#boardName").append('<input type="hidden" id="teamNoHidden" value="'+ teamNo +'">');
	
	var userEmail = $(e.target).parent().next().next().val();
			
	var role = '';
	/* 클릭한 메뉴 teamNo로 user의 권한 조회하여 write기능 활성화or비활성화 처리 */
	getAuthority(teamNo, userEmail);
		
	/* 클릭한 메뉴 teamNo로 보드 task 조회*/
	getTeamTask(teamNo, userEmail);
})

function getAuthority(teamNo, userEmail){
	$.ajax({
		url: "../getAuthority",
		type: "post",
		data: JSON.stringify({"teamNo" : teamNo , "userEmail" : userEmail}), //데이터
		contentType: "application/json", //보내는 데이터 타입
		success: function(result){
			//옵저버 권한 이라면 글쓰기 기능 제한 
			if(result.role == 1){
						/* task추가 부분 비활성화 */
						$(".addTaskBox").css("display", "none");
						
						/* input태그 readonly추가 */
						$("#card_modal input").each(function(index, item){
		       				$(item).attr("readonly",true);
		   				});
		   				
						/* textarea태그 readonly추가 */
		   				$("#card_modal textarea").each(function(index, item){
		       				$(item).attr("readonly",true);
		   				});
		   				
		   				/* x버튼을 제외한 모든 버튼 비활성화 */
		   				$("#card_modal button").each(function(index, item){
							$(item).attr("disabled", true);
		   				});
		   				
		   				/* select 박스 비활성화 */
		   				$("#card_modal #selectCheck").each(function(index, item){
							$(item).attr("disabled", true);
		   				});
		   				
					}else{
						/* task추가 부분 활성화 */
						$(".addTaskBox").css("display", "block");
						
						/* input태그 readonly 해제 */
						$("#card_modal input").each(function(index, item){
		       				$(item).attr("readonly",false);
		   				});
		   				/* textarea태그 readonly 해제 */
		   				$("#card_modal textarea").each(function(index, item){
		       				$(item).attr("readonly",false);
		   				});
		   				/* x버튼을 제외한 모든 버튼 활성화 */
		   				$("#card_modal button").each(function(index, item){
							$(item).attr("disabled", false);
		   				});
		   				/* select 박스 활성화 */
		   				$("#card_modal #selectCheck").each(function(index, item){
							$(item).attr("disabled", false);
		   				});
					}
				},
				error: function(err){
				}
			});
}

function getTeamTask(teamNo, userEmail){
	var todo_task = "";
	var doing_task = "";
	var done_task = "";
	
	/* team task 가져오는거 function으로 빼서 사용해야할듯.. (addTask 후에도 사용)*/
	$.ajax({
		url: "../getTeamTask",
		type: "post",
		data: JSON.stringify({"teamNo": teamNo, "userEmail": userEmail}), //데이터
		contentType: "application/json", //보내는 데이터 타입
		success: function(result){
			$("#mainBoardPage").css("display","none");
			$("#teamProjectBoard").css("display","block");
			$("#noticePage").css("display","none");
			
			/*pollTeamTask();*/
			
			/* 요청으로 받아온 리스트 들을 화면에 task 단게에 맞게 뿌려준다. */
			for(var i = 0; i < result.length; i++){
				/* todo에 넣을것 */
				if(result[i].status == 0){
					todo_task += '<article class="card" data-taskno="'+result[i].taskNo+'">';
					todo_task += '<header>'+ result[i].title +'</header>';
					todo_task += '<div class="detail">'
					todo_task += makeDetail(result[i]);
					todo_task += '</div>';
					todo_task += '</article>';
				}
				
				/* doing에 넣을것 */
				else if(result[i].status == 1){
					doing_task += '<article class="card" data-taskno="'+result[i].taskNo+'">';
					doing_task += '<header>'+ result[i].title +'</header>';
					doing_task += '<div class="detail">';
					doing_task += makeDetail(result[i]);
					doing_task += '</div>';
					doing_task += '</article>';
				}
				
				/* done에 넣을것 */
				else if(result[i].status == 2){
					done_task += '<article class="card" data-taskno="'+result[i].taskNo+'">';
					done_task += '<header>'+ result[i].title +'</header>';
					done_task += '<div class="detail">';
					done_task += makeDetail(result[i]);
					done_task += '</div>';
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

/* task card의 디테일 부분을 만들어준다. */
function makeDetail(task){
	var detail = '';
	 
	/*0. 닉네임 표시*/
	if(task.userEmail != undefined){
		var nickname = findNickname(task.userEmail);
		if(nickname != "" && nickname != undefined){
			detail += '<i class="bi bi-emoji-laughing"></i>  ';
			detail += nickname;
		}
	}
	
	var color = "";
	/* 오늘날짜와 endDate 비교 하여 날짜 detail에 컬러 부여 */
	if(task.targetDate != null){
		var endDate = new Date(task.targetDate);
		var now = new Date();
		var compareDate = endDate - now;
		
		var day = 86400000; // 하루의 시간
		
		if(compareDate <= day*3){ //3일 남음
			color = "red";
		}else if(compareDate <= day*7){ //7일 남음
			color = "#FF9933";
		}
	}
	
	/*1. 날짜*/
	if(task.startDate != null){
		detail += '  <i class="bi bi-calendar3"></i>  ';
		/* 형식 변환 */
		var timestamp = task.startDate;
		var date = new Date(timestamp);
		detail += '<span style="color:'+color+';">';
		detail += date.getFullYear()+ '/' + (date.getMonth()+1) + '/' + date.getDate();
		detail += '</span>';
	}
	
	if(task.targetDate != null){
		detail += '<span style="color:'+color+';">';
		detail += ' - ';
		/* 형식 변환 */
		var timestamp = task.targetDate;
		var date = new Date(timestamp);
		var target_date = date.getFullYear( )+ '/' + (date.getMonth()+1) + '/' + date.getDate();
		detail += target_date;
		detail += '</span>';
		detail += '<br/>';
	}
	
	/* 댓글 갯수 */
	var countReply = replyCount(task.taskNo);
	if(countReply != 0){
		detail += '<i class="bi bi-chat-square-dots"></i>  ';
		detail += countReply;
		detail += '  ';
	}
	
	/* 진척률 */
	if(task.progressRate > 0){
		detail += '<i class="bi bi-check-square"></i>  ';
		detail += task.progressRate + '%';
	}

	/* 첨부파일 갯수 아직 미완..*/
	
	return detail;
}

/* task card에 달린 댓글의 갯수를 가져온다 */
function replyCount(taskNo){
	var count;
	/*2. 댓글 갯수*/
	$.ajax({
		url: "../putReply",
		type: "post",
		contentType: "application/json",
		data: JSON.stringify({taskNo: taskNo}),
		async: false,
		success: function(reply){
			count = reply.length;
		},
		error: function(err){
			count = 0;
		}
	});
	return count;
}

function findNickname(email){
	var nickname="";
	$.ajax({
		url:"../user/searchUserList", //컨트롤러
		type:"post",
		data:JSON.stringify({"searchKeyWord": email}),
		contentType:"application/json; charset=utf-8",
		async: false,
		success:function(result){
			for(var i = 0; i < result.length; i++){
				nickname = result[i].nickname;
			}
		}, 
		error: function(){
			nickname = "";
		}		
	})
	return nickname;
}

/* 상세페이지에서 select의 option값이 바뀔 때 task테이블의 status uptate */
$("#selectCheck").change(function(e){
	var status = $(e.target).val();
	var taskNo = $("#taskNo").val();
	
	var status = $(e.target).val();
	var taskNo = $("#taskNo").val();
	var userEmail = $(".userEmail").val();
	var teamNo = $("#teamNoHidden").val();
	
	$.ajax({
		
		url: "../taskStatusChange",
		type: "post",
		contentType: "application/json",
		data: JSON.stringify({"taskNo": taskNo,
							  "status": status}),
		success: function(result) {
			
			getTeamTask(teamNo, userEmail);
			closeCardModal();
			
		},
		error: function(err) {
			alert("옮기기 실패 했습니다.");
		}
		
	});
	
});

/* 메인 페이지 로딩 후 바로 user가 속한 팀과 프로젝트 리스트를 가져와서 화면에 버튼으로 뿌려준다.*/
function loadMainBoard(){
	
	$(document).ready(function(){
		var workspace_member = '';
		var workspace_observer = '';
		
		$.ajax({
			url: "../getWorkspace",
			type: "get",
			contentType: "application/json", //보내는 데이터 타입
			success: function(result){
				
				for(var i = 0; i < result.length; i++){
					
					/* 시간 양식 변경 */
					var teamRegdate =  new Date(result[i].teamRegdate);
					var startdate = teamRegdate.getFullYear() + "-" + (teamRegdate.getMonth()+1) + "-" + teamRegdate.getDate();
					var teamendDate = new Date(result[i].endDate);
					var enddate = teamendDate.getFullYear() + "-" + (teamendDate.getMonth()+1) + "-" + teamendDate.getDate();
					
					//member
					if(result[i].role == 0){ 
						workspace_member += '<div class="col-md-6 col-xl-3 workspace" data-teamNo='+result[i].teamNo+'>';
						workspace_member += '<article class="stat-cards-item workspaceBtn" type="button">';
						workspace_member += '<div class="stat-cards-info">';
						workspace_member += '<p class="stat-cards-info__num">'+result[i].teamName+'</p>';
						workspace_member += '<p class="stat-cards-info__title">'+result[i].teamGoal+'</p>';
					 	workspace_member += '<p class="stat-cards-info__progress">'+ startdate + "  to  " + enddate +'</p>';
						workspace_member += '</div>';
						workspace_member += '</article>';
						workspace_member += '</div>';
					}
					//observer
					else {
						workspace_observer += '<div class="col-md-6 col-xl-3 workspace" data-teamNo='+result[i].teamNo+'>';
						workspace_observer += '<article class="stat-cards-item workspaceBtn" type="button">';
						workspace_observer += '<div class="stat-cards-info">';
						workspace_observer += '<p class="stat-cards-info__num">'+result[i].teamName+'</p>';
						workspace_observer += '<p class="stat-cards-info__title">'+result[i].teamGoal+'</p>';
					 	workspace_observer += '<p class="stat-cards-info__progress">'+ startdate + "  to  " + enddate +'</p>';
						workspace_observer += '</div>';
						workspace_observer += '</article>';
						workspace_observer += '</div>';
					}
				}
				$("#memberWorkspace").html(workspace_member);
				$("#observerWorkspace").html(workspace_observer);
				
			},
			error: function(err){
				
			}
		});
	})
}

/* 메인 보드 페이지에서 workspace 버튼 클릭시 해당 보드 task불러오기 */
$("#mainBoardPage").on('click', 'article', function(e){

	var teamNo = $(e.target).closest(".workspace").attr("data-teamNo");
	var teamName = $(e.target).closest(".stat-cards-info").children(".stat-cards-info__num").html();
	var userEmail = $(".userEmail").val();
	/* 만약 제일 바깥 div를 눌러서 teamName이 undefined라면 다시 teamName을 구한다.*/
	if(teamName == undefined){
		teamName = $(e.target).children().children(".stat-cards-info__num").html();
	}
	
	/* 보드의 상단에 타이틀을 팀명으로 변경 */
	$("#boardName").html("# "+teamName);
	$("#boardName").append('<input type="hidden" id="teamNoHidden" value="'+ teamNo +'">');
	
	/* workspace클릭 시 히든태그로 값 넘기기 */
	var taskValue = "";
	taskValue += '<input type="hidden" id="teamNo" name="teamNo" value="'+ teamNo +'">';
	taskValue += '<input type="hidden" id="userEmail" name="userEmail" value="'+ userEmail +'">';
	taskValue += '<input type="hidden" class="teamNo" name="teamNo" value="'+ teamNo +'">';
	taskValue += '<input type="hidden" class="userEmail" name="userEmail" value="'+ userEmail +'">';
	$(".addTaskValue").html(taskValue);
	
	/* 클릭한 메뉴 teamNo로 user의 권한 조회하여 write기능 활성화or비활성화 처리 */
	getAuthority(teamNo, userEmail);
	
	/* 클릭한 메뉴 teamNo로 보드 task 조회*/
	getTeamTask(teamNo, userEmail);
})

/* sideMenubar에서 team의 ...버튼 클릭시 */
$(".cat-sub-menu").on('click', 'button', function(e){
	if($(e.target).hasClass("teamTask")){
		$("#menu").css("display", "none");
		return;
	}
	
	var teamNo = $(e.target.parentElement.parentElement.nextElementSibling).val();
	
	$("#menu").attr("data-teamNo", teamNo);
	$("#menu").css("top", e.pageY);
	$("#menu").css("left", e.pageX);
	$("#menu").css("display", "block");
})

/* 컨텍스트 메뉴에서 메뉴아이템을 선택시 */
$('menuitem').on('click', function(e){
	/* 일단 컨텍스트 메뉴창 안보이게 처리 */
	$("#menu").css("display", "none");
	var teamNo = $("#menu").attr("data-teamNo");
	
	/* 팀원 추가 버튼*/
	if($(e.target).attr("label") == "add Team/Project Member"){
		
		/* 기존에 팀에 추가되어있던 팀원과 권한설정 리스트 불러오기 */
		loadTeamMemeberState(teamNo);
		
		/* add member 모달창 켜짐 */
		$("#add_team_modal").css("display", "flex");
		$("#add_team_modal").attr("data-teamNo", teamNo);
		$("html").css("overflow", "hidden");
	}
	
	/* 팀 수정 */
	else if($(e.target).attr("label") == "edit Team/Project"){
		$("#modal").css("display", "flex");
		$("html").css("overflow", "hidden");
		
		/* 선택한 팀정보 가져와서 뿌려주기 */
		$.ajax({
			url:"../getTeamInfo", //컨트롤러
			type:"post",
			data:JSON.stringify({"teamNo": teamNo}),
			contentType:"application/json; charset=utf-8",
			success:function(result){
				
				/* 팀 no를 */
				$("#teamNo").val(result.teamNo);
				
				if(result.teamRegdate != null){
					$("#teamRegDate").val(result.teamRegdate.substring(0, 11));
					$("#teamEndDate").val(result.endDate.substring(0, 11));
				}
				
				$("#teamName").val(result.teamName);
				$("#teamGoal").val(result.teamGoal);
				$("#userEmail").val(result.userEmail);
				
				/* 수정할 수 있는 팀은 status가 진행중 일것이라고 생각하고 따로 작업해주지 않았다. */
			},
			error: function(){
			}
		})
	}
	
	/* 팀 삭제 (사실상 status 종료된 팀으로 update) */
	else if($(e.target).attr("label") == "Delete Team/Project"){
		
		if(!confirm("정말 삭제하시겠습니까?")){
			return;
		}else{
			/* 팀의 status N으로 변경 */
			$.ajax({
				url:"../closeTeamStatus", //컨트롤러
				type:"post",
				data:JSON.stringify({"teamNo": teamNo}),
				contentType:"application/json; charset=utf-8",
				success:function(result){
					alert("삭제되었습니다.")
					location.href="/board/board";
				},
				error: function(){
					alert("삭제 실패하였습니다.")
				}	
			})
		}
	}
})

/* 선택한 팀의 멤버와 권한 불러오기 */
function loadTeamMemeberState(teamNo){
	$.ajax({
		url:"../getTeamMember", //컨트롤러
		type:"post",
		data:JSON.stringify({"teamNo": teamNo}),
		contentType:"application/json; charset=utf-8",
		success:function(result){
			
			var memberState = '';
			for(var i = 0; i < result.length; i++){
				memberState += '<li class="searchtitle selectUser">';
				memberState += '<div>';
				memberState += '<span>'+result[i].nickName+'</span>';
				memberState += '<span class="subtitle">'+result[i].userEmail+'</span>';
				memberState += '</div>';
				memberState += '<div>';
				memberState += '<select class="selectPossible">';
				if(result[i].role == 0){ //멤버 권한
					memberState += '<option value="0" selected>Member멤버</option>';
					memberState += '<option value="1">Observer옵저버</option>';
				}else{ //옵저버 권한
					memberState += '<option value="0">Member멤버</option>';
					memberState += '<option value="1" selected>Observer옵저버</option>';
				}
				memberState += '</select>';
				memberState += '<button class="button-prevent deleteMember">X</button>';
				memberState += '</div>';
				memberState += '</li>';
			}
			/* 태그만들어서 memberList부분에 넣어주기 */
			$(".chooseMemberList").html(memberState);
		}, 
		error: function(){
		}		
	})
}

/* 컨텍스트 메뉴이외의 것을 클릭시 메뉴 닫히도록 처리 */
$('html').click(function(e) {   
	/* 컨텍스트 메뉴가 활성화 되어있고, class이름에 contextMenu가 아닌것을 클린한 경우 */
	if($("#menu").css("display") == 'block'){
		if(!$(e.target).hasClass("contextMenu") && !$(e.target).hasClass("teamContextMenu")){
			$("#menu").css("display", "none");
		}
	}
});

/* 팀원 추가 모달창 닫기 */
function closeAddMemberModal() {
	$("#add_team_modal").css("display", "none");
	$("html").css("overflow", "auto");
	
	/* 검색어 초기화 */
	$("#searchMember").val("");
	/* 찾은 userlist 초기화 */
	$(".search-list").html("");
	/* 멤버 추가 리스트 초기화 */
	$(".chooseMemberList").html("");
	/* 삭제 하려던 멤버 정보 초기화 */
	deleteData =[];
}

/* 
멤버 이메일이나 닉네임 검색시 
입력한 검색어에 따라 해당하는 닉네임이나 이메일을 가진 user를 리스트로 보여준다. 
*/
$("#searchMember").keyup(function(e){
	
	var searchKeyword = $(e.target).val();
	var findUserList = '';
	
	$.ajax({
		url:"../user/searchUserList", //컨트롤러
		type:"post",
		data:JSON.stringify({"searchKeyWord": searchKeyword}),
		contentType:"application/json; charset=utf-8",
		success:function(result){
			for(var i = 0; i < result.length; i++){
				findUserList += '<li class="searchtitle chooseUser">';
				findUserList += '<span>'+result[i].nickname+'</span><br/>';
				findUserList += '<span class="subtitle">'+result[i].userEmail+'</span>';
			}
			
			$(".search-list").html(findUserList);
		}, 
		error: function(){
		}		
	})
})

$(".search-list").on("click", function() {
	$("span").off("click");
})

/* 검색한 멤버의 이름을 클릭하면 */
$(".searchModal .search-list").on('click', 'li', function(e){
	/* 검색어 초기화 */
	$("#searchMember").val("");
	/* 찾은 userlist 초기화 */
	$(".search-list").html("");
	
	/* nickname과 email을 구한다. */
	var nickname = $(this).children().first().html();
	var email = $(this).children().last().html();
	
	/* 이미 chooseMemberList에 등록된 이메일이라면 중복 방지 */
	var emailList = $(".chooseMemberList").text();
	if(emailList.indexOf(email) != -1){
		alert("이미 추가된 멤버입니다.");
		return;
	}

	var chooseUser = '';
	chooseUser += '<li class="searchtitle selectUser">';
	chooseUser += '<div>';
	chooseUser += '<span>'+nickname+'</span>';
	chooseUser += '<span class="subtitle">'+email+'</span>';
	chooseUser += '</div>';
	chooseUser += '<div>';
	chooseUser += '<select class="selectPossible">';
	chooseUser += '<option value="0" selected>Member멤버</option>';
	chooseUser += '<option value="1">Observer옵저버</option>';
	chooseUser += '</select>';
	chooseUser += '<button class="button-prevent deleteMember">X</button>';
	chooseUser += '</div>';
	chooseUser += '</li>';
	
	/* 태그만들어서 memberList부분에 넣어주기 */
	$(".chooseMemberList").append(chooseUser);
})

let deleteData = [];

/* 모달창에서 추가된 멤버 x버튼 클릭시 삭제 되는 기능 추가 */
$(".chooseMemberList").on('click', 'button', function(e){
	
	var email = $(this.parentElement.parentElement).children().first().children().last().html();
	var teamNo = $("#add_team_modal").attr("data-teamNo");
	
	/* 지금 삭제하려는 이메일이 팀 생성자와 일치하는지 검사 */
	if(email == checkTeamCtor(teamNo)){
		alert("팀 생성자는 삭제 불가능 합니다.");
		return;
	}else{
		$(this.parentElement.parentElement).remove();
		var role = $(this.parentElement.parentElement).children().last().prev().val();

		deleteData.push({"userEmail" : email, "teamNo" : teamNo, "role" : role});
	}
})

/*
팀에 등록된 team Leader값을 return
*/
function checkTeamCtor(teamNo){
	var email = "";
	$.ajax({
		url:"../getTeamInfo", //컨트롤러
		type:"post",
		data:JSON.stringify({"teamNo": teamNo}),
		contentType:"application/json; charset=utf-8",
		async: false,
		success:function(result){
			email = result.userEmail;
		},
		error: function(){
			email = "";
		}
	})
	return email;
}

function deleteAuthority(data){
	/* 권한 테이블에 등록된 사람이었는지 체크 후 등록되었었다면 삭제 */
	$.ajax({
		url:"../deleteAuthority",
		type:"post",
		data:JSON.stringify(data),
		contentType:"application/json; charset=utf-8",
		success:function(result){
		}, 
		error: function(){
		}		
	})
}

/* 팀원 추가 모달창에서 save 버튼 클릭시 DB에 insert */
$("#add_team_modal").on('click', 'button', function(e){
	/* save버튼이 아닌 경우 예외처리 */
	if($(this).attr("id") != "addMemberSaveBtn"){
		return;
	}
	
	deleteAuthority(deleteData);
	
	var emailList = $(".chooseMemberList li .subtitle").get();
	var roleList = $(".chooseMemberList li .selectPossible option:selected").get();
	var teamNo = $("#add_team_modal").attr("data-teamNo");
	/* teamNo로 teamName 조회 notice 메세지 만들기 위한 작업 */
	var teamName = '';
	$.ajax({
		url:"../getTeamInfo", //컨트롤러
		type:"post",
		data:JSON.stringify({"teamNo": teamNo}),
		contentType:"application/json; charset=utf-8",
		async: false,
		success:function(result){
			console.log(result);
			teamName = result.teamName;
		},
		error: function(){
		}
	})
		
	for(var i = 0; i < emailList.length; i++){
		var email = emailList[i].innerHTML;
		var role = roleList[i].value;
		
		/* 초대 msg 만들기 */
		var msg = "["+ teamName + "] 팀에 ";
		if(role == 0){ //멤버
			msg += "member로 ";
		}else{ //옵저버
			msg += "observer로 ";
		}
		msg += "초대되었습니다.";
		
		if(checkAuthority(email, teamNo) == 0){
			if(confirm(email + "에게 초대 메세지를 보내시겠습니까?")){
				insertUserNotice(email, msg, 0);
			}
		}
		
		$.ajax({
			url:"../addAuthority",
			type:"post",
			data:JSON.stringify({"userEmail" : email, "teamNo" : teamNo, "role" : role}),
			contentType:"application/json; charset=utf-8",
			success:function(result){
				$("#add_team_modal").css("display", "none");
				$("html").css("overflow", "auto");
				/* 검색어 초기화 */
				$("#searchMember").val("");
				/* 찾은 userlist 초기화 */
				$(".search-list").html("");
				/* 멤버 추가 리스트 초기화 */
				$(".chooseMemberList").html("");
			}, 
			error: function(){
			}		
		})
	}
})

/* 기존에 멤버로 존재하는지 체크 */
function checkAuthority(email, teamNo){
	var existMember = 0;
	$.ajax({
		url:"../checkAuthority",
		type:"post",
		data:JSON.stringify({"userEmail" : email, "teamNo" : teamNo}),
		contentType:"application/json; charset=utf-8",
		async: false,
		success:function(result){
			existMember = result;
		}, 
		error: function(){
			existMember = -1;
		}		
	})
	return existMember;
}

/* task 상세 페이지에서 제일 하단부에 있는 save버튼을 눌렀을 시 task테이블 update */
$(".taskSaveBtn").on('click', 'button', function(e){
	
	/* 부모태그에 기능을 줘서 cancle 을 눌렀을 떄 같이 먹는 거 방지. */
	if($(this).hasClass("cancle"))return;
	
	/* task upate될 정보들 */
	var taskTitle = $("#taskTitle").val();
	var startDate = $("#startDate").val();
	var targetDate = $("#targetDate").val();
	var content = $("#description").val();
	var taskNo = $(e.target).next().children().val();
	var userEmail = $(".userEmail").val();
	
	$.ajax({
		
		url: "../updateTask",
		type: "post",
		data: JSON.stringify({"title": taskTitle, 
							  "startDate": startDate, 
							  "targetDate": targetDate, 
							  "content": content,
							  "taskNo": taskNo,
							  "userEmail": userEmail}),
		contentType: "application/json",
		success: function(result){
			
			/* 저장시 모든 input태그의 정보 초기화 */
			$("#card_modal input").each(function(index, item){
				$(item).val("");
			});
	
			/* 저장시 모든 textarea태그의 정보 초기화 */
			$("#card_modal textarea").each(function(index, item){
				$(item).val("");
			});
			
			closeCardModal();
			
			/* 사실 팀 task를 읽어올 떄 userEmail은 필요없다. */
			/* 상세페이지에서 save버튼 눌렀을 시 입력 했던 값 공백으로 치환 */
			$("#taskTitle").val("");
			$("#startDate").val("");
			$("#targetDate").val("");
			$("#description").val("");
			$(".add_checkbox_wrap").remove();
			
		},
		error: function(err){
			if(startDate == "" && targetDate == ""){
				alert("날짜를 꼭 선택 해 주세요");
			}else{
				alert("저장에 실패 했습니다");
			}
		}
		
	});
	
});

/* 
팀 생성에서 팀리더 검색시 검색 리스트 뽑아서 넣어준다.
*/
$(".searchTeamLeader").keyup(function(e){
	
	var searchKeyword = $(e.target).val();
	var findUserList = '';
	
	$.ajax({
		url:"../user/searchUserList", //컨트롤러
		type:"post",
		data:JSON.stringify({"searchKeyWord": searchKeyword}),
		contentType:"application/json; charset=utf-8",
		success:function(result){
			for(var i = 0; i < result.length; i++){
				findUserList += '<li>';
				findUserList += '<span>' + result[i].userEmail + '</span>';
				findUserList += '<span>' + '(' + result[i].nickname + ')</span>';
				findUserList += '</li>';
			}
			$(".searchTeamLeaderList .search-component").html(findUserList);
		}, 
		error: function(){
		}		
	})
})

/* 팀생성 - 검색한 멤버의 이름을 클릭하면  */
$(".searchTeamLeaderList").on('click', 'li', function(e){
	/* 찾은 userlist 초기화 */
	$(".search-component").html("");
	
	var email = $(this).children().first().html();
	$(".searchTeamLeader").val(email)
})

/**
 * polling ajax를 사용하여 특정 초마다 user의 notice를 읽어온다.
 */
$(document).ready(
	(function pollUserNotice() {
	/*이메일은 컨트롤러에서 session email 사용*/
	    $.ajax({
	        url: '../getUserNotice',
	        type: 'GET',
			dataType: "json",
	        success: function(result) {
	            console.log(result);
				
				var noticeTag = '';
				for(var i = 0; i < result.length; i++){
					noticeTag += makeUserNotice(result[i]);				
				}
	            
	            $("#userNotice").html(noticeTag);
	            
	            /* msg가 있다면 icon에 active class 추가 */
				if(result.length != 0){
					$("#userNoticeIcon").addClass("active");
				}else{
					console.log("메세지 없음");
					$("#userNotice").html("메세지가 없습니다.");
				}
	        },
	        error: function(){
			},
	        timeout: 10000, //5초
	        complete: setTimeout(function() { pollUserNotice(); }, 6000)
	    })
	})()
)

/* notice에 뿌려줄 메세지 tag 만들기 */
function makeUserNotice(notice){
	var tag = '';
	tag += '<li>';
	tag += '<a href="">';
	
	/* msg status에 따라 제목과 아이콘 컬러를 다르게해주었다. */
	//아이콘 컬러 (info / danger / purple / success / warning / grey)
	var noticeTitle = '';
	if(notice.msgStatus == 0){ //팀 초대 알림
		noticeTitle = "Welcome to Our Team!";
		tag += '<div class="notification-dropdown-icon success">'; //컬러
		tag += '<img src="/img/svg/gift-green.svg">'; //아이콘 
	}else if(notice.msgStatus == 1){ //업무 할당 알림
		noticeTitle = "Task Assignment";
		tag += '<div class="notification-dropdown-icon info">'; //컬러
		tag += '<img src="/img/svg/coffee-blue.svg">'; //아이콘 
	}else if(notice.msgStatus == 2){ //댓글 알림
		noticeTitle = "Comment on Work";
		tag += '<div class="notification-dropdown-icon warning">'; //컬러
		tag += '<img src="/img/svg/send-orange.svg">'; //아이콘 
	}
	tag += '</div>';
	tag += '<div class="notification-dropdown-text">';
	tag += '<span class="notification-dropdown__title">'+ noticeTitle +'</span>';
	tag += '<span class="notification-dropdown__subtitle">'+ notice.message +'</span>';
	tag += '<input type="hidden" id="userNoticeNo" value="'+ notice.noticeNo +'">';
	tag += '</div>';
	tag += '</a>';
	tag += '</li>';
	
	return tag;
}

/* notice를 클릭하면 해당 notice의 checked 상태를 Y로 변경시켜 확인된 notice가 되도록 처리해준다. */
$("#userNotice").on('click', 'li', function(e){
	e.preventDefault();
	
	var noticeNo = $(this).find('#userNoticeNo').val();
	$(this).remove();

	//메세지가 한건도 없는 경우	
	if($("#userNotice li").length == 0){
		$("#userNoticeIcon").removeClass("active");
		$("#userNotice").html("메세지가 없습니다.");
	}
		
	$.ajax({
		url: '../updateUserNoticeChecked',
	    type: 'POST',
	    data:JSON.stringify({"noticeNo": noticeNo}),
		contentType:"application/json; charset=utf-8",
	    success: function(result) {
			console.log(result);
	    },
	    error: function(){
		},
    });
})

/**
 * polling ajax를 사용하여 특정 초마다 user의 notice를 읽어온다.
 */
/*
$(document).ready(
	(function pollTask() {
		setInterval(
			printtemano()
			,500
		);
	})
);
*/
$(document).ready(function(){
    setInterval(printtemano(),5000);
});

function printtemano(){
	console.log("팀넘버");
	console.log($(".teamNo").val());
}
