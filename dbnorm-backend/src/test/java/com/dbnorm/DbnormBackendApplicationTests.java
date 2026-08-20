package com.dbnorm;

import com.dbnorm.dto.SchemaRequest;
import com.dbnorm.service.DataService;
import com.dbnorm.service.NormalizationService;
import org.springframework.mock.web.MockMultipartFile;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class DbnormBackendApplicationTests {

    private final NormalizationService normalizationService = new NormalizationService();
    private final DataService dataService = new DataService(normalizationService);

    @Test
    void normalizeShouldAllowDependencyFree1nfSchema() {
        SchemaRequest req = new SchemaRequest();
        req.setAttributes(List.of("ID", "Name"));
        req.setPrimaryKey(List.of("ID"));
        req.setFunctionalDependencies(List.of());

        var response = normalizationService.normalize(req, "1NF");

        assertEquals("1NF", response.getTargetNormalForm());
        assertEquals(1, response.getDecomposition().size());
    }

    @Test
    void rejectCsvWithMissingSchemaAttribute() {
        SchemaRequest req = new SchemaRequest();
        req.setAttributes(List.of("ID", "Name"));
        req.setPrimaryKey(List.of("ID"));
        req.setFunctionalDependencies(List.of());
        MockMultipartFile file = new MockMultipartFile(
                "file", "people.csv", "text/csv", "ID\n1\n".getBytes());

        assertThrows(IllegalArgumentException.class,
                () -> dataService.processDataNormalization(file, req, "1NF"));
    }

    @Test
    void detectShouldReturn4NFWhenMvdIsSatisfied() {
        SchemaRequest req = new SchemaRequest();
        req.setTableName("StudentCourseHobby");
        req.setAttributes(List.of("A", "B", "C"));
        req.setPrimaryKey(List.of("A"));
        req.setMultivaluedDependencies(List.of(
            dependency(List.of("A"), List.of("B")),
            dependency(List.of("A"), List.of("C"))
        ));

        var response = normalizationService.detect(req);

        assertEquals("4NF", response.getHighestNormalForm());
        assertTrue(response.getReasons().isEmpty());
    }

    @Test
    void normalizeShouldDecomposeTo4NF() {
        SchemaRequest req = new SchemaRequest();
        req.setTableName("StudentCourseHobby");
        req.setAttributes(List.of("A", "B", "C"));
        req.setPrimaryKey(List.of("A"));
        req.setMultivaluedDependencies(List.of(
            dependency(List.of("A"), List.of("B")),
            dependency(List.of("A"), List.of("C"))
        ));

        var response = normalizationService.normalize(req, "4NF");

        assertEquals("4NF", response.getTargetNormalForm());
        assertFalse(response.getDecomposition().isEmpty());
    }

    @Test
    void normalizeShouldDecomposeTo2NF() {
        SchemaRequest req = new SchemaRequest();
        req.setTableName("StudentCourse");
        req.setAttributes(List.of("StudentID", "StudentName", "CourseID", "CourseName"));
        req.setPrimaryKey(List.of("StudentID", "CourseID"));
        req.setFunctionalDependencies(List.of(
            dependency(List.of("StudentID"), List.of("StudentName")),
            dependency(List.of("CourseID"), List.of("CourseName"))
        ));

        var response = normalizationService.normalize(req, "2NF");

        assertEquals("2NF", response.getTargetNormalForm());
        assertEquals(3, response.getDecomposition().size());
    }

    @Test
    void normalizeShouldRetainAtomicRelationIn1NF() {
        SchemaRequest req = new SchemaRequest();
        req.setAttributes(List.of("ID", "Name"));
        req.setPrimaryKey(List.of("ID"));
        req.setFunctionalDependencies(List.of(dependency(List.of("ID"), List.of("Name"))));

        var response = normalizationService.normalize(req, "1NF");

        assertEquals("1NF", response.getTargetNormalForm());
        assertEquals(1, response.getDecomposition().size());
        assertEquals(Set.of("ID", "Name"), response.getDecomposition().get(0).getAttributes());
    }

    @Test
    void rejectDependencyWithUnknownAttribute() {
        SchemaRequest req = new SchemaRequest();
        req.setAttributes(List.of("ID", "Name"));
        req.setFunctionalDependencies(List.of(dependency(List.of("ID"), List.of("Missing"))));

        assertThrows(IllegalArgumentException.class, () -> normalizationService.detect(req));
    }

    @Test
    void rejectEmptyDependencySide() {
        SchemaRequest req = new SchemaRequest();
        req.setAttributes(List.of("ID", "Name"));
        req.setFunctionalDependencies(List.of(dependency(List.of(), List.of("Name"))));

        assertThrows(IllegalArgumentException.class, () -> normalizationService.normalize(req, "3NF"));
    }

    @Test
    void normalizeShouldRejectUnsupportedTarget() {
        SchemaRequest req = new SchemaRequest();
        req.setAttributes(List.of("A", "B"));
        req.setPrimaryKey(List.of("A"));
        req.setFunctionalDependencies(List.of(dependency(List.of("A"), List.of("B"))));

        assertThrows(IllegalArgumentException.class, () -> normalizationService.normalize(req, "INVALID"));
    }

    @Test
    void detectShouldReturn5NFWhenJoinDependencyIsSatisfied() {
        SchemaRequest req = new SchemaRequest();
        req.setTableName("ProjectAllocation");
        req.setAttributes(List.of("A", "B", "C"));
        req.setPrimaryKey(List.of("A", "B", "C"));
        req.setJoinDependencies(List.of(
            List.of("A", "B"),
            List.of("B", "C")
        ));

        var response = normalizationService.detect(req);

        assertEquals("5NF", response.getHighestNormalForm());
    }

    @Test
    void normalizeShouldDecomposeTo5NF() {
        SchemaRequest req = new SchemaRequest();
        req.setTableName("ProjectAllocation");
        req.setAttributes(List.of("A", "B", "C"));
        req.setPrimaryKey(List.of("A", "B", "C"));
        req.setJoinDependencies(List.of(
            List.of("A", "B"),
            List.of("B", "C")
        ));

        var response = normalizationService.normalize(req, "5NF");

        assertEquals("5NF", response.getTargetNormalForm());
        assertFalse(response.getDecomposition().isEmpty());
    }

    private SchemaRequest.FunctionalDependencyDto dependency(List<String> lhs, List<String> rhs) {
        SchemaRequest.FunctionalDependencyDto dto = new SchemaRequest.FunctionalDependencyDto();
        dto.setLhs(lhs);
        dto.setRhs(rhs);
        return dto;
    }

}
