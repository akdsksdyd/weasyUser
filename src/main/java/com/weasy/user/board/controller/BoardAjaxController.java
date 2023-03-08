package com.weasy.user.board.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.weasy.user.board.service.BoardService;
import com.weasy.user.command.TaskVO;
import com.weasy.user.command.TeamVO;

@RestController
public class BoardAjaxController {
	
	@Autowired
	BoardService boardService;
	
	@PostMapping("/getTeamNo")
	@ResponseBody
	public ResponseEntity<List<TaskVO>> getTeamNo(@RequestBody TaskVO vo,
								  				  Model model) {
		
		System.out.println(vo.getTeamNo());
		System.out.println(vo.getTitle());
		
		return new ResponseEntity<>(boardService.getTaskList(vo), HttpStatus.OK);
	}
	
	@PostMapping("/addTask")
	@ResponseBody
	public ResponseEntity<Integer> addTask(@RequestBody TaskVO vo){
		
		System.out.println(vo.getTeamNo());
		System.out.println(vo.getTitle());
		
		vo.setUserEmail("user");
		
		return new ResponseEntity<>(boardService.addTask(vo), HttpStatus.OK);
	}
	
}
