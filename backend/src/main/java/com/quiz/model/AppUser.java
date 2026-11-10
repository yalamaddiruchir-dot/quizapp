package com.quiz.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity @Table(name = "users")
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @Column(unique = true, nullable = false) public String username;
    @JsonIgnore @Column(nullable = false) public String password; // BCrypt hash
    @Column(nullable = false) public String role; // USER or ADMIN
}
