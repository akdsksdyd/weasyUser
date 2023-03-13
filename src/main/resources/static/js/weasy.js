"use strict";
/* 팀 클릭 시 teamNo전달 */
$(".teamTask").click(function(e){
	
	console.log(e.target.parentElement.nextElementSibling.value);
	var teamNo = $(e.target.parentElement.nextElementSibling).val();
	var userEmail = $(e.target.parentElement.nextElementSibling.nextElementSibling).val();
	
	e.preventDefault();
	
	/* 팀보드의 addTask버튼부분에 hidden 태그로 팀no 추가 */
	var taskValue = '<input type="hidden" id="teamNo" name="teamNo" value="'+ teamNo +'">';
	$(".addTaskValue").html(taskValue);
	
	/* 클릭한 메뉴 teamNo로 보드 task 조회*/
	getTeamTask(teamNo);
});

/* task card 추가 function */
$(".addTaskBtn").click(function(e){
	//input창에서 입력받은값
	var inputTask = $("#taskText").val();
	/*입력안하면 입력안되도록*/
	if(inputTask == ''){
		return;
	}

	console.log(e.target.nextElementSibling.firstChild);
	var teamNoValue = $(e.target.nextElementSibling.firstChild).val();
	var emailValue = $(e.target.nextElementSibling.lastChild).val();
	console.log(teamNoValue);

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
			
			/* content가 업데이트 시 제대로 안뜨는 부분 수정 */
				$('#description').val(result.content);
			
		},
		error: function(err){
			alert("조회에 실패 했습니다.");
		}
		
	});
	
	var replyList = "";
	var userEmail = $(".userEmail").val();
	var teamNo= $(".teamNo").val();
	
	$.ajax({
		
		url: "../putReply",
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
	
});

/* 보드 리스트 카드 모달창 닫기 */
function closeCardModal(){
	$("#card_modal").css("display", "none");
	$("html").css("overflow", "auto");
	
	/* 상세페이지에서 x버튼 눌렀을 시 입력 했던 값 공백으로 치환 */
	$("#taskTitle").val("");
	$("#startDate").val("");
	$("#targetDate").val("");
	$("#description_content").val("");
	$("#comment_list").empty();
	
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
	$("#description").val(description);
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

/* task card 모달창에서 댓글 등록하기 버튼 눌렀을 때 동작 */
/* 댓글 추가 버튼 누르면 댓글 업로드 */
$("#commentBtn").click(function(e){
	console.log($(".userEmail").val());
	console.log($(".teamNo").val());
	console.log($(".taskNo").val());
	var userEmail = $(".userEmail").val();
	var teamNo= $(".teamNo").val();
	var taskNo= $(".taskNo").val();
	
	var write_comment = $(".comment_box>textarea").val(); 
	var comment = '';
	
	$.ajax({
		url: "../insertReply",
		type: "post",
		data: JSON.stringify({"userEmail": userEmail,
							  "teamNo": teamNo,
							  "taskNo": taskNo,
							  "comment": write_comment}),
		contentType: "application/json",
		success: function(result){
			
			comment += '<div class="card_content">'; 
			comment += '<div class="profile_box">';
			comment += '<img class="profile" src="/img/avatar/avatar-illustrated-02.png" alt="User name">';
			comment += '</div>';
			comment += '<span class="comment_box">'+write_comment+'</span>'; 
			comment += '</div>'; 
			
			$("#comment_list").append(comment);
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
	var userEmail = $(e.target).parent().next().next().val();
	console.log(userEmail);
	getTeamTask(teamNo, userEmail);
	
})

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
			
				/* 요청으로 받아온 리스트 들을 화면에 task 단게에 맞게 뿌려준다. */
			for(var i = 0; i < result.length; i++){
				/* todo에 넣을것 */
				if(result[i].status == 0){
					todo_task += '<article class="card" data-taskno="'+result[i].taskNo+'">';
					todo_task += '<header>'+ result[i].title +'</header>';
					todo_task += '<div class="detail">'+ '디테일 추후에 넣어줘' +'</div>';
					todo_task += '</article>';
				}
				
				/* doing에 넣을것 */
				else if(result[i].status == 1){
					doing_task += '<article class="card" data-taskno="'+result[i].taskNo+'">';
					doing_task += '<header>'+ result[i].title +'</header>';
					doing_task += '<div class="detail">'+ '디테일 추후에 넣어줘' +'</div>';
					doing_task += '</article>';
				}
				
				/* done에 넣을것 */
				else if(result[i].status == 2){
					done_task += '<article class="card" data-taskno="'+result[i].taskNo+'">';
					done_task += '<header>'+ result[i].title +'</header>';
					done_task += '<div class="detail">'+ '디테일 추후에 넣어줘' +'</div>';
					done_task += '</article>';
				}
			} //for문의 끝
			
			console.dir($("#taskTitle").attr("placeholder"));
			
			$("#to-do-content").html(todo_task);
			$("#doing-content").html(doing_task);
			$("#done-content").html(done_task);
			
		},
		error: function(err){
			alert("보드 조회에 실패했습니다. 관리자에게 문의 부탁드립니다.🙏");
			console.log(err);
		}
	});
}

/* 메인 페이지 로딩 후 바로 user가 속한 팀과 프로젝트 리스트를 가져와서 화면에 버튼으로 뿌려준다.*/
function loadMainBoard(){
	
	$(document).ready(function(){
		var workspace = '';
		$.ajax({
			url: "../getWorkspace",
			type: "get",
			contentType: "application/json", //보내는 데이터 타입
			success: function(result){
				
				for(var i = 0; i < result.length; i++){
					workspace += '<div class="col-md-6 col-xl-3 workspace" data-teamNo='+result[i].teamNo+'>';
					workspace += '<article class="stat-cards-item workspaceBtn" type="button">';
					workspace += '<div class="stat-cards-info">';
					workspace += '<p class="stat-cards-info__num">'+result[i].teamName+'</p>';
					workspace += '<p class="stat-cards-info__title">'+result[i].teamGoal+'</p>';
					
					var teamRegdate =  new Date(result[i].teamRegdate);
					var startdate = teamRegdate.getFullYear() + "-" + (teamRegdate.getMonth()+1) + "-" + teamRegdate.getDate();
					var teamendDate = new Date(result[i].endDate);
					var enddate = teamendDate.getFullYear() + "-" + (teamendDate.getMonth()+1) + "-" + teamendDate.getDate();
					
				 	workspace += '<p class="stat-cards-info__progress">'+ startdate + "  to  " + enddate +'</p>';
					workspace += '</div>';
					workspace += '</article>';
					workspace += '</div>';
				}
				$("#memberWorkspace").html(workspace);
				
			},
			error: function(err){
				
			}
		});
	})
}

/* 메인 보드 페이지에서 workspace 버튼 클릭시 해당 보드 task불러오기 */
$("#mainBoardPage").on('click', 'article', function(e){
	e.preventDefault();

	var teamNo = $(e.target).closest(".workspace").attr("data-teamNo");
	var teamName = $(e.target).closest(".stat-cards-info").children(".stat-cards-info__num").html();
	/* 만약 제일 바깥 div를 눌러서 teamName이 undefined라면 다시 teamName을 구한다.*/
	if(teamName == undefined){
		teamName = $(e.target).children().children(".stat-cards-info__num").html();
	}
	
	/* 보드의 상단에 타이틀을 팀명으로 변경 */
	$("#boardName").html("# "+teamName);
	
	/* 클릭한 메뉴 teamNo로 보드 task 조회*/
	getTeamTask(teamNo);
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
	/* 팀원 추가 버튼*/
	if($(e.target).attr("label") == "add Team/Project Member"){
		
		/* 기존에 팀에 추가되어있던 팀원과 권한설정 리스트 불러오기 */
		var teamNo = $("#menu").attr("data-teamNo");
		loadTeamMemeberState(teamNo);
		
		/* add member 모달창 켜짐 */
		$("#add_team_modal").css("display", "flex");
		$("#add_team_modal").attr("data-teamNo", teamNo);
		$("html").css("overflow", "hidden");
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
				memberState += '<select class="selectPossible">';
				if(result[i].role == 0){ //멤버 권한
					memberState += '<option value="0" selected>Member멤버</option>';
					memberState += '<option value="1">Observer옵저버</option>';
				}else{ //옵저버 권한
					memberState += '<option value="0">Member멤버</option>';
					memberState += '<option value="1" selected>Observer옵저버</option>';
				}
				memberState += '</select>';
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
$(".search-list").on('click', 'li', function(e){
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
	chooseUser += '<select class="selectPossible">';
	chooseUser += '<option value="0" selected>Member멤버</option>';
	chooseUser += '<option value="1">Observer옵저버</option>';
	chooseUser += '</select>';
	chooseUser += '</li>';
	
	/* 태그만들어서 memberList부분에 넣어주기 */
	$(".chooseMemberList").append(chooseUser);
})

/* 모달창에서 추가된 멤버 더블 클릭시 삭제 되는 기능 추가 */
$(".chooseMemberList").on('dblclick', 'li', function(e){
	$(this).remove();
	
	var email = $(this).children().first().children().last().html();
	var role = $(this).children().last().val();
	var teamNo = $("#add_team_modal").attr("data-teamNo");
	
	/* 권한 테이블에 등록된 사람이었는지 체크 후 등록되었었다면 삭제 */
	$.ajax({
		url:"../deleteAuthority",
		type:"post",
		data:JSON.stringify({"userEmail" : email, "teamNo" : teamNo, "role" : role}),
		contentType:"application/json; charset=utf-8",
		success:function(result){
		}, 
		error: function(){
		}		
	})
})

/* 팀원 추가 모달창에서 save 버튼 클릭시 DB에 insert */
$("#add_team_modal").on('click', 'button', function(e){
	/* save버튼이 아닌 경우 예외처리 */
	if($(this).attr("id") != "addMemberSaveBtn"){
		return;
	}
	
	var emailList = $(".chooseMemberList li .subtitle").get();
	var roleList = $(".chooseMemberList li .selectPossible option:selected").get();
	for(var i = 0; i < emailList.length; i++){
		var email = emailList[i].innerHTML;
		var role = roleList[i].value;
		var teamNo = $("#add_team_modal").attr("data-teamNo");
		
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
/*$(".listBox").on('click', 'article', function(e){
	
   	var taskNo = $(e.target).closest('article').attr("data-taskno");
   	
   	$(".save").click(function(e){
		e.preventDefault();
   		console.log(taskNo);
		   
	})
})*/


/* task 상세 페이지에서 제일 하단부에 있는 save버튼을 눌렀을 시 task테이블 update */
$(".taskSaveBtn").on('click', 'button', function(e){
	
	/* 부모태그에 기능을 줘서 cancle 을 눌렀을 떄 같이 먹는 거 방지. */
	if($(this).hasClass("cancle"))return;
	
	console.log("!!!!!!!!!!!!!!!!!!");
	var taskTitle = $("#taskTitle").val();
	var startDate = $("#startDate").val();
	var targetDate = $("#targetDate").val();
	var content = $("#description").val();
	var taskNo = $(e.target).next().children().val();
	var teamNo = $("#teamNo").val();
	var userEmail = $(".userEmail").val();
	
	$.ajax({
		
		url: "../updateTask",
		type: "post",
		data: JSON.stringify({"title": taskTitle, 
							  "startDate": startDate, 
							  "targetDate": targetDate, 
							  "content": content,
							  "taskNo": taskNo}),
		contentType: "application/json",
		success: function(result){
			
			/* 상세페이지에서 save버튼 눌렀을 시 입력 했던 값 공백으로 치환 */
			$("#taskTitle").val("");
			$("#startDate").val("");
			$("#targetDate").val("");
			$("#description").val("");
			//$("#description_contetn").val("");
			console.log("팀넘버:"+teamNo);
			console.log("이메일:"+userEmail);
			getTeamTask(teamNo, userEmail);
			closeCardModal();
			
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
