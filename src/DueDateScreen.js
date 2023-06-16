export default function DueDateScreen({ $target, initialState, submitDueDate, onClose }) {
    const $dueDateScreen = document.createElement('div')

    $dueDateScreen.className = "dueDateScreen"

    $target.appendChild($dueDateScreen);

    this.state = initialState;
    this.setState = (newState) => {
        this.state = newState;
        this.render();
    }
    this.render = () => {
        const showDueDate = this.state;
        $dueDateScreen.style.display = showDueDate ? 'block' : 'none';

        $dueDateScreen.innerHTML = `
            <div class="dueDateWrapper">
                <div class="dueDateTitle">dueDate 날짜를 입력해주세요.</div>
                <div class="dueDateSubTitle">*취소시 esc 또는 화면 밖을 클릭해주세요</div>
                <input type="date" id="dueDate" />
                <button class="dueDateButton">dueDate 적용</button>
            </div>
        `
    }

    $dueDateScreen.addEventListener('click', (e) => {
        if (Array.from(e.target.classList).includes('dueDateScreen')) {
            onClose()
        }
        if (e.target.className === "dueDateButton") {
            const getDate = document.querySelector('#dueDate').value
            submitDueDate(getDate);
            onClose();
        }
    })

    window.addEventListener('keyup', (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    })
    this.render()
}