package kioskmake.projectkiosk.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminPageController {

	@GetMapping("/admin/menu-insert")
	public String admin() {
		return "admin/admin";
	}
	
	@GetMapping("/admin/menu-list")
	public String adminMenuList() {
		return "admin/admin-product-list";
	}
	
}
