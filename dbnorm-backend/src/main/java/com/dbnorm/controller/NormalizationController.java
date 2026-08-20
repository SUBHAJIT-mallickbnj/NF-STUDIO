package com.dbnorm.controller;

import com.dbnorm.dto.DetectResponse;
import com.dbnorm.dto.NormalizeResponse;
import com.dbnorm.dto.SchemaRequest;
import com.dbnorm.dto.TableDataDto; // Import the new DTO
import com.dbnorm.service.DataService; // Import the new Service
import com.dbnorm.service.NormalizationService;
import com.fasterxml.jackson.databind.ObjectMapper; // Import Jackson for JSON parsing
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Import MultipartFile

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class NormalizationController {

    private final NormalizationService service;
    private final DataService dataService; // Add DataService

    // Update Constructor
    public NormalizationController(NormalizationService service, DataService dataService) {
        this.service = service;
        this.dataService = dataService;
    }

    // ... (Keep your existing detect and normalize methods exactly as they are) ...

    @PostMapping("/nf/detect")
    public ResponseEntity<DetectResponse> detect(@Valid @RequestBody SchemaRequest request) {
        if (request.getAttributes() == null || request.getAttributes().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (request.getPrimaryKey() == null || request.getPrimaryKey().isEmpty()) {
            request.setPrimaryKey(java.util.List.of(request.getAttributes().get(0)));
        }
        return ResponseEntity.ok(service.detect(request));
    }
    
    @PostMapping("/nf/normalize")
    public ResponseEntity<NormalizeResponse> normalize(@Valid @RequestBody SchemaRequest request,
                                                       @RequestParam(name = "target", defaultValue = "3NF") String target) {
        if (!isSupportedTarget(target)) {
            return ResponseEntity.badRequest().build();
        }
        if (request.getAttributes() == null || request.getAttributes().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (request.getPrimaryKey() == null || request.getPrimaryKey().isEmpty()) {
            request.setPrimaryKey(java.util.List.of(request.getAttributes().get(0)));
        }
        return ResponseEntity.ok(service.normalize(request, target));
    }

    // --- NEW ENDPOINT FOR FILE UPLOAD ---
    @PostMapping(value = "/data/normalize", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<List<TableDataDto>> normalizeWithData(
            @RequestPart("file") MultipartFile file,
            @RequestPart("schema") String schemaJson,
            @RequestParam(name = "target", defaultValue = "3NF") String target) throws IOException {

        if (!isSupportedTarget(target) || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Manually parse the JSON string into SchemaRequest
        ObjectMapper mapper = new ObjectMapper();
        SchemaRequest request;
        try {
            request = mapper.readValue(schemaJson, SchemaRequest.class);
        } catch (JsonProcessingException ex) {
            return ResponseEntity.badRequest().build();
        }

        // Process logic + data
        List<TableDataDto> result = dataService.processDataNormalization(file, request, target);

        return ResponseEntity.ok(result);
    }

    private boolean isSupportedTarget(String target) {
        return target != null && List.of("1NF", "2NF", "3NF", "BCNF", "4NF", "5NF")
                .stream()
                .anyMatch(target::equalsIgnoreCase);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Void> handleInvalidSchema(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().build();
    }
}