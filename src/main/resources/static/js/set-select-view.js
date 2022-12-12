window.onload = () => {
    MenuLoader.getInstance().getMenuList();
}

class MenuLoader {
    static #instance = null;

    menuType = "side";
    menuObject = null;

    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new MenuLoader();
        }

        return this.#instance;
    }

    constructor() {
        this.menuObject = JSON.parse(localStorage.menuObject);
    }

    getMenuList() {
        let size = localStorage.size;

        $.ajax({
            async: false,
            type: "get",
            url: `/api/v1/menu/${this.menuType}/list?setSize=${size == null ? 'none' : size}&mcMorning=${this.menuObject.mcMorningFlag}`,
            dataType: "json",
            success: (response) => {
                    this.setMenuList(response.data);
            },
            error: (request, status, error) => {
                console.log(request.status);
                console.log(request.responseText);
                console.log(error);
            }
        })
    }

    setMenuList(menuList) {
        const foodMenuUl = document.querySelector(".food-menu-btns");

        if(menuList != null) {
            this.clearDomObject(foodMenuUl);
    
            menuList.forEach(menu => {
                foodMenuUl.innerHTML += `
                    <li class="menu-detail-li">
                        <div class="food-menu-img">
                            <img src="/image/images/${this.menuType}/${menu.image}" alt="${menu.menuName}">
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

            this.setMenuClickEvent(menuList);
        }else {
            foodMenuUl.innerHTML = `
                <li>
                    <div class="food-menu-img">
                        
                    </div>
                    <div>
                        <p>제품이 없습니다.</p>
                        <div class="food-menu-price">
                            <p</p>
                            <p></p>
                        </div>
                    </div>
                </li>
            `;
        }
    }

    clearDomObject(domObject) {
        domObject.innerHTML = "";
    }

    setMenuClickEvent(menuList) {
        const menuDetailLiItems = document.querySelectorAll(".menu-detail-li");

        if(this.menuType == "side") {
            menuDetailLiItems.forEach((menu, index) => {
                menu.onclick = () => {
                    localStorage.sideMenuObject = JSON.stringify(menuList[index]);
                    this.selectedSideMenu();
                    this.menuType = "drink";
                    this.getMenuList();
                }
            })

        }else {
            menuDetailLiItems.forEach((menu, index) => {
                menu.onclick = () => {
                    localStorage.drinkMenuObject = JSON.stringify(menuList[index]);
                    location.replace("/shopping-basket");
                }
            })

        }
    }

    selectedSideMenu() {
        const menuTitle = document.querySelector(".menu-title h2");
        const sideITag = document.querySelector(".side-i");

        sideITag.classList.remove("fa-circle");
        sideITag.classList.add("fa-circle-check");
        menuTitle.textContent = "음료";
    }
}