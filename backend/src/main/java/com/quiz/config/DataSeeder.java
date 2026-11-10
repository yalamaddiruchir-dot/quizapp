package com.quiz.config;

import com.quiz.model.AppUser;
import com.quiz.model.Question;
import com.quiz.repo.QuestionRepository;
import com.quiz.repo.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository users; private final QuestionRepository questions;
    private final PasswordEncoder encoder; private final String adminPassword;

    public DataSeeder(UserRepository u, QuestionRepository q, PasswordEncoder e, @Value("${app.admin.password}") String ap) {
        users = u; questions = q; encoder = e; adminPassword = ap;
    }

    @Override public void run(String... args) {
        if (users.findByUsername("admin").isEmpty()) {
            AppUser a = new AppUser();
            a.username = "admin"; a.password = encoder.encode(adminPassword); a.role = "ADMIN";
            users.save(a);
        }
        if (questions.count() == 0) {
            add("Which hook stores state in a React function component?", "useState", "useFetch", "useRender", "useClass", 0, "React");
            add("Which annotation marks the entry point of a Spring Boot app?", "@EnableWeb", "@SpringBootApplication", "@MainClass", "@RunApp", 1, "Spring Boot");
            add("Which SQL command removes all rows matching a condition?", "DROP", "TRUNCATE COLUMN", "DELETE", "REMOVE", 2, "MySQL");
            add("What does REST stand for?", "Remote Execution State Transfer", "Resource Exchange Standard Technology", "Rapid Endpoint Service Transfer", "Representational State Transfer", 3, "Web");
            add("Which HTTP status means a resource was not found?", "404", "200", "401", "500", 0, "Web");
            add("Which Spring Data interface gives you built-in CRUD methods?", "CrudRunner", "JpaRepository", "DataManager", "EntityHelper", 1, "Spring Boot");
        }
    }

    private void add(String t, String a, String b, String c, String d, int correct, String cat) {
        Question q = new Question();
        q.text = t; q.optionA = a; q.optionB = b; q.optionC = c; q.optionD = d; q.correct = correct; q.category = cat;
        questions.save(q);
    }
}
