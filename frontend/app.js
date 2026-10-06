
const API_URL = "https://studenthub-fastapi-crud.onrender.com";
// ----------------------------------
// DOM Elements
// ----------------------------------

const studentForm = document.getElementById("studentForm");
const studentId = document.getElementById("studentId");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const yearInput = document.getElementById("year");

const tableBody = document.getElementById("studentTableBody");
const totalStudents = document.getElementById("totalStudents");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");

const apiStatus = document.getElementById("apiStatus");
const dashboardStatus = document.getElementById("dashboardStatus");

const resetBtn = document.getElementById("resetBtn");
const refreshBtn = document.getElementById("refreshBtn");


// ----------------------------------
// Show Message
// ----------------------------------

function showMessage(message, isError = false) {
    formMessage.textContent = message;

    formMessage.style.color = isError
        ? "#dc2626"
        : "#16a34a";
}


// ----------------------------------
// Reset Form
// ----------------------------------

function resetForm() {
    studentForm.reset();

    studentId.value = "";

    formTitle.textContent = "Add Student";

    submitBtn.textContent = "Add Student";

    showMessage("");
}


// ----------------------------------
// API Status
// ----------------------------------

async function checkApiStatus() {
    try {
        const response = await fetch(`${API_URL}/`);

        if (!response.ok) {
            throw new Error("API unavailable");
        }

        apiStatus.textContent = "● API Connected";
        apiStatus.style.color = "#86efac";

        dashboardStatus.textContent = "Online";
        dashboardStatus.style.color = "#16a34a";

    } catch (error) {
        apiStatus.textContent = "● API Offline";
        apiStatus.style.color = "#fca5a5";

        dashboardStatus.textContent = "Offline";
        dashboardStatus.style.color = "#dc2626";

        console.error("API Status Error:", error);
    }
}


// ----------------------------------
// GET: Fetch All Students
// ----------------------------------

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);

        if (!response.ok) {
            throw new Error("Failed to load students");
        }

        const students = await response.json();

        displayStudents(students);

    } catch (error) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-row">
                    Failed to load students.
                    Check whether FastAPI is running.
                </td>
            </tr>
        `;

        console.error("GET Error:", error);
    }
}


// ----------------------------------
// Display Students
// ----------------------------------

function displayStudents(students) {
    totalStudents.textContent = students.length;

    if (students.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-row">
                    No students found. Add your first student!
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = students.map(student => `
        <tr>
            <td>${student.id}</td>

            <td>${escapeHtml(student.name)}</td>

            <td>${escapeHtml(student.email)}</td>

            <td>${escapeHtml(student.course)}</td>

            <td>${student.year}</td>

            <td>
                <button
                    class="action-btn edit-btn"
                    onclick="editStudent(${student.id})"
                >
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// ----------------------------------
// POST: Create
// PUT: Update
// ----------------------------------

studentForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    console.log("1. Submit handler started");

    const id = studentId.value;

    // Convert year value into a number.
    // HTML option values should be numeric: 1, 2, 3, 4.
    const year = Number(yearInput.value);

    const studentData = {
        name: nameInput.value.trim(),

        email: emailInput.value.trim(),

        course: courseInput.value,

        year: year
    };

    console.log("2. Student data:", studentData);

    // ----------------------------------
    // Validation
    // ----------------------------------

    if (
        !studentData.name ||
        !studentData.email ||
        !studentData.course ||
        !Number.isInteger(studentData.year) ||
        studentData.year < 1 ||
        studentData.year > 4
    ) {
        showMessage(
            "Please fill in all fields correctly.",
            true
        );

        console.log("Validation failed:", studentData);

        return;
    }

    // ----------------------------------
    // Determine POST or PUT
    // ----------------------------------

    const isEditing = Boolean(id);

    const url = isEditing
        ? `${API_URL}/students/${id}`
        : `${API_URL}/students`;

    const method = isEditing
        ? "PUT"
        : "POST";

    console.log("3. Request URL:", url);
    console.log("4. Request Method:", method);

    submitBtn.disabled = true;

    submitBtn.textContent = isEditing
        ? "Updating..."
        : "Adding...";

    try {

        console.log("5. Sending request...");

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(studentData)

        });

        console.log("6. Response status:", response.status);

        const result = await response.json();

        console.log("7. Server response:", result);

        if (!response.ok) {

            throw new Error(
                result.detail || "Request failed"
            );

        }

        showMessage(
            isEditing
                ? "Student updated successfully!"
                : "Student added successfully!"
        );

        resetForm();

        await loadStudents();

    } catch (error) {

        console.error("POST/PUT Error:", error);

        showMessage(
            error.message,
            true
        );

    } finally {

        submitBtn.disabled = false;

        submitBtn.textContent = studentId.value
            ? "Update Student"
            : "Add Student";

    }

});


// ----------------------------------
// Edit Student
// ----------------------------------

async function editStudent(id) {

    try {

        const response = await fetch(
            `${API_URL}/students/${id}`
        );

        if (!response.ok) {
            throw new Error("Student not found");
        }

        const student = await response.json();

        studentId.value = student.id;

        nameInput.value = student.name;

        emailInput.value = student.email;

        courseInput.value = student.course;

        yearInput.value = String(student.year);

        formTitle.textContent = "Update Student";

        submitBtn.textContent = "Update Student";

        showMessage(
            "Editing student #" + student.id
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        showMessage(
            error.message,
            true
        );

    }

}


// ----------------------------------
// DELETE: Delete Student
// ----------------------------------

async function deleteStudent(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/students/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.detail || "Delete failed"
            );

        }

        showMessage(
            "Student deleted successfully!"
        );

        await loadStudents();

    } catch (error) {

        showMessage(
            error.message,
            true
        );

        console.error("DELETE Error:", error);

    }

}


// ----------------------------------
// Escape HTML
// ----------------------------------

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ----------------------------------
// Buttons
// ----------------------------------

resetBtn.addEventListener(
    "click",
    resetForm
);

refreshBtn.addEventListener(
    "click",
    loadStudents
);


// ----------------------------------
// Initialize Application
// ----------------------------------

checkApiStatus();

loadStudents();