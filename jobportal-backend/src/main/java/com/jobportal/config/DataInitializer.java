package com.jobportal.config;

import com.jobportal.model.Job;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Seed Admin
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@jobportal.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);

            // Seed Recruiter
            User recruiter = User.builder()
                    .name("Sarah Recruiter")
                    .email("recruiter@techcorp.com")
                    .password(passwordEncoder.encode("recruiter123"))
                    .role(Role.RECRUITER)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            User savedRecruiter = userRepository.save(recruiter);

            // Seed Student
            User student = User.builder()
                    .name("Alex Student")
                    .email("student@university.edu")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(student);

            // Seed Sample Jobs
            Job job1 = Job.builder()
                    .title("Senior Full Stack Engineer")
                    .description("Join our dynamic engineering team building modern cloud-native SaaS platforms. Tech stack: Java, Spring Boot, React, MongoDB, AWS.")
                    .company("TechCorp Global")
                    .location("San Francisco, CA (Remote)")
                    .salary(145000.0)
                    .postedDate(LocalDateTime.now().minusDays(2))
                    .recruiterId(savedRecruiter.getId())
                    .recruiterName(savedRecruiter.getName())
                    .recruiterEmail(savedRecruiter.getEmail())
                    .build();

            Job job2 = Job.builder()
                    .title("Frontend React Developer")
                    .description("We are looking for a passionate UI/UX focused Frontend Developer with experience in React, TypeScript, TailwindCSS, and state management.")
                    .company("InnovateLab")
                    .location("New York, NY (Hybrid)")
                    .salary(115000.0)
                    .postedDate(LocalDateTime.now().minusDays(1))
                    .recruiterId(savedRecruiter.getId())
                    .recruiterName(savedRecruiter.getName())
                    .recruiterEmail(savedRecruiter.getEmail())
                    .build();

            Job job3 = Job.builder()
                    .title("Cloud & DevOps Architect")
                    .description("Design and maintain high-performance CI/CD pipelines, Kubernetes clusters, Dockerized microservices, and observability tools.")
                    .company("CloudScale Solutions")
                    .location("Austin, TX (Remote)")
                    .salary(160000.0)
                    .postedDate(LocalDateTime.now().minusHours(12))
                    .recruiterId(savedRecruiter.getId())
                    .recruiterName(savedRecruiter.getName())
                    .recruiterEmail(savedRecruiter.getEmail())
                    .build();

            Job job4 = Job.builder()
                    .title("AI & Machine Learning Intern")
                    .description("Exciting internship opportunity for university students to work with Large Language Models, PyTorch, and NLP architectures.")
                    .company("NextGen AI Labs")
                    .location("Boston, MA")
                    .salary(65000.0)
                    .postedDate(LocalDateTime.now().minusHours(4))
                    .recruiterId(savedRecruiter.getId())
                    .recruiterName(savedRecruiter.getName())
                    .recruiterEmail(savedRecruiter.getEmail())
                    .build();

            jobRepository.save(job1);
            jobRepository.save(job2);
            jobRepository.save(job3);
            jobRepository.save(job4);

            System.out.println(">>> [DataInitializer] Seeded initial Admin, Recruiter, Student, and 4 sample jobs into MongoDB!");
        }
    }
}
