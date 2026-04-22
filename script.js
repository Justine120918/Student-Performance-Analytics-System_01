let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = null;

function save() {
    localStorage.setItem("students", JSON.stringify(students));
}

function addStudent() {
    let name = document.getElementById("name").value;
    let subject = document.getElementById("subject").value;
    let grade = document.getElementById("grade").value;

    if (!name || !subject || !grade) {
        alert("Fill all fields!");
        return;
    }

    students.push({
        name,
        subject,
        grade: Number(grade)
    });

    save();
    clearInputs();
    render();
}

function clearInputs() {
    document.getElementById("name").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("grade").value = "";
}

function deleteStudent(index) {
    if (confirm("Delete this student?")) {
        students.splice(index, 1);
        save();
        render();
    }
}

function openModal(index) {
    editIndex = index;

    document.getElementById("editName").value = students[index].name;
    document.getElementById("editSubject").value = students[index].subject;
    document.getElementById("editGrade").value = students[index].grade;

    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function updateStudent() {
    students[editIndex] = {
        name: document.getElementById("editName").value,
        subject: document.getElementById("editSubject").value,
        grade: Number(document.getElementById("editGrade").value)
    };

    save();
    closeModal();
    render();
}

function clearData() {
    if (confirm("Delete all data?")) {
        students = [];
        save();
        render();
    }
}

function render() {
    let table = document.getElementById("table");

    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    `;

    let total = 0;
    let top = [];
    let risk = [];

    students.forEach((s, i) => {
        total += s.grade;

        let status = "Normal";
        let cls = "good";

        if (s.grade >= 90) {
            status = "Top";
            cls = "top";
            top.push(s.name);
        } else if (s.grade < 75) {
            status = "At Risk";
            cls = "bad";
            risk.push(s.name);
        }

        table.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.subject}</td>
                <td>${s.grade}</td>
                <td class="${cls}">${status}</td>
                <td>
                    <button class="edit-btn" onclick="openModal(${i})">Edit</button>
                    <button class="delete-btn" onclick="deleteStudent(${i})">Delete</button>
                </td>
            </tr>
        `;
    });

    let gpa = students.length ? (total / students.length).toFixed(2) : 0;

    document.getElementById("gpa").innerText = "Average GPA: " + gpa;
    document.getElementById("top").innerText = "Top Students: " + [...new Set(top)].join(", ");
    document.getElementById("risk").innerText = "At Risk: " + [...new Set(risk)].join(", ");

    drawChart();
}

let chart;

function drawChart() {
    let ctx = document.getElementById("chart");

    let names = students.map(s => s.name);
    let grades = students.map(s => s.grade);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: names,
            datasets: [{
                label: "Grades",
                data: grades
            }]
        }
    });
}

render();