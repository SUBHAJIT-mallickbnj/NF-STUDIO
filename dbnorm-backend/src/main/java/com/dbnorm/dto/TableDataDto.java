package com.dbnorm.dto;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class TableDataDto {
    private String tableName;
    private Set<String> columns;
    private List<Map<String, String>> rows;

    public TableDataDto(String tableName, Set<String> columns, List<Map<String, String>> rows) {
        this.tableName = tableName;
        this.columns = columns;
        this.rows = rows;
    }

    // Getters and Setters
    public String getTableName() { return tableName; }
    public void setTableName(String tableName) { this.tableName = tableName; }
    
    public Set<String> getColumns() { return columns; }
    public void setColumns(Set<String> columns) { this.columns = columns; }
    
    public List<Map<String, String>> getRows() { return rows; }
    public void setRows(List<Map<String, String>> rows) { this.rows = rows; }
}