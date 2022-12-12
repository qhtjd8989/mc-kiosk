window.onload = () => {
    MenuSetter.getInstance();
    ButtonClickEventSetter.getInstance();
}

class MenuSetter {
    static #instance = null;

    menuObject = null;
    sideMenuObject = null;
    drinkMenuObject = null;

    menuType = null;
    mainMenuModalView = null;

    totalPrice = 0;
    totalKcal = 0;

    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new MenuSetter();
        }

        return this.#instance;
    }

    constructor() {
        this.menuObject = JSON.parse(localStorage.menuObject);
        this.sideMenuObject = JSON.parse(localStorage.sideMenuObject);
        this.drinkMenuObject = JSON.parse(localStorage.drinkMenuObject);
        this.setTotalPriceAndTotalKcal();
        this.setSetMenuInformation();
        this.setBurgerSetClass();
    }
    
    setTotalPriceAndTotalKcal() {
        const amount = parseInt(document.querySelector(".amount-detail-span").textContent);
        const menuInformationTitleDiv = document.querySelector(".menu-information-div");

        this.totalPrice = (this.menuObject.price + this.sideMenuObject.defaultPrice + this.drinkMenuObject.defaultPrice) * amount;
        this.totalKcal = (this.menuObject.kcal + this.sideMenuObject.kcal + this.drinkMenuObject.kcal) * amount;

        
        menuInformationTitleDiv.innerHTML = `
            <p>${this.menuObject.menuName} 세트</p>
            <p>￦<span class="price-span">${this.totalPrice.toLocaleString('ko-KR')}</span><span class="kcal-span">${this.totalKcal.toLocaleString('ko-KR')} Kcal</span></p>
                
        `;
    }

    setSetMenuInformation() {
        const selectMenuImageDiv = document.querySelector(".select-menu-image-div");
        const burgerDetailDiv = document.querySelector(".burger-detail-div");
        const sideDetailDiv = document.querySelector(".side-detail-div");
        const drinkDetailDiv = document.querySelector(".drink-detail-div");

        const burgerImage = this.menuObject.image;
        const sideMenuImage = this.sideMenuObject.image;
        const drinkMenuImage = this.drinkMenuObject.image;

        const burgerSrc = `/image/images/burger/${burgerImage}`;
        const sideSrc = `/image/images/side/${sideMenuImage}`;
        const drinkSrc = `/image/images/drink/${drinkMenuImage}`;

        const burgerAlt = `${burgerImage.substring(burgerImage.lastIndexOf("_") + 1, burgerImage.lastIndexOf("."))}`;
        const sideAlt = `${sideMenuImage.substring(sideMenuImage.lastIndexOf("_") + 1, sideMenuImage.lastIndexOf("."))}`;
        const drinkAlt = `${drinkMenuImage.substring(drinkMenuImage.lastIndexOf("_") + 1, drinkMenuImage.lastIndexOf("."))}`;

        

        selectMenuImageDiv.innerHTML = `
            <div class="set-menu-image">
                <img class="side-menu-image" src="${sideSrc}" alt="${sideAlt}">
                <img class="drink-menu-image" src="${drinkSrc}" alt="${drinkAlt}">
            </div>
            <div class="menu-image">
                <img class="burger-menu-image" src="${burgerSrc}" alt="${burgerAlt}">
            </div>
        `;

        burgerDetailDiv.innerHTML = `
            <div class="modify-menu-detail-div">
                <div class="modify-menu-detail-informantion">
                    <span class="detail-name-span">${this.menuObject.menuName}</span>
                    <span class="detail-kcal-span">${this.menuObject.kcal} Kcal</span>
                </div>
                <img src="${burgerSrc}" alt="${burgerAlt}">
            </div>
        `;

        sideDetailDiv.innerHTML = `
            <div class="modify-menu-detail-div">
                <div class="modify-menu-detail-informantion">
                    <span class="detail-name-span">${this.sideMenuObject.menuName}</span>
                    <span class="detail-kcal-span">${this.sideMenuObject.kcal} Kcal</span>
                </div>
                <img src="${sideSrc}" alt="${sideAlt}">
            </div>
        `;

        drinkDetailDiv.innerHTML = `
            <div class="modify-menu-detail-div">
                <div class="modify-menu-detail-informantion">
                    <span class="detail-name-span">${this.drinkMenuObject.menuName}</span>
                    <span class="detail-kcal-span">${this.drinkMenuObject.kcal} Kcal</span>
                </div>
                <img src="${drinkSrc}" alt="${drinkAlt}">
            </div>
        `;

    }

    getModifyMenuList(menuType) {
        this.menuType = menuType;

        $.ajax({
            async: false,
            type: "get",
            url: `/api/v1/menu/${menuType}/change/list?setSize=${localStorage.size}&mcMorning=${this.menuObject.mcMorningFlag}`,
            dataType: "json",
            success: (response) => {
                this.setModalData(response.data);
            },
            error: (request, status, error) => {
                console.log(request.status);
                console.log(request.responseText);
                console.log(error);
            }
        })
    }

    setModalData(menuList) {
        this.mainMenuModalView = document.querySelector(".main-menu-modal-view");
            const modalMenuUl = document.querySelector(".menu-ul");
    
            this.clearDomObject(modalMenuUl);
            this.mainMenuModalView.classList.remove("visible");
    
            menuList.forEach(menu => {
                modalMenuUl.innerHTML += `
                    <li class="menu-li">
                        <div class="menu-image">
                            <img src="/image/images/${this.menuType}/${menu.image}" alt="${menu.menuName}">
                        </div>
                        <div class="modal-menu-information-div">
                            <p class="menu-name">${menu.menuName}</p>
                            <p>₩ ${menu.price}</p>
                            <p>${menu.kcal} Kcal</p>
                        </div>
                    </li>
                `;
            })

            this.setModifyMenuClickEvent(menuList);
    }
    
    clearDomObject(domObject) {
        domObject.innerHTML = "";
    }
    
    setBurgerSetClass() {
        let burgerSet = BurgerSet.getInstance(this.menuObject, this.sideMenuObject, this.drinkMenuObject);

    }

    setModifyMenuClickEvent(menuList) {
        const menuLiItems = document.querySelectorAll(".menu-li");

        menuLiItems.forEach((menu, index) => {
            menu.onclick = () => this.modifyMenu(menuList[index]);
        })

    }

    modifyMenu(menu) {
        this.setMenuObjectByMenuType(menu);
        this.setTotalPriceAndTotalKcal();
        this.setSetMenuInformation();
        this.mainMenuModalView.classList.add("visible");
    }

    setMenuObjectByMenuType(menu) {
        if(this.menuType == 'side') {
            BurgerSet.getInstance().setMenuObject.side = menu;
            this.sideMenuObject = menu;

        }else if(this.menuType == 'drink') {
            BurgerSet.getInstance().setMenuObject.drink = menu;
            this.drinkMenuObject = menu;

        }

    }
  
}

class ButtonClickEventSetter {
    static #instance = null;

    menuSetter = null;

    
    amountDetailSpan = null;
    minusButton = null;

    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new ButtonClickEventSetter();
        }

        return this.#instance;
    }

    constructor() {
        this.amountDetailSpan = document.querySelector(".amount-detail-span");

        this.setPlusButtonClickEvent();
        this.setMinusButtonClickEvent();
        this.setCancelButtonClickEvent();
        this.setLoadMainPageButtonClickEvent();
        this.setModifyButtonClickEvent();
        this.modalViewCancelButtonClickEvent();
        this.setShoppingBasketAddButtonClickEvent();
    }

    setPlusButtonClickEvent() {
        const plusButton = document.querySelector(".plus-button");

        plusButton.onclick = () => this.increaseAmount();

    }
    
    setMinusButtonClickEvent() {
        this.minusButton = document.querySelector(".minus-button");

        this.minusButton.onclick = () => this.decreaseAmount();

    }

    increaseAmount() {
        this.amountDetailSpan.textContent = this.getAmount() + 1;
        this.checkToSeeIfTheAmountIsOne();

        MenuSetter.getInstance().setTotalPriceAndTotalKcal();
    }
    
    decreaseAmount() {
        if(this.getAmount() != 1) {
            this.amountDetailSpan.textContent = this.getAmount() - 1;
            this.checkToSeeIfTheAmountIsOne();

            MenuSetter.getInstance().setTotalPriceAndTotalKcal();
        }
    }
    
    getAmount() {
        return parseInt(this.amountDetailSpan.textContent);
    }
    
    checkToSeeIfTheAmountIsOne() {
        if(this.getAmount() == 1) {
            this.minusButtonIsDisabled();
        }else {
            this.minusButtonIsActivated();
        }
    }
    
    minusButtonIsDisabled() {
        this.minusButton.classList.add("disable-amount-button")
    }
    
    minusButtonIsActivated() {
        this.minusButton.classList.remove("disable-amount-button")
    }

    setCancelButtonClickEvent() {
        const cancelButton = document.querySelector(".cancel-button");
        cancelButton.onclick = () => location.replace("/kiosk-main");
    }
    
    setLoadMainPageButtonClickEvent() {
        const loadMainPageButton = document.querySelector(".load-main-page-button");

        loadMainPageButton.onclick = () => location.replace("/kiosk-main");
    }

    setModifyButtonClickEvent() {
        const modifyButtonItems = document.querySelectorAll(".modify-button");

        this.menuSetter = MenuSetter.getInstance();

        modifyButtonItems.forEach((button, index) => {
            button.onclick = () => this.menuSetter.getModifyMenuList(index == 0 ? "side" : "drink");
        })

    }

    modalViewCancelButtonClickEvent() {
        const cancelMark = document.querySelector(".cancel-mark");

        cancelMark.onclick = () => this.menuSetter.mainMenuModalView.classList.add("visible");
    }


    setShoppingBasketAddButtonClickEvent() {
        const shoppingVasketAddButton = document.querySelector(".shopping-vasket-add-button");
        
        shoppingVasketAddButton.onclick = () => {
            let menuObject = MenuSetter.getInstance().menuObject;
            let sideMenuObject = MenuSetter.getInstance().sideMenuObject;
            let drinkMenuObject = MenuSetter.getInstance().drinkMenuObject;

            // const totalPrice = document.querySelector(".price-span").textContent.replaceAll(",", "");
            // const totalKcal = document.querySelector(".kcal-span").textContent.replaceAll(",", "");
            const setPrice = (menuObject.price + sideMenuObject.defaultPrice + drinkMenuObject.defaultPrice);
            const setKcal = this.totalKcal = (menuObject.kcal + sideMenuObject.kcal + drinkMenuObject.kcal);


            BurgerSet.getInstance().setMenuObject.setPrice = setPrice;
            BurgerSet.getInstance().setMenuObject.setKcal = setKcal;
            // BurgerSet.getInstance().setMenuObject.totalPrice = totalPrice;
            // BurgerSet.getInstance().setMenuObject.totalKcal = totalKcal;
            BurgerSet.getInstance().setMenuObject.amount = this.getAmount();

            let menuList = JSON.parse(localStorage.orderMenuList);
            
            menuList.push(BurgerSet.getInstance().setMenuObject);

            localStorage.orderMenuList = JSON.stringify(menuList);
    
            location.replace("/order");
        }
    }

}

class BurgerSet {
    static #instance = null;

    setMenuObject = {
        "setName": null,
        "amount": 0,
        "setPrice": 0,
        "totalPrice": 0,
        "totalKcal": 0,
        "setFlag": true,

        "burger": {
            "menuName": null,
            "price": 0,
            "kcal": 0,
            "image": null
        },
        "side": {
            "menuName": null,
            "price": 0,
            "kcal": 0,
            "image": null
        },
        "drink": {
            "menuName": null,
            "price": 0,
            "kcal": 0,
            "image": null
        }
    }

    static getInstance(burger, side, drink) {
        if(this.#instance == null) {
            this.#instance = new BurgerSet(burger, side, drink);
        }
        return this.#instance;
    }

    constructor(burger, side, drink) {
        this.setMenuObject.setName = burger.menuName + " 세트";
        this.setMenuObject.burger = burger;
        this.setMenuObject.side = side;
        this.setMenuObject.drink = drink;
    }

}