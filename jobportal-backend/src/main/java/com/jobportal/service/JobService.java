package com.jobportal.service;

import com.jobportal.dto.JobDto;
import com.jobportal.exception.ResourceNotFoundException;
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
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<JobDto> getAllJobs() {
        return jobRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<JobDto> searchJobs(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllJobs();
        }
        String cleanKeyword = keyword.trim();
        return jobRepository.findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrLocationContainingIgnoreCase(
                cleanKeyword, cleanKeyword, cleanKeyword)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public JobDto getJobById(String id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id " + id));
        return mapToDto(job);
    }

    public List<JobDto> getJobsByRecruiter(String recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public JobDto createJob(JobDto jobDto, String recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        Job job = Job.builder()
                .title(jobDto.getTitle())
                .description(jobDto.getDescription())
                .company(jobDto.getCompany())
                .location(jobDto.getLocation())
                .salary(jobDto.getSalary())
                .postedDate(LocalDateTime.now())
                .recruiterId(recruiter.getId())
                .recruiterName(recruiter.getName())
                .recruiterEmail(recruiter.getEmail())
                .build();

        Job savedJob = jobRepository.save(job);
        return mapToDto(savedJob);
    }

    public JobDto updateJob(String id, JobDto jobDto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id " + id));

        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setCompany(jobDto.getCompany());
        job.setLocation(jobDto.getLocation());
        job.setSalary(jobDto.getSalary());

        Job updatedJob = jobRepository.save(job);
        return mapToDto(updatedJob);
    }

    public void deleteJob(String id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id " + id));
        applicationRepository.deleteByJobId(id);
        jobRepository.delete(job);
    }

    private JobDto mapToDto(Job job) {
        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .company(job.getCompany())
                .location(job.getLocation())
                .salary(job.getSalary())
                .postedDate(job.getPostedDate())
                .recruiterId(job.getRecruiterId())
                .recruiterName(job.getRecruiterName())
                .build();
    }
}
