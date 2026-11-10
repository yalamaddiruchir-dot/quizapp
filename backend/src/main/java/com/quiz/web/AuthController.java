package com.quiz.web;

import com.quiz.model.AppUser;
import com.quiz.repo.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users; private final PasswordEncoder encoder;
    public AuthController(UserRepository u, PasswordEncoder e) { users = u; encoder = e; }

    record Creds(@NotBlank @Size(min = 3, max = 30) String username, @NotBlank @Size(min = 6, max = 100) String password) {}

    @PostMapping("/register")
    ResponseEntity<Map<String, String>> register(@Valid @RequestBody Creds c) {
        if (users.findByUsername(c.username()).isPresent()) return ResponseEntity.status(HttpStatus.CONFLICT).build();
        AppUser u = new AppUser();
        u.username = c.username(); u.password = encoder.encode(c.password()); u.role = "USER";
        users.save(u);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("username", u.username));
    }

    /** Called after login to confirm credentials and learn the role. */
    @GetMapping("/me")
    Map<String, String> me(Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        return Map.of("username", auth.getName(), "role", role);
    }
}
