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
public class JobDto {
    private String id;
    private String title;
    private String description;
    private String company;
    private String location;
    private Double salary;
    private LocalDateTime postedDate;
    private String recruiterId;
    private String recruiterName;
}
