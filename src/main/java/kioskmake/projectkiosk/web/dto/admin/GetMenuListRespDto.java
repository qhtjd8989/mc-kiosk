package kioskmake.projectkiosk.web.dto.admin;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GetMenuListRespDto {

	private int id;
	private String menuCategoryName;
	private String menuName;
	private int price;
	private int kcal;
	private String size;
	private String img;
	private boolean mcLunchFlag;
	private boolean setMenuFlag;
	private boolean onlyMcMorningFlag;
	private boolean hamburgerMcMorningFlag;
	private int totalCount;
}
