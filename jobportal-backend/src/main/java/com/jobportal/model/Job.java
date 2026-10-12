package com.jobportal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    private String id;

    private String title;

    private String description;

    private String company;

    private String location;

    private Double salary;

    @CreatedDate
    @Builder.Default
    private LocalDateTime postedDate = LocalDateTime.now();

    private String recruiterId;
    
    private String recruiterName;
    
    private String recruiterEmail;
}
