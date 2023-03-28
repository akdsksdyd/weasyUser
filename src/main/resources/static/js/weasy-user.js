"use strict";
$(document).ready(function(){
	//이메일 중복검사 미진행 시, 회원가입 불가능하게 설정
	let checkEmailFail;
	//gender 체크박스 값 유지를 위한 변수
	let genderInd = 0;
	
	
	/* 이메일 중복확인 기능 */
	$(".doubleCheck_btn").on('click', function(){
		var email = $("input[name='userEmail']").val();		
		if(email == ""){
			$(".valid-email").html("이메일을 입력해주세요").css('color', 'red');
			return false;
		}
		
		$.ajax({
			url:"../user/checkEmail", //컨트롤러
			type:"post",
			data:JSON.stringify({"userEmail": email}),
			contentType:"application/json",
			success:function(result){
				if(result == "0"){
					$(".valid-email").html("사용 가능한 이메일입니다.").css('color', 'green');
					checkEmailFail = result;
				}else{
					$(".valid-email").html("이미 사용중인 이메일입니다.").css('color', 'red');
					checkEmailFail = result;			
				}
			}, 
			error: function(){
				alert("에러입니다");
			}		
		})
	});
   
   
   
	/* gender 체크박스 - only one */
	const checkboxes = $("input[name='genderCheck']");
	$("input[name='genderCheck']").on('click', function(e){
	    if(this.checked) {
	        for(let ind = 0; ind < checkboxes.length; ind++){
				if(checkboxes[ind].checked){ genderInd = ind; }
	            checkboxes[ind].checked = false;
	        }
	        console.log(checkboxes[genderInd].value);
	        $("input[name='gender']").attr('value', checkboxes[genderInd].value);
	       	console.log("제발: "+$("input[name='gender']").val());
	        this.checked = true;
	    } else {
	        this.checked = false;
	    }	    
	    
	});

	
	
	/*회원가입 버튼 클릭시*/
	$(".loginBtn").click(	
   //회원가입 유효성 검사
	function signUpSubmit() {
		var nameVal = $("input[name='userName']");
		var emailVal = $("input[name='userEmail']");
		var pwVal = $("input[name='userPw']");
		var phoneVal = $("input[name='phoneNum']");
      	var birthVal = $("input[name='birth']");
      	var nickNameVal = $("input[name='nickname']");

      	let userName = RegExp(/^[가-힣]{2,5}$/);
      	let userEmail = RegExp(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i);
      	let userPw = RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);
      	let phoneNum = RegExp(/^[0-9]{3}-[0-9]{4}-[0-9]{4}/);
      	let userBirth = RegExp(/^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/);
	  	let nickname = RegExp(/^[ㄱ-ㅎ가-힣a-z0-9-_]{2,10}$/);
	
      	let nameWarning = $(".valid-name");
      	let emailWarning = $(".valid-email");
      	let pwWarning = $(".valid-pw");
      	let phoneNumWarning = $(".valid-phone");
      	let birthWarning = $(".valid-brith");
      	let nicknameWarning = $(".valid-nickname");

 
      	//이름 공백 및 유효성 확인
		if(nameVal.val() == "") {
        	nameWarning.html("이름을 입력해주세요.");
        	nameVal.focus();
        	return false;
      	} else if(userName.test(nameVal.val()) == false) {
         	nameWarning.html("이름은 필수 입력 값입니다.");
         	nameVal.focus();
         	return false;
      	} else{ nameWarning.html("");}



	  	//이메일 공백 및 유효성 확인
      	if (emailVal.val() == "") {
        	 emailWarning.html("이메일을 입력해주세요");
        	 emailVal.focus();
        	 return false;
        	 
      	} else if (!userEmail.test(emailVal.val())) {
         emailWarning.html("이메일 형식이 올바르지 않습니다.");
         emailVal.focus();
         return false;
         
      	} else if(checkEmailFail == undefined || checkEmailFail == 1){ //이메일 중복검사 필수로 설정
		  emailWarning.html("이메일 중복확인이 필요합니다.");
		  emailVal.focus();
		  return false;
		  
	  	} else{emailWarning.html("")}
     
   
   
   		//비밀번호 공백 및 유효성 확인
      	if (pwVal.val() == "") {
         	pwWarning.html("비밀번호를 입력해주세요");
         	pwVal.focus();
         	return false;
         	
      	} else if (!userPw.test(pwVal.val())) {
         	pwWarning.html("8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.");
         	pwVal.focus();
         	return false;
         	
      	} else {
		  pwWarning.html("");
	  	}



      	/*휴대폰 공백 및 유효성 확인*/
      	if(!phoneNum .test(phoneVal.val())) {
         	phoneNumWarning.html("핸드폰 번호는 숫자로만 입력해주세요");
         	phoneVal.focus();
         	return false;
         
      	} else {phoneNumWarning.html("");}



      	/*생일 공백 및 유효성 확인*/
        if(!userBirth.test(birthVal.val())) {
         	birthWarning.html("생년월일 형식에 올바르지 않습니다.");
         	birthVal.focus();
         	return false;
         	
      	} else {birthWarning.html("");}



      	/*닉네임 공백 및 유효성 확인*/
      	if (nickNameVal.val() == "") {
         	nicknameWarning.html("닉네임을 입력하세요");
         	nickNameVal.focus();
         	return false;
         	
      	} else if(!nickname.test(nickNameVal.val())) {
         	nicknameWarning.html("닉네임을 2자이상 입력하세요.");
         	nickNameVal.focus();
         	return false;
         	
      	} else{nicknameWarning.html("");}
      
      
		/*성별 체크박스 값 유지(회원가입 버튼 클릭 이후에도)*/
		for(var i = 0; i < checkboxes.length; i++){
			if(checkboxes[i].values === checkboxes[genderInd].values){
				checkboxes[i].checked = true;
			}
		}
   })
   
	   
/*	$("input[name=profile]").on('click', function(){
		console.log($("input[name=profile]:checked").val());
	})
   */
}) //end




	






















