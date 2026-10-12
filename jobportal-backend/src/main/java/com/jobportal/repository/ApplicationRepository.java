package com.jobportal.repository;

import com.jobportal.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByApplicantId(String applicantId);
    List<Application> findByJobId(String jobId);
    boolean existsByApplicantIdAndJobId(String applicantId, String jobId);
    void deleteByJobId(String jobId);
}
