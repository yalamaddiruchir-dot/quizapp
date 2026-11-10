package com.quiz.web;

import com.quiz.model.Question;
import com.quiz.model.QuizResult;
import com.quiz.repo.QuestionRepository;
import com.quiz.repo.ResultRepository;
import java.security.Principal;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    private final QuestionRepository questions; private final ResultRepository results;
    public QuizController(QuestionRepository q, ResultRepository r) { questions = q; results = r; }

    record QuestionView(Long id, String text, List<String> options, String category) {}
    record Submission(Map<Long, Integer> answers) {}
    record Review(Long id, String text, List<String> options, Integer selected, int correct) {}
    record Outcome(int score, int total, List<Review> review) {}

    private static List<String> opts(Question q) { return List.of(q.optionA, q.optionB, q.optionC, q.optionD); }

    /** Random questions WITHOUT the correct answer. */
    @GetMapping
    List<QuestionView> start(@RequestParam(defaultValue = "10") int count) {
        List<Question> all = new ArrayList<>(questions.findAll());
        Collections.shuffle(all);
        return all.stream().limit(Math.max(1, Math.min(count, 50)))
            .map(q -> new QuestionView(q.id, q.text, opts(q), q.category)).toList();
    }

    /** Scores on the server so answers can't be tampered with in the browser. */
    @PostMapping("/submit")
    Outcome submit(@RequestBody Submission s, Principal p) {
        List<Review> review = new ArrayList<>();
        int score = 0;
        for (Map.Entry<Long, Integer> e : s.answers().entrySet()) {
            Question q = questions.findById(e.getKey()).orElse(null);
            if (q == null) continue;
            Integer picked = e.getValue();
            if (picked != null && picked == q.correct) score++;
            review.add(new Review(q.id, q.text, opts(q), picked, q.correct));
        }
        QuizResult r = new QuizResult();
        r.username = p.getName(); r.score = score; r.total = review.size();
        results.save(r);
        return new Outcome(score, review.size(), review);
    }

    @GetMapping("/results")
    List<QuizResult> mine(Principal p) { return results.findByUsernameOrderByTakenAtDesc(p.getName()); }
}
