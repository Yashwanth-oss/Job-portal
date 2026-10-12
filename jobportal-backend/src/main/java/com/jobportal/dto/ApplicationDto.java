package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDto {
    private String id;
    private String applicantId;
    private String applicantName;
    private String applicantEmail;
    private String jobId;
    private String jobTitle;
    private String company;
    private String resumeUrl;
    private String status;
    private LocalDateTime appliedDate;
}
