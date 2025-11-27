package com.portfolio.dto;

import com.portfolio.model.Project;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDTO {
    private Long id;
    private String title;
    private String description;
    private String technologies;
    private String link;
    private Long createdAt;
    private Long updatedAt;

    public static ProjectDTO fromEntity(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .technologies(project.getTechnologies())
                .link(project.getLink())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    public Project toEntity() {
        return Project.builder()
                .id(this.id)
                .title(this.title)
                .description(this.description)
                .technologies(this.technologies)
                .link(this.link)
                .build();
    }
}
