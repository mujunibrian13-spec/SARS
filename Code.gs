// Deploy this inside the Google Sheet the n8n workflow already uses:
// https://docs.google.com/spreadsheets/d/1-iKhS4mKeMtt-gPL3O1Qkw51Is9QANRhLdvta7z9OPM/edit?gid=0
// Extensions → Apps Script → paste this file → Deploy → New deployment
// → Type: Web app → Execute as: Me → Who has access: Anyone
// Then copy the resulting /exec URL into WEB_APP_URL in script.js.

const SPREADSHEET_ID = "1-iKhS4mKeMtt-gPL3O1Qkw51Is9QANRhLdvta7z9OPM";
const STUDENTS_SHEET_NAME = "Students";
const ACTIVITIES_SHEET_NAME = "Read Activities";

function doPost(e) {
  try {
    const params = e.parameter;
    const formType = params.formType;

    if (formType === "student") {
      appendStudent(params);
    } else if (formType === "activity") {
      appendActivity(params);
    } else {
      return jsonResponse({ result: "error", message: "Unknown formType" });
    }

    return jsonResponse({ result: "success" });
  } catch (err) {
    return jsonResponse({ result: "error", message: err.message });
  }
}

function appendStudent(params) {
  const sheet = getSheet(STUDENTS_SHEET_NAME);
  sheet.appendRow([
    params.student_id,
    params.full_name,
    params.email,
    params.whatsapp_no,
  ]);
}

function appendActivity(params) {
  const sheet = getSheet(ACTIVITIES_SHEET_NAME);
  sheet.appendRow([
    params.activity_id,
    params.student_id,
    params.activity_name,
    params.activity_date,
    params.activity_time,
    false, // notified
  ]);
}

function getSheet(name) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
  if (!sheet) {
    throw new Error("Sheet not found: " + name);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
