package kioskmake.projectkiosk.domain.menu;

import kioskmake.projectkiosk.web.dto.admin.GetMenuDetailRespDto;
import kioskmake.projectkiosk.web.dto.admin.GetMenuListRespDto;
import kioskmake.projectkiosk.web.dto.menu.ReadMenuResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    private int id;
    private boolean set_flag;

    private String menu_type;
	private boolean mc_morning_flag;
	private String burger_type;
	private String size;
	private String drink_type;
	private String menu_name;
	private String menu_category_name;
	private int sales;
	private int price;
	private int default_price;
	private int kcal;
	private int mc_lunch_flag;
	private int set_menu_flag;
	private int is_mc_morning_flag;
	private int only_mc_morning_flag;
	private int drink_category_code;
	private int menu_category_code;
	private boolean hamburger_mc_morning_flag;
	private int hamburger_category_code;
	private int total_count;
	
	private String image;

    public ReadMenuResponseDto toReadMenuResponseDto() {
        return ReadMenuResponseDto.builder()
        		.id(id)
                .menuName(menu_name)
				.mcMorningFlag(mc_morning_flag)
                .price(price)
				.defaultPrice(default_price)
                .kcal(kcal)
                .image(image)
                .mcLunchFlag(mc_lunch_flag == 1)
				.menuCategoryCode(menu_category_code)
				.hamburgerCategoryCode(hamburger_category_code)
                .build();
    }
    
    public GetMenuListRespDto toMenuList() {
    	return GetMenuListRespDto.builder()
    			.id(id)
    			.menuCategoryName(menu_type)
    			.menuName(menu_name)
    			.price(price)
    			.kcal(kcal)
    			.size(size)
    			.img(image)
    			.mcLunchFlag(mc_lunch_flag == 1)
    			.setMenuFlag(set_menu_flag == 1)
    			.onlyMcMorningFlag(only_mc_morning_flag == 1)
    			.hamburgerMcMorningFlag(hamburger_category_code == -1)
    			.totalCount(total_count)
    			.build();
    }
    
    public GetMenuDetailRespDto toDetailDto() {
    	return GetMenuDetailRespDto.builder()
    			.id(id)
    			.menuName(menu_name)
    			.price(price)
    			.sales(sales)
    			.kcal(kcal)
    			.image(image)
				.menuCategoryName(menu_category_name)
    			.size(size != null ? size : "")
				.hamburgerCategoryCode(hamburger_category_code)
				.mcLunchFlag(mc_lunch_flag == 1)
				.setMenuFlag(set_menu_flag == 1)
				.mcMorningFlag(is_mc_morning_flag == 1)
				.onlyMcMorningFlag(only_mc_morning_flag == 1)
				.drinkCategoryCode(drink_category_code)
				.menuCategoryCode(menu_category_code)
    			.build();
    }
}