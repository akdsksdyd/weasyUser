/* websocket.js 를 가져와서 사용한다. */
document.write('<script src="./weasy.js"></script>');

var wSocket;

function init() {
	wSocket = new WebSocket("ws://"+window.location.host+"/realTimeCheck");
	wSocket.onopen = function(e) {
		onOpen(e)
	};
	wSocket.onclose = function(e) {
		onClose(e)
	};
	wSocket.onmessage = function(e) {
		onMessage(e)
	};
	wSocket.onerror = function(e) {
		onError(e)
	};
}

function onOpen(e) {
	//alert("WebSocket opened!");
	$("#btn_open").attr("disabled", "disabled");
	$("#btn_close").removeAttr("disabled");
	$("#btn_send").removeAttr("disabled");
	$("#message").removeAttr("disabled");
}

function onClose(e) {
	//alert("WebSocket closed!");
	$("#btn_open").removeAttr("disabled");
	$("#btn_close").attr("disabled", "disabled");
	$("#btn_send").attr("disabled", "disabled");
	$("#message").attr("disabled", "disabled");
}

function onMessage(e) {
	//alert("메시지 수신 : " + e.data);
	console.log("메세지 수신:" + e.data);
	
	//board 변경 사항 감지
	//보드의 save버튼 클릭시 / 댓글 등록 버튼 클릭시 / 팀원 할당 클릭시 / 
	if(e.data == "board"){
		if($("#teamNoHidden").val() == undefined || $("#teamNoHidden").val() == null) return;
		
		//지금 team board를 보고 있다면 reload (task가 DB에 적용될 시간을 주기 위해 3초 후에 reload되도록 실행해 주었다.)
		setTimeout(function() {
			console.log("팀 번호 => "+$("#teamNoHidden").val());
			getTeamTask($("#teamNoHidden").val());
		}, 2000);
	}
	
	//notice 변경 사항 감지
	if(e.data == "notice"){
		//insertUserNotice시에 notice reload동작
		userNotice();
	}
	
	//team 변경 사항 감지
	if(e.data == "team"){
		setTimeout(function() {
			
			loadMainBoard();
			
			$.ajax({
				url: '../reloadTeamList',
			    type: 'POST',
				contentType:"application/json; charset=utf-8",
				async:false,
			    success: function(result) {
					console.log(result);
					var tag = "";
					for(var i = 0; i < result.length; i++){
						tag += '<li class="stat-cards-info__num">';
						tag += '<button type="button" class="teamTask">'+result[i].teamName+'</button>';
						if(result[i].role == 0){
							tag += '<button type="button" class="teamContextMenu" id="teamContextMenu">';
							tag += '<img class="teamContextMenu" src="/img/svg/more-vertical-white.svg" alt="">';
							tag += '</button>';
						}
						tag += '</li>';
						tag += '<input type="hidden" class="teamNo" value="'+result[i].teamNo+'">';
						tag += '<input type="hidden" class="userEmail" value="'+result[i].userEmail+'">';
					}
					$(".cat-sub-menu").html(tag);
			    },
			    error: function(){
				}
	    	});
    	}, 2000);
	}
}

function onError(e) {
	alert("오류발생 : " + e.data);
}

function doOpen() {
	init();
}

function doClose() {
	wSocket.close();
}

function doSend() {
	wSocket.send($("#message").val());
}

$(document).ready(function() {
	$("#btn_open").removeAttr("disabled");
	$("#btn_close").attr("disabled", "disabled");
	$("#btn_send").attr("disabled", "disabled");
	$("#message").attr("disabled", "disabled");
	init();
});
