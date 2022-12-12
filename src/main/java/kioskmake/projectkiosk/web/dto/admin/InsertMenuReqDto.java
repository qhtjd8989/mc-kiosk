package kioskmake.projectkiosk.web.dto.admin;

import org.springframework.web.multipart.MultipartFile;

import kioskmake.projectkiosk.domain.menu.Menu;
import lombok.Data;

@Data
public class InsertMenuReqDto {
	private String menuType;
	private boolean mcMorningFlag;
	private String burgerType;
	private String size;
	private String drinkType;
	private String name;
	private int sales;
	private int price;
	private int kcal;
	private boolean onlyMcMorningFlag;
	
	private MultipartFile img;
	
	public Menu menuEntity(String img) {
		return Menu.builder()
				.menu_type(menuType)
				.mc_morning_flag(mcMorningFlag)
				.burger_type(burgerType)
				.size(size)
				.drink_type(drinkType)
				.menu_name(name)
				.sales(sales)
				.price(price)
				.kcal(kcal)
				.image(img)
				.only_mc_morning_flag(onlyMcMorningFlag ? 1 : 0)
				.build();
				
	}
}