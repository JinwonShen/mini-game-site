import { makeDOMwithProperties } from "../utils/dom.js";
import { handleModalOpen } from "../utils/modal.js";
import {
  isGameStart,
  setTimer,
  startTimer,
  stopTimer,
  getResultTimeString,
  getNowTime,
} from "../utils/timer.js";
import { MOUSE_CONTROL_SCORE_KEY } from "../constants/localStorage.js";

// boxDOM들을 저장할 수 있는 전역변수
let boxDOMList = [];
let wallBoxDOMList = [];
let startBoxDOM = null;
let endBoxDOM = null;

const gameFieldDOM = document.getElementById("game-field");

export const initMouseControlGame = () => {
  startBoxDOM.innerHTML = "시작";
  endBoxDOM.innerHTML = "끝";
  boxDOMList.forEach((boxDOM) => {
    boxDOM.style.backgroundColor = "transparent";
  });
  stopTimer();
  setTimer(0);
};

const handleSuccessGame = () => {
  stopTimer();
  // 게임 성공시 타이머를 멈추고 모달을 띄워주기
  // Todo: modal 구현
  handleModalOpen({
    isSuccess: true,
    timeString: getResultTimeString(),
  });
  // 게임 성공시 localStorage에 갱신된 최고 점수 (최소 소요 시간) 저장
  const nowSpendTime = getNowTime();
  const currentSpendTime = localStorage.getItem(MOUSE_CONTROL_SCORE_KEY);
  if (!currentSpendTime || currentSpendTime < nowSpendTime) {
    localStorage.setItem(MOUSE_CONTROL_SCORE_KEY, nowSpendTime);
  }

  setTimer(0);
};

const handleFailedGame = () => {
  stopTimer();
  // 게임 실패시 타이머를 멈추고 모달을 띄워주기
  // Todo: modal 구현
  handleModalOpen({
    isSuccess: false,
  });
  setTimer(0);
};

export const setBoxDOM = ({
  row, // 행이 몇갠지
  col, // 열이 몇갠지
  start, // 시작 위치[ 행,열 ]
  end, // 종료 위치 [ 행, 열 ]
  walls, // 벽의 위치들 [ 행, 열 ]
}) => {
  // control-box-container를 만들고,
  // box들을 채우기
  const controlBoxContainer = makeDOMwithProperties("div", {
    id: "control-box-container",
    // 필트를 벗어났을 때에도 실패하기 때문에 다음 메서드를 동일하게 실행
    onmouseleave: () => {
      if (!isGameStart) return;
      handleFailedGame();
    },
  });
  controlBoxContainer.style.display = "grid";
  controlBoxContainer.style.gridTemplateRows = `repeat(${row}, 1fr)`;
  controlBoxContainer.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
  // display: grid;
  // grid-template-rows: repeat(3, 1fr) // 3행
  // grid-template-columns: repeat(4, 1fr) // 4행

  for (let i = 0; i < row; i++) {
    // 행을 1씩 늘려가면서
    for (let j = 0; j < col; j++) {
      // 열을 1씩 늘려가면서
      const {
        type,
        className,
        innerHTML = "",
        onmouseover,
      } = (function () {
        // 익명함수와 즉시실행함수
        if (i === start[0] && j === start[1]) {
          return {
            type: "start",
            className: "control-box start",
            innerHTML: "시작",
            onmouseover: (event) => {
              startTimer(handleFailedGame);

              event.target.innerHTML = "";
              // 게임 시작 -> 타이머가 시작
              // 게임 시작 변수 변경 !
              // 시작이 표기되어있는 innerHTML 없애기
            },
          };
        }
        if (i === end[0] && j === end[1]) {
          return {
            type: "end",
            className: "control-box end",
            innerHTML: "끝",
            onmouseover: () => {
              if (!isGameStart) return;
              event.target.innerHTML = "";
              handleSuccessGame();
              // 게임 시작 변수가 세팅 되었을 때를 기준으로 동작
              // 게임 종료 -> 타이머가 종료, 성공 모달 출력
              // 끝이 표기되어있는 innerHTML 없애기
            },
          };
        }
        for (let wall of walls) {
          if (i === wall[0] && j === wall[1]) {
            // 벽의 위치
            return {
              type: "wall",
              className: "control-box wall",
              onmouseover: (event) => {
                if (!isGameStart) return;
                handleFailedGame();
                // 게임 시작 변수가 세팅 되었을 때를 기준으로 동작
                // 게임 종료 -> 타이머가 종료, 실패 모달 출력
              },
            };
          }
        }
        return {
          type: "normal",
          className: "control-box",
          onmouseover: (event) => {
            if (!isGameStart) return;

            event.target.style.backgroundColor = "linen";
          },
          // 게임 시작 변수가 세팅 되었을 때를 기준으로 동작
          // 길의 색상이 변경
        };
      })();

      const boxDOM = makeDOMwithProperties("div", {
        className: className, // 키와 값이 같으면 생략가능
        innerHTML: innerHTML,
        id: `box-${i}-${j}`,
        onmouseover,
      });

      switch (type) {
        case "start":
          startBoxDOM = boxDOM;
          break;
        case "end":
          endBoxDOM = boxDOM;
          break;
        case "wall":
          wallBoxDOMList.push(boxDOM);
          break;
        default:
          boxDOMList.push(boxDOM);
      }

      controlBoxContainer.appendChild(boxDOM);
    }
  }
  gameFieldDOM.appendChild(controlBoxContainer);
};
