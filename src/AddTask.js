import { getItem, setItem, removeItem } from "./storage.js"
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

export default function ({ $target, initialState, onClose, addNewTask }) {
    const $addTask = document.createElement('div')

    $addTask.className = "addTask";

    $target.appendChild($addTask);

    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;

        this.render();
    }

    let details = [];

    this.render = () => {
        $addTask.style.display = this.state.addTask ? 'block' : 'none';

        const { users } = this.state;

        $addTask.innerHTML = `
            <div class=addContent>
                <div class="addNameWrapper"><div>이름*</div> <input id="name" type="text" placeholder="이름을 입력해주세요." value="${getItem("name", "")}"></input></div>
                <div class="addDescriptionWrapper"><div>설명*</div> <textarea id="description" rows="5" cols="25" placeholder="work에 대해 설명해주세요" value="${getItem("description", "")}">${getItem("description", "")}</textarea></div>
                <div class="addAdminWrapper">
                <div>담당자*</div>
                ${users.map((user, index) => `
                    <input type="checkbox" ${getItem(`admin${index + 1}`, "")} id="admin${index + 1}" name="${user.name}" />
                    <label for="${user.name}">${user.name}</label>
                `).join('')}
                </div>
                <div class="addClassificationWrapper">
                    <div>분류*</div>
                    <input type="checkbox" ${getItem("classification1", "")} id="classification1" name="프론트엔드" />
                    <label for="프론트엔드">프론트엔드</label>
                    <input type="checkbox" ${getItem("classification2", "")} id="classification2" name="백엔드" />
                    <label for="백엔드">백엔드</label>
                    <input type="checkbox" ${getItem("classification3", "")} id="classification3" name="기획" />
                    <label for="기획">기획</label>
                    <input type="checkbox" ${getItem("classification4", "")} id="classification4" name="디자인" />
                    <label for="디자인">디자인</label>
                </div>
                <div class="addDetailWrapper">
                    <input id="inputDetail" type="text" placeholder="세부 사항을 입력해주세요."></input>
                    <button class="addDetail">세부 works 추가</button>
                    ${details ? `${details.map((detail) => `
                        <div>${detail}</div>
                    `).join('')}` : ``}
                </div>
                <button class="Add">생성하기</button>
            </div>
        `
    }

    this.render();

    this.deleteStorage = () => {
        const { users } = this.state;

        details = [];
        removeItem("name");
        removeItem("description");
        removeItem("name");
        for (let i = 1; i <= users.length; i++) {
            removeItem(`admin${i}`);
        }
        removeItem("classification1");
        removeItem("classification2");
        removeItem("classification3");
        removeItem("classification4");
    }

    window.addEventListener('keyup', (e) => {
        //만약 누른 키가 esc인 경우 onCLose 호출
        if (e.key === 'Escape') {
            this.deleteStorage();
            onClose();
        }
    })

    $addTask.addEventListener('click', (e) => {
        if (Array.from(e.target.classList).includes('addTask')) {
            this.deleteStorage();
            onClose()
        }
        if (e.target.className === "addDetail") {
            details.push(document.querySelector('#inputDetail').value);
            this.render();
        }
        if (e.target.type === "checkbox") {
            setItem(e.target.id, "checked");
        }
        if (e.target.className == "Add") {
            const { users } = this.state;

            const newTask = {
                colId: 1,
                id: null,
                name: null,
                description: null,
                admins: [],
                classifications: [],
                isDetailWorks: false,
                detailWorks: [],
                cheerUp: 0,
                dueDate: null
            };
            newTask.id = this.state.tasks.length+1;
            newTask.name = document.querySelector('#name').value;
            newTask.description = document.querySelector('#description').value;

            const newAdmins = [];
            for (let i = 1; i <= users.length; i++) {
                const getAdmin = document.querySelector(`#admin${i}`);
                if (getAdmin.checked) {
                    newAdmins.push(getAdmin.name);
                }
            }
            newTask.admins = newAdmins;

            const newClassifications = [];
            for (let i = 1; i <= 4; i++) {
                const getClassification = document.querySelector(`#classification${i}`);
                if (getClassification.checked) {
                    newClassifications.push(getClassification.name);
                }
            }
            newTask.classifications = newClassifications;

            if((newTask.name == "") || (newTask.description == "") || (newTask.admins.length == 0) || (newTask.classifications.length==0)){
                onClose();
                return;
            }

            newTask.isDetailWorks = (details.length == 0) ? false : true;

            const newDetailWorks = [];
            for (let i = 0; i < details.length; i++) {
                newDetailWorks.push({
                    name: details[i],
                    isComplete: false,
                })
            }
            newTask.detailWorks = newDetailWorks;

            axios.post( 'http://localhost:8080/card/create', 
            { 
                "colId" : newTask.colId,
                "id" : newTask.id,
                "name" : newTask.name,
                "description" :newTask.description,
                "isDetailWorks" : newTask.isDetailWorks,
                "cheerUp" : newTask.cheerUp,
                "dueDate" : newTask.dueDate
            }, 
            { 
                headers:{ 
                    'Content-type': 'application/json', 
                'Accept': 'application/json' 
                } 
            } ) .then(res => { 

                for(let index = 0 ; index < newTask.admins.length ; index++){
                    axios.post('http://localhost:8080/cardAdmin/create', 
                    { 
                        "cardId" : newTask.id,
                        "admin" : newTask.admins[index]
                    }) .then(result => { 
                        console.log(res.data);
                    
                    }).catch(error =>console.log("error!")
                    )
                }

                for(let index = 0 ; index < newTask.classifications.length ; index++){
                    axios.post('http://localhost:8080/cardClass/create', 
                    { 
                        "cardId" : newTask.id,
                        "cardClass" : newTask.classifications[index]
                    }) .then(result => { 
                        console.log(res.data);
                    
                    }).catch(error =>console.log("error!")
                    )
                }
            
            }).catch(error =>console.log("error!")
            )
            addNewTask(newTask);
            this.deleteStorage();
            
            onClose();
        }
    })

    

    $addTask.addEventListener('keyup', (e) => {
        e.target.id ? setItem(e.target.id, e.target.value) : "";
    })
}