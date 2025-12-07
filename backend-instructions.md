# Backend Setup Instructions (Google Sheets + Apps Script)

This application requires a Google Sheet backend to handle user registration, status checks, and Admin logic.

### Step 1: Create the Google Sheet
1. Create a new Google Sheet.
2. Rename the sheet tab (at the bottom) to `KLSE Subscribers`.
3. Create the following header row (Row 1):
   - **A1**: Timestamp
   - **B1**: Name
   - **C1**: Email
   - **D1**: Status
   - **E1**: Notes
   - **F1**: Expiry Date  **(NEW)**

### Step 2: Add the Apps Script Code
1. In the Google Sheet, go to **Extensions > Apps Script**.
2. Delete any existing code in `Code.gs` and paste the code below.

```javascript
const SHEET_NAME = "KLSE Subscribers";
// Admin Credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const params = e.parameter;
    const action = params.action;

    // --- REGISTER ---
    if (action === "register") {
      const name = params.name;
      const email = params.email;
      
      // Check for duplicates (Column C is index 2)
      const data = sheet.getDataRange().getValues();
      const emailColIndex = 2; 
      for (let i = 1; i < data.length; i++) {
        if (data[i][emailColIndex] == email) {
           return createJSON({ "result": "error", "message": "Email already registered." });
        }
      }

      // Append Row: Timestamp, Name, Email, Status, Notes, Expiry (Empty initially)
      sheet.appendRow([new Date(), name, email, "Registered", "", ""]);
      return createJSON({ "result": "success", "message": "Registration successful" });
    }

    // --- UPDATE STATUS (Admin) ---
    if (action === "updateStatus") {
      if (params.username !== ADMIN_USERNAME || params.password !== ADMIN_PASSWORD) {
        return createJSON({ "result": "error", "message": "Invalid Admin Credentials" });
      }

      const targetEmail = params.email;
      const newStatus = params.newStatus;
      const data = sheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][2] == targetEmail) {
          // Update Status column (Column D is index 3 -> +1 for 1-based index = 4)
          sheet.getRange(i + 1, 4).setValue(newStatus);
          
          let logMsg = "Status updated to " + newStatus + " on " + new Date();
          
          // If activating, set expiry date to 30 days from now
          if (newStatus === "Active") {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);
            // Expiry Date is in Column F (index 5 -> +1 = 6)
            sheet.getRange(i + 1, 6).setValue(expiryDate);
            logMsg += ". Expiry set to " + expiryDate.toISOString();
          }

          // Update Notes (Column E is index 4 -> +1 for 1-based index = 5)
          sheet.getRange(i + 1, 5).setValue(logMsg);
          return createJSON({ "result": "success", "message": "Status updated" });
        }
      }
      return createJSON({ "result": "error", "message": "User not found" });
    }
    
    return createJSON({ "result": "error", "message": "Invalid action" });

  } catch (e) {
    return createJSON({ "result": "error", "message": e.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const params = e.parameter;
  const action = params.action;

  // --- CHECK STATUS (Public) ---
  if (action === "checkStatus") {
    const emailToCheck = params.email;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] == emailToCheck) {
        // Status is in Column D (index 3)
        // Expiry is in Column F (index 5)
        
        let expiryRaw = data[i][5];
        let expiryStr = "";
        
        if (expiryRaw instanceof Date) {
          expiryStr = expiryRaw.toISOString();
        } else if (expiryRaw) {
          expiryStr = String(expiryRaw);
        }

        return createJSON({ 
          "result": "success", 
          "status": data[i][3], 
          "expiryDate": expiryStr
        });
      }
    }
    return createJSON({ "result": "error", "message": "User not found" });
  }

  // --- GET ALL USERS (Admin) ---
  if (action === "getUsers") {
    if (params.username !== ADMIN_USERNAME || params.password !== ADMIN_PASSWORD) {
      return createJSON({ "result": "error", "message": "Invalid Admin Credentials" });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const users = [];
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      let expiryRaw = data[i][5];
      let expiryStr = "";
      if (expiryRaw instanceof Date) {
        expiryStr = expiryRaw.toISOString();
      } else if (expiryRaw) {
        expiryStr = String(expiryRaw);
      }

      users.push({
        timestamp: data[i][0],
        name: data[i][1],
        email: data[i][2],
        status: data[i][3],
        notes: data[i][4],
        expiryDate: expiryStr
      });
    }
    return createJSON({ "result": "success", "data": users });
  }
  
  return createJSON({ "result": "error", "message": "Invalid action" });
}

function createJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
```

### Step 3: Deploy (Update)
1. If you have already deployed, you must Create a **New Deployment** to apply changes.
2. Click **Deploy** > **Manage deployments** > Edit (pencil icon) > Version: **New version** > **Deploy**.
3. Use the same URL as before (if you updated the version correctly) or copy the new URL if it changed.

### Step 4: Admin Access
1. In the website, scroll to the footer.
2. Click "Admin Login".
3. Enter Username: `admin` and Password: `admin`.