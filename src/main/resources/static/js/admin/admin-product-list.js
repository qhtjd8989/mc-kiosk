window.onload = () => {
    MenuListLoader.getInstance().getMenuList(1);
}

class MenuListLoader {
    static #instance = null;

    pageSetter = null;
    menuDetailLoader = null;

    tbody = null;
    productSelect = null;
    menuDetailItems = null;

    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new MenuListLoader();
        }
        return this.#instance;
    }

    constructor() {
        this.tbody = document.querySelector(".list-body");
        this.productSelect = document.querySelector(".product-input");
        this.setProductSelectChangeEvent();

        this.pageSetter = PageSetter.getInstance();
        this.menuDetailLoader = MenuDetailLoader.getInstance();
    }

    getMenuList(nowPage) {
        $.ajax({
            async: false,
            type: "get",
            url: `/api/v1/menu/menu/list`,
            data: {
                "page" : nowPage,
                "menuType": MenuTypeGetter.getInstance().getSelectMenuType()
            },
            dataType: "json",
            success: (response) => {
                this.setMenuList(response.data);

                if(response.data != null) {
                    this.pageSetter.setPageNumber(response.data[0].totalCount)
                    this.menuDetailLoader.setMenuDetailButtonClickEvent();
                }else {
                    this.pageSetter.setPageNumber(0);
                }
            },
            error: (request, status, error) => {
                console.log(request.status)
                console.log(request.responseText)
                console.log(error);
            }
        });
    }

    setMenuList(menuList) {
        this.tbody.innerHTML = "";

        menuList.forEach((menu, index) => {
            if(index == 0) {
                return;
            }
            
            this.tbody.innerHTML += `
            <tr>
                <th>
                    ${menu.menuCategoryName}
                    <input type="hidden" class="menu-code" value="${menu.id}">
                    <input type="hidden" class="menu-type" value="${menu.menuCategoryName}">
                </th>
                <th>${menu.menuName}</th>
                <th>${menu.price}</th>
                <th>${menu.size}</th>
                <td><button type="button" class="list-button detail-button"><i class="fa-regular fa-file-lines"></i></button></td>
                <td><button type="button" class="list-button delete-button"><i class="fa-regular fa-trash-can"></i></button></td>
            </tr>
            <tr class="menu-detail visible">
                
            </tr>
            `;
        })

        this.setDeleteButtonClickEvent(menuList);
        this.menuDetailItems = document.querySelectorAll(".menu-detail");
    }

    setDeleteButtonClickEvent(menuList) {
        const deleteButtons = document.querySelectorAll(".delete-button");

        deleteButtons.forEach((button, index) => {
            button.onclick = () => {
                if(confirm("정말로 삭제하시겠습니까?")) {
                    this.deleteMenu(menuList[index + 1]);

                }
            }
        })
    }

    deleteMenu(menu) {
        console.log(menu);

        $.ajax({
            async: false,
            type: "delete",
            url: `/api/v1/menu/${menu.menuCategoryName}/${menu.id}`,
            dataType: "json",
            success: (response) => {
                if(response.data) {
                    alert("삭제 성공");
                    location.replace("/admin/menu-list");

                }else {
                    alert("삭제 실패");

                }
            },
            error: (request, status, error) => {
                console.log(request.status);
                console.log(request.responseText);
                console.log(error);
            }
        })
    }

    setProductSelectChangeEvent() {
        const productSelect = MenuTypeGetter.getInstance().productSelect;

        productSelect.onchange = () => {
            this.getMenuList(1);
        }
    }
}

class MenuDetailLoader {
    static #instance = null;

    menuTypeGetter = null;

    formData = null;
    menuDetailBox = null;
    addButton = null;
    fileInput = null;
    productImageBox = null;
    menuCode = null;
    imageValue = null;
    defaultImageName = null;
    defaultMenuType = null;

    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new MenuDetailLoader();
        }
        return this.#instance;
    }

    constructor() {
        this.menuTypeGetter = MenuTypeGetter.getInstance();
    }

    setMenuDetailButtonClickEvent() {
        const menuDetailButton = document.querySelectorAll(".detail-button");
    
        for(let i = 0; i < menuDetailButton.length; i++) {
    
            menuDetailButton[i].onclick = () =>  {
                this.getMenuDetail(i);
            }
        }
    
    }

    getMenuDetail(index) {
        this.menuCode = document.querySelectorAll(".menu-code")[index].value;
                
        $.ajax({
            async: false,
            type: "get",
            url: `/api/v1/menu/detail`,
            data: {
                "id" : this.menuCode,
                "menuType": this.menuTypeGetter.getSelectedDetailMenuType(index)
            },
            dataType: "json",
            success: (response) => {
                this.setMenuDetail(response.data, index);
            },
            error: (request, status, error) => {
                console.log(request.status);
                console.log(request.responseText);
                console.log(error);
            }
        });

        this.toggleVisibleClass(index);
    }

    toggleVisibleClass(index) {
        const menuDetails = MenuListLoader.getInstance().menuDetailItems;
    
        if(menuDetails[index].classList.contains("visible")) {
            menuDetails.forEach(menuDetail => menuDetail.classList.add("visible"));

            menuDetails[index].classList.remove("visible");
        }else {
            confirm("수정을 취소하시겠습니까?")
            menuDetails[index].classList.add("visible");
        }
    }

    getImagePreview() {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            this.productImageBox.innerHTML += `
                <div class="img-box">
                    <span class="fa-solid fa-xmark"></span>
                    <img class="product-img" src="${e.target.result}">
                </div>
            `;
    
            this.addButton.setAttribute("disabled", true);
            this.setImageDeleteButtonClickEvent();
            
        }
        setTimeout(() => { reader.readAsDataURL(this.imageValue)}, 100);
       
    }

    setImageDeleteButtonClickEvent() {
        const deleteButton = document.querySelectorAll(".fa-xmark");

        for(let i = 0; i < deleteButton.length; i++) {
            deleteButton[i].onclick = (e) => {
                if(confirm("상품 이미지를 지우시겠습니까?")) {
                    e.target.parentNode.parentNode.innerHTML = "";
                    this.addButton.removeAttribute("disabled");
                }
            }
        }
    }

    setFileImage(formData) {

        this.fileInput.value = "";

        this.fileInput.click();
    
        this.fileInput.onchange = () => {
            const fomrData = new FormData(formData);
            let changeFlge = false;
            this.imageValue = null;
        
            fomrData.forEach((value) => {
                if(value.size != 0) {
                    this.imageValue = value;
                    changeFlge = true;
                }
            });
            
            if(changeFlge){
                this.getImagePreview();
            }
        }
    }
    
    setMenuDetail(menuDetail, index) {
        this.menuDetailBox = MenuListLoader.getInstance().menuDetailItems[index];
        this.menuTypeGetter.menuTypeItem = menuDetail.menuCategoryName;

        console.log(menuDetail);

        this.menuDetailBox.innerHTML = `
            <td colspan="8">
                <table class="product-info">
                    <tr>
                        <td>
                            <input class="menu-type-input product-input" value="${menuDetail.menuCategoryName}" disabled>
                        </td>
                        <td><input type="text" class="product-input" value="${menuDetail.menuName}" placeholder="이름"></td>
                        <td><input type="text" class="product-input" value="${menuDetail.price}" placeholder="가격"></td>
                        <td><input type="text" class="product-input" value="${menuDetail.kcal}" placeholder="칼로리"></td>
                        <td><input type="text" class="product-input" value="${menuDetail.size}" placeholder="사이즈"></td>
                    </tr>
                    <tr>
                        <td class="modify-check-box-td" colspan="5">
                            ${menuDetail.menuCategoryName == `burger` ? 
                            `<select class="burger-type-select">
                                <option value="-1" ${menuDetail.hamburgerCategoryCode == -1 ? 'selected' : ''}>mcMorning</option>
                                <option value="2" ${menuDetail.hamburgerCategoryCode == 2 ? 'selected' : ''}>beef</option>
                                <option value="3" ${menuDetail.hamburgerCategoryCode == 3 ? 'selected' : ''}>seafood</option>
                                <option value="4" ${menuDetail.hamburgerCategoryCode == 4 ? 'selected' : ''}>chicken</option>
                            </select>
                            <span class="mc-lunch-flag-check mc-lunch-flag-visible">
                                <input type="checkbox" name="radio-check" id="mc-lunch-check-box" class="product-input mc-lunch-flag" ${menuDetail.mcLunchFlag ? `checked`:``}>
                                <label for="mc-lunch-check-box" class="mc-lunch-check-box">맥런치</label>
                            </span>` : ``}

                            ${menuDetail.menuCategoryName == `side` ? 
                            `<span class="mc-morning-check mc-morning-visible">
                                <input type="checkbox" name="radio-check" id="mc-morning-check-box" class="product-input mc-morning" ${menuDetail.mcMorningFlag ? `checked`:``}>
                                <label for="mc-morning-check-box" class="mc-morning-check-box">맥모닝 메뉴</label>
                            </span>
                            <span class="only-mc-morning-check only-mc-morning-visible">
                                <input type="checkbox" name="radio-check" id="only-mc-morning-check-box" class="product-input only-mc-morning" ${menuDetail.onlyMcMorningFlag ? `checked`:``}>
                                <label for="only-mc-morning-check-box" class="only-mc-morning-check-box">※ 맥모닝시간에도 판매 가능</label>
                            </span>
                            <span class="set-menu-flag-check set-menu-flag-visible">
                                <input type="checkbox" name="radio-check" id="set-menu-check-box" class="product-input set-menu-flag" ${menuDetail.setMenuFlag ? `checked`:``}>
                                <label for="set-menu-check-box" class="set-menu-check-box">세트메뉴</label>
                            </span>` : ``}

                            ${menuDetail.menuCategoryName == `drink` ? 
                            `<span class="mc-morning-check mc-morning-visible">
                                <input type="checkbox" name="radio-check" id="mc-morning-check-box" class="product-input mc-morning" ${menuDetail.mcMorningFlag ? `checked`:``}>
                                <label for="mc-morning-check-box" class="mc-morning-check-box">맥모닝 메뉴</label>
                            </span>
                            <span class="only-mc-morning-check only-mc-morning-visible">
                                <input type="checkbox" name="radio-check" id="only-mc-morning-check-box" class="product-input only-mc-morning" ${menuDetail.onlyMcMorningFlag ? `checked`:``}>
                                <label for="only-mc-morning-check-box" class="only-mc-morning-check-box">※ 맥모닝시간에도 판매 가능</label>
                            </span>
                            <span class="set-menu-flag-check set-menu-flag-visible">
                                <input type="checkbox" name="radio-check" id="set-menu-check-box" class="product-input set-menu-flag" ${menuDetail.setMenuFlag ? `checked`:``}>
                                <label for="set-menu-check-box" class="set-menu-check-box">세트메뉴</label>
                            </span>
                            <select class="product-input">
                                <option value="1" ${menuDetail.drinkCategoryCode == 1 ? 'selected' : ''}>음료</option>
                                <option value="2" ${menuDetail.drinkCategoryCode == 2 ? 'selected' : ''}>커피</option>
                            </select>` : ``}

                            ${menuDetail.menuCategoryName == `dessert` ? 
                            `<span class="mc-morning-check mc-morning-visible">
                                <input type="checkbox" name="radio-check" id="mc-morning-check-box" class="product-input mc-morning" ${menuDetail.mcMorningFlag ? `checked`:``}>
                                <label for="mc-morning-check-box" class="mc-morning-check-box">맥모닝 메뉴</label>
                            </span>
                            <span class="only-mc-morning-check only-mc-morning-visible">
                                <input type="checkbox" name="radio-check" id="only-mc-morning-check-box" class="product-input only-mc-morning" ${menuDetail.onlyMcMorningFlag ? `checked`:``}>
                                <label for="only-mc-morning-check-box" class="only-mc-morning-check-box">※ 맥모닝시간에도 판매 가능</label>
                            </span>` : ``}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5">
                            <form enctype="multipart/form-data">
                                <div class="product-img-inputs">
                                    <label>상품 이미지</label>
                                    <button type="button" class="add-button">추가</button>
                                    <input type="file" class="file-input product-invisible" name="file" >
                                </div>
                            </form>
                            <div class="product-images">
                                ${menuDetail.image != null ? `
                                <div class="img-box">
                                    <span class="fa-solid fa-xmark"></span>
                                    <img class="product-img" src="/image/images/${MenuTypeGetter.getInstance().getSelectedDetailMenuType(index)}/${menuDetail.image}">
                                </div>` : ``}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5">
                            <button type="button" class="update-button">수정하기</button>
                        </td>
                    </tr>
                </table>
            </td>
        `;

        

        this.addButton = this.menuDetailBox.querySelector(".add-button");
        this.fileInput = this.menuDetailBox.querySelector(".file-input");
        this.productImageBox = this.menuDetailBox.querySelector(".product-images");
        
        this.defaultImageName = menuDetail.image;

        if(menuDetail.image != null) {
            this.addButton.setAttribute("disabled", true);
        }

        this.addButton.onclick = () => {
            this.addButton.removeAttribute("disabled");
            this.setFileImage(this.menuDetailBox.querySelector("form"));
            
        }

        if(menuDetail.menuCategoryName != "burger") {
            this.setMcMorningCheckBoxClickEvent();
}

        this.setImageDeleteButtonClickEvent();
        
        this.setUpdateButtonClickEvent(this.menuDetailBox.querySelector(".update-button"), index);
    
    }

    setMcMorningCheckBoxClickEvent() {
        const mcMorningCheckBox = this.menuDetailBox.querySelector(".mc-morning");

        mcMorningCheckBox.onchange = () => {
            if(mcMorningCheckBox.checked) {
                this.menuDetailBox.querySelector(".only-mc-morning").setAttribute("checked", true);
            }
        }
    }

    setUpdateButtonClickEvent(updateButton, index) {
        updateButton.onclick = () => {
        
            this.setUpdateData(index);

            this.formData.forEach((v, k) => {
                console.log("key: " + k);
                console.log("value: " + v);
            })
    
            $.ajax({
                async: false,
                type: "put",
                url: `/api/v1/menu/detail/${this.menuCode}`,
                enctype: "multipart/form-data",
                contentType: false,
                processData: false,
                data: this.formData,
                dataType: "json",
                success: (response) => {
                    if(response.data) {
                        alert("수정 완료")
                        location.replace("/admin/menu-list");
                    }
                },
                error: (request, status, error) => {
                    console.log(request.status);
                    console.log(request.responseText);
                    console.log(error);
                }
            });
        }
    }

    setUpdateData(index) {
        const productInput = this.menuDetailBox.querySelectorAll(".product-input");

        console.log(productInput);
    
        let selectedDetailMenuType = MenuTypeGetter.getInstance().getSelectedDetailMenuType(index);

        this.formData = new FormData();
        
        this.formData.append("menuType", productInput[0].value);
        this.formData.append("menuName", productInput[1].value);
        this.formData.append("price", productInput[2].value);
        this.formData.append("kcal", productInput[3].value);
        this.formData.append("size", productInput[4].value);

        if(this.imageValue != null) {
            this.formData.append("deleteFileName", this.defaultImageName);
            this.formData.append("newFile", this.imageValue);
        }

        if(selectedDetailMenuType == 'burger') {
            this.formData.append("mcLunchFlag", productInput[5].checked);
            this.formData.append("hamburgerCategoryCode", document.querySelector(".burger-type-select").value);

        }else if (selectedDetailMenuType == 'side' || selectedDetailMenuType == 'drink') {
            this.formData.append("mcMorningFlag", productInput[5].checked);
            this.formData.append("onlyMcMorningFlag", productInput[6].checked);
            this.formData.append("setMenuFlag", productInput[7].checked);
            if(selectedDetailMenuType == 'drink') {
                this.formData.append("drinkCategoryCode", productInput[7].value);
            }
        }else {
            this.formData.append("mcMorningFlag", productInput[5].checked);
            this.formData.append("onlyMcMorningFlag", productInput[6].checked);
        }
    }
    
}

class MenuTypeGetter {
    static #instance = null;

    productSelect = null;

    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new MenuTypeGetter();
        }
        return this.#instance;
    }

    constructor() {
        this.productSelect = document.querySelector(".product-input");
    }

    getSelectMenuType() {
        return this.productSelect.value;
    }

    getSelectedDetailMenuType(index) {
        const menuTypeItems = document.querySelectorAll(".menu-type");
        return menuTypeItems[index].value;
    }
}

class PageSetter {
    static #instance = null;

    nowPage = 1;
    pageButton = null;

    totalPageCount = null;
    startIndex = null;
    endIndex = null;

    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new PageSetter();
        }
        return this.#instance;
    }

    constructor() {
        this.pageButton = document.querySelector(".page-btn-box");
    }

    setPageNumber(totalMenuCount) {
        this.totalPageCount = totalMenuCount % 10 == 0 ? Math.floor(totalMenuCount / 10) : Math.floor(totalMenuCount / 10) + 1;
        this.startIndex = this.nowPage % 5 == 0 ? this.nowPage - 4 : this.nowPage - (this.nowPage % 5) + 1;
        this.endIndex = this.startIndex + 4 <= this.totalPageCount ? this.startIndex + 4 : this.totalPageCount;
        
        this.pageButton.innerHTML = ``;
        
        if(this.startIndex > 5) {
            this.pageButton.innerHTML += `
                <button type="button" class="page-button pre">&lt;</button>
            `;
        }
        
        for(let i = this.startIndex; i <= this.endIndex; i++) {
            this.pageButton.innerHTML += `
                <button type="button" class="page-button">${i}</button>
            `
        }
        
        if(this.endIndex != this.totalPageCount) {
            this.pageButton.innerHTML += `
                <button type="button" class="page-button next">&gt;</button>
            `;
        }

        this.setPageButtonClickEvent(this.totalPageCount);
        
    }

    setPageButtonClickEvent(totalMenuCount) {
        const menuLoader = MenuListLoader.getInstance();

        const pageNumberButtons = document.querySelectorAll(".page-button");

        if(this.startIndex != 1) {
            const prePageButton = document.querySelector(".pre");

            prePageButton.onclick = () => {
                this.nowPage = this.startIndex - 1;
                menuLoader.getMenuList(this.nowPage);
            }
        }
        
        if(this.endIndex != totalMenuCount) {
            const nextPageButton = document.querySelector(".next");

            nextPageButton.onclick = () => {
                this.nowPage = this.endIndex + 1;
                menuLoader.getMenuList(this.nowPage);
            }
        }
        
        pageNumberButtons.forEach(button => {
            if(button.textContent != "<" && button.textContent != ">"){
                button.onclick = () => {
                    this.nowPage = button.textContent;
                    menuLoader.getMenuList(this.nowPage);
                }
            }
        })
    }
}