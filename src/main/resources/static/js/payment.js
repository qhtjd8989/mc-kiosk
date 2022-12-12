const backButton = document.querySelector(".back-button");
const cardPayment = document.querySelector(".card-payment");

backButton.onclick = () => {
  history.back();
}

cardPayment.onclick = () => {
  let price = localStorage.totalPrice.replace("￦", "");
  
  alert(price + "원 결제 되었습니다")
  localStorage.removeItem("orderMenuList");
  localStorage.totalPrice = "￦0";
  
  location.replace("/main");
}

