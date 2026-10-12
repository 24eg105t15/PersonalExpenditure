package com.spendwise.service;

import com.spendwise.dto.auth.AuthResponse;
import com.spendwise.dto.auth.LoginRequest;
import com.spendwise.dto.auth.RegisterRequest;
import com.spendwise.entity.User;
import com.spendwise.exception.BadRequestException;
import com.spendwise.exception.DuplicateResourceException;
import com.spendwise.repository.UserRepository;
import com.spendwise.repository.UserSettingsRepository;
import com.spendwise.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserSettingsRepository userSettingsRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("John Doe", "john@example.com", "encodedPassword");
        sampleUser.setId(1L);
    }

    @Test
    @DisplayName("Should register user successfully when valid details provided")
    void shouldRegisterUserSuccessfully() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "Pass@123", "Pass@123");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Pass@123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateTokenFromUser(1L, "john@example.com", "John Doe")).thenReturn("jwt.token.here");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt.token.here", response.getToken());
        assertEquals("john@example.com", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
        verify(userSettingsRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Should throw BadRequestException when passwords do not match")
    void shouldThrowWhenPasswordsDoNotMatch() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "Pass@123", "Wrong@123");

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email is already registered")
    void shouldThrowWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest("John Doe", "john@example.com", "Pass@123", "Pass@123");
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should login successfully with correct credentials")
    void shouldLoginSuccessfully() {
        LoginRequest request = new LoginRequest("john@example.com", "Pass@123");
        Authentication auth = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("jwt.token.login");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(sampleUser));

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt.token.login", response.getToken());
        assertEquals("john@example.com", response.getUser().getEmail());
    }
}
