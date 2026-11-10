package com.quiz.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class QuizResult {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    public String username;
    public int score;
    public int total;
    public LocalDateTime takenAt = LocalDateTime.now();
}
