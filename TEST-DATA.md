📊 DB-NORM TESTING DATA - VERIFICATION EXAMPLES
═══════════════════════════════════════════════════════════════════════════

TEST CASE 1: EMPLOYEE DEPARTMENT (Simple 2NF Example)
───────────────────────────────────────────────────────────────────────────

Schema Information:
  Table Name: Employee
  Columns: EmpID, EmpName, DeptID, DeptName, Location
  Primary Key: EmpID
  
Functional Dependencies (Enter these):
  1. EmpID → EmpName
  2. EmpID → DeptID
  3. DeptID → DeptName
  4. DeptID → Location

Expected Output: 2NF
Reason: DeptName and Location depend on DeptID (subset of key)

Correct Normalization to 3NF:
  Table 1: Employee(EmpID, EmpName, DeptID)
  Table 2: Department(DeptID, DeptName, Location)

Sample Data to Test:
┌──────┬─────────┬────────┬────────────┬──────────┐
│EmpID │EmpName  │DeptID  │DeptName    │Location  │
├──────┼─────────┼────────┼────────────┼──────────┤
│101   │John     │D1      │HR          │Floor-1   │
│102   │Sarah    │D1      │HR          │Floor-1   │
│103   │Mike     │D2      │IT          │Floor-2   │
│104   │Emma     │D2      │IT          │Floor-2   │
│105   │David    │D3      │Finance     │Floor-3   │
└──────┴─────────┴────────┴────────────┴──────────┘

═══════════════════════════════════════════════════════════════════════════

TEST CASE 2: COURSE REGISTRATION (3NF Violation Example)
───────────────────────────────────────────────────────────────────────────

Schema Information:
  Table Name: CourseRegistration
  Columns: StudentID, StudentName, CourseID, CourseName, InstructorID, InstructorName
  Primary Key: StudentID, CourseID
  
Functional Dependencies (Enter these):
  1. StudentID → StudentName
  2. CourseID → CourseName
  3. InstructorID → InstructorName
  4. CourseID → InstructorID

Expected Output: 2NF
Reason: StudentName depends only on StudentID (partial dependency)

Correct Normalization to 3NF:
  Table 1: StudentCourse(StudentID, CourseID)
  Table 2: Student(StudentID, StudentName)
  Table 3: Course(CourseID, CourseName, InstructorID)
  Table 4: Instructor(InstructorID, InstructorName)

Sample Data to Test:
┌───────────┬──────────────┬──────────┬────────────┬───────────────┬──────────────┐
│StudentID  │StudentName   │CourseID  │CourseName  │InstructorID   │InstructorName│
├───────────┼──────────────┼──────────┼────────────┼───────────────┼──────────────┤
│S001       │Alice         │C101      │Database    │I001           │Dr. Smith     │
│S001       │Alice         │C102      │Web Dev     │I002           │Prof. Jones   │
│S002       │Bob           │C101      │Database    │I001           │Dr. Smith     │
│S002       │Bob           │C103      │Cloud       │I003           │Dr. Brown     │
│S003       │Charlie       │C102      │Web Dev     │I002           │Prof. Jones   │
└───────────┴──────────────┴──────────┴────────────┴───────────────┴──────────────┘

═══════════════════════════════════════════════════════════════════════════

TEST CASE 3: BOOK STORE (BCNF Example)
───────────────────────────────────────────────────────────────────────────

Schema Information:
  Table Name: BookAuthor
  Columns: BookID, BookTitle, AuthorID, AuthorName, PublisherID, PublisherName
  Primary Key: BookID, AuthorID
  
Functional Dependencies (Enter these):
  1. BookID → BookTitle
  2. BookID → PublisherID
  3. PublisherID → PublisherName
  4. AuthorID → AuthorName

Expected Output: 2NF
Reason: Multiple partial dependencies

Correct Normalization to BCNF:
  Table 1: Book(BookID, BookTitle, PublisherID)
  Table 2: BookAuthors(BookID, AuthorID)
  Table 3: Author(AuthorID, AuthorName)
  Table 4: Publisher(PublisherID, PublisherName)

Sample Data to Test:
┌────────┬──────────────────┬─────────┬────────────┬────────────┬──────────────────┐
│BookID  │BookTitle         │AuthorID │AuthorName  │PublisherID │PublisherName     │
├────────┼──────────────────┼─────────┼────────────┼────────────┼──────────────────┤
│B001    │Database Design   │A001     │John Smith  │P001        │Tech Books Inc    │
│B001    │Database Design   │A002     │Jane Doe    │P001        │Tech Books Inc    │
│B002    │Web Development   │A002     │Jane Doe    │P002        │Web Masters       │
│B003    │Cloud Computing   │A003     │Bob Wilson  │P001        │Tech Books Inc    │
└────────┴──────────────────┴─────────┴────────────┴────────────┴──────────────────┘

═══════════════════════════════════════════════════════════════════════════

TEST CASE 4: HOSPITAL PATIENT (Multiple Dependencies)
───────────────────────────────────────────────────────────────────────────

Schema Information:
  Table Name: PatientMedical
  Columns: PatientID, PatientName, DoctorID, DoctorName, DepartmentID, DepartmentName, Prescription
  Primary Key: PatientID
  
Functional Dependencies (Enter these):
  1. PatientID → PatientName
  2. PatientID → DoctorID
  3. DoctorID → DoctorName
  4. DoctorID → DepartmentID
  5. DepartmentID → DepartmentName
  6. PatientID → Prescription

Expected Output: 2NF (initially has issues)
Reason: Transitive dependencies exist

Correct Normalization to 3NF:
  Table 1: Patient(PatientID, PatientName, Prescription, DoctorID)
  Table 2: Doctor(DoctorID, DoctorName, DepartmentID)
  Table 3: Department(DepartmentID, DepartmentName)

Sample Data to Test:
┌───────────┬─────────────┬─────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│PatientID  │PatientName  │DoctorID │DoctorName    │DepartmentID  │DepartmentName│Prescription  │
├───────────┼─────────────┼─────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│P001       │John         │D1       │Dr. Anderson  │DEPT1         │Cardiology    │Aspirin       │
│P002       │Mary         │D1       │Dr. Anderson  │DEPT1         │Cardiology    │Beta Blockers │
│P003       │Robert       │D2       │Dr. Baker     │DEPT2         │Neurology     │Painkillers   │
│P004       │Sarah        │D3       │Dr. Carter    │DEPT3         │Orthopedic    │Antibiotics   │
└───────────┴─────────────┴─────────┴──────────────┴──────────────┴──────────────┴──────────────┘

═══════════════════════════════════════════════════════════════════════════

TEST CASE 5: SIMPLE 1NF (Already Normalized)
───────────────────────────────────────────────────────────────────────────

Schema Information:
  Table Name: Employee_Simple
  Columns: EmployeeID, EmployeeName, Salary
  Primary Key: EmployeeID
  
Functional Dependencies (Enter these):
  1. EmployeeID → EmployeeName
  2. EmployeeID → Salary

Expected Output: 3NF or BCNF
Reason: No anomalies exist

Sample Data to Test:
┌──────────┬───────────────┬──────────┐
│EmployeeID│EmployeeName   │Salary    │
├──────────┼───────────────┼──────────┤
│E001      │Alice Johnson  │50000     │
│E002      │Bob Smith      │60000     │
│E003      │Carol White    │55000     │
└──────────┴───────────────┴──────────┘

═══════════════════════════════════════════════════════════════════════════

HOW TO USE THESE TEST CASES IN DB-NORM:
───────────────────────────────────────────────────────────────────────────

Step 1: Go to http://localhost:5173

Step 2: Click "Start Normalizing"

Step 3: Fill in the form:
  - TABLE NAME: (e.g., "Employee")
  - COLUMNS: Add each column name
  - PRIMARY KEY: (e.g., "EmpID")
  
Step 4: Add Functional Dependencies:
  - Click "+" button
  - Left side (LHS): Source column
  - Right side (RHS): Dependent column
  - Add each FD from the list above
  
Step 5: Click "Analyze" or "Detect"
  - Check if it shows the expected Normal Form
  - Read the violation reasons

Step 6: Click "Normalize to 3NF" or "Normalize to BCNF"
  - System will decompose the schema
  - See the resulting tables
  
Step 7: Export the result (optional)
  - Click "Download as JSON" or "Export"

═══════════════════════════════════════════════════════════════════════════

EXPECTED RESULTS SUMMARY:
───────────────────────────────────────────────────────────────────────────

Test Case 1 (Employee):
  ✅ Detect: Should show 2NF
  ✅ Reason: DeptName and Location in partial dependency
  ✅ Normalize to 3NF: Creates 2 tables

Test Case 2 (CourseRegistration):
  ✅ Detect: Should show 2NF
  ✅ Reason: StudentName is partial dependency
  ✅ Normalize to 3NF: Creates 4 tables

Test Case 3 (BookAuthor):
  ✅ Detect: Should show 2NF
  ✅ Reason: Multiple partial dependencies
  ✅ Normalize to BCNF: Creates 4 tables

Test Case 4 (PatientMedical):
  ✅ Detect: Should show 2NF
  ✅ Reason: Transitive dependencies exist
  ✅ Normalize to 3NF: Creates 3 tables

Test Case 5 (Employee_Simple):
  ✅ Detect: Should show 3NF or BCNF
  ✅ Reason: No violations
  ✅ Normalize: No changes needed

═══════════════════════════════════════════════════════════════════════════

QUICK COPY-PASTE FORMAT FOR TEST CASE 1:
───────────────────────────────────────────────────────────────────────────

Table Name: Employee
Columns: EmpID, EmpName, DeptID, DeptName, Location
Primary Key: EmpID

Functional Dependencies:
  From: EmpID      To: EmpName
  From: EmpID      To: DeptID
  From: DeptID     To: DeptName
  From: DeptID     To: Location

═══════════════════════════════════════════════════════════════════════════

VERIFICATION CHECKLIST:
───────────────────────────────────────────────────────────────────────────

After testing each case, verify:

✅ Detect works - Shows correct normal form
✅ Reasons displayed - Explains violations
✅ Candidate keys shown - Lists primary keys
✅ Normalize works - Decomposes into tables
✅ Results make sense - Tables are properly split
✅ Export works - Can download JSON

If all ✅, then NORMALIZATION IS WORKING PROPERLY!

═══════════════════════════════════════════════════════════════════════════
