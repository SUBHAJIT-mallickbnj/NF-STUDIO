package com.dbnorm.service;

import com.dbnorm.dto.DetectResponse;
import com.dbnorm.dto.NormalizeResponse;
import com.dbnorm.dto.SchemaRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class NormalizationService {

    /**
     * Finds the highest normal form of a relation.
     */
    public DetectResponse detect(SchemaRequest req) {
        validateRequest(req);
        Set<String> attrs = new HashSet<>(req.getAttributes());
        var fdsRaw = toFdPairs(req.getFunctionalDependencies());
        var minCover = minimalCover(attrs, fdsRaw);
        var fds = expandRhs(minCover);
        var mvdsRaw = toFdPairs(req.getMultivaluedDependencies() != null ? req.getMultivaluedDependencies() : Collections.emptyList());
        var jdsRaw = req.getJoinDependencies() != null
            ? req.getJoinDependencies().stream().map(HashSet::new).collect(Collectors.toList())
            : Collections.<Set<String>>emptyList();

        List<Set<String>> candKeys;
        if (req.getPrimaryKey() != null && !req.getPrimaryKey().isEmpty()) {
            Set<String> userKey = parseAttributes(req.getPrimaryKey());
            userKey.retainAll(attrs);
            candKeys = userKey.isEmpty() ? candidateKeys(attrs, fds) : List.of(userKey);
        } else {
            candKeys = candidateKeys(attrs, fds);
        }

        if (candKeys.isEmpty()) {
            DetectResponse resp = new DetectResponse();
            resp.setHighestNormalForm("1NF");
            resp.setReasons(List.of("Could not find a candidate key. Please check functional dependencies."));
            resp.setCandidateKeys(Collections.emptyList());
            return resp;
        }

        Set<String> primeAttrs = candKeys.stream().flatMap(Set::stream).collect(Collectors.toSet());
        List<String> reasons = new ArrayList<>();

        boolean is2NF = true;
        for (var fd : fds) {
            Set<String> X = fd.getKey();
            String A = fd.getValue().iterator().next();
            if (X.contains(A)) continue;

            boolean isProperSubsetOfKey = candKeys.stream().anyMatch(k -> k.containsAll(X) && !k.equals(X));
            if (isProperSubsetOfKey && !primeAttrs.contains(A)) {
                is2NF = false;
                reasons.add("2NF violation: " + X + " -> " + A + " (partial dependency)");
            }
        }

        boolean is3NF = is2NF;
        if (is2NF) {
            for (var fd : fds) {
                Set<String> X = fd.getKey();
                String A = fd.getValue().iterator().next();
                if (X.contains(A)) continue;

                if (!isSuperkey(X, attrs, fds) && !primeAttrs.contains(A)) {
                    is3NF = false;
                    reasons.add("3NF violation: " + X + " -> " + A + " (transitive dependency/not a superkey)");
                }
            }
        }

        boolean isBCNF = is3NF;
        if (is3NF) {
            for (var fd : fds) {
                Set<String> X = fd.getKey();
                String A = fd.getValue().iterator().next();
                if (X.contains(A)) continue;

                if (!isSuperkey(X, attrs, fds) && candKeys.stream().noneMatch(k -> X.containsAll(k))) {
                    isBCNF = false;
                    reasons.add("BCNF violation: " + X + " -> " + A + " (determinant is not a superkey)");
                }
            }
        }

        boolean is4NF = isBCNF && mvdsRaw.isEmpty();
        if (!mvdsRaw.isEmpty()) {
            is4NF = true;
            for (var mvd : mvdsRaw) {
                Set<String> X = mvd.getKey();
                Set<String> Y = mvd.getValue();
                if (X.isEmpty() || Y.isEmpty()) continue;
                if (isTrivialMvd(X, Y, attrs)) continue;
                if (!isSuperkey(X, attrs, fds) && candKeys.stream().noneMatch(k -> X.containsAll(k))) {
                    is4NF = false;
                    reasons.add("4NF violation: " + X + " ->> " + Y + " (multivalued dependency causes redundancy)");
                }
            }
        }

        boolean is5NF = is4NF && !jdsRaw.isEmpty();
        if (!jdsRaw.isEmpty()) {
            Set<String> jdCoverage = new HashSet<>();
            for (var jd : jdsRaw) {
                if (jd == null || jd.isEmpty()) continue;
                jdCoverage.addAll(jd);
            }
            if (!jdCoverage.equals(attrs)) {
                is5NF = false;
                reasons.add("5NF violation: join dependencies do not cover all attributes of the relation without redundancy");
            }
        }

        String highest = "1NF";
        if (is2NF) highest = "2NF";
        if (is3NF) highest = "3NF";
        if (isBCNF) highest = "BCNF";
        if (is4NF) highest = "4NF";
        if (is5NF) highest = "5NF";

        DetectResponse resp = new DetectResponse();
        resp.setHighestNormalForm(highest);
        resp.setReasons(reasons.stream().distinct().collect(Collectors.toList()));
        resp.setCandidateKeys(candKeys.stream().map(ArrayList::new).collect(Collectors.toList()));
        return resp;
    }

    /**
     * Normalizes a relation to the specified normal form (up to 5NF).
     */
    public NormalizeResponse normalize(SchemaRequest req, String target) {
        validateRequest(req);
        if (target == null || List.of("1NF", "2NF", "3NF", "BCNF", "4NF", "5NF").stream()
                .noneMatch(target::equalsIgnoreCase)) {
            throw new IllegalArgumentException("Unsupported target normal form: " + target);
        }
        Set<String> attrs = new HashSet<>(req.getAttributes());
        var fdsRaw = toFdPairs(req.getFunctionalDependencies());
        var minCover = minimalCover(attrs, fdsRaw);

        // Parse New Inputs for 4NF and 5NF
        var mvdsRaw = toFdPairs(req.getMultivaluedDependencies() != null ? req.getMultivaluedDependencies() : Collections.emptyList());
        List<Set<String>> jdsRaw = req.getJoinDependencies() != null 
            ? req.getJoinDependencies().stream().map(HashSet::new).collect(Collectors.toList()) 
            : Collections.emptyList();

        List<NormalizeResponse.Relation> decomposition = new ArrayList<>();
        List<String> notes = new ArrayList<>();

        List<Set<String>> candidateKeys = candidateKeys(attrs, minCover);
        if (candidateKeys.isEmpty() && req.getPrimaryKey() != null && !req.getPrimaryKey().isEmpty()) {
            Set<String> userKey = parseAttributes(req.getPrimaryKey());
            userKey.retainAll(attrs);
            if (!userKey.isEmpty()) {
                candidateKeys = List.of(userKey);
            }
        }

        if (candidateKeys.isEmpty()) {
            notes.add("Normalization not possible: No candidate key could be found for the given schema.");
            return new NormalizeResponse(target, Collections.emptyList(), notes);
        }

        // --- PIPELINE EXECUTION ---
        
        // 1. Base Decomposition (3NF or BCNF)
        List<NormalizeResponse.Relation> currentRelations;
        if ("1NF".equalsIgnoreCase(target)) {
            NormalizeResponse.Relation relation = new NormalizeResponse.Relation();
            relation.setName("R1");
            relation.setAttributes(new HashSet<>(attrs));
            relation.setFds(findFdsForRelation(attrs, minCover));
            currentRelations = List.of(relation);
            notes.add("Relation retained in 1NF with atomic attributes.");
        } else if ("2NF".equalsIgnoreCase(target)) {
               currentRelations = twoNfDecomposition(attrs, minCover, candidateKeys, notes);
           } else if ("3NF".equalsIgnoreCase(target)) {
             currentRelations = threeNfSynthesis(attrs, minCover, notes);
        } else {
             // For BCNF, 4NF, 5NF - we start with BCNF
             var singleRhsFds = expandRhs(minCover);
             currentRelations = bcnfDecomposition(attrs, singleRhsFds, notes);
        }

        // 2. 4NF Decomposition (from BCNF results)
        if ("4NF".equalsIgnoreCase(target) || "5NF".equalsIgnoreCase(target)) {
            currentRelations = fourNfDecomposition(currentRelations, mvdsRaw, minCover, notes);
        }

        // 3. 5NF Decomposition (from 4NF results)
        if ("5NF".equalsIgnoreCase(target)) {
            currentRelations = fiveNfDecomposition(currentRelations, jdsRaw, notes);
        }

        decomposition = currentRelations;

        NormalizeResponse response = new NormalizeResponse();
        response.setTargetNormalForm(target);
        response.setDecomposition(decomposition);
        response.setNotes(notes);
        return response;
    }

    // ---------------- Normalization Algorithms ----------------

    private List<NormalizeResponse.Relation> twoNfDecomposition(
            Set<String> attrs,
            Set<Map.Entry<Set<String>, Set<String>>> fds,
            List<Set<String>> candidateKeys,
            List<String> notes) {

        Set<String> primeAttrs = candidateKeys.stream()
                .flatMap(Set::stream)
                .collect(Collectors.toSet());
        List<NormalizeResponse.Relation> decomposition = new ArrayList<>();
        Set<String> removedNonPrimeAttributes = new HashSet<>();
        int relationCounter = 1;

        for (var fd : fds) {
            Set<String> lhs = fd.getKey();
            Set<String> rhs = fd.getValue();
            boolean partialDependency = candidateKeys.stream()
                    .anyMatch(key -> key.containsAll(lhs) && !key.equals(lhs));
            boolean nonPrimeRhs = rhs.stream().anyMatch(attribute -> !primeAttrs.contains(attribute));

            if (partialDependency && nonPrimeRhs) {
                Set<String> relationAttrs = new HashSet<>(lhs);
                relationAttrs.addAll(rhs);
                NormalizeResponse.Relation relation = new NormalizeResponse.Relation();
                relation.setName("R" + relationCounter++);
                relation.setAttributes(relationAttrs);
                relation.setFds(findFdsForRelation(relationAttrs, fds));
                decomposition.add(relation);
                removedNonPrimeAttributes.addAll(rhs);
            }
        }

        Set<String> remainingAttrs = new HashSet<>(attrs);
        remainingAttrs.removeAll(removedNonPrimeAttributes);
        Set<String> preservedKey = candidateKeys.isEmpty()
                ? Collections.emptySet()
                : candidateKeys.get(0);
        remainingAttrs.addAll(preservedKey);

        if (decomposition.isEmpty() || !decomposition.stream()
                .anyMatch(relation -> relation.getAttributes().containsAll(preservedKey))) {
            NormalizeResponse.Relation relation = new NormalizeResponse.Relation();
            relation.setName("R" + relationCounter++);
            relation.setAttributes(remainingAttrs);
            relation.setFds(findFdsForRelation(remainingAttrs, fds));
            decomposition.add(relation);
        } else if (remainingAttrs.size() > preservedKey.size()) {
            NormalizeResponse.Relation relation = new NormalizeResponse.Relation();
            relation.setName("R" + relationCounter);
            relation.setAttributes(remainingAttrs);
            relation.setFds(findFdsForRelation(remainingAttrs, fds));
            decomposition.add(relation);
        }

        notes.add("Decomposition is lossless-join to 2NF.");
        return decomposition;
    }

    private List<NormalizeResponse.Relation> threeNfSynthesis(Set<String> attrs, Set<Map.Entry<Set<String>, Set<String>>> minCover, List<String> notes) {
        List<NormalizeResponse.Relation> decomposition = new ArrayList<>();
        int relationCounter = 1;

        // 1. Group FDs by their Left Hand Side (Determinant)
        Map<Set<String>, Set<String>> groupedFds = new HashMap<>();
        for (var fd : minCover) {
            groupedFds.computeIfAbsent(fd.getKey(), k -> new HashSet<>()).addAll(fd.getValue());
        }

        // 2. Generate tables based on the GROUPED rules instead of single rules
        for (Map.Entry<Set<String>, Set<String>> entry : groupedFds.entrySet()) {
            Set<String> newRelationAttrs = new HashSet<>();
            newRelationAttrs.addAll(entry.getKey());   // Add the LHS (e.g., StudentID)
            newRelationAttrs.addAll(entry.getValue()); // Add all grouped RHS (e.g., StudentName, Department)

            NormalizeResponse.Relation newRelation = new NormalizeResponse.Relation();
            newRelation.setName("R" + relationCounter++);
            newRelation.setAttributes(newRelationAttrs);
            newRelation.setFds(findFdsForRelation(newRelationAttrs, minCover));
            decomposition.add(newRelation);
        }

        // 3. Verify Lossless Join: Ensure at least one candidate key is fully preserved in a table
        List<Set<String>> candKeys = candidateKeys(attrs, minCover);
        boolean keyPreserved = candKeys.stream().anyMatch(key -> 
            decomposition.stream().anyMatch(rel -> rel.getAttributes().containsAll(key))
        );

        // 4. Fallback: If no key is preserved, create a dedicated table for the Primary Key
        if (!keyPreserved && !candKeys.isEmpty()) {
            Set<String> primaryKey = candKeys.get(0);
            NormalizeResponse.Relation newRelation = new NormalizeResponse.Relation();
            newRelation.setName("R" + relationCounter++);
            newRelation.setAttributes(primaryKey);
            newRelation.setFds(findFdsForRelation(primaryKey, minCover));
            decomposition.add(newRelation);
            notes.add("Added a relation with a candidate key to ensure a lossless-join decomposition.");
        }
        
        notes.add("Decomposition is dependency-preserving and lossless-join to 3NF.");
        return decomposition;
    }

    private List<NormalizeResponse.Relation> bcnfDecomposition(Set<String> attrs, Set<Map.Entry<Set<String>, Set<String>>> fds, List<String> notes) {
        List<NormalizeResponse.Relation> relations = new ArrayList<>();
        NormalizeResponse.Relation initialRelation = new NormalizeResponse.Relation();
        initialRelation.setAttributes(attrs);
        initialRelation.setFds(findFdsForRelation(attrs, fds));
        relations.add(initialRelation);

        int relationCounter = 0;
        boolean decomposed = true;
        while (decomposed) {
            decomposed = false;
            List<NormalizeResponse.Relation> newRelations = new ArrayList<>();
            for (NormalizeResponse.Relation rel : relations) {
                Map.Entry<Set<String>, Set<String>> violation = findBcnfViolation(rel.getAttributes(), rel.getFds().stream()
                    .map(fd -> Map.entry((Set<String>)fd.getLhs(), (Set<String>)fd.getRhs()))
                    .collect(Collectors.toSet()));

                if (violation == null) {
                    rel.setName("R" + (++relationCounter));
                    newRelations.add(rel);
                } else {
                    decomposed = true;
                    Set<String> X = violation.getKey();
                    Set<String> Y = new HashSet<>(violation.getValue());
                    Set<String> Z = new HashSet<>(rel.getAttributes());
                    Z.removeAll(X);
                    Z.removeAll(Y);
                    
                    Set<String> r1Attrs = new HashSet<>(X);
                    r1Attrs.addAll(Y);
                    NormalizeResponse.Relation r1 = new NormalizeResponse.Relation();
                    r1.setAttributes(r1Attrs);
                    r1.setFds(findFdsForRelation(r1Attrs, fds));
                    
                    Set<String> r2Attrs = new HashSet<>(X);
                    r2Attrs.addAll(Z);
                    NormalizeResponse.Relation r2 = new NormalizeResponse.Relation();
                    r2.setAttributes(r2Attrs);
                    r2.setFds(findFdsForRelation(r2Attrs, fds));
                    
                    notes.add("BCNF violation found in a relation with determinant " + X + ". Decomposing into " + r1.getAttributes() + " and " + r2.getAttributes());
                    newRelations.add(r1);
                    newRelations.add(r2);
                }
            }
            relations = newRelations;
        }
        
        int finalCounter = 1;
        for(NormalizeResponse.Relation rel : relations) {
            rel.setName("R" + finalCounter++);
        }

        notes.add("Decomposition is lossless-join to BCNF, but may not be dependency-preserving.");
        return relations;
    }

    private List<NormalizeResponse.Relation> fourNfDecomposition(
            List<NormalizeResponse.Relation> bcnfRelations, 
            Set<Map.Entry<Set<String>, Set<String>>> mvds, 
            Set<Map.Entry<Set<String>, Set<String>>> fds,
            List<String> notes) {

        List<NormalizeResponse.Relation> finalRelations = new ArrayList<>(bcnfRelations);
        boolean changed = true;

        while (changed) {
            changed = false;
            List<NormalizeResponse.Relation> nextStepRelations = new ArrayList<>();

            for (NormalizeResponse.Relation rel : finalRelations) {
                Set<String> attrs = rel.getAttributes();
                boolean splitted = false;

                for (var mvd : mvds) {
                    Set<String> X = mvd.getKey();
                    Set<String> Y = mvd.getValue();

                    if (attrs.containsAll(X) && attrs.containsAll(Y)) {
                        boolean isTrivial = X.containsAll(Y);
                        Set<String> XunionY = new HashSet<>(X); XunionY.addAll(Y);
                        if (XunionY.equals(attrs)) isTrivial = true;

                        if (!isTrivial && !isSuperkey(X, attrs, fds)) {
                            splitted = true;
                            
                            Set<String> r1Attrs = new HashSet<>(X);
                            r1Attrs.addAll(Y);
                            NormalizeResponse.Relation r1 = new NormalizeResponse.Relation();
                            r1.setAttributes(r1Attrs);
                            r1.setFds(findFdsForRelation(r1Attrs, fds));
                            r1.setName(rel.getName() + "_1");

                            Set<String> r2Attrs = new HashSet<>(attrs);
                            r2Attrs.removeAll(Y);
                            r2Attrs.addAll(X);
                            NormalizeResponse.Relation r2 = new NormalizeResponse.Relation();
                            r2.setAttributes(r2Attrs);
                            r2.setFds(findFdsForRelation(r2Attrs, fds));
                            r2.setName(rel.getName() + "_2");

                            nextStepRelations.add(r1);
                            nextStepRelations.add(r2);
                            
                            notes.add("4NF Violation in " + rel.getName() + ": MVD " + X + " ->> " + Y + " holds, but " + X + " is not a superkey.");
                            changed = true;
                            break;
                        }
                    }
                }
                if (!splitted) {
                    nextStepRelations.add(rel);
                }
            }
            finalRelations = nextStepRelations;
        }
        return finalRelations;
    }

    private List<NormalizeResponse.Relation> fiveNfDecomposition(
            List<NormalizeResponse.Relation> fourNfRelations,
            List<Set<String>> joinDependencies,
            List<String> notes) {

        List<NormalizeResponse.Relation> finalRelations = new ArrayList<>();

        for (NormalizeResponse.Relation rel : fourNfRelations) {
            Set<String> attrs = rel.getAttributes();
            boolean appliedJD = false;

            Set<String> jdTotalAttrs = new HashSet<>();
            List<Set<String>> applicableProjections = new ArrayList<>();

            for (Set<String> projection : joinDependencies) {
                if (attrs.containsAll(projection)) {
                    applicableProjections.add(projection);
                    jdTotalAttrs.addAll(projection);
                }
            }

            if (!applicableProjections.isEmpty() && jdTotalAttrs.equals(attrs) && applicableProjections.size() > 1) {
                notes.add("Applying 5NF Join Dependency to " + rel.getName());
                int counter = 1;
                for (Set<String> proj : applicableProjections) {
                    NormalizeResponse.Relation newRel = new NormalizeResponse.Relation();
                    newRel.setName(rel.getName() + "_JD" + counter++);
                    newRel.setAttributes(proj);
                    Set<Map.Entry<Set<String>, Set<String>>> castedFds = rel.getFds().stream()
                            .map(f -> Map.entry((Set<String>) f.getLhs(), (Set<String>) f.getRhs()))
                            .collect(Collectors.toSet());
                    newRel.setFds(findFdsForRelation(proj, castedFds));
                    finalRelations.add(newRel);
                }
                appliedJD = true;
            }

            if (!appliedJD) {
                finalRelations.add(rel);
            }
        }
        return finalRelations;
    }

    private boolean isTrivialMvd(Set<String> lhs, Set<String> rhs, Set<String> attrs) {
        if (lhs == null || rhs == null || lhs.isEmpty() || rhs.isEmpty()) {
            return true;
        }
        return lhs.containsAll(rhs) || rhs.containsAll(lhs) || rhs.equals(attrs) || lhs.equals(attrs);
    }

    // ---------------- Helper Methods ----------------

    private void validateRequest(SchemaRequest req) {
        if (req == null || req.getAttributes() == null || req.getAttributes().isEmpty()) {
            throw new IllegalArgumentException("Schema must contain at least one attribute.");
        }

        Set<String> attributes = req.getAttributes().stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(attribute -> !attribute.isEmpty())
                .collect(Collectors.toSet());
        if (attributes.size() != req.getAttributes().size()) {
            throw new IllegalArgumentException("Schema attributes must be non-empty and unique.");
        }

        validateAttributeList("Primary key", req.getPrimaryKey(), attributes, false);
        validateDependencies("Functional dependency", req.getFunctionalDependencies(), attributes);
        validateDependencies("Multivalued dependency", req.getMultivaluedDependencies(), attributes);

        if (req.getJoinDependencies() != null) {
            for (List<String> group : req.getJoinDependencies()) {
                validateAttributeList("Join dependency group", group, attributes, true);
            }
        }
    }

    private void validateDependencies(
            String dependencyType,
            List<SchemaRequest.FunctionalDependencyDto> dependencies,
            Set<String> attributes) {
        if (dependencies == null) {
            return;
        }
        for (SchemaRequest.FunctionalDependencyDto dependency : dependencies) {
            if (dependency == null) {
                throw new IllegalArgumentException(dependencyType + " cannot contain null entries.");
            }
            Set<String> lhs = parseAttributes(dependency.getLhs());
            Set<String> rhs = parseAttributes(dependency.getRhs());
            if (lhs.isEmpty() || rhs.isEmpty()) {
                throw new IllegalArgumentException(dependencyType + " must have non-empty left and right sides.");
            }
            validateAttributeList(dependencyType, new ArrayList<>(lhs), attributes, true);
            validateAttributeList(dependencyType, new ArrayList<>(rhs), attributes, true);
        }
    }

    private void validateAttributeList(
            String field,
            List<String> values,
            Set<String> attributes,
            boolean required) {
        if (values == null) {
            if (required) {
                throw new IllegalArgumentException(field + " must not be empty.");
            }
            return;
        }
        Set<String> normalized = values.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .collect(Collectors.toSet());
        if (required && normalized.isEmpty()) {
            throw new IllegalArgumentException(field + " must not be empty.");
        }
        if (normalized.size() != values.size() || !attributes.containsAll(normalized)) {
            Set<String> unknown = new HashSet<>(normalized);
            unknown.removeAll(attributes);
            throw new IllegalArgumentException(field + " contains invalid attributes: " + unknown);
        }
    }

    private Map.Entry<Set<String>, Set<String>> findBcnfViolation(Set<String> attrs, Set<Map.Entry<Set<String>, Set<String>>> fds) {
        for (var fd : fds) {
            Set<String> X = fd.getKey();
            Set<String> Y = fd.getValue();
            if (!isSuperkey(X, attrs, fds) && !X.containsAll(Y)) {
                return Map.entry(X, Y);
            }
        }
        return null;
    }

    private List<NormalizeResponse.FunctionalDependency> findFdsForRelation(Set<String> relationAttrs, Set<Map.Entry<Set<String>, Set<String>>> fds) {
        Set<Map.Entry<Set<String>, Set<String>>> fdsInRelation = fds.stream()
                .filter(fd -> relationAttrs.containsAll(fd.getKey()) && relationAttrs.containsAll(fd.getValue()))
                .collect(Collectors.toSet());
        
        Set<Map.Entry<Set<String>, Set<String>>> minCover = minimalCover(relationAttrs, fdsInRelation);
        
        return minCover.stream()
                .map(fd -> {
                    NormalizeResponse.FunctionalDependency newFd = new NormalizeResponse.FunctionalDependency();
                    newFd.setLhs(fd.getKey());
                    newFd.setRhs(fd.getValue());
                    return newFd;
                })
                .collect(Collectors.toList());
    }

    private boolean isSuperkey(Set<String> X, Set<String> attrs, Set<Map.Entry<Set<String>, Set<String>>> fds) {
        return closure(X, fds).containsAll(attrs);
    }

    private Set<String> closure(Set<String> X, Set<Map.Entry<Set<String>, Set<String>>> fds) {
        Set<String> result = new HashSet<>(X);
        boolean changed;
        do {
            changed = false;
            for (var fd : fds) {
                if (result.containsAll(fd.getKey()) && !result.containsAll(fd.getValue())) {
                    result.addAll(fd.getValue());
                    changed = true;
                }
            }
        } while (changed);
        return result;
    }
    
    private List<Set<String>> candidateKeys(Set<String> attrs, Set<Map.Entry<Set<String>, Set<String>>> fds) {
        List<Set<String>> keys = new ArrayList<>();
        List<String> allAttrs = new ArrayList<>(attrs);
        int n = allAttrs.size();

        for (int i = 1; i < (1 << n); i++) {
            Set<String> candidate = new HashSet<>();
            for (int j = 0; j < n; j++) {
                if (((i >> j) & 1) == 1) {
                    candidate.add(allAttrs.get(j));
                }
            }
            if (isSuperkey(candidate, attrs, fds)) {
                boolean isMinimal = true;
                for (Set<String> existingKey : keys) {
                    if (candidate.containsAll(existingKey)) {
                        isMinimal = false;
                        break;
                    }
                }
                if (isMinimal) {
                    keys.removeIf(key -> key.containsAll(candidate));
                    keys.add(candidate);
                }
            }
        }
        return keys;
    }

    private Set<Map.Entry<Set<String>, Set<String>>> toFdPairs(List<SchemaRequest.FunctionalDependencyDto> raw) {
        Set<Map.Entry<Set<String>, Set<String>>> fds = new HashSet<>();
        if (raw == null) {
            return fds;
        }
        for (SchemaRequest.FunctionalDependencyDto dto : raw) {
            if (dto == null) continue;
            Set<String> lhs = parseAttributes(dto.getLhs());
            Set<String> rhs = parseAttributes(dto.getRhs());
            for (String r : rhs) {
                fds.add(Map.entry(lhs, Set.of(r)));
            }
        }
        return fds;
    }
    
    private Set<String> parseAttributes(Object obj) {
        if (obj == null) return Set.of();
        if (obj instanceof List<?>) {
            return ((List<?>) obj).stream().filter(Objects::nonNull).map(String::valueOf).map(String::trim)
                    .filter(attribute -> !attribute.isEmpty()).collect(Collectors.toSet());
        }
        String s = obj.toString();
        if (s.contains(",")) {
            return Arrays.stream(s.split(",")).map(String::trim).filter(attribute -> !attribute.isEmpty()).collect(Collectors.toSet());
        }
        String attribute = s.trim();
        return attribute.isEmpty() ? Set.of() : Set.of(attribute);
    }

    private Set<Map.Entry<Set<String>, Set<String>>> minimalCover(Set<String> attrs, Set<Map.Entry<Set<String>, Set<String>>> fds) {
        Set<Map.Entry<Set<String>, Set<String>>> fdsMinimalLhs = new HashSet<>();
        for (var fd : fds) {
            Set<String> lhs = new HashSet<>(fd.getKey());
            Set<String> rhs = fd.getValue();
            
            if (lhs.size() > 1) {
                for (String attr : new HashSet<>(lhs)) {
                    Set<String> tempLhs = new HashSet<>(lhs);
                    tempLhs.remove(attr);
                    
                    Set<Map.Entry<Set<String>, Set<String>>> tempFds = new HashSet<>(fds);
                    tempFds.remove(fd);
                    
                    
                    if (closure(tempLhs, tempFds).containsAll(rhs)) {
                        lhs.remove(attr);
                    }
                }
            }
            fdsMinimalLhs.add(Map.entry(lhs, rhs));
        }

        Set<Map.Entry<Set<String>, Set<String>>> fdsFinal = new HashSet<>(fdsMinimalLhs);
        for (var fdToRemove : new HashSet<>(fdsMinimalLhs)) {
            fdsFinal.remove(fdToRemove);
            if (!closure(fdToRemove.getKey(), fdsFinal).containsAll(fdToRemove.getValue())) {
                fdsFinal.add(fdToRemove);
            }
        }
        
        Set<Map.Entry<Set<String>, Set<String>>> finalSplitFds = new HashSet<>();
        for (var fd : fdsFinal) {
            for (String rhsAttr : fd.getValue()) {
                finalSplitFds.add(Map.entry(fd.getKey(), Set.of(rhsAttr)));
            }
        }
        return finalSplitFds;
    }
    
    private Set<Map.Entry<Set<String>, Set<String>>> expandRhs(Set<Map.Entry<Set<String>, Set<String>>> fds) {
        return fds;
    }
}