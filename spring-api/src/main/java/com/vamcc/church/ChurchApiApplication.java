package com.vamcc.church;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * VAMCC Church Spring Boot API Application
 * Main entry point for the Spring Boot application
 *
 * Run: mvn spring-boot:run
 * Or:  java -jar target/church-spring-api-1.0.0.jar
 *
 * API Base URL: http://localhost:8080/api
 */
@SpringBootApplication
public class ChurchApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChurchApiApplication.class, args);
    }
}
