package net.skhu.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.skhu.dto.Student;
import net.skhu.mapper.DepartmentMapper;
import net.skhu.mapper.StudentMapper;
import net.skhu.model.Pagination;
import net.skhu.model.StudentEdit;

@Controller
@RequestMapping("student")
@Slf4j
public class StudentController {

    @Autowired StudentMapper studentMapper;
    @Autowired DepartmentMapper departmentMapper;
    ModelMapper modelMapper = new ModelMapper();


    @GetMapping("list")
    public String list(Model model,
                       Pagination pagination,
                       @RequestParam(value = "name", defaultValue = "") String name) {

        List<Student> students;

        if (name.isEmpty()) {
            // 전체 목록 조회
            students = studentMapper.findAll(pagination);
            pagination.setRecordCount(studentMapper.getCount());
        } else {
            // 검색된 목록 조회
            students = studentMapper.findByName(
                name + "%",
                pagination.getFirstRecordIndex(),
                pagination.getSz()
            );
            // 검색된 총 레코드 수 설정
            pagination.setRecordCount(studentMapper.getCountByName(name + "%"));
        }

        model.addAttribute("students", students);
        model.addAttribute("pagination", pagination);
        model.addAttribute("name", name);

        return "student/list";
    }





    @GetMapping("edit")
    public String edit(Model model,  Pagination pagination, @RequestParam("id") int id) {
        Student student = studentMapper.findById(id);
        StudentEdit studentEdit = modelMapper.map(student, StudentEdit.class);
        model.addAttribute("studentEdit", studentEdit);
        model.addAttribute("departments", departmentMapper.findAll());
        return "student/edit";
    }

    @PostMapping(value="edit", params="cmd=save")
    public String edit(Model model, Pagination pagination,
            @Valid StudentEdit studentEdit, BindingResult bindingResult) {
        try {
            log.debug(studentEdit.toString());
            if (bindingResult.hasErrors()) {
				throw new Exception("저장할 수 없습니다");
			}
            Student student = modelMapper.map(studentEdit, Student.class);
            studentMapper.update(student);
            return "redirect:list?" + pagination.getQueryString();
        }
        catch (Exception ex) {
            bindingResult.reject("", null, ex.getMessage());
            model.addAttribute("departments", departmentMapper.findAll());
            return "student/edit";
        }
    }

    @PostMapping(value="edit", params="cmd=delete")
    public String delete(Model model, Pagination pagination,
            @Valid StudentEdit studentEdit, BindingResult bindingResult) {
        try {
            studentMapper.deleteById(studentEdit.getId());
            return "redirect:list?" + pagination.getQueryString();
        }
        catch (Exception ex) {
            bindingResult.reject("", null, ex.getMessage());
            model.addAttribute("departments", departmentMapper.findAll());
            return "student/edit";
        }
    }

    @GetMapping("create")
    public String create(Model model, Pagination pagination) {
        StudentEdit studentEdit = new StudentEdit();
        model.addAttribute("studentEdit", studentEdit);
        model.addAttribute("departments", departmentMapper.findAll());
        return "student/edit";
    }


/*
새 학생 레코드를 DB에 insert한 후, 학생 목록 페이지로 나갈 때,
방금 등록한 새 학생 객체가 보이는 마지막 페이지로 나가야 한다.

int lastPage = (int)Math.ceil((double)studentMapper.count() / pagination.getSz());
  마지막 페이지 번호는 위와 같이 계산한다.
  Math.ceil(double value) 메소드는 value에 소수점 자리가 있을 경우, 올림값을 리턴한다.
  (예: value 값이 3.14일 경우, 4를 리턴)

pagination.setPg(lastPage);
  현재 페이지 번호를 마지막 페이지 번호로 변경한다.
 */
    @PostMapping("create")
    public String create(Model model, Pagination pagination,
            @Valid StudentEdit studentEdit, BindingResult bindingResult) {
        try {
            log.debug(studentEdit.toString());
            if (bindingResult.hasErrors()) {
				throw new Exception("저장할 수 없습니다");
			}
            Student student = modelMapper.map(studentEdit, Student.class);
            studentMapper.insert(student);
            int lastPage = (int)Math.ceil((double)studentMapper.getCount() / pagination.getSz());
            pagination.setPg(lastPage);
            return "redirect:list?" + pagination.getQueryString();
        }
        catch (Exception ex) {
            bindingResult.reject("", null, ex.getMessage());
            model.addAttribute("departments", departmentMapper.findAll());
            return "student/edit";
        }
    }
}