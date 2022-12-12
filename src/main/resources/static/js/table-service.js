const backButton = document.querySelector(".back-button");
const tableService = document.querySelector(".table-service");
const pickupService = document.querySelector(".pickup-service");
const loadMainPageButton = document.querySelector(".load-main-page-button");
tableService.onclick = () => {
    if(confirm("테이블을 이용하시겠습니까?")) {
        location.href ="/payment";
    }
}

pickupService.onclick = () => {
    if(confirm("카운터에서 픽업하시겠습니까?")) {
        location.href ="/payment";
    }
}

loadMainPageButton.onclick = () => {
    location.replace("/kiosk-main")
}

backButton.onclick = () => {
    history.back();
}