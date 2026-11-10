package com.quiz.web;

import com.quiz.model.Question;
import com.quiz.repo.QuestionRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/questions")
public class AdminController {
    private final QuestionRepository repo;
    public AdminController(QuestionRepository r) { repo = r; }

    @GetMapping List<Question> all() { return repo.findAll(); }

    @PostMapping Question add(@Valid @RequestBody Question q) { q.id = null; return repo.save(q); }

    @PutMapping("/{id}")
    Question edit(@PathVariable Long id, @Valid @RequestBody Question q) {
        if (!repo.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        q.id = id;
        return repo.save(q);
    }

    @DeleteMapping("/{id}") void delete(@PathVariable Long id) { repo.deleteById(id); }
}
