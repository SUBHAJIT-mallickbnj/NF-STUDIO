package com.dbnorm.service;

import com.dbnorm.dto.NormalizeResponse;
import com.dbnorm.dto.SchemaRequest;
import com.dbnorm.dto.TableDataDto;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class DataService {

    private final NormalizationService normalizationService;

    public DataService(NormalizationService normalizationService) {
        this.normalizationService = normalizationService;
    }

    public List<TableDataDto> processDataNormalization(MultipartFile file, SchemaRequest schemaRequest, String targetForm) throws IOException {
        // 1. Read the Input CSV Data into a list of Maps (Rows)
        List<Map<String, String>> records = parseCsv(file, schemaRequest.getAttributes());

        // 2. Calculate the Normalization Logic (Using your existing logic)
        NormalizeResponse logicResponse = normalizationService.normalize(schemaRequest, targetForm);

        // 3. Apply the Split (Create List of TableDataDto)
        List<TableDataDto> resultTables = new ArrayList<>();

        for (NormalizeResponse.Relation relation : logicResponse.getDecomposition()) {
            // Project columns and get Distinct rows for this specific table
            List<Map<String, String>> projectedRows = projectAndDeduplicate(records, relation.getAttributes());
            
            TableDataDto tableDto = new TableDataDto(
                relation.getName(),
                relation.getAttributes(),
                projectedRows
            );
            resultTables.add(tableDto);
        }

        return resultTables;
    }

    private List<Map<String, String>> parseCsv(MultipartFile file, List<String> attributes) throws IOException {
        // Parses CSV. Assumes first row is Header.
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

            Set<String> headers = new HashSet<>();
            for (String header : csvParser.getHeaderNames()) {
                headers.add(header.replaceFirst("^\\uFEFF", "").trim().toLowerCase(Locale.ROOT));
            }
            for (String attribute : attributes) {
                if (!headers.contains(attribute.trim().toLowerCase(Locale.ROOT))) {
                    throw new IllegalArgumentException("CSV is missing the schema attribute: " + attribute);
                }
            }

            List<Map<String, String>> records = new ArrayList<>();
            for (CSVRecord csvRecord : csvParser) {
                records.add(csvRecord.toMap());
            }
            return records;
        }
    }

    private List<Map<String, String>> projectAndDeduplicate(List<Map<String, String>> allRecords, Set<String> targetAttributes) {
        // Uses a Set to automatically remove duplicate rows
        Set<Map<String, String>> uniqueRows = new HashSet<>();
        List<Map<String, String>> resultRows = new ArrayList<>();

        for (Map<String, String> record : allRecords) {
            Map<String, String> newRow = new HashMap<>();
            
            for (String col : targetAttributes) {
                // Case-insensitive lookup for column value
                String val = findValue(record, col);
                if (val == null) val = ""; 
                newRow.put(col, val);
            }
            
            if (uniqueRows.add(newRow)) { // returns true if added (was not present)
                resultRows.add(newRow);
            }
        }
        return resultRows;
    }

    private String findValue(Map<String, String> record, String colName) {
        for (Map.Entry<String, String> entry : record.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(colName)) {
                return entry.getValue();
            }
        }
        return null;
    }
}