// 색상 배열
var colors = ['#86C8BC', '#FFD4B2', '#FFF6BD', '#CEEDC7', '#82AAE3', '#91D8E4', '#BFEAF5', '#4D455D', '#E96479'];

// 캘린더 페이지 모달 키기
$("#calendarSidebar").click(function(){
	console.log('왓냐')
	$("#teamProjectBoard").css("display","none");
	$("#mainBoardPage").css("display","none");
	$("#noticePage").css("display","none");
	$(".calendar-container").css("display","block");
	
	// 달력 삽입
	$(".calendarWrap").html("<div id='calendar'></div>");
	
	// 달력 세팅
	// 1. 소속된 팀 목록 가져오기
	// 2. teamNo 낮은 순으로 조회한 하나의 팀의 업무 기간 데이터 가져오기 
	$.ajax({
		url: "../getCalendarData",
		type: "get",
		success: (res) => {
			//console.log(res);
			//console.log(res.teamList[0].teamName);
			
			var str = '';
			
			// 팀 리스트에 삽입
			res.teamList.forEach(team => {
				str += '<div class="getTeam">🔹'+ team.teamName +'</div>';
			});
			
			$('.realTeamList').html(str);
			
			// 달력 데이터 삽입
			var arr = [];
			res.taskList.forEach((a, idx) => {
				arr.push({
		            title: a.title,
		            start: new Date(a.startDate),
		            end: new Date(a.targetDate),
		            color: colors[idx%10],
		          })
			});
			
			$('#calendar').fullCalendar({
		        defaultView: 'month',
		        displayEventTime: false, // 기본 달력 뷰는 월간 뷰입니다.
		        header: {
		          left: 'prev,next today',
		          center: 'title',
		          right: 'month'
		        },
		        events: arr
		        ,
		        eventRender: function(event, element) {
		          // 이벤트의 td 요소에 border-radius 스타일을 추가합니다.
		          element.find('td').css('border-radius', '15px');
		          element.find('.fc-title').css('font-weight', '600');
		          element.find('.fc-title').css('padding', '0 5px');
		        }
		    });	
			
		},
		error: (err) => {
			console.log(err);
		}
	})
	
})

// 선택한 팀의 업무 일정 가져오기
$('.realTeamList').on('click', '.getTeam', (e) => {
	var teamName = ($(e.target).html()).slice(2);
	
	$.ajax({
		url: "../getCalendarTeamData/" + teamName,
		type: "get",
		success: (res) => {
			
			// 달력 삽입
			$(".calendarWrap").html("<div id='calendar'></div>");
			
			var arr = [];
			res.forEach((a, idx) => {
				
				if(a.startDate != null && a.targetDate != null){
					arr.push({
			            title: a.title,
			            start: new Date(a.startDate),
			            end: new Date(a.targetDate),
			            color: colors[idx%10],
			        })
				}
			});
			
			console.log(arr)
			
			$('#calendar').fullCalendar({
		        defaultView: 'month',
		        displayEventTime: false, // 기본 달력 뷰는 월간 뷰입니다.
		        header: {
		          left: 'prev,next today',
		          center: 'title',
		          right: 'month'
		        },
		        events: arr
		        ,
		        eventRender: function(event, element) {
		          // 이벤트의 td 요소에 border-radius 스타일을 추가합니다.
		          element.find('td').css('border-radius', '15px');
		          element.find('.fc-title').css('font-weight', '600');
		          element.find('.fc-title').css('padding', '0 5px');
		        }
		    });	
			
		},
		error: (err) => {
			console.log("error");
		}
	})
	
})




