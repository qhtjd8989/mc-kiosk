window.onload = () => {
  TypeButtonClickEventSetter.getInstacne();
  ImageSetter.getInstacne();
  ImageSetter.getInstacne().loadBurgerObjectById();
}

class TypeButtonClickEventSetter {
  static #instance = null;

  typeBox = null;

  static getInstacne() {
      if(this.#instance == null) {
          this.#instance = new TypeButtonClickEventSetter();
      }

      return this.#instance;
  }

  constructor() {
    this.setTypeButtonClickEvnet();
    this.setLocationBackButtonClickEvent();
  }

  setTypeButtonClickEvnet() {
    const selectMenuImageDiv = document.querySelectorAll(".select-menu-image-div");
    this.typeBox = document.querySelector(".type-box");

      
    selectMenuImageDiv[0].onclick = () => {
      this.typeBox.style.display = 'block';
      this.typeBox.innerHTML = `
        <div class="type">
          <div class="type-content">
            <p>단품을 선택 하시겠습니까?</p>
            <div class="type-btns btns">
              <button type="button" class="single-confirm">확인</button>
              <button type="button" class="cancel">취소</button>
            </div>
          </div>
        </div>`

      this.setCancelButtonClickEvent();
    
      const singleConfirm = document.querySelector(".single-confirm");
      singleConfirm.onclick = () => {
        let menuList = JSON.parse(localStorage.orderMenuList);
        let menuObject = JSON.parse(localStorage.menuObject);

        menuObject.setFlag = false;
        menuObject.amount = 1;

        menuList.push(menuObject);

        localStorage.orderMenuList = JSON.stringify(menuList);

        location.replace("/order");
      }
    }

    selectMenuImageDiv[1].onclick = () => {
      this.typeBox.style.display = 'block';
      this.typeBox.innerHTML = `<div class="type">
        <div class="type-content">
            <p>기본 세트를 선택 하시겠습니까?</p>
            <div class="type-btns btns">
              <button type="button" class="m-set-confirm">확인</button>
              <button type="button" class="cancel">취소</button>
            </div>
          </div>
        </div>`
            
      this.setCancelButtonClickEvent();

      const mSetConfirm = document.querySelector(".m-set-confirm");
      mSetConfirm.onclick = () => {
        localStorage.size = "M";
        location.replace("/set-select-view");
      }
    }

    selectMenuImageDiv[2].onclick = () => {
      this.typeBox.style.display = 'block';
      this.typeBox.innerHTML = `
        <div class="type">
          <div class="type-content">
            <p>라지 세트를 선택 하시겠습니까?</p>
            <div class="type-btns btns">
              <button type="button" class="l-set-confirm">확인</button>
              <button type="button" class="cancel">취소</button>
            </div>
          </div>
        </div>`

      this.setCancelButtonClickEvent();

      const lSetConfirm = document.querySelector(".l-set-confirm");
      lSetConfirm.onclick = () => {
        localStorage.size = "L";
          location.replace("/set-select-view");
      }
    }
  }

  setCancelButtonClickEvent() {
    const cancel = document.querySelector(".cancel");

    cancel.onclick = () => {
      this.typeBox.style.display = 'none';
    }
  }

  setLocationBackButtonClickEvent() {
    const locationBackButton = document.querySelector(".location-back-button");

    locationBackButton.onclick = () => location.replace("/kiosk-main");
  }
}

class ImageSetter {
  static #instance = null;

  menuObject = null;

  static getInstacne() {
    if(this.#instance == null) {
      this.#instance = new ImageSetter();
    }

    return this.#instance;
  }

  constructor() {
    this.loadBurgerObjectByLocalStorage();
  }

  loadBurgerObjectByLocalStorage() {
    this.menuObject = localStorage.menuObject;

    if(this.menuObject != null) {
      this.menuObject = JSON.parse(this.menuObject);

    }
  }

  loadBurgerObjectById() {
    let menuType = MenuTypeSetter.getInstacne().getMenuType(this.menuObject.mcMorningFlag);

    $.ajax({
      async: false,
      type: "get",
      url: `/api/v1/menu/${menuType}/${this.menuObject.id}`,
      dataType: "json",
      success: (response) => {
        if(response.data != null) {
          this.setPriceInformation(response.data);
          this.setBurgerImage(response.data[0].image);
        }
      },
      error: (request, status, error) => {
        console.log(request.status);
        console.log(request.responseText);
        console.log(error);
      }
    })
  }

  setPriceInformation(menuList) {
    const pricePItems = document.querySelectorAll(".price-p");

    pricePItems.forEach((pTag, index) => {
      pTag.textContent = `￦ ${menuList[index].price.toLocaleString('ko-KR')}`;
    })
  }

  setBurgerImage(burgerImage) {
    const burgerImageItems = document.querySelectorAll(".burger-image");

    burgerImageItems.forEach(image => {
      image.src = `/image/images/burger/${burgerImage}`;
      image.alt = `${burgerImage.substring(burgerImage.lastIndexOf("_") + 1, burgerImage.lastIndexOf("."))}`;
    });
  }
}

class MenuTypeSetter {
  static #instance = null;

  static getInstacne() {
    if(this.#instance == null) {
      this.#instance = new MenuTypeSetter();
    }

    return this.#instance;
  }

  getMenuType(mcMorningFlag) {
    return mcMorningFlag ? "mc-morning" : "burger";
  }
}