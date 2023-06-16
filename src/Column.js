import TaskScreen from "./TaskScreen.js";

export default function Column({ $target, initialState, column_name, column_id, cheerUpButtonClick, nextButtonClick }) {

    const $column = document.createElement("div");

    this.state = initialState;

    $target.appendChild($column);

    $column.className = "column";

    this.setState = (nextState) => {
        this.state = nextState;
        taskScreen.setState(this.state);
        taskScreen.render();
    }

    this.render = () => {
        $column.innerHTML = `
            <div class="column_title_wrapper">
                <div class="column_title">${column_name}</div>
            </div>
        `
    }

    this.render();

    const taskScreen = new TaskScreen({
        $target: $column,
        initialState: this.state,
        column_id: column_id,
        cheerUpButtonClick,
        nextButtonClick,
    });

}