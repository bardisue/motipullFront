export default function RankingScreen({ $target, initialState, onClose }) {
    const $rankingScreen = document.createElement('div');

    $target.appendChild($rankingScreen);

    $rankingScreen.className = "rankingScreen"


    //users
    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;

        this.render();
    }

    this.render = () => {
        $rankingScreen.style.display = this.state.showRanking ? 'block' : 'none';

        const { users } = this.state;

        users.sort(function (a, b) {
            return b.value - a.value;
        });

        $rankingScreen.innerHTML = `
            <div class="content">
                <ul>
                    ${users.slice(0, 3).map((user, index) => `
                        <li>${index + 1}등 : ${user.name}/${user.value}점 </li>
                    `)}
                </ul>
            </div>
        `
    }

    this.render();

    window.addEventListener('keyup', (e) => {
        //만약 누른 키가 esc인 경우 onCLose 호출
        if (e.key === 'Escape') {
            onClose()
        }
    })
    $rankingScreen.addEventListener('click', (e) => {
        if (Array.from(e.target.classList).includes('rankingScreen')) {
            onClose()
        }
    })
}