package com.vamcc.church.service;

import com.vamcc.church.model.Member;
import com.vamcc.church.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Member Service - Business Logic Layer
 * Handles member operations: add, delete, query
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;

    /**
     * Add a new member
     *
     * @param member Member object to save
     * @return Saved member with ID
     * @throws IllegalArgumentException if email already exists
     */
    public Member addMember(Member member) {
        log.info("Adding new member: {}", member.getName());

        if (memberRepository.existsByEmail(member.getEmail())) {
            log.warn("Email already exists: {}", member.getEmail());
            throw new IllegalArgumentException("An account with this email already exists");
        }

        if (member.getPhone() != null && memberRepository.existsByPhone(member.getPhone())) {
            log.warn("Phone number already exists: {}", member.getPhone());
            throw new IllegalArgumentException("A member with this phone number already exists");
        }

        Member savedMember = memberRepository.save(member);
        log.info("Member added successfully with ID: {}", savedMember.getId());
        return savedMember;
    }

    /**
     * Delete a member by ID
     *
     * @param memberId ID of member to delete
     * @throws IllegalArgumentException if member not found
     */
    public void deleteMember(Long memberId) {
        log.info("Deleting member with ID: {}", memberId);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> {
                    log.error("Member not found with ID: {}", memberId);
                    return new IllegalArgumentException("Member not found with ID: " + memberId);
                });

        memberRepository.delete(member);
        log.info("Member deleted successfully with ID: {}", memberId);
    }

    /**
     * Query member by ID
     *
     * @param memberId ID of member to find
     * @return Member object
     * @throws IllegalArgumentException if member not found
     */
    public Member queryMemberById(Long memberId) {
        log.info("Querying member by ID: {}", memberId);

        return memberRepository.findById(memberId)
                .map(member -> {
                    log.info("Member found: {}", member);
                    return member;
                })
                .orElseThrow(() -> {
                    log.error("Member not found with ID: {}", memberId);
                    return new IllegalArgumentException("Member not found with ID: " + memberId);
                });
    }

    /**
     * Query member by email
     *
     * @param email Email of member to find
     * @return Member object
     * @throws IllegalArgumentException if member not found
     */
    public Member queryMemberByEmail(String email) {
        log.info("Querying member by email: {}", email);

        return memberRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("Member not found with email: {}", email);
                    return new IllegalArgumentException("Member not found with email: " + email);
                });
    }

    /**
     * Query member by phone
     *
     * @param phone Phone number of member to find
     * @return Member object
     * @throws IllegalArgumentException if member not found
     */
    public Member queryMemberByPhone(String phone) {
        log.info("Querying member by phone: {}", phone);

        return memberRepository.findByPhone(phone)
                .orElseThrow(() -> {
                    log.error("Member not found with phone: {}", phone);
                    return new IllegalArgumentException("Member not found with phone: " + phone);
                });
    }

    /**
     * Query all members
     *
     * @return List of all members
     */
    public List<Member> queryAllMembers() {
        log.info("Querying all members");
        return memberRepository.findAll();
    }

    /**
     * Search members by name
     *
     * @param name Name to search for
     * @return List of matching members
     */
    public List<Member> searchMembersByName(String name) {
        log.info("Searching members by name: {}", name);
        return memberRepository.findByNameIgnoreCaseContaining(name);
    }

    /**
     * Search members by email or phone
     *
     * @param query Search query
     * @return List of matching members
     */
    public List<Member> searchMembers(String query) {
        log.info("Searching members by query: {}", query);
        return memberRepository.searchByEmailOrPhone(query);
    }

    /**
     * Update an existing member
     *
     * @param memberId ID of member to update
     * @param memberDetails Updated member details
     * @return Updated member
     */
    public Member updateMember(Long memberId, Member memberDetails) {
        log.info("Updating member with ID: {}", memberId);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> {
                    log.error("Member not found with ID: {}", memberId);
                    return new IllegalArgumentException("Member not found with ID: " + memberId);
                });

        if (memberDetails.getName() != null) {
            member.setName(memberDetails.getName());
        }
        if (memberDetails.getEmail() != null && !member.getEmail().equals(memberDetails.getEmail())) {
            if (memberRepository.existsByEmail(memberDetails.getEmail())) {
                throw new IllegalArgumentException("Email already in use");
            }
            member.setEmail(memberDetails.getEmail());
        }
        if (memberDetails.getPhone() != null) {
            member.setPhone(memberDetails.getPhone());
        }
        if (memberDetails.getAddress() != null) {
            member.setAddress(memberDetails.getAddress());
        }

        Member updatedMember = memberRepository.save(member);
        log.info("Member updated successfully with ID: {}", memberId);
        return updatedMember;
    }
}
