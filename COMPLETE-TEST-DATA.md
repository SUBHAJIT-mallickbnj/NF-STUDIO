📚 COMPLETE TEST DATA REFERENCE GUIDE
═════════════════════════════════════════════════════════════════════════════

This guide contains all test cases you need to verify that the normalization
is working properly. Each test has complete data ready to copy-paste.

═════════════════════════════════════════════════════════════════════════════

TEST 1: EMPLOYEE DEPARTMENT (2NF WITH VIOLATIONS)
═════════════════════════════════════════════════════════════════════════════

SCENARIO:
  An employee works in a department. Each department has a name and location.
  Multiple employees can work in the same department.
  Problem: Department details repeat for each employee → Redundancy!

DATA TO ENTER:

  Table Name: Employee
  
  Columns: EmpID, EmpName, DeptID, DeptName, Location
  
  Primary Key: EmpID
  
  Functional Dependencies:
    1. EmpID → EmpName          (Each employee has unique name)
    2. EmpID → DeptID           (Each employee assigned to one dept)
    3. DeptID → DeptName        (Each dept has unique name)
    4. DeptID → Location        (Each dept has unique location)

EXPECTED ANALYSIS RESULT:
  Highest Normal Form: 2NF ⚠️
  
  Violation Reason:
    DeptName and Location are partially dependent on DeptID.
    They don't depend on the full primary key (EmpID).
    
  Why it's a problem:
    If an employee's name changes, we only update 1 row.
    But if a department name changes, we must update multiple rows!

EXPECTED NORMALIZATION RESULT (3NF):
  Table 1: Employee
    - EmpID (Primary Key)
    - EmpName
    - DeptID (Foreign Key → Department)
  
  Table 2: Department
    - DeptID (Primary Key)
    - DeptName
    - Location

SAMPLE DATA BEFORE NORMALIZATION:
  ┌────────────┬──────────┬────────┬─────────────┬──────────┐
  │   EmpID    │ EmpName  │ DeptID │ DeptName    │ Location │
  ├────────────┼──────────┼────────┼─────────────┼──────────┤
  │    E001    │  John    │  D01   │  HR         │ Floor-1  │
  │    E002    │  Sarah   │  D01   │  HR         │ Floor-1  │ ← Redundant!
  │    E003    │  Mike    │  D02   │  IT         │ Floor-2  │
  │    E004    │  Emma    │  D02   │  IT         │ Floor-2  │ ← Redundant!
  └────────────┴──────────┴────────┴─────────────┴──────────┘

SAMPLE DATA AFTER NORMALIZATION:
  Employee Table:
  ┌────────────┬──────────┬────────┐
  │   EmpID    │ EmpName  │ DeptID │
  ├────────────┼──────────┼────────┤
  │    E001    │  John    │  D01   │
  │    E002    │  Sarah   │  D01   │
  │    E003    │  Mike    │  D02   │
  │    E004    │  Emma    │  D02   │
  └────────────┴──────────┴────────┘
  
  Department Table:
  ┌────────┬─────────────┬──────────┐
  │ DeptID │ DeptName    │ Location │
  ├────────┼─────────────┼──────────┤
  │  D01   │  HR         │ Floor-1  │
  │  D02   │  IT         │ Floor-2  │
  └────────┴─────────────┴──────────┘

BENEFIT: Now if HR moves to Floor-3, update only 1 row, not 2!

═════════════════════════════════════════════════════════════════════════════

TEST 2: SIMPLE EMPLOYEE (ALREADY 3NF - NO VIOLATIONS)
═════════════════════════════════════════════════════════════════════════════

SCENARIO:
  A simple employee table with no redundancy or violations.
  Each employee has an ID, name, and salary.
  Perfect normalization!

DATA TO ENTER:

  Table Name: Employee
  
  Columns: EmployeeID, EmployeeName, Salary
  
  Primary Key: EmployeeID
  
  Functional Dependencies:
    1. EmployeeID → EmployeeName
    2. EmployeeID → Salary

EXPECTED ANALYSIS RESULT:
  Highest Normal Form: 3NF ✅
  
  No Violations: Everything is correctly normalized!
  
EXPECTED NORMALIZATION RESULT:
  Same table (no decomposition needed):
  
  Table: Employee
    - EmployeeID (Primary Key)
    - EmployeeName
    - Salary

SAMPLE DATA:
  ┌────────────┬───────────────┬────────┐
  │EmployeeID  │EmployeeName   │ Salary │
  ├────────────┼───────────────┼────────┤
  │    001     │    Alice      │ 50000  │
  │    002     │    Bob        │ 55000  │
  │    003     │    Carol      │ 60000  │
  └────────────┴───────────────┴────────┘

BENEFIT: No redundancy, nothing to decompose. Perfect!

═════════════════════════════════════════════════════════════════════════════

TEST 3: COURSE REGISTRATION (2NF WITH COMPOSITE KEY)
═════════════════════════════════════════════════════════════════════════════

SCENARIO:
  Students register for courses. Each student has a name.
  Each course has a name and an instructor who teaches it.
  Problem: If instructor teaches multiple courses, his name repeats!

DATA TO ENTER:

  Table Name: CourseRegistration
  
  Columns: StudentID, StudentName, CourseID, CourseName, InstructorID, InstructorName
  
  Primary Key: StudentID, CourseID  (Composite key)
  
  Functional Dependencies:
    1. StudentID → StudentName           (Each student has one name)
    2. CourseID → CourseName             (Each course has one name)
    3. CourseID → InstructorID           (Each course has one instructor)
    4. InstructorID → InstructorName     (Each instructor has one name)

EXPECTED ANALYSIS RESULT:
  Highest Normal Form: 2NF ⚠️
  
  Violation Reason:
    StudentName depends only on StudentID (part of composite key)
    Not on the complete key (StudentID, CourseID)
    
  Why it's a problem (Partial Dependency):
    StudentName is partially dependent - depends on StudentID only
    Should depend on both StudentID AND CourseID
    
EXPECTED NORMALIZATION RESULT (4 Tables):
  Table 1: Enrollment
    - StudentID (FK)
    - CourseID (FK)
    
  Table 2: Student
    - StudentID (PK)
    - StudentName
    
  Table 3: Course
    - CourseID (PK)
    - CourseName
    - InstructorID (FK)
    
  Table 4: Instructor
    - InstructorID (PK)
    - InstructorName

SAMPLE DATA BEFORE NORMALIZATION:
  ┌───────┬───────────┬──────────┬────────────┬──────────┬─────────────┐
  │Student│StudentName│ CourseID │ CourseName │Instructor│InstructorName│
  │  ID   │           │          │            │ ID       │             │
  ├───────┼───────────┼──────────┼────────────┼──────────┼─────────────┤
  │  S01  │  Alice    │   C01    │  Math      │   I01    │   Dr.Smith  │
  │  S01  │  Alice    │   C02    │  Physics   │   I02    │   Dr.Jones  │ ← Redundant!
  │  S02  │  Bob      │   C01    │  Math      │   I01    │   Dr.Smith  │ ← Redundant!
  │  S02  │  Bob      │   C03    │  Chemistry │   I03    │   Dr.Brown  │
  └───────┴───────────┴──────────┴────────────┴──────────┴─────────────┘

SAMPLE DATA AFTER NORMALIZATION:
  Enrollment Table:
  ┌───────┬──────────┐
  │Student│ CourseID │
  │  ID   │          │
  ├───────┼──────────┤
  │  S01  │   C01    │
  │  S01  │   C02    │
  │  S02  │   C01    │
  │  S02  │   C03    │
  └───────┴──────────┘
  
  Student Table:
  ┌───────┬───────────┐
  │StudentID│StudentName│
  ├───────┼───────────┤
  │  S01  │   Alice   │
  │  S02  │   Bob     │
  └───────┴───────────┘
  
  Course Table:
  ┌──────────┬────────────┬──────────┐
  │ CourseID │ CourseName │Instructor│
  │          │            │   ID     │
  ├──────────┼────────────┼──────────┤
  │   C01    │   Math     │    I01   │
  │   C02    │  Physics   │    I02   │
  │   C03    │ Chemistry  │    I03   │
  └──────────┴────────────┴──────────┘
  
  Instructor Table:
  ┌──────────┬─────────────┐
  │Instructor│InstructorName│
  │   ID     │             │
  ├──────────┼─────────────┤
  │   I01    │  Dr.Smith   │
  │   I02    │  Dr.Jones   │
  │   I03    │  Dr.Brown   │
  └──────────┴─────────────┘

BENEFIT: Student names not repeated, instructor names not repeated!

═════════════════════════════════════════════════════════════════════════════

TEST 4: BOOK AUTHOR PUBLISHER (2NF COMPLEX)
═════════════════════════════════════════════════════════════════════════════

SCENARIO:
  Books have authors and publishers. Each book has one publisher.
  Each publisher publishes multiple books.
  Problem: Publisher name repeats for each book by same publisher!

DATA TO ENTER:

  Table Name: BookAuthor
  
  Columns: BookID, BookTitle, AuthorID, AuthorName, PublisherID, PublisherName
  
  Primary Key: BookID, AuthorID
  
  Functional Dependencies:
    1. BookID → BookTitle           (Each book has unique title)
    2. BookID → PublisherID         (Each book from one publisher)
    3. PublisherID → PublisherName  (Each publisher has unique name)
    4. AuthorID → AuthorName        (Each author has unique name)

EXPECTED ANALYSIS RESULT:
  Highest Normal Form: 2NF ⚠️
  
  Violation Reason:
    BookTitle and PublisherID depend only on BookID
    Not on full composite key (BookID, AuthorID)
    
EXPECTED NORMALIZATION RESULT (4 Tables):
  Table 1: BookAuthor (Junction)
    - BookID (FK)
    - AuthorID (FK)
    
  Table 2: Book
    - BookID (PK)
    - BookTitle
    - PublisherID (FK)
    
  Table 3: Author
    - AuthorID (PK)
    - AuthorName
    
  Table 4: Publisher
    - PublisherID (PK)
    - PublisherName

═════════════════════════════════════════════════════════════════════════════

TEST 5: PATIENT MEDICAL RECORD (2NF TRANSITIVE DEPENDENCY)
═════════════════════════════════════════════════════════════════════════════

SCENARIO:
  Patients see doctors. Doctors work in departments.
  Problem 1: Doctor name repeats for same patient visiting multiple times
  Problem 2: Department name repeats for same doctor (transitive dependency)

DATA TO ENTER:

  Table Name: PatientMedical
  
  Columns: PatientID, PatientName, DoctorID, DoctorName, DepartmentID, DepartmentName
  
  Primary Key: PatientID
  
  Functional Dependencies:
    1. PatientID → PatientName
    2. PatientID → DoctorID
    3. DoctorID → DoctorName
    4. DoctorID → DepartmentID
    5. DepartmentID → DepartmentName

EXPECTED ANALYSIS RESULT:
  Highest Normal Form: 2NF ⚠️
  
  Violation Reason:
    Transitive Dependency: PatientID → DoctorID → DepartmentID
    DepartmentName depends on DepartmentID, not on PatientID directly
    
EXPECTED NORMALIZATION RESULT (3 Tables):
  Table 1: Patient
    - PatientID (PK)
    - PatientName
    - DoctorID (FK)
    
  Table 2: Doctor
    - DoctorID (PK)
    - DoctorName
    - DepartmentID (FK)
    
  Table 3: Department
    - DepartmentID (PK)
    - DepartmentName

SAMPLE DATA BEFORE NORMALIZATION:
  ┌──────────┬───────────┬────────┬──────────┬──────────┬─────────────┐
  │PatientID │PatientName│DoctorID│DoctorName│DepartmentID│DepartmentName│
  ├──────────┼───────────┼────────┼──────────┼──────────┼─────────────┤
  │   P001   │   Alice   │  D01   │ Dr.Smith │   DE01   │  Cardiology │
  │   P002   │   Bob     │  D01   │ Dr.Smith │   DE01   │  Cardiology │ ← Redundant!
  │   P003   │   Carol   │  D02   │Dr.Johnson│   DE02   │ Orthopedics │
  │   P004   │   Diana   │  D02   │Dr.Johnson│   DE02   │ Orthopedics │ ← Redundant!
  └──────────┴───────────┴────────┴──────────┴──────────┴─────────────┘

SAMPLE DATA AFTER NORMALIZATION:
  Patient Table:
  ┌──────────┬───────────┬────────┐
  │PatientID │PatientName│DoctorID│
  ├──────────┼───────────┼────────┤
  │   P001   │   Alice   │  D01   │
  │   P002   │   Bob     │  D01   │
  │   P003   │   Carol   │  D02   │
  │   P004   │   Diana   │  D02   │
  └──────────┴───────────┴────────┘
  
  Doctor Table:
  ┌────────┬──────────┬──────────┐
  │DoctorID│DoctorName│DepartmentID│
  ├────────┼──────────┼──────────┤
  │  D01   │ Dr.Smith │   DE01   │
  │  D02   │Dr.Johnson│   DE02   │
  └────────┴──────────┴──────────┘
  
  Department Table:
  ┌──────────┬─────────────┐
  │DepartmentID│DepartmentName│
  ├──────────┼─────────────┤
  │   DE01   │ Cardiology  │
  │   DE02   │ Orthopedics │
  └──────────┴─────────────┘

═════════════════════════════════════════════════════════════════════════════

QUICK SUMMARY TABLE:
═════════════════════════════════════════════════════════════════════════════

│ Test # │ Table Name        │ Expected │ Reason          │ Tables │
├────────┼───────────────────┼──────────┼─────────────────┼────────┤
│ 1      │ Employee          │ 2NF ⚠️  │ Partial Dep.    │ 2      │
│ 2      │ Employee (Simple) │ 3NF ✅  │ No violations   │ 1      │
│ 3      │ CourseRegistration│ 2NF ⚠️  │ Partial Dep.    │ 4      │
│ 4      │ BookAuthor        │ 2NF ⚠️  │ Partial Dep.    │ 4      │
│ 5      │ PatientMedical    │ 2NF ⚠️  │ Transitive Dep. │ 3      │
└────────┴───────────────────┴──────────┴─────────────────┴────────┘

═════════════════════════════════════════════════════════════════════════════

KEY DEFINITIONS:
═════════════════════════════════════════════════════════════════════════════

PARTIAL DEPENDENCY (2NF Violation):
  When non-key attributes depend on only part of a composite primary key
  Example: In (StudentID, CourseID), StudentName depends only on StudentID
  
TRANSITIVE DEPENDENCY (3NF Violation):
  When non-key attributes depend on other non-key attributes
  Example: PatientID → DoctorID → DepartmentID
  
FUNCTIONAL DEPENDENCY (A → B):
  "A determines B" meaning if A is known, B is uniquely determined
  Example: StudentID → StudentName (each student has one name)

═════════════════════════════════════════════════════════════════════════════

VERIFICATION CHECKLIST:
═════════════════════════════════════════════════════════════════════════════

For Each Test:

□ Analysis Stage:
  □ Detect shows expected Normal Form (2NF or 3NF)
  □ Reason explains the violation correctly
  □ Candidate keys are identified

□ Normalization Stage:
  □ Creates expected number of tables
  □ Table names are reasonable
  □ All columns distributed correctly
  □ Foreign keys identified
  □ Primary keys preserved

□ Logic Verification:
  □ No redundancy in result
  □ Each table focuses on one entity
  □ Dependencies resolved properly

═════════════════════════════════════════════════════════════════════════════

IF ALL TESTS PASS → ✨ NORMALIZATION IS 100% WORKING! ✨

═════════════════════════════════════════════════════════════════════════════
