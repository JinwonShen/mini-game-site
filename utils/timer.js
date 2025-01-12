// const MAX_TIME = 4; // 3600 * 24; // 최대시간은 24시간
// const timerDOM = document.getElementsByClassName("game-time")[0];

// export let isGameStart = false;

// let time = 0;
// let timerId = null;

// const convertToTwoNumber = (num) => {
//   const stringNum = `${num}`; // String(num)도 가능
//   if (stringNum.length === 1) return `0${stringNum}`;
//   else return stringNum;
// };

// const getTimeString = (time) => {
//   // e.g. time = 0; return "00:00:00"
//   // 60s -> 00:01:00
//   // 3600s -> 01:00:00
//   // time / 60

//   // 1시간 1분 1초 -> 1 + 60 + 3600 -> 3661초
//   // 1과 나머지 61, hours : 1;
//   const hours = Math.floor(time / 3600); // time을 3600으로 나누면 1.03??? 등으로 나올 수 있기 때문에 Math.floor(내림)
//   time = time - hours * 3600; // 61
//   const minutes = Math.floor(time / 60); // 몫1과 나머지1
//   time = time - minutes * 60; // 61 - 60 * 1
//   const seconds = time;

//   // 0이 넘어왔을 때, 0:0:0으로 넘어옴
//   // convertToTwoNumber함수를 만들어 활용
//   return `${convertToTwoNumber(hours)}:${convertToTwoNumber(
//     minutes
//   )}:${convertToTwoNumber(seconds)}`;
// };

// export const startTimer = (onTimeOver) => {
//   isGameStart = true;
//   timerId = setInterval(() => {
//     time++;
//     timerDOM.innerHTML = getTimeString(time); // 0 -> 00:00:00 1 -> 00:00:01
//     if (MAX_TIME < time) {
//       onTimeOver?.();
//       clearInterval(timerId);
//     }
//   }, 1000);
// };

// export const stopTimer = () => {
//   isGameStart = false;
//   if (timerId == null) return;
//   clearInterval(timerId);
// };

// export const setTimer = (initTime) => {
//   time = initTime;
//   timerDOM.innerHTML = getTimeString(time);
// };

// export const getResultTimeString = () => {
//   return getTimeString(time);
// };

// export const getNowTime = () => {
//   return time;
// };

const MAX_TIME = 3600 * 24; // 최대시간은 24시간
const timerDOM = document.getElementsByClassName("game-time")[0];

export let isGameStart = false;

let time = 0;
let timerId = null;

const convertToTwoNumber = (num) => {
  const stringNum = `${num}`; // String(num)도 가능
  if (stringNum.length === 1) return `0${stringNum}`;
  else return stringNum;
};

export const getTimeString = (time) => {
  const hours = Math.floor(time / 3600); // 시 계산
  time = time - hours * 3600;
  const minutes = Math.floor(time / 60); // 분 계산
  time = time - minutes * 60;
  const seconds = time;

  return `${convertToTwoNumber(hours)}:${convertToTwoNumber(
    minutes
  )}:${convertToTwoNumber(seconds)}`;
};

export const startTimer = (onTimeOver) => {
  isGameStart = true;
  const startTime = Date.now() - time * 1000; // 현재 시간에서 경과 시간 보정

  const updateTimer = () => {
    const currentTime = Date.now();
    time = Math.floor((currentTime - startTime) / 1000); // 실제 경과 시간 계산
    timerDOM.innerHTML = getTimeString(time);

    if (MAX_TIME < time) {
      onTimeOver?.();
      stopTimer();
    } else {
      timerId = setTimeout(
        updateTimer,
        1000 - ((Date.now() - currentTime) % 1000)
      ); // 보정된 간격으로 호출
    }
  };

  updateTimer();
};

export const stopTimer = () => {
  isGameStart = false;
  if (timerId == null) return;
  clearTimeout(timerId); // `setTimeout` 사용에 맞게 clearTimeout 호출
  timerId = null;
};

export const setTimer = (initTime) => {
  time = initTime;
  timerDOM.innerHTML = getTimeString(time);
};

export const getResultTimeString = () => {
  return getTimeString(time);
};

export const getNowTime = () => {
  return time;
};

/* 
// chatGPT를 활용해 수정한 내용.
// 기존 제작한 startTimer를 실행했을 때 웹에서 
// 초에 오차가 있는 것을 발견함.
// setInterval의 특성과 타이머 실행 시간 누적의 차이 떄문이라고 한다.
// setInterval은 기본적으로 지정된 시간 간격(예: 1000ms)마다 콜백 함수를 실행하도록 예약합니다. 하지만 이 과정에서 아래와 같은 이유로 정확히 1초 간격을 유지하지 못할 수 있습니다:
// 그 외에도 setInterval의 비동기 특성, setInterval 실행 지연 누적, 함수 실행 시간 등의 이유가 있었다.
// 아래 수정된 코드
export const startTimer = () => {
  const startTime = Date.now(); // 타이머 시작 시간 기록

  const updateTimer = () => {
    const currentTime = Date.now(); // 현재 시간
    time = Math.floor((currentTime - startTime) / 1000); // 경과 시간 계산
    timerDOM.innerHTML = getTimeString(time); // 화면 업데이트
    setTimeout(updateTimer, 1000 - ((Date.now() - currentTime) % 1000)); // 보정된 간격으로 호출
  };

  updateTimer();
};
*/
