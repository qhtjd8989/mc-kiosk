package kioskmake.projectkiosk.web.dto.menu;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReadMenuResponseDto {
    private int id;
    private String menuName;
    private int price;
    private int defaultPrice;
    private int kcal;
    private int menuCategoryCode;
    private int hamburgerCategoryCode;
    private String image;
    private String type;
    private boolean mcMorningFlag;
    private boolean mcLunchFlag;
}