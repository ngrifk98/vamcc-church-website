package com.vamcc.church.repository;

import com.vamcc.church.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Member Repository - Data Access Layer
 * Provides CRUD operations and custom queries for Member entity
 */
@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    /**
     * Find member by email
     */
    Optional<Member> findByEmail(String email);

    /**
     * Find member by phone
     */
    Optional<Member> findByPhone(String phone);

    /**
     * Search members by name (case-insensitive)
     */
    List<Member> findByNameIgnoreCaseContaining(String name);

    /**
     * Custom query to search by email or phone
     */
    @Query("SELECT m FROM Member m WHERE LOWER(m.email) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(m.phone) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Member> searchByEmailOrPhone(@Param("query") String query);

    /**
     * Find all members with a specific role
     */
    List<Member> findByRole(String role);

    /**
     * Check if email already exists
     */
    boolean existsByEmail(String email);

    /**
     * Check if phone already exists
     */
    boolean existsByPhone(String phone);
}
