package com.jobportal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    private String id;

    private String applicantId;
    private String applicantName;
    private String applicantEmail;

    private String jobId;
    private String jobTitle;
    private String company;

    private String resumeUrl;

    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @CreatedDate
    @Builder.Default
    private LocalDateTime appliedDate = LocalDateTime.now();
}
