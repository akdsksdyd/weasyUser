package com.weasy.user.board.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.gson.JsonParser;
import com.weasy.user.board.service.BoardService;
import com.weasy.user.command.AuthorityVO;
import com.weasy.user.command.CalendarVO;
import com.weasy.user.command.ReplyUploadVO;
import com.weasy.user.command.ReplyVO;
import com.weasy.user.command.TaskDetailVO;
import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;
import com.weasy.user.command.UserPageVO;
import com.weasy.user.command.UserVO;
import com.weasy.user.command.noticeListVO;
import com.weasy.user.command.noticeVO;
import com.weasy.user.util.UserCriteria;

import net.coobird.thumbnailator.Thumbnailator;

@RestController
public class BoardAjaxController {

	@Autowired
	BoardService boardService;
	
	//업로드 패스
	@Value("${project.uploadpath}")
	private String uploadpath;
	
	//날짜별로 폴더생성
	public String makeDir() {
				
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyMMdd");
		String now = sdf.format(date);
				
		String path = uploadpath + "\\" + now;
		File file = new File(path);
				
		if(file.exists() == false) { //존재하면 생성x
					
			file.mkdir(); //폴더생성
					
		}
				
		return now; //년월일 폴더위치
	}
	
	@PostMapping("/getTeamInfo")
	@ResponseBody
	public TeamVO getTeamInfo(@RequestBody TeamVO vo) {
		return boardService.getTeamInfo(vo);
	}

	//팀 선택 시 그 해당하는 팀의 task불러오기
	@PostMapping("/getTeamTask")
	@ResponseBody
	public List<TaskVO> getTeamTask(@RequestBody TaskVO taskVo) {
		//팀번호로 해당 팀의 task들 리스트 가져오기
		List<TaskVO> list = boardService.getTaskList(taskVo);
		System.out.println("팀태스크 가져오는 칸터를로: "+list.toString());
		return list;
	}

	@GetMapping("/getWorkspace")
	@ResponseBody
	public List<TeamVO> getWorkspace(HttpSession session) {
		//세션에 연결된 이메일의 user가 들어가 있는 team과 user의 권한 읽어오기
		String userEmail = (String)session.getAttribute("Email");
		return boardService.getTeamListWithRole(userEmail);
	}

	//업무 추가
	@PostMapping("/addTask")
	@ResponseBody
	public ResponseEntity<Integer> addTask(@RequestBody TaskVO taskVo,
			TeamVO teamVo){

		return new ResponseEntity<>(boardService.addTask(taskVo), HttpStatus.OK);
	}

	@PostMapping("/getTeamMember")
	@ResponseBody
	public List<AuthorityVO> getTeamMember(@RequestBody TeamVO vo){
		return boardService.getTeamMember(vo);
	}

	@PostMapping("/addAuthority")
	@ResponseBody
	public int addAuthority(@RequestBody AuthorityVO vo){
		//기존에 존재하던 권한이라면 update
		if(boardService.checkAuthority(vo) != 0) { //기존회원 있음
			//업데이트 진행
			return boardService.updateAuthority(vo);
		}
		//아니라면 insert 해주도록 변경
		return boardService.addAuthority(vo);
	}

	@PostMapping("/checkAuthority")
	@ResponseBody
	public int checkAuthority(@RequestBody AuthorityVO vo){
		//0 이 아니면 기존회원 있음, 0이면 신규 추가 멤버
		return boardService.checkAuthority(vo);
	}

	//회원 권한가지고 오기
	@ResponseBody
	@PostMapping("/getAuthority")
	public AuthorityVO getAuthority(@RequestBody Map<String, Object> param, HttpSession session) {
		JsonParser parser = new JsonParser();
		int teamNo = Integer.parseInt(param.get("teamNo").toString());
		String email = session.getAttribute("Email").toString();

		TeamVO vo = TeamVO.builder().teamNo(teamNo)
				.userEmail(email)
				.build();
		return boardService.getAuthority(vo);
	}

	@PostMapping("/deleteAuthority")
	@ResponseBody
	public void deleteAuthority(@RequestBody List<AuthorityVO> list){
		//삭제할 권한 배열 받아서
		for(int i = 0; i < list.size(); i++) {
			AuthorityVO vo = list.get(i);
			//기존에 존재하던 권한이라면 삭제
			if(boardService.checkAuthority(vo) != 0) { //기존회원 있음
				boardService.deleteAuthority(vo);
			}
		}
	}

	//업무 update
	@PostMapping("/updateTask")
	@ResponseBody
	public void updateTask(@RequestBody TaskVO taskVo){

		boardService.updateTask(taskVo);
	}

	//댓글 추가
	@PostMapping("/insertReply")
	@ResponseBody
	public String insertReply(@RequestBody ReplyVO replyVo, HttpSession session) {
		String email = session.getAttribute("Email").toString();
		replyVo.setUserEmail(email);
		boardService.insertReply(replyVo);
		return email;
	}

	//상세페이지에 값 넣기
	@PostMapping("/putTask")
	@ResponseBody
	public TaskVO putTask(@RequestBody TaskVO taskVo) {

		return boardService.putTask(taskVo.getTaskNo());
	}

	//상세페이지에 댓글 넣기(가지고오기)
	@PostMapping("/putReply")
	@ResponseBody
	public List<ReplyVO> putReply(@RequestBody ReplyVO replyVo) {
		return boardService.putReply(replyVo.getTaskNo());
	}

	//댓글 수정, 삭제 할 떄 필요한 email 얻어오기
	@PostMapping("/get_email")
	@ResponseBody
	public List<Integer> getEmail(@RequestBody ReplyVO replyVo,
			HttpSession session) {

		String emailCheck = session.getAttribute("Email").toString();

		ArrayList<String> list = boardService.getEmail(replyVo);
		ArrayList<Integer> result = new ArrayList<>();

		for(int i = 0; i < list.size(); i++) {

			if(list.get(i).toString().equals(emailCheck)) {
				result.add(1);
			}else {
				result.add(0);
			}
		}

		return result;
	}

	//댓글 수정
	@PostMapping("/update_reply")
	@ResponseBody
	public void updateReply(@RequestBody ReplyVO replyNo) {

		boardService.updateReply(replyNo);
	}

	//댓글 삭제
	@PostMapping("/delete_reply")
	@ResponseBody
	public void deleteReply(@RequestBody ReplyVO replyVo) {

		boardService.deleteReply(replyVo);
	}

	@PostMapping("/closeTeamStatus")
	@ResponseBody
	public int closeTeamStatus(@RequestBody Map<String, Object> param) {
		JsonParser parser = new JsonParser();
		int teamNo = Integer.parseInt(param.get("teamNo").toString());

		return boardService.closeTeamStatus(teamNo);
	}

	//task status 바꿔주기
	@PostMapping("/taskStatusChange")
	@ResponseBody
	public void taskStatusChange(@RequestBody TaskVO taskVo) {
		boardService.taskStatusChange(taskVo);
	}

	private int validTotal = 0; 
	private int valid_realend = 0;

	/**
	 * 공지사항 데이터 가져오기 
	 * 
	 * @param user_criteria
	 * @return
	 */
	@GetMapping("/get_notice_list")
	public ArrayList<noticeListVO> getNoticeList(UserCriteria user_criteria){
		int pageStart  = new UserCriteria(user_criteria.getPage(), user_criteria.getAmount()).getPageStart();
		if(pageStart > validTotal || pageStart < 0 || valid_realend == user_criteria.getPage()) {
			return null;
		}
		return boardService.getNoticeList(user_criteria);
	}

	/**
	 * 페이지네이션 개수 계산 
	 * 화면에 페이지네이션을 뿌려준다
	 *  
	 * @param user_criteria
	 * @return UserPageVO 페이지계산vo
	 */
	@GetMapping("/user_pagenation")
	public UserPageVO user_pagenation (UserCriteria user_criteria) {
		//페이지네이션 클릭 시 토탈 값 구해오기
		int total = boardService.getTotal(user_criteria);
		UserPageVO pageVo = new UserPageVO(user_criteria, total);
		if(pageVo.getEnd() == pageVo.getRealEnd()){
			
		}
		validTotal = total; //페이지네이션 화살표 제한 걸어주기 위함
		valid_realend = pageVo.getRealEnd();

		return pageVo;
	}

	/**
	 * noticeNo가 일치한 공지사항의 상세페이지를 띄운다
	 * 
	 * @param noticeVo
	 * @return ArrayList<noticeListVO>
	 */
	@PostMapping("/get_detail_notice")
	public ArrayList<noticeListVO> getDetailNotice(@RequestBody noticeListVO noticeVo){


		return boardService.getDetailNotice(noticeVo);
	}
	/**
	 * 공지사항 이미지 가져오기
	 * @param notice_vo
	 * @return 
	 */
	@GetMapping("/get_notice_img")
	public ArrayList<noticeListVO> getNoticeImg(noticeListVO notice_vo){
		return boardService.getNoticeImg(notice_vo);
	}

	/**
	 * 검색된 공지사항의 데이터를 가져옴 
	 * 
	 * @param user_criteria 검색어-keyword 검색타입-searchType
	 * @return  ArrayList<noticeListVO>
	 */
	@PostMapping("/get_search_notice")
	public ArrayList<noticeListVO> getSearchNotice(@RequestBody UserCriteria user_criteria){
		System.out.println("!!!!!!!!!!!!!서치타입"+user_criteria.getPage());
		return boardService.getSearchNotice(user_criteria);
	}

	//task card의 user 변경해주기
	@PostMapping("/updateTaskUser")
	@ResponseBody
	public int updateTaskUser(@RequestBody TaskVO taskVo) {
		return boardService.updateTaskUser(taskVo);
	}

	/**
	 * 
	 * @return 성공1 , 실패0
	 */
	@PostMapping("/insertUserNotice")
	@ResponseBody
	public int  insertUserNotice(@RequestBody noticeVO noticevo) {
		return boardService.insertUserNotice(noticevo);
	}

	/**
	 * session의 이메일계정과 일치하는 사람의 checked가 N인(미확인) notice를 전부 읽어온다.
	 * 
	 * @param session 세션에 등록된 email 사용
	 * @return ArrayList<noticeVO>
	 */
	@GetMapping("/getUserNotice")
	@ResponseBody
	public ArrayList<noticeVO> getUserNotice(HttpSession session) {
		String email = (String)session.getAttribute("Email");
		return boardService.getUserNotice(email);
	}

	/**
	 * notice를 클릭하면 checked 상태를 변경하여 확인된 notice로 상태를 변경해준다.
	 * checked 컬럼의 상태 N -> Y로 변경
	 * 
	 * @param noticevo noticeNo를 활용하여 해당 notice의 checked상태 변경
	 * @return
	 */
	@PostMapping("/updateUserNoticeChecked")
	@ResponseBody
	public int updateUserNoticeChecked(@RequestBody noticeVO noticevo) {
		return boardService.updateUserNoticeChecked(noticevo);
	}

	//taskDetail (todo)테이블에 값 넣어주기
	@PostMapping("/insert_todo")
	@ResponseBody
	public void insertTodoList(@RequestBody TaskDetailVO tdVo) {

		boardService.insertTodoList(tdVo);
	}

	//taskDetail 업데이트 구문
	@PostMapping("/update_todo")
	@ResponseBody
	public void updateTodoList(@RequestBody TaskDetailVO tdVo) {

		boardService.updateTodoList(tdVo);
	}

	//taskDetail 조회
	@PostMapping("/put_taskdetail")
	@ResponseBody
	public List<TaskDetailVO> putTaskDetail(@RequestBody TaskDetailVO tdVo){


		return boardService.putTaskDetail(tdVo);
	}

	//진척률 업데이트
	@PostMapping("/progress_update")
	@ResponseBody
	public void progressUpdate(@RequestBody TaskVO taskVo) {

		boardService.progressUpdate(taskVo);
	}

	//todo리스트 삭제
	@PostMapping("/delete_todo")
	@ResponseBody
	public void deleteTodo(@RequestBody TaskDetailVO tdVo) {

		boardService.deletetodo(tdVo);
	}
	
	@PostMapping("/reloadTeamList")
	public ArrayList<TeamVO> deleteTodo(HttpSession session) {
		String user_id = (String)session.getAttribute("Email");
		return boardService.getTeamListWithRole(user_id);
	}
	
	// 캘린더 데이터 가져오기
	   @GetMapping("/getCalendarData")
	   public Map<String, Object> getCalendarData(HttpServletRequest request) {
	      
	      String userEmail = request.getSession().getAttribute("Email").toString();
	      
	      // 팀 목록 가져오기
	      ArrayList<TeamVO> teamList = boardService.getTeamListWithRole(userEmail);
	      System.out.println(teamList.toString());
	      
	      // 한 팀의 캘린더 데이터 가져오기
	      ArrayList<CalendarVO> taskList = boardService.getCalendarData(userEmail);
	      
	      Map<String, Object> map = new HashMap<>();
	      map.put("teamList", teamList);
	      map.put("taskList", taskList);
	      
	      return map;
	   }
	   
	   // 특정 팀의 캘린더 데이터 가져오기
	   @GetMapping("/getCalendarTeamData/{teamName}")
	   public ArrayList<CalendarVO> getCalendarTeamData(@PathVariable("teamName") String teamName) {
	      
	      ArrayList<CalendarVO> list = boardService.getCalendarTeamData(teamName);
	      System.out.println(list.toString());
	      
	      return list;
	   }
	
	
	//파일 등록요청
	@PostMapping("/file_regist")
    public void upload(HttpServletRequest request, MultipartFile file, ReplyUploadVO ruVo) {
		//파일 인서트 - 인서트 이전에 키 값을 받아와야 한다.
		String origin = file.getOriginalFilename(); //파일명
		//브라우저별로 경로가 포함되서 올라오는 경우가 있어서 간단한 처리구문
		String filename = origin.substring(origin.lastIndexOf("\\") + 1);
		//폴더생성
		String filepath = makeDir();
		//중복 파일의 처리
		String uuid = UUID.randomUUID().toString();
		//최종저장경로
		String savename = uploadpath + "\\" + filepath + "\\" + uuid + "_" + filename;
		System.out.println(savename);
		
		try {
			
			File save = new File(savename); //세이브 경로
			file.transferTo(save); //업로드 진행
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		//인서트 - insert이전에 prod_id가 필요한데, selectKey방식으로 가져온다.
		ruVo = ReplyUploadVO.builder().fileName(filename)
											.filePath(filepath)
											.taskNo(ruVo.getTaskNo())
											.UUID(uuid)
											.build();
		
		boardService.fileRegist(ruVo);
		
    }
	
	//다운로드 기능
	@GetMapping("/download/{filePath}/{uuid}/{fileName}")
	public ResponseEntity<byte[]> download(@PathVariable("filePath") String filePath,
							  			   @PathVariable("uuid") String uuid,
							  			   @PathVariable("fileName") String fileName) {
			
		//파일이 저장된 경로
		String savename = uploadpath + "\\" + filePath + "\\" + uuid + "_" + fileName; //업로드패스
		File file = new File(savename);
		//저장된 이미지 파일의 이진데이터 형식을 구함
		byte[] result = null; //1. data
			
		ResponseEntity<byte[]> entity = null;
			
		try {
				
			result = FileCopyUtils.copyToByteArray(file);
				
			//2. header
			HttpHeaders header = new HttpHeaders();
				
			//다운로드임을 명시
			header.add("Content-Disposition", "attachment; filename=" + fileName );
				
			//3. 응답본문
			entity = new ResponseEntity<>(result, header, HttpStatus.OK);//데이터, 헤더, 상태값
				
		} catch (IOException e) {
			e.printStackTrace();
		}
			
		return entity;
	}
	
	//파일이름 불러오는 구문
	@PostMapping("/put_upload")
	@ResponseBody
	public ResponseEntity<List<ReplyUploadVO>> putUpload(@RequestBody ReplyUploadVO ruVo) {//vo, map
		
		return new ResponseEntity<>(boardService.putUpload(ruVo), HttpStatus.OK);
	}

}