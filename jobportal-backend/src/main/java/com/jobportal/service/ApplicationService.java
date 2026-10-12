package com.jobportal.service;

import com.jobportal.dto.ApplicationDto;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Application;
import com.jobportal.model.ApplicationStatus;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public ApplicationDto applyForJob(String userId, String jobId, String resumeUrl) {
        if (applicationRepository.existsByApplicantIdAndJobId(userId, jobId)) {
            throw new RuntimeException("You have already applied for this job");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        Application application = Application.builder()
                .applicantId(user.getId())
                .applicantName(user.getName())
                .applicantEmail(user.getEmail())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .company(job.getCompany())
                .resumeUrl(resumeUrl)
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDateTime.now())
                .build();

        Application savedApp = applicationRepository.save(application);
        return mapToDto(savedApp);
    }

    public List<ApplicationDto> getApplicationsByUser(String userId) {
        return applicationRepository.findByApplicantId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ApplicationDto> getApplicationsByJob(String jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ApplicationDto updateApplicationStatus(String applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        try {
            ApplicationStatus newStatus = ApplicationStatus.valueOf(status.toUpperCase());
            application.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + status);
        }

        Application updatedApp = applicationRepository.save(application);
        return mapToDto(updatedApp);
    }

    private ApplicationDto mapToDto(Application app) {
        return ApplicationDto.builder()
                .id(app.getId())
                .applicantId(app.getApplicantId())
                .applicantName(app.getApplicantName())
                .applicantEmail(app.getApplicantEmail())
                .jobId(app.getJobId())
                .jobTitle(app.getJobTitle())
                .company(app.getCompany())
                .resumeUrl(app.getResumeUrl())
                .status(app.getStatus().name())
                .appliedDate(app.getAppliedDate())
                .build();
    }
}
