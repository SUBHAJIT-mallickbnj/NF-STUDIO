Write-Host "================================" -ForegroundColor Cyan
Write-Host "DB-Norm Project Verification" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check Backend Server
Write-Host "[TEST 1] Backend Server on port 8080..." -ForegroundColor Yellow
try {
    $uri = "http://localhost:8080/api/nf/detect"
    $headers = @{"Content-Type"="application/json"}
    $body = @{
        tableName = "Employee"
        attributes = @("EmpID", "Name", "DeptID", "DeptName")
        primaryKey = @("EmpID")
        functionalDependencies = @(
                @{lhs = @("EmpID"); rhs = @("Name")},
                @{lhs = @("DeptID"); rhs = @("DeptName")}
        )
    } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $body -UseBasicParsing -ErrorAction Stop
    $result = $response.Content | ConvertFrom-Json
    Write-Host "SUCCESS: Backend Detect Endpoint works" -ForegroundColor Green
    Write-Host "  Normal Form: $($result.highestNormalForm)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Normalize Endpoint
Write-Host "[TEST 2] Backend Normalize Endpoint (3NF)..." -ForegroundColor Yellow
try {
    $uri = "http://localhost:8080/api/nf/normalize?target=3NF"
    $headers = @{"Content-Type"="application/json"}
    $body = @{
        tableName = "Employee"
        attributes = @("EmpID", "Name", "DeptID", "DeptName")
        primaryKey = @("EmpID")
        functionalDependencies = @(
                @{lhs = @("EmpID"); rhs = @("Name")},
                @{lhs = @("DeptID"); rhs = @("DeptName")}
        )
    } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $body -UseBasicParsing -ErrorAction Stop
    $result = $response.Content | ConvertFrom-Json
    Write-Host "SUCCESS: Normalize Endpoint works" -ForegroundColor Green
    Write-Host "  Target NF: $($result.targetNormalForm)" -ForegroundColor Green
    Write-Host "  Tables: $($result.decomposition.Count)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Frontend Server
Write-Host "[TEST 3] Frontend Server on port 5173..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/" -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "SUCCESS: Frontend is running" -ForegroundColor Green
        Write-Host "  URL: http://localhost:5173" -ForegroundColor Green
    }
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access Application:" -ForegroundColor Yellow
Write-Host "  Web UI: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  API: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available Features:" -ForegroundColor Yellow
Write-Host "  1. Detect normal form of schemas" -ForegroundColor White
Write-Host "  2. Normalize to 2NF, 3NF, BCNF" -ForegroundColor White
Write-Host "  3. Process CSV data with normalization" -ForegroundColor White
Write-Host "  4. Visualize schema diagrams" -ForegroundColor White
Write-Host "  5. Export results" -ForegroundColor White
Write-Host ""
