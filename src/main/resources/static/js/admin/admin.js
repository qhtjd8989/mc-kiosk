const productType = document.querySelector(".product-type");

const submitButton = document.querySelector(".submit-button");
const addButton = document.querySelector(".add-button");
const fileInput = document.querySelector(".file-input");


let productImageFiles = new Array();

burgerTypeInput();

function burgerTypeInput() {
    const checkBoxItems = document.querySelectorAll(".mc-morning-check input");
    const burgerType = document.querySelector(".burger-type");
    const sizeType = document.querySelector(".size-type");
    const drinkType = document.querySelector(".drink-type");
    const mcMorningCheck = document.querySelector(".mc-morning-check");
    const onlyMcMorningCheck = document.querySelector(".only-mc-morning-check");


    productType.value == "burger" ? mcMorningCheck.classList.remove("mc-morning-visible") : "";

    setCheckBoxChangeEvent(burgerType, checkBoxItems);

    productType.onchange = () => {
        if(productType.value == "burger") {
            mcMorningCheck.classList.remove("mc-morning-visible");
            drinkType.classList.add("drink-visible");
            sizeType.classList.add("size-visible");
            onlyMcMorningCheck.classList.add("only-mc-morning-visible")
        } else if(productType.value == "side") {
            burgerType.classList.add("burger-visible");
            sizeType.classList.remove("size-visible");
            drinkType.classList.add("drink-visible");
            mcMorningCheck.classList.add("mc-morning-visible");
            onlyMcMorningCheck.classList.remove("only-mc-morning-visible")
        } else if(productType.value == "drink") {
            burgerType.classList.add("burger-visible");
            sizeType.classList.remove("size-visible");
            drinkType.classList.remove("drink-visible");
            mcMorningCheck.classList.add("mc-morning-visible");
            onlyMcMorningCheck.classList.remove("only-mc-morning-visible")
        }else {
            burgerType.classList.add("burger-visible");
            sizeType.classList.add("size-visible");
            drinkType.classList.add("drink-visible");
            mcMorningCheck.classList.add("mc-morning-visible");
            onlyMcMorningCheck.classList.remove("only-mc-morning-visible")
        }

        if(productType != "burger") {
            unCheckedCheckBoxItems(checkBoxItems);
        }
    }
}

function setCheckBoxChangeEvent(burgerType, checkBoxItems) {
    const burger = document.querySelector(".burger");
    const mcMorning = document.querySelector(".mc-morning");

    checkBoxItems.forEach(checkBox => {
        checkBox.onchange = (e) => {
            if(e.target.classList.contains("burger" )&& e.target.checked) {
                burgerType.classList.remove("burger-visible");
                mcMorning.checked = false;
            }else if(e.target.classList.contains("mc-morning") && e.target.checked) {
                burger.checked = false;
                burgerType.classList.add("burger-visible");
            }else {
                burgerType.classList.add("burger-visible");
            }
        }
    })
}

function unCheckedCheckBoxItems(checkBoxItems) {
    checkBoxItems.forEach(checkBox => checkBox.checked = false);
}

addButton.onclick = () => {
    fileInput.click();
}

fileInput.onchange = () => {
    const formData = new FormData(document.querySelector("form"));
    let changeFlge = false;

    formData.forEach((value) => {
        if(value.size != 0) {
            productImageFiles.push(value);
            changeFlge = true;
        }
    });
    
    if(changeFlge){
        getImagePreview();
        fileInput.value = null;
    }
}

function getImagePreview() {
    const productImages = document.querySelector(".product-images");

    productImages.innerHTML = "";

    productImageFiles.forEach((file, i) => {
        const reader = new FileReader();
    
        reader.onload = (e) => {
            productImages.innerHTML += `
                <div class="img-box">
                    <span class="fa-solid fa-xmark"></span>
                    <img class="product-img" src="${e.target.result}">
                </div>
            `;

            const deleteButton = document.querySelectorAll(".fa-xmark");
            deleteButton.forEach((xbutton, index) => {
                xbutton.onclick = () => {
                    if(confirm("상품 이미지를 지우시겠습니까?")) {
                        productImageFiles.splice(index, 1);
                        console.log(productImageFiles);
                        getImagePreview();
                    }
                };
            })
        }
        setTimeout(() => {reader.readAsDataURL(file)}, i * 100);
    });
}

submitButton.onclick = () => {
    const productInput = document.querySelectorAll(".product-input");

    let formData = new FormData();

    formData.append("menuType", productInput[0].value);
    if(productInput[0].value == "burger") {
        if(productInput[1].checked == true) {
            formData.append("mcMorningFlag", productInput[1].checked)
        }else {
            formData.append("burgerType", productInput[3].value);
        }
    }
    if(productInput[0].value == "side" || productInput[0].value == "drink") {
        formData.append("size", productInput[4].value);
    }
    if(productInput[0].value == "drink") {
        formData.append("drinkType", productInput[5].value);
    }
    formData.append("name", productInput[7].value);
    formData.append("price", productInput[8].value);
    formData.append("kcal", productInput[9].value);
    formData.append("onlyMcMorningFlag", productInput[6].checked)
        

    productImageFiles.forEach((file) => {
        formData.append("img", file);
    });

    
    for (var item of formData.entries()) {
        console.log(item[0] + " : " + item[1]);
    }
    
 
    add(formData);
}

function add(formData) {
    $.ajax({
        async: false,
        type: "post",
        url: `/api/v1/menu/${productType.value}`,
        enctype: "multipart/form-data",
        contentType: false,
        processData: false,
        data: formData,
        dataType: "json",
        success: (response) => {
            alert("상품 등록 완료");
            console.log(response.data);
        },
        error: (error) => {
            alert("상품 등록 실패");
            console.log(error);
        }
    });
}


