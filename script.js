document.addEventListener("DOMContentLoaded", startQuiz);

// คำถามทั้งหมด 20 ข้อ
const allQuestions = [
    { text: "คอมพิวเตอร์เครื่องแรกของโลกชื่อว่าอะไร?", choices: ["ENIAC", "IBM", "Apple I"], correct: "ENIAC" },
    { text: "CPU ย่อมาจากอะไร?", choices: ["Central Processing Unit", "Computer Power Unit", "Central Program Unit"], correct: "Central Processing Unit" },
    { text: "RAM ทำหน้าที่อะไร?", choices: ["เก็บข้อมูลถาวร", "ประมวลผลคำสั่ง", "เก็บข้อมูลชั่วคราว"], correct: "เก็บข้อมูลชั่วคราว" },
    { text: "ภาษาโปรแกรมมิ่งใดเก่าแก่ที่สุด?", choices: ["Python", "Fortran", "C++"], correct: "Fortran" },
    { text: "HTML ใช้สำหรับอะไร?", choices: ["เขียนโปรแกรม", "ออกแบบเว็บ", "วิเคราะห์ข้อมูล"], correct: "ออกแบบเว็บ" },
    { text: "หน่วยวัดความเร็วของ CPU คืออะไร?", choices: ["GHz", "MB", "TB"], correct: "GHz" },
    { text: "ระบบปฏิบัติการใดเป็นโอเพนซอร์ส?", choices: ["Windows", "macOS", "Linux"], correct: "Linux" },
    { text: "JavaScript ใช้สำหรับอะไร?", choices: ["จัดการฐานข้อมูล", "พัฒนาเว็บแบบโต้ตอบ", "ออกแบบกราฟิก"], correct: "พัฒนาเว็บแบบโต้ตอบ" },
    { text: "Cloud Computing คืออะไร?", choices: ["เซิร์ฟเวอร์บนคลาวด์", "ฮาร์ดแวร์ใหม่", "ระบบจัดเก็บไฟล์"], correct: "เซิร์ฟเวอร์บนคลาวด์" },
    { text: "หน่วยเก็บข้อมูลใดเร็วที่สุด?", choices: ["HDD", "SSD", "Flash Drive"], correct: "SSD" },
    { text: "ภาษาโปรแกรมใดนิยมใช้พัฒนาแอปมือถือ?", choices: ["C++", "Swift", "PHP"], correct: "Swift" },
    { text: "SQL ใช้สำหรับอะไร?", choices: ["จัดการฐานข้อมูล", "เขียนโปรแกรม", "ออกแบบ UI"], correct: "จัดการฐานข้อมูล" },
    { text: "Python ใช้ทำอะไร?", choices: ["AI และ Data Science", "การออกแบบเว็บไซต์", "การจัดการระบบปฏิบัติการ"], correct: "AI และ Data Science" },
    { text: "CSS ใช้ทำอะไร?", choices: ["กำหนดโครงสร้างเว็บ", "ตกแต่งหน้าเว็บ", "เขียนสคริปต์เว็บ"], correct: "ตกแต่งหน้าเว็บ" },
    { text: "Git ใช้สำหรับอะไร?", choices: ["จัดการเวอร์ชันโค้ด", "รันโปรแกรม", "เขียน API"], correct: "จัดการเวอร์ชันโค้ด" }
];

let quiz = { questions: [] };
let userAnswers = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let timer;

// ดึง element จาก HTML
const questionText = document.getElementById("question-text");
const choicesContainer = document.getElementById("choices");
const nextButton = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-container");
const answerSummary = document.getElementById("answer-summary");
const timerElement = document.getElementById("timer");
const finalScore = document.getElementById("final-score");

// ฟังก์ชันสุ่ม 5 คำถามจากทั้งหมด 20 คำถาม
function getRandomQuestions() {
    quiz.questions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
}

// ฟังก์ชันบันทึกข้อมูลลง localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
}

// ฟังก์ชันดึงข้อมูลจาก localStorage
function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
    }
}

// เริ่มต้นควิซ
function startQuiz() {
    getRandomQuestions();
    saveToLocalStorage("quizData", quiz);
    userAnswers = [];
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 60;
    
    resultContainer.classList.add("hidden");
    document.getElementById("quiz-container").classList.remove("hidden");

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `เวลาที่เหลือ: ${timeLeft} วินาที`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);

    showQuestion();
}

// แสดงคำถามปัจจุบัน
function showQuestion() {
    const question = quiz.questions[currentQuestionIndex];
    questionText.textContent = question.text;
    choicesContainer.innerHTML = "";

    question.choices.forEach(choice => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.classList.add("bg-gray-200", "p-2", "rounded-lg", "hover:bg-gray-300", "choice-btn");
        button.onclick = () => selectAnswer(button, choice, question.correct);
        choicesContainer.appendChild(button);
    });

    nextButton.classList.add("hidden");
}

// ตรวจสอบคำตอบ
function selectAnswer(button, choice, correct) {
    document.querySelectorAll(".choice-btn").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");

    userAnswers.push({
        question: quiz.questions[currentQuestionIndex].text,
        selected: choice,
        correct: correct,
        isCorrect: choice === correct
    });

    if (choice === correct) score++;
    nextButton.classList.remove("hidden");
}

// ไปยังคำถามถัดไป
nextButton.onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.questions.length) {
        showQuestion();
    } else {
        clearInterval(timer);
        showResult();
    }
};

// คำนวณคะแนน
function calculateScore() {
    return (score / quiz.questions.length) * 100;
}

// แสดงผลคะแนนพร้อมรายละเอียดคำตอบ
function showResult() {
    document.getElementById("quiz-container").classList.add("hidden");
    resultContainer.classList.remove("hidden");

    const finalScoreValue = calculateScore();
    finalScore.textContent = `คุณได้คะแนน ${finalScoreValue.toFixed(2)}% 🎉`;

    answerSummary.innerHTML = "<h3 class='text-lg font-bold'>สรุปคำตอบของคุณ:</h3>";
    userAnswers.forEach((answer, index) => {
        const resultClass = answer.isCorrect ? "text-green-600" : "text-red-600";
        answerSummary.innerHTML += `
            <p class='${resultClass}'>
                ข้อ ${index + 1}: ${answer.question}<br>
                <b>คุณเลือก:</b> ${answer.selected} <br>
                <b>คำตอบที่ถูกต้อง:</b> ${answer.correct}
            </p>
            <hr>
        `;
    });

    saveToLocalStorage("quizScore", { score: finalScoreValue, date: new Date(), answers: userAnswers });
}