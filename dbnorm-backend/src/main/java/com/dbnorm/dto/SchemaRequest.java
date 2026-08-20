package com.dbnorm.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class SchemaRequest {

    private String tableName;

    // Attributes are still mandatory
    @NotEmpty
    private List<String> attributes;

    private List<String> primaryKey;

    // REMOVED @NotEmpty here because 4NF/5NF might not have FDs
    private List<FunctionalDependencyDto> functionalDependencies;

    // New fields (already optional)
    private List<FunctionalDependencyDto> multivaluedDependencies;
    private List<List<String>> joinDependencies;

    public SchemaRequest() {
        super();
    }

    public SchemaRequest(String tableName, List<String> attributes, List<String> primaryKey,
            List<FunctionalDependencyDto> functionalDependencies,
            List<FunctionalDependencyDto> multivaluedDependencies,
            List<List<String>> joinDependencies) {
        super();
        this.tableName = tableName;
        this.attributes = attributes;
        this.primaryKey = primaryKey;
        this.functionalDependencies = functionalDependencies;
        this.multivaluedDependencies = multivaluedDependencies;
        this.joinDependencies = joinDependencies;
    }

    // --- Getters and Setters ---

    public String getTableName() { return tableName; }
    public void setTableName(String tableName) { this.tableName = tableName; }

    public List<String> getAttributes() { return attributes; }
    public void setAttributes(List<String> attributes) { this.attributes = attributes; }

    public List<String> getPrimaryKey() { return primaryKey; }
    public void setPrimaryKey(List<String> primaryKey) { this.primaryKey = primaryKey; }

    public List<FunctionalDependencyDto> getFunctionalDependencies() { return functionalDependencies; }
    public void setFunctionalDependencies(List<FunctionalDependencyDto> functionalDependencies) { this.functionalDependencies = functionalDependencies; }

    public List<FunctionalDependencyDto> getMultivaluedDependencies() { return multivaluedDependencies; }
    public void setMultivaluedDependencies(List<FunctionalDependencyDto> multivaluedDependencies) { this.multivaluedDependencies = multivaluedDependencies; }

    public List<List<String>> getJoinDependencies() { return joinDependencies; }
    public void setJoinDependencies(List<List<String>> joinDependencies) { this.joinDependencies = joinDependencies; }

    public static class FunctionalDependencyDto {
        @JsonAlias("from")
        private Object lhs;
        @JsonAlias("to")
        private Object rhs;

        public Object getLhs() { return lhs; }
        public void setLhs(Object lhs) { this.lhs = lhs; }
        public Object getRhs() { return rhs; }
        public void setRhs(Object rhs) { this.rhs = rhs; }
    }
}