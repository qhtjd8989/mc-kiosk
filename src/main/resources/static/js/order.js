const homeButton = document.querySelector(".load-main-page-button");
const menuPrice = document.querySelectorAll(".menu-price");
const orderCompleteButton = document.querySelector(".order-complete-button");

const subTotalPriceSpan = document.querySelector(".sub-total-price-span");
const totalPriceSpan = document.querySelector(".total-price-span");
const pointButton = document.querySelector(".point-button");
const pointModal = document.querySelector(".point-modal");
const usePoint = document.querySelector(".use-point");
const havingPointInfo = document.querySelector(".having-point-info");
const cancelButton = document.querySelectorAll(".cancel-button");
const addOrdersButton = document.querySelector(".add-orders-button");
const insertModal = document.querySelector(".insert-modal");
const insertUser = document.querySelector(".insert-user");
const insertCancelButton = document.querySelector(".insert-cancel-button");
const userName = document.querySelector(".user-name");
const userPhoneNumber = document.querySelector(".user-phone-number");
const earnPoints = document.querySelector(".earn-points");
const usingPointButton = document.querySelector(".using-point-button");

let count = 1;
let amount = 4500;
let price = amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
let result = amount.toLocaleString('ko-KR');
let orderMenuList = null;



setOrderMenu();
setTotalPrice();

orderCompleteButton.onclick = () => {
    let totalPriceText = document.querySelector(".total-price-span").textContent;
    localStorage.totalPrice = totalPriceText;
    location.href = "/table-service";
}

homeButton.onclick = () => {
    if(confirm("장바구니가 모두 초기화 됩니다.")) {
        localStorage.removeItem("orderMenuList");
        location.replace("/kiosk-main");
        localStorage.totalPrice = "￦0";
    }
    // let totalPriceText = document.querySelector(".total-price-span").textContent;
    // localStorage.totalPrice = totalPriceText;
}

addOrdersButton.onclick = () => {
    updateShoppingBasketInformation();
    let totalPriceText = document.querySelector(".total-price-span").textContent;
    localStorage.totalPrice = totalPriceText;
    location.replace("/kiosk-main");
}

pointButton.onclick = () => {
    pointModal.classList.remove("modal-visible");
}


usePoint.onclick = (e) => {
    if(checkUser(e.target)){
       
    }
}


earnPoints.onclick = (e) => {
    if(checkUser(e.target)) {
        // alert(earnPoint + "포인트 적립되었습니다.");
        pointModal.classList.add("modal-visible");
        havingPointInfo.classList.add("use-point-visible");
        // updateUserPoint(user)     
    }
}

cancelButton.forEach(button => {
    button.onclick = () => {
        pointModal.classList.add("modal-visible");
        havingPointInfo.classList.add("use-point-visible");
        userName.value = "";
        userPhoneNumber.value = "";
        let finalAmount = document.querySelector(".final-amount-input");
        let usingPoint = document.querySelector(".using-point-input");
        finalAmount.value = "";
        usingPoint.value = "";
    }
})

function checkUser(button) {
    let status = false;
    let pointStatus = button.classList.contains("use-point") ? "use" : "earn";
    console.log(pointStatus);
    $.ajax({
        async: false,
        type: "get",
        url: `/api/v1/check/user`,
        data: {
            "userName": userName.value,
            "userPhoneNumber": userPhoneNumber.value
        },
        dataType: "json",
        success: (response) => {
            user = response.data;
            if(response.data == null) {
                insertModalInVisibleEvent();
                status = false;
            }else {
                if(pointStatus == "use") {
                    havingPointInfo.classList.remove("use-point-visible");
                    let usingPoint = document.querySelector(".using-point-input");
                    let currentPoint = document.querySelector(".current-point-value");
                    currentPoint.value = user.point;
                    const point = document.querySelector(".total-price-span").textContent;
                    let num = point.replace("￦", "");
                    let num2 = num.replace("," , "");
                    let point2 = parseInt(num2);
                    let finalAmount = document.querySelector(".final-amount-input");
                    finalAmount

                    usingPoint.onkeydown = () => {

                        setTimeout(() => {
                            let usingPointValue = parseInt(usingPoint.value);

                            console.log(usingPoint.value);

                            if(usingPoint.value.length == 0) {
                                console.log("된다")
                                usingPoint.value = 0;
                                usingPointValue = parseInt(usingPoint.value);
                                finalAmount.value = point2 - usingPointValue;
                            }

                            if(usingPointValue + 1 > user.point) {

                                usingPoint.value = user.point;
                                usingPointValue = parseInt(usingPoint.value);

                                console.log(usingPointValue);
                                finalAmount.value = point2 - usingPointValue;

                                if(finalAmount.value < 0) {
                                    usingPoint.value =  point2;
                                    finalAmount.value = 0;
                                }
                            } else if(usingPointValue + 1 > point2) {
                                usingPoint.value =  point2;
                                finalAmount.value = 0;
                            }else if(usingPointValue < 1) {
                                usingPoint.value = 0;
                            }else {
                                finalAmount.value = point2 - usingPointValue;
                            }
                       

                            console.log(finalAmount.value);

                        }, 100);
                       
                    }
                    usingPointButton.onclick = () => {
                        usePointButtonClick(response.data, pointStatus);
                    }
                }else {
                    updateUserPoint(response.data, pointStatus);
                }
                // console.log(response.data);
                status = true;
                // alert("성공");
            }
        },
        error: (error) => {
            console.log(error);
        }
    })
    return status;
}

function usePointButtonClick(user, pointStatus) {
    const id = user.id;
    let usingPoint = document.querySelector(".using-point-input").value;
    let finalAmountInput = document.querySelector(".final-amount-input").value;
    
    if(confirm(usingPoint + "포인트를 사용하시겠습니까?")) {
        $.ajax({
            async: false,
            type: "put",
            url: `/api/v1/check/point`,
            data:{
                "id": id,
                "point": usingPoint,
                "pointStatus": pointStatus
            },
            dataType: "json",
            success: (response) => {
                console.log(response.data);
                alert(usingPoint + "가 사용되었습니다.")
                pointModal.classList.add("modal-visible");
                havingPointInfo.classList.add("use-point-visible");
                userName.value = "";
                userPhoneNumber.value = "";
                

                subTotalPriceSpan.innerHTML = "￦" + finalAmountInput.toLocaleString('ko-KR');
                totalPriceSpan.innerHTML = "￦" + finalAmountInput.toLocaleString('ko-KR');
            },
            error: (error) => {
                console.log(error);
                alert("포인트 사용 실패");
            }
        });
    }
}

function updateUserPoint(user, pointStatus) {
    const point = document.querySelector(".total-price-span").textContent;
    console.log(point)
    let num = point.replace("￦", "");
    let num2 = num.replace("," , "");
    let point2 = parseInt(num2);
    let earnPoint = (point2 / 100) * 5;

    const id = user.id;
    console.log(id);

    $.ajax({
        async: false,
        type: "put",
        url: `/api/v1/check/point`,
        data:{
            "id": id,
            "point": earnPoint,
            "pointStatus": pointStatus
        },
        dataType: "json",
        success: (response) => {
            console.log(response.data);
            alert(earnPoint + "포인트 적립 성공");
            pointModal.classList.add("modal-visible");
            havingPointInfo.classList.add("use-point-visible");
        },
        error: (error) => {
            console.log(error);
            alert("포인트 적립 실패");
        }
    });

}

function insertModalInVisibleEvent() {
    insertModal.classList.remove("insert-modal-visible");
}

insertUser.onclick = () => {
    $.ajax({
        async: false,
        type: "post",
        url: `/api/v1/check/insert-user`,
        data: {
            "userName": userName.value,
            "userPhoneNumber": userPhoneNumber.value
        },
        dataType: "json",
        success: (response) => {
            console.log(response.data);
            insertModalVisibleEvent();
            alert("등록 성공");
            
        },
        error: (error) => {
            console.log(error);
            alert("등록 실패");
        }
    });
}

function insertModalVisibleEvent() {
    insertModal.classList.add("insert-modal-visible");
}

insertCancelButton.onclick = () => {
    insertModalVisibleEvent();
}



function setOrderMenu() {
    const orderMenuDetails = document.querySelector("main");

    orderMenuList = JSON.parse(localStorage.orderMenuList);

    orderMenuDetails.innerHTML = "";

    orderMenuList.forEach(menu => {
        let totalPrice = null;
        let totalKcal = null;

        if(menu.setFlag) {
            totalPrice = "￦" + (menu.amount * menu.setPrice).toLocaleString('ko-KR');
            totalKcal = (menu.amount * menu.setKcal).toLocaleString("ko-KR") + " Kcal";
        }else {
            totalPrice = "￦" + (menu.defaultPrice == 0 ? menu.price : menu.defaultPrice).toLocaleString('ko-KR');
            totalKcal = menu.kcal.toLocaleString("ko-KR") + " Kcal";
        }
        
        orderMenuDetails.innerHTML += `
            <div class="order-menu">
                <button type="button" class="cancel-button">취소</button>
                <div class="menu-img-info">
                    <div class="menu-info">
                        <span class="menu-title">${menu.setFlag ? menu.setName : menu.menuName} <span class="total-kcal-span">${totalKcal}</span></span>
                        <span class="menu-details">${menu.setFlag ? menu.side.menuName + " " + menu.drink.menuName : menu.menuName}</span>
                        <button type="button" class="details-button">세부정보 표시</button>
                    </div>
                </div>
                <div class="set-count-modify">
                    <button class="minus-button" type="button">-</button>
                    <div class="set-count">
                        <span class="set-count-span">${menu.amount}</span>
                    </div>
                    <button class="plus-button" type="button">+</button>
                </div>
                <span class="menu-price">${totalPrice}</span>
            </div> 
        `;
    });

    setMinusButtonClickEvent();
    setPlusButtonClickEvent();
    setCancelButtonClickEvent();
}

function setTotalPrice() {
    const subTotalPriceSpan = document.querySelector(".sub-total-price-span");
    const totalPriceSpan = document.querySelector(".total-price-span");

    let totalPrice = parseInt(getTotalPrice());

    subTotalPriceSpan.textContent = "￦" + totalPrice.toLocaleString("ko-KR");
    totalPriceSpan.textContent = "￦" + totalPrice.toLocaleString("ko-KR");
    
}

function setTotalKcal(index, count) {
    const totalKcalSpanItems = document.querySelectorAll(".total-kcal-span");
    let totalKcal = getTotalKcal(index, count);

    totalKcalSpanItems[index].textContent = totalKcal;
}

function getTotalKcal(index, count) {
    if(orderMenuList[index].setFlag) {
        return (orderMenuList[index].setKcal * count).toLocaleString("ko-KR") + " Kcal";

    }else {
        return (orderMenuList[index].kcal * count).toLocaleString("ko-KR") + " Kcal";

    }
}

function getTotalPrice() {
    const menuPriceItems = document.querySelectorAll(".menu-price");

    let totalPrice = 0;

    menuPriceItems.forEach(menuPrice => {
        totalPrice += parseInt(menuPrice.textContent.substring(1).replaceAll(",", ""));
    })

    return totalPrice;
}

function setMinusButtonClickEvent() {
    const setCountItems = document.querySelectorAll(".set-count-span");
    const minusButtons = document.querySelectorAll(".minus-button");

    minusButtons.forEach((button, index) => {
        button.onclick = () => {
            let count = parseInt(setCountItems[index].innerHTML);
            if(count < 2) {
                alert("최소 수량은 1입니다");
                
            }else {
                count -= 1;
                setCountItems[index].innerHTML = count;
            }
    
            setMenuPrice(index, count);
            setTotalKcal(index, count);
            setTotalPrice();
        }
    
    })
}

function setPlusButtonClickEvent() {
    const setCountItems = document.querySelectorAll(".set-count-span");
    const plusButtons = document.querySelectorAll(".plus-button");

    plusButtons.forEach((button, index) => {
        button.onclick = () => {
            let count = parseInt(setCountItems[index].innerHTML);
    
            if(setCountItems[index].innerHTML > 0){
                count += 1;
                setCountItems[index].innerHTML = count;
            }
    
            setMenuPrice(index, count);
            setTotalKcal(index, count);
            setTotalPrice();
            
            // const point = document.querySelector(".total-price-span").textContent;
            // let num = point.replace("￦", "");
            // console.log(num);
            // let num2 = num.replace("," , "");
            // console.log(num2);
        }
    })
}

function setMenuPrice(index, count) {
    const menuPrice = document.querySelectorAll(".menu-price")[index];

    if(orderMenuList[index].setFlag) {
        menuPrice.textContent = "￦" + (orderMenuList[index].setPrice * count).toLocaleString("ko-KR");

    }else {
        let price = orderMenuList[index].defaultPrice == 0 ? orderMenuList[index].price : orderMenuList[index].defaultPrice;
        menuPrice.textContent = "￦" + (price * count).toLocaleString("ko-KR");

    }
}

function updateShoppingBasketInformation() {
    const setCountItems = document.querySelectorAll(".set-count-span");

    orderMenuList.forEach((menu, index) => {
        menu.amount = setCountItems[index].textContent;
    })

    localStorage.orderMenuList = JSON.stringify(orderMenuList);
}

function setCancelButtonClickEvent() {
    const cancelButtonItems = document.querySelectorAll(".cancel-button");


    cancelButtonItems.forEach((button, buttonIndex) => {
        button.onclick = () => {
            orderMenuList = orderMenuList.filter((menu, filterIndex) => buttonIndex != filterIndex);
            
            localStorage.orderMenuList = JSON.stringify(orderMenuList);
            location.replace("/order");
        }
    })

}