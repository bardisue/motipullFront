import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

export default function TaskScreen({ $target, initialState, column_id, cheerUpButtonClick, nextButtonClick }) {

    const $taskScreen = document.createElement('div');

    $taskScreen.className = "taskScreen";

    this.state = initialState;

    $target.appendChild($taskScreen);

    this.setState = (nextState) => {
        this.state = nextState;
        this.render();
    }

    this.render = () => {
        const { tasks } = this.state;
        const currentDate = new Date();

        $taskScreen.innerHTML = `
            <ul>
                ${tasks.map(({ colId, id, name, description, admins, classifications, isDetailWorks, detailWorks, cheerUp, dueDate }) => `
                ${(colId == column_id) ?
                `<li data-id="${id}" class="taskItem">
                        <h3 class="taskTitle">${name}</h3>
                        <p class="taskContent">${description}</p>
                        <ul class="adminWrapper">
                            ${admins.map((admin) => `
                                        <li class="admin">${admin}</li>
                                    `).join('')}
                        </ul>
                        <ul class="classificationWrapper">
                            ${classifications.map((classification) => `
                                        <li class="classification">${classification}</li>
                                    `).join('')}
                        </ul>
                        ${isDetailWorks ? `
                                    <div class="detailWorksPercent">세부 Works 
                                    <b>${Math.floor(((detailWorks.filter(({ isComplete }) => { return isComplete }).length) / detailWorks.length) * 100)}%</b>
                                    진행</div>
                                    <div class="detailWorksSentence">시작이 반! 하나부터 시작해보아요!</div>
                                ` : ``}
                        <button class="cheerUp">응원</button>
                        <div class="detailWorksSentence">${cheerUp}명이 응원합니다!</div>
                        <div class="dueDate">${dueDate > 0 ? `
                            ${((dueDate.getTime() - currentDate.getTime()) / 60 / 60 / 24 / 1000) >= 0 ?
                        `<b>${Math.ceil((dueDate.getTime() - currentDate.getTime()) / 60 / 60 / 24 / 1000)}</b>일 남았습니다` : 'dueDate를 넘겼습니다.'}
                        ` : ``}</div>
                        ${(colId != 4 ? `<button class="next">다음 단계로</button>` : ``)}
                    </li>`
                : ''}
                `).join('')}
            </ul>
        `;
    }
    $taskScreen.addEventListener('click', (e) => {
        const $li = e.target.closest('li')
        const getId = $li.dataset.id;
        const getCol = $li.dataset.column_id;
        if (e.target.className === "cheerUp") {
            axios.post( 'http://localhost:8080/card/cheerUp', 
            { 
                "cardId" : getId
            }, 
            { 
                headers:{ 
                    'Content-type': 'application/json', 
                'Accept': 'application/json' 
                } 
            } )
            
            cheerUpButtonClick(getId);
        }

        if (e.target.className === "next") {
            axios.post( 'http://localhost:8080/card/colChange', 
            { 
                "cardId" : getId
            }, 
            { 
                headers:{ 
                    'Content-type': 'application/json', 
                'Accept': 'application/json' 
                } 
            } )
            nextButtonClick(getId)
        }

        if (Array.from(e.target.classList).includes('detail')) {
            console.log(getId);
        }
    })


    this.render();
}