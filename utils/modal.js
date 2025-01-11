const modalDOM = document.getElementsByClassName("modal")[0];
const modalTitleDOM = document.getElementsByClassName("modal-title")[0];
const modalDescriptionDOM =
  document.getElementsByClassName("modal-description")[0];

export const handleModalOpen = ({
  isSuccess,
  timeString, // "00:00:00" | undefined
}) => {
  modalDOM.classList.add("open");
  // 성공 모달 -> title -> 성공 !, description -> 몇 초만에 성공했습니다 !
  // 실패 모달 -> title -> 실패 !, description -> 다시 시도해보세요 ~
  if (isSuccess) {
    modalTitleDOM.innerHTML = "성공!";
    modalDescriptionDOM.innerHTML = `${timeString}만에 성공했습니다 !`;
  } else {
    modalTitleDOM.innerHTML = "실패!";
    modalDescriptionDOM.innerHTML = "다시 시도해보세요 ~";
  }
};

export const handleModalClose = (onModalClose) => {
  modalDOM.classList.remove("open");
  onModalClose?.();
};
