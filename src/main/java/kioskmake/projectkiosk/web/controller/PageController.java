package kioskmake.projectkiosk.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

	@GetMapping("/main")
	public String loadMainPage() {
		return "insert";
	}
	
	@GetMapping("/kiosk-main")
	public String loadKioskMainPage() {
		return "kiosk-main";
	}
	
	@GetMapping("/order")
	public String loadOrderPage() {
		return "order";
	}
	
	@GetMapping("/payment")
	public String loadPaymentPage() {
		return "payment";
	}
	
	@GetMapping("/set-select-view")
	public String loadSetSelectViewPage() {
		return "set-select-view";
	}
	
	@GetMapping("/set-size-select-view")
	public String loadSizeSelectViewPage() {
		return "set-size-select-view";
	}
	
	@GetMapping("/table-service")
	public String loadTableServicePage() {
		return "table-service";
	}

	@GetMapping("/shopping-basket")
	public String loadShoppingBasketPage() {
		return "shopping-basket-add-view";
	}
}