package com.vamcc.church.controller;

import com.vamcc.church.model.Member;
import com.vamcc.church.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * Member Controller - REST API Endpoints
 * Provides HTTP endpoints for member management
 *
 * Base URL: http://localhost:8080/api/members
 */
@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    private final MemberService memberService;

    /**
     * POST /api/members
     * Add a new member
     *
     * @param member Member object with email, name, password, etc.
     * @return Created member (201 Created)
     */
    @PostMapping
    public ResponseEntity<?> addMember(@Valid @RequestBody Member member) {
        try {
            log.info("POST /members - Adding new member: {}", member.getName());
            Member savedMember = memberService.addMember(member);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMember.sanitize());
        } catch (IllegalArgumentException e) {
            log.error("Error adding member: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error adding member", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * DELETE /api/members/{memberId}
     * Delete a member by ID
     *
     * @param memberId ID of member to delete
     * @return Success/error response (200 OK or 404 Not Found)
     */
    @DeleteMapping("/{memberId}")
    public ResponseEntity<?> deleteMember(@PathVariable Long memberId) {
        try {
            log.info("DELETE /members/{} - Deleting member", memberId);
            memberService.deleteMember(memberId);
            return ResponseEntity.ok(Map.of(
                    "message", "Member deleted successfully",
                    "memberId", memberId
            ));
        } catch (IllegalArgumentException e) {
            log.error("Error deleting member: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error deleting member", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * GET /api/members/{memberId}
     * Query member by ID
     *
     * @param memberId ID of member to retrieve
     * @return Member object (200 OK or 404 Not Found)
     */
    @GetMapping("/{memberId}")
    public ResponseEntity<?> queryMemberById(@PathVariable Long memberId) {
        try {
            log.info("GET /members/{} - Querying member by ID", memberId);
            Member member = memberService.queryMemberById(memberId);
            return ResponseEntity.ok(member.sanitize());
        } catch (IllegalArgumentException e) {
            log.error("Error querying member: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error querying member", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * GET /api/members
     * Query all members or search by query parameter
     *
     * @param search Optional search parameter (email, phone, or name)
     * @return List of members
     */
    @GetMapping
    public ResponseEntity<?> queryMembers(@RequestParam(required = false) String search) {
        try {
            log.info("GET /members - Querying members. Search: {}", search);
            List<Member> members;

            if (search != null && !search.isEmpty()) {
                members = memberService.searchMembers(search);
            } else {
                members = memberService.queryAllMembers();
            }

            return ResponseEntity.ok(members.stream()
                    .map(Member::sanitize)
                    .toList());
        } catch (Exception e) {
            log.error("Unexpected error querying members", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * GET /api/members/email/{email}
     * Query member by email
     *
     * @param email Email of member to retrieve
     * @return Member object (200 OK or 404 Not Found)
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<?> queryMemberByEmail(@PathVariable String email) {
        try {
            log.info("GET /members/email/{} - Querying member by email", email);
            Member member = memberService.queryMemberByEmail(email);
            return ResponseEntity.ok(member.sanitize());
        } catch (IllegalArgumentException e) {
            log.error("Error querying member by email: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error querying member by email", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * GET /api/members/phone/{phone}
     * Query member by phone
     *
     * @param phone Phone number of member to retrieve
     * @return Member object (200 OK or 404 Not Found)
     */
    @GetMapping("/phone/{phone}")
    public ResponseEntity<?> queryMemberByPhone(@PathVariable String phone) {
        try {
            log.info("GET /members/phone/{} - Querying member by phone", phone);
            Member member = memberService.queryMemberByPhone(phone);
            return ResponseEntity.ok(member.sanitize());
        } catch (IllegalArgumentException e) {
            log.error("Error querying member by phone: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error querying member by phone", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * PUT /api/members/{memberId}
     * Update an existing member
     *
     * @param memberId ID of member to update
     * @param memberDetails Updated member details
     * @return Updated member (200 OK or 404 Not Found)
     */
    @PutMapping("/{memberId}")
    public ResponseEntity<?> updateMember(
            @PathVariable Long memberId,
            @Valid @RequestBody Member memberDetails) {
        try {
            log.info("PUT /members/{} - Updating member", memberId);
            Member updatedMember = memberService.updateMember(memberId, memberDetails);
            return ResponseEntity.ok(updatedMember.sanitize());
        } catch (IllegalArgumentException e) {
            log.error("Error updating member: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error updating member", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "VAMCC Church Member API"));
    }
}
