# React Feature Porting & C# API Endpoint Mapping

This reference document outlines the exact C# backend API endpoints, HTTP methods, authorization rules, and request/response models for all system features currently needing development, routing corrections, or UI completion in the React application.

---

## 1. Blood Inventory Management (🔴 Completely Missing in React)

*   **Current React State**: Only a placeholder in `src/router.tsx` (`<div>Admin Blood Inventories Page</div>`). No folder exists under `src/features/`.
*   **C# Controller**: `BloodInventoryController.cs`
*   **C# Base Route**: `api/BloodInventory`

### Endpoints:

#### 1.1 Get All Blood Inventory Ledger
*   **Endpoint**: `GET /api/BloodInventory/list`
*   **Response**: `Result<List<BloodInventoryResModel>>`
*   **Usage**: Populates the main stock table ledger for staff/admin tracking.

#### 1.2 Get Available Stock (Aggregated Summary)
*   **Endpoint**: `GET /api/BloodInventory/available-stock`
*   **HTTP Method**: `GET`
*   **Query Parameters**:
    *   `hospitalId` (optional, `int`)
    *   `bloodGroup` (optional, `string`, e.g., `A+`, `O-`, `AB+`)
*   **Response**: `Result<List<AvailableStockResModel>>`
*   **Usage**: Renders aggregate status charts and quick summary cards (e.g. Total Active Units per group).

#### 1.3 Add Donation to Inventory
*   **Endpoint**: `POST /api/BloodInventory/add/{donationId}`
*   **Route Parameters**: `donationId` (`int`)
*   **Response**: `Result<BloodInventoryResModel>`
*   **Usage**: Triggered when a blood donation appointment screening completes successfully, transfering blood to available stock.

#### 1.4 Consume Blood Bag
*   **Endpoint**: `PATCH /api/BloodInventory/use`
*   **Content-Type**: `application/json`
*   **Request Body**:
    ```json
    {
      "inventoryId": 12,
      "requestId": 34
    }
    ```
*   **Response**: `Result<BloodInventoryResModel>`
*   **Usage**: Triggered when fulfilling a pending patient/hospital blood request with a specific stock unit.

#### 1.5 Run Stock-Take Check
*   **Endpoint**: `POST /api/BloodInventory/stock-take`
*   **Query Parameters**:
    *   `hospitalId` (optional, `int`)
*   **Response**: `Result<int>` (Returns count of expired items updated to `Expired` status)
*   **Usage**: Action button for admins to clean and update expired bags in their inventory.

---

## 2. Admin & Staff Dashboard (🔴 Placeholder in React)

*   **Current React State**: `/admin` default index displays static placeholder `<div>Admin Dashboard Page</div>`.
*   **C# Controller**: `DashboardController.cs`
*   **C# Base Route**: `api/Dashboard`

### Endpoints:

#### 2.1 Get System Analytics
*   **Endpoint**: `GET /api/Dashboard/{userId}`
*   **Route Parameters**: `userId` (`int`)
*   **Response**: Direct JSON String containing keys:
    *   `totalDonors` (`int`)
    *   `totalDonations` (`int`)
    *   `totalBloodRequests` (`int`)
    *   `bloodStock` (`array` of blood types and quantities)
    *   `monthlyTrends` (`array` of charts data)
*   **Usage**: Populates the administrator dashboard graphs and statistics.

---

## 3. Medical Records & Screening (🟡 Bypassed in React Routing)

*   **Current React State**: Full pages built in `src/features/medical-records/pages` but bypassed with a static `<div>Admin Medical Records Page</div>` in `router.tsx`.
*   **C# Controller**: `MedicalRecordController.cs`
*   **C# Base Route**: `api/MedicalRecord`
*   **Authorization Policy**: `AdminOnly`

### Endpoints:

#### 3.1 Get All Medical Screening Records
*   **Endpoint**: `GET /api/MedicalRecord/list`
*   **Response**: `Result<List<MedicalRecordResModel>>`

#### 3.2 Submit Screening Result (Create)
*   **Endpoint**: `POST /api/MedicalRecord/create`
*   **Request Body**:
    ```json
    {
      "donationId": 5,
      "hospitalId": 2,
      "hemoglobinLevel": 14.5,
      "hivResult": "Negative",
      "hepatitisBResult": "Negative",
      "hepatitisCResult": "Negative",
      "malariaResult": "Negative",
      "syphilisResult": "Negative",
      "screeningStatus": "Passed",
      "screeningNotes": "Fully fit for donation.",
      "screenedBy": 1,
      "screeningAt": "2026-05-22T00:00:00Z"
    }
    ```

#### 3.3 Update Screening Result
*   **Endpoint**: `PUT /api/MedicalRecord/update`
*   **Request Body**: (Same as Create schema, containing `"id": int`)

#### 3.4 Delete Record
*   **Endpoint**: `DELETE /api/MedicalRecord/{id}`

---

## 4. Donor Appointments (🟡 Bypassed in React Routing)

*   **Current React State**: React pages exist inside `src/features/appointments/` but are bypassed in `router.tsx` with placeholders.
*   **C# Controller**: `AppointmentController.cs`
*   **C# Base Route**: `api/Appointment`

### Endpoints:

#### 4.1 Get Appointments List
*   **Endpoint**: `GET /api/Appointment/list`
*   **Query Parameters**:
    *   `hospitalId` (optional, `int`)
    *   `appointmentDate` (optional, `string`, `yyyy-MM-dd`)
*   **Auth Policy**: `AdminClientDonar`

#### 4.2 Book Appointment
*   **Endpoint**: `POST /api/Appointment/donation/{donationId}`
*   **Request Body**:
    ```json
    {
      "remarks": "Regular appointment booking remarks."
    }
    ```
*   **Auth Policy**: `AdminDonar`

#### 4.3 Update Appointment Status
*   **Endpoint**: `PATCH /api/Appointment/{id}/status`
*   **Request Body**:
    ```json
    {
      "status": "confirmed" // scheduled, confirmed, cancelled, completed
    }
    ```
*   **Auth Policy**: `AdminDonar`

#### 4.4 Reschedule Date/Time
*   **Endpoint**: `PATCH /api/Appointment/{id}/time`
*   **Request Body**:
    ```json
    {
      "appointmentDate": "2026-05-25",
      "appointmentTime": "10:30"
    }
    ```
*   **Auth Policy**: `AdminClientDonar`

#### 4.5 Complete Appointment
*   **Endpoint**: `POST /api/Appointment/{id}/complete`
*   **Auth Policy**: `AdminOnly`

---

## 5. Blood Requests - Admin View (🟡 Bypassed in React Routing)

*   **Current React State**: React page components exist in `src/features/requests/pages/admin/` but bypassed with `<div>Admin Blood Requests Page</div>` placeholder in `router.tsx`.
*   **C# Controller**: `BloodRequestController.cs`
*   **C# Base Route**: `api/BloodRequest`

### Endpoints:

#### 5.1 Get All Blood Requests
*   **Endpoint**: `GET /api/BloodRequest/list`
*   **Auth Policy**: `AdminClientDonar`

#### 5.2 Approve/Reject Request Status
*   **Endpoint**: `PATCH /api/BloodRequest/{id}/status`
*   **Request Body**:
    ```json
    {
      "status": "approved", // pending, cancelled, approved, rejected, fulfilled
      "donorId": 12 // Optional matching donor ID
    }
    ```
*   **Auth Policy**: `AdminOnly`

#### 5.3 Edit/Modify Blood Request details
*   **Endpoint**: `PUT /api/BloodRequest/update`
*   **Request Body**:
    ```json
    {
      "id": 1,
      "userId": 3,
      "hospitalId": 2,
      "patientName": "John Doe",
      "bloodGroup": "O+",
      "unitsRequired": 2,
      "contactPhone": "0912345678",
      "urgency": "high", // low, medium, high, critical
      "requiredDate": "2026-05-25",
      "reason": "Accident emergency"
    }
    ```
*   **Auth Policy**: `AdminOnly`

---

## 6. Certificates & Client Appreciation (🟡 Client Panel Placeholder)

*   **Current React State**: Client certificates route displays a static placeholder `<div>Client Certificates Page</div>`.
*   **C# Controller**: `CertificateController.cs`
*   **C# Base Route**: `api/Certificate`

### Endpoints:

#### 6.1 Get Donor Certificates
*   **Endpoint**: `GET /api/Certificate/donor/{donorId}`
*   **Auth Policy**: `AdminClientDonar`
*   **Usage**: Enables donors to download appreciation awards in their frontend client panel.

---

## 7. Role & System Settings Management (🟡 Admin Settings Placeholder)

*   **Current React State**: `/admin/settings` maps to placeholder `<div>Admin Settings Page</div>`.
*   **C# Controllers**: `RoleController.cs`, `PermissionController.cs`, `RolePermissionController.cs`

### Endpoints:

#### 7.1 Roles CRUD
*   `GET /api/Role/list` -> Fetch all system roles (`admin`, `staff`, `donor`, `user`).
*   `POST /api/Role/create` | `PUT /api/Role/edit` | `DELETE /api/Role/delete` (Requires `AdminOnly`)

#### 7.2 Permissions CRUD
*   `GET /api/Permission/list` -> Fetch all available permissions.
*   `POST /api/Permission/create` | `PUT /api/Permission/edit` | `DELETE /api/Permission/delete` (Requires `AdminOnly`)

#### 7.3 Role-Permission Matrix Allocation
*   `GET /api/RolePermission/list` -> Fetch role-permission matrix.
*   `POST /api/RolePermission/create` -> Map a permission to a role.
*   `PUT /api/RolePermission/edit` -> Re-assign role permission.
*   `DELETE /api/RolePermission/delete` -> Revoke permission.
