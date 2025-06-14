// 질문 데이터를 저장할 배열
let questions = JSON.parse(localStorage.getItem('questions')) || [];

// DOM 요소
const questionsContainer = document.getElementById('questionsContainer');
const questionModal = document.getElementById('questionModal');
const questionForm = document.getElementById('questionForm');
const newQuestionBtn = document.getElementById('newQuestionBtn');
const cancelBtn = document.getElementById('cancelBtn');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
let imageBase64 = '';

// 이미지 미리보기 및 base64 변환
if (imageInput) {
    imageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                imageBase64 = evt.target.result;
                imagePreview.innerHTML = `<img src="${imageBase64}" alt="미리보기 이미지" />`;
            };
            reader.readAsDataURL(file);
        } else {
            imageBase64 = '';
            imagePreview.innerHTML = '';
        }
    });
}

// 모달 표시/숨김 함수
function toggleModal() {
    questionModal.classList.toggle('hidden');
    questionModal.classList.toggle('flex');
    if (questionModal.classList.contains('hidden')) {
        // 모달 닫힐 때 이미지 초기화
        imageBase64 = '';
        if (imageInput) imageInput.value = '';
        if (imagePreview) imagePreview.innerHTML = '';
    }
}

// 질문 카드 생성 함수
function createQuestionCard(question) {
    const card = document.createElement('div');
    card.className = 'question-card bg-white rounded-2xl shadow-lg p-4 sm:p-6 fade-in';
    card.setAttribute('data-question-id', question.id);
    card.innerHTML = `
        <div class="flex items-center justify-between mb-3 sm:mb-4">
            <h3 class="text-lg sm:text-xl font-bold">${question.title}</h3>
            <span class="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                <i class="far fa-clock mr-1"></i>${new Date(question.id).toLocaleDateString()}
            </span>
        </div>
        <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">${question.content}</p>
        ${question.image ? `<img src="${question.image}" alt="질문 이미지" class="w-full max-h-52 object-contain rounded-xl mb-4" />` : ''}
        <div class="answer-list">
            ${question.answers.map(answer => `
                <div class="bg-gray-50 p-3 sm:p-4 rounded-xl mb-2 sm:mb-3 shadow-sm">
                    <div class="flex items-start">
                        <i class="fas fa-comment-dots text-indigo-500 mt-1 mr-2 sm:mr-3 text-sm"></i>
                        <p class="text-gray-700">${answer}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="flex gap-2 items-stretch mt-auto">
            <input type="text" class="answer-input flex-1" placeholder="답변을 입력하세요...">
            <button class="answer-btn bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-1 transition duration-300 whitespace-nowrap flex items-center justify-center" 
                    onclick="addAnswer(${question.id})">
                <i class="fas fa-paper-plane mr-2"></i>답변
            </button>
        </div>
    `;
    return card;
}

// 질문 목록 렌더링
function renderQuestions() {
    questionsContainer.innerHTML = '';
    questions.forEach(question => {
        questionsContainer.appendChild(createQuestionCard(question));
    });
}

// 새 질문 추가
function addQuestion(title, content, image) {
    const newQuestion = {
        id: Date.now(),
        title,
        content,
        image: image || '',
        answers: []
    };
    questions.push(newQuestion);
    localStorage.setItem('questions', JSON.stringify(questions));
    renderQuestions();
}

// 답변 추가
function addAnswer(questionId) {
    const questionCard = document.querySelector(`[data-question-id="${questionId}"]`);
    const answerInput = questionCard.querySelector('.answer-input');
    const answer = answerInput.value.trim();
    
    if (answer) {
        const questionIndex = questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
            questions[questionIndex].answers.push(answer);
            localStorage.setItem('questions', JSON.stringify(questions));
            renderQuestions();
            answerInput.value = '';
        }
    }
}

// 이벤트 리스너
newQuestionBtn.addEventListener('click', toggleModal);
cancelBtn.addEventListener('click', toggleModal);

questionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    addQuestion(title, content, imageBase64);
    toggleModal();
    questionForm.reset();
});

// 초기 렌더링
renderQuestions(); 
