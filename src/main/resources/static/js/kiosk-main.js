const foodMenus = document.querySelectorAll('.food-menus');     // 메뉴 리스트
const navBtnsList = document.querySelectorAll('nav > ul > li'); // 메뉴 버튼
const foodType = document.querySelectorAll('.food-type li'); 
const learnMenuBtnsList = document.querySelectorAll('.learn-menu-btns-list li');

const modalBody = document.querySelector(".modal-body");

const totalPriceSpan = document.querySelector(".total-price");

const orderHistory = document.querySelector(".order-history");


totalPriceSpan.innerHTML = "";

totalPriceSpan.innerHTML = localStorage.totalPrice == undefined ? "￦0" : localStorage.totalPrice;

// nav 버튼 이벤트
for (let i = 0; i < navBtnsList.length; i++) {//liList배열이기때문 선택할려면for문사용
    // let n = 0;//현재 클릭된 버튼에 인덱스값이 초기값설정
    // navBtnsList[i].index = i;//메뉴의 인덱스 값을 미리 설정


    navBtnsList[i].onclick = () => {
        // e.preventDefault();//a태그의 이벤트 상실
        // n = e.currentTarget.index; //==$(this).index(); 0 1 2 3 4 5                 
        //e.target //자식요소에 이벤트를 적용하는 대상
        //e.currentTarget//부모요소 이벤트 적용하는 대상

        if(isMainPageButton(i)) {
            const menuButton = document.querySelectorAll(".food-menu-btns");
            menuButton.forEach(menuUl => menuUl.innerHTML = "");

            setTopRankingMenuList();
        }else if(isMcMorningButton(i)) {
            if(!isMcMorningTime()) {
                alert("맥모닝 시간이 아닙니다.\n06:00 ~ 10:00");
                return false;
            }
        }else {
            getMenuList(navBtnsList[i].querySelector("span").textContent, i, "all");

        }


        for (let j = 0; j < navBtnsList.length; j++) {
            //클릭된 버튼을 비교하고 스타일을 설정하기 위한 반복문
            if (j == i) {
                foodMenus[j].style.display = 'block';
            } else {
                foodMenus[j].style.display = 'none';
            }
        }
    }
}

foodMenus[0].style.display = 'block';// 메인 페이지


// 메뉴 알아보기
learnMenuBtnsList[0].onclick = () => {
    navBtnsList[1].click();
    foodMenus[0].style.display = 'none';
    foodMenus[1].style.display = 'block';
}

learnMenuBtnsList[1].onclick = () => {
    navBtnsList[2].click();
    foodMenus[0].style.display = 'none';
    foodMenus[2].style.display = 'block';
}

learnMenuBtnsList[2].onclick = () => {
    // foodMenus[0].style.display = 'none';
    // foodMenus[3].style.display = 'block';
}

learnMenuBtnsList[3].onclick = () => {
    navBtnsList[4].click();
    foodMenus[0].style.display = 'none';
    foodMenus[4].style.display = 'block';
}



setLocalSorage();
setShoppingBasketInformation();
setBurgerTypeCategoryClickEvent();
setTopRankingMenuList();
removeMenuObjectInLocalStorage();
setSelectBurgerTypeEvent();
setOrderHistoryDivClickEvent();

function setLocalSorage() {
    let menuList = localStorage.orderMenuList;

    if(menuList == null) {

        localStorage.orderMenuList = JSON.stringify(new Array());
    }
    
}

function setShoppingBasketInformation() {
    let menuList = localStorage.orderMenuList;``

    if(menuList != null) {
        const shoppingBasketTotalCount = document.querySelector(".order-total-count p");
        const shoppingBasketTotalPrice = document.querySelector(".order-total-price span");
        let totalPrice = 0;

        menuList = JSON.parse(menuList);

        shoppingBasketTotalCount.textContent = menuList.length;


        menuList.forEach(menu => {
            if(menu.setFlag) {
                totalPrice += menu.setPrice * menu.amount;

            }else {
                totalPrice += menu.price * menu.amount;

            }
        });

        shoppingBasketTotalPrice.textContent + "￦" + totalPrice.toLocaleString("ko-KR");
    }
}

function setBurgerTypeCategoryClickEvent() {
    const burgerTypeItems = document.querySelectorAll(".burger-type li");

    burgerTypeItems.forEach((burgerTypeLi, index) => {

        burgerTypeLi.onclick = () => {
            let burgerType = getBurgerType(index);

            getMenuList("버거", 2, burgerType);
        }
    })
}

function getBurgerType(index) {
    return index == 0 ? "all" : index == 1 ? "beef" : index == 2 ? "chicken" : "seaFood";
}

function setTopRankingMenuList() {
    const popularMenuUl = document.querySelector(".popular-menu-btns");
    let menuList = loadTopRankingMenuList();

    clearDomObject(popularMenuUl);

    menuList.forEach(menu => {
        popularMenuUl.innerHTML += `
            <li class="menu-li">
                <div class="food-menu-img">
                <img src="/image/images/${menu.menuCategoryCode == 1 ? 'burger' : 'dessert'}/${menu.image}" alt="${menu.menuName}">
                </div>
                <div>
                <p>${menu.menuName}</p>
                <div class="food-menu-price">
                    <p>₩ ${menu.price.toLocaleString('ko-KR')}</p>
                    <p>${menu.kcal.toLocaleString('ko-KR')} Kcal</p>
                </div>
                </div>
            </li>
        `;
    })

    setMenuClickEvent(menuList, "topRankingMenuType");
}

function loadTopRankingMenuList() {
    let menuList = null;

    $.ajax({
        async: false,
        type: "get",
        url: `/api/v1/menu/top-ranking/list`,
        dataType: "json",
        success: (response) => {
            menuList = response.data;
        },
        error: (request, status, error) => {
            console.log(request.status);
            console.log(request.responseText);
            console.log(error);
        }
    })

    return menuList;
}

//버거 메뉴 
function getMenuList(selectedValue, index, burgerType) {
    let menuType = setMenuTypeBySelectMenuType(selectedValue);
    let url = getUrlBySelectedValut(selectedValue, menuType, burgerType);

    $.ajax({
        async: false,
        type: "get",
        url: url,
        dataType: "json",
        success: (response) => {
            setList(response.data, index, menuType);
        },
        error: (error) => {
            console.log(error);
        }
    });
}

function getUrlBySelectedValut(selectedValue, menuType, burgerType) {
    return selectedValue == "버거" ? `/api/v1/menu/burger/list?burgerType=${burgerType}` 
    : selectedValue == "맥모닝" ? `/api/v1/menu/mc-morning/list` 
    : selectedValue == "추천메뉴" ? `/api/v1/menu/top-ranking/list` : `/api/v1/menu/${menuType}/list?mcMorning=false`;
}

function setSelectBurgerTypeEvent() {
    foodType.forEach(type => {
        type.onmousedown = () => type.classList.add("active");
        type.onmouseup = () => type.classList.remove("active");
        type.onmouseout = () => type.classList.remove("active");
        
    });
}

function setMenuTypeBySelectMenuType(value) {
    let menuType = null;
    
    if(value == "버거") {
        menuType = "burger";

    }else if(value == "사이드") {
        menuType = "side";

    }else if(value == "커피") {
        menuType = "coffee";

    }else if(value == "디저트") {
        menuType = "dessert";

    }else if(value == "음료") {
        menuType = "drink";

    }else if(value == "맥모닝") {
        menuType = "mcMorning";
        
    }else if(value == "추천메뉴") {
        menuType = "recomendedMenu"
    }

    return menuType;
}

function setList(list, index, menuType){
    const menuButton = document.querySelectorAll(".food-menu-btns");
    

    menuButton.forEach(menuUl => menuUl.innerHTML = "");

    list.forEach(menu => {
        let price = menu.price == 0 ? menu.defaultPrice : menu.price;
        menuButton[index].innerHTML += `
            <li class="menu-li">
                <div class="food-menu-img">
                    <img src="/image/images/${menuType == "recomendedMenu" 
                    ? menu.menuCategoryCode == 1 
                        ? "burger" : "dessert" 
                    : menuType == "mcMorning" ? "burger" : menuType}/${menu.image}">
                </div>
                <div>
                    <p>${menu.menuName}</p>
                    <div class="food-menu-price">
                    <p>₩ ${price.toLocaleString('ko-KR')}</p>
                    <p>${menu.kcal.toLocaleString('ko-KR')}<span>Kcal</span></p>
                    </div>
                </div>
            </li>
        `
    });

    setMenuClickEvent(list, menuType);
}

function setMenuClickEvent(menuList, menuType) {
    const menuListLi = document.querySelectorAll(".menu-li");

    menuListLi.forEach((menu, index) => {
        let burgerFlag = setMenuFlagByMenuType(menuType, menuList[index]);
        let url = burgerFlag ? "/set-size-select-view" : "/order";


        menu.onclick = () => {
            menuType == "mcMorning" || menuList[index].menuCategoryCode == -1 ? loadSetSelectViewPage(menuList[index]) :
            burgerFlag ? loadSetSizeSelectViewPage(menuList[index], url) : showAddShoppingBasketModalView(menuList[index]);
        }
    })
}

function setMenuFlagByMenuType(menuType, menu) {
    return menuType == "burger" || menu.menuCategoryCode == 1 || menuType == "mcMorning";
}

function loadSetSelectViewPage(menu) {
    localStorage.menuObject = JSON.stringify(menu);

    location.replace("/set-select-view");
}

function loadSetSizeSelectViewPage(menu, url) {
    localStorage.menuObject = JSON.stringify(menu);

    location.replace(url);
}

function showAddShoppingBasketModalView(menu) {
    modalBody.classList.remove("visible");

    setRequestButtonClickEvent(menu);
    
}

function setRequestButtonClickEvent(menu) {
    const requestButtonItems = document.querySelectorAll(".show-add-shopping-basket-modal-view button");

    requestButtonItems.forEach((button, index) => {
        button.onclick = () => index == 0 ? showAddShoppingBasket(menu) : cancelModal();
    });
}

function showAddShoppingBasket(menu) {
    let menuList = localStorage.orderMenuList;

    if(menuList != null) {
        menuList = JSON.parse(menuList);

        menu.amount = 1;

        menuList.push(menu);
    }

    localStorage.orderMenuList = JSON.stringify(menuList);
    location.replace("/order")
}

function cancelModal() {
    modalBody.classList.add("visible");
}

function isMainPageButton(index) {
    return index == 0;
}

function isMcMorningButton(index) {
    return index == 7;
}

function isMcMorningTime() {
    let mcMorningTimeFlag = false;
    
    let eventType = "mc-morning";

    $.ajax({
        async: false,
        type: "get",
        url: `/api/v1/check/${eventType}`,
        dataType: "json",
        success: (response) => {
            mcMorningTimeFlag = response.data;
            console.log(mcMorningTimeFlag);
        },
        error: (request, status, error) => {
            console.log(request.status);
            console.log(request.responseText);
            console.log(error);
        }
    });

    return mcMorningTimeFlag;
}

function clearDomObject(domObject) {
    domObject.innerHTML = "";
}

function setOrderHistoryDivClickEvent() {
    const orderHistoryDiv = document.querySelector(".order-history");

    orderHistoryDiv.onclick = () => {
        let menuList = localStorage.orderMenuList;

        if(menuList != null) {
            menuList = JSON.parse(menuList);
            
            menuList.length == 0 ? showAlert() : location.replace("/order");
        }
        
    }
}

function showAlert() {
    alert("주문 내역이 없습니다.");
}

function removeMenuObjectInLocalStorage() {
    localStorage.removeItem("size");
    localStorage.removeItem("menuObject");
    localStorage.removeItem("sideMenuObject");
    localStorage.removeItem("drinkMenuObject");
    localStorage.removeItem("burgerSet");
}