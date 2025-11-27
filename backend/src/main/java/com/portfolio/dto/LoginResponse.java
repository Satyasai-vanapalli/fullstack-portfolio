package com.portfolio.dto;

import com.portfolio.model.User;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String role;
    private String username;
    private Long userId;

    public static LoginResponse fromUser(String token, User user) {
        return LoginResponse.builder()
                .token(token)
                .role(user.getRole().toString())
                .username(user.getUsername())
                .userId(user.getId())
                .build();
    }
}
