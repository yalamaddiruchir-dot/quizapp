package com.quiz.repo;

import com.quiz.model.QuizResult;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByUsernameOrderByTakenAtDesc(String username);
}
