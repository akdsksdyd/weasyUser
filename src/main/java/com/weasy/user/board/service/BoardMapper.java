package com.weasy.user.board.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import com.weasy.user.util.UserCriteria;
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

@Mapper
public interface BoardMapper {
	
	/* 팀 */
	public int insertTeam(TeamVO vo);
	
	/* 팀 update */
	public int updateTeam(TeamVO vo);
	
	public ArrayList<TeamVO> getTeamList(String user_id);
	
	//user가 속한 팀 리스트와 권한을 함께 가지고 온다.
	public ArrayList<TeamVO> getTeamListWithRole(String user_id);
	
	public int getTeamNo(TeamVO vo);
	
	//선택한 팀 정보 읽어오기
	public TeamVO getTeamInfo(TeamVO vo);
	
	//현재 팀에 추가되어있는 멤버 권한 리스트 가져오기
	public ArrayList<AuthorityVO> getTeamMember(TeamVO vo);
	
	//팀 닫기
	public int closeTeamStatus(int teamNo);
	
	/* 권한(팀원) */
	
	//팀원 추가 (권한 테이블)	
	public int addAuthority(AuthorityVO vo);
	
	//팀원 권한 조회	
	public AuthorityVO getAuthority(TeamVO vo);

	//기존에 있는 팀원인지 체크
	public int checkAuthority(AuthorityVO vo);
	
	//기존 팀원 정보 update
	public int updateAuthority(AuthorityVO vo);
	
	//기존 팀원 정보 delete
	public int deleteAuthority(int deletekey);
	
	//권한 authno얻기 (pk)
	public int getAuthNo(AuthorityVO vo);

	/* task */
	
	public int addTask(TaskVO vo);
	
	public ArrayList<TaskVO> getTaskList(TaskVO taskVo);
	
	public void updateTask(TaskVO taskVo);
	
	public void insertReply(ReplyVO replyVo);
	
	public TaskVO putTask(int taskNo);
	
	public ArrayList<ReplyVO> putReply(int taskNo);
	
	//댓글 수정
	public void updateReply(@RequestBody ReplyVO replyNo);
	
	//댓글 삭제
	public void deleteReply(@RequestBody ReplyVO replyVo);
	
	//댓글 수정, 삭제 시 작성자인지 아닌지 반환
	public ArrayList<String> getEmail(ReplyVO replyVo);
	
	//공지사항 리스트 가져오기
	public ArrayList<noticeListVO> getNoticeList(UserCriteria user_criteria);
	//공지사항 게시글 수(페이징)
	public int getTotal(UserCriteria cri); //전체게시글 수 
	//공지사항 상세페이지 가져오기
	public ArrayList<noticeListVO> getDetailNotice(noticeListVO noticeVo);
	//공지사항 검색
	public ArrayList<noticeListVO> getSearchNotice(UserCriteria user_criteria);
	//공지사항 이미지 가져오기
	public ArrayList<noticeListVO> getNoticeImg(noticeListVO notice_vo);
	
	public void taskStatusChange(TaskVO taskVo);
	
	//task 할당자 변경
	public int updateTaskUser(TaskVO taskVo);
	
	//사용자 개개인에게 보여질 notice insert
	public int insertUserNotice(noticeVO noticevo);
	
	//session에 연결된 email계정에 해당하는 notcie 읽어오기
	public ArrayList<noticeVO> getUserNotice(String email);
	
	//확인된 notice의 checked상태 변경
	public int updateUserNoticeChecked(noticeVO noticevo);
	
	//taskDetail (todo)테이블에 값 넣어주기
	public void insertTodoList(TaskDetailVO tdVo);
	
	//taskDetail 업데이트 구문
	public void updateTodoList(TaskDetailVO tdVo); 
	
	//taskDetail 조회
	public ArrayList<TaskDetailVO> putTaskDetail(TaskDetailVO tdVo);
	
	//진척률 업데이트
	public void progressUpdate(TaskVO taskVo);
	
	//todo리스트 삭제
	public void deletetodo(TaskDetailVO tdVo);
	
	// 캘린더 데이터
	public ArrayList<CalendarVO> getCalendarData(String userEmail);
	   
	// 특정팀 캘린더 데이터
	public ArrayList<CalendarVO> getCalendarTeamData(String teamName);
	//파일 등록
	public void fileRegist(ReplyUploadVO ruVo);
	
	//파일이름 불러오는 구문
	public ArrayList<ReplyUploadVO> putUpload(ReplyUploadVO ruVo);
	
}
