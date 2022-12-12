package kioskmake.projectkiosk.web.dto.admin;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GetMenuDetailRespDto {
	
	private int id;
	private String menuName;
	private int price;
	private int sales;
	private int kcal;
	private String image;
	private String size;
	private String menuCategoryName;

	private int hamburgerCategoryCode;
	private boolean mcLunchFlag;
	private boolean setMenuFlag;
	private boolean mcMorningFlag;
	private boolean onlyMcMorningFlag;
	private int drinkCategoryCode;
	private int menuCategoryCode;
}