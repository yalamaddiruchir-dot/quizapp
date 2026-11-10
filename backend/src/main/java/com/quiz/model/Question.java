package com.quiz.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @NotBlank @Column(length = 500, nullable = false) public String text;
    @NotBlank public String optionA;
    @NotBlank public String optionB;
    @NotBlank public String optionC;
    @NotBlank public String optionD;
    @Min(0) @Max(3) public int correct; // index 0-3 of the right option
    public String category;
}
