package kioskmake.projectkiosk.web.dto.admin;

import kioskmake.projectkiosk.domain.menu.Menu;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateMenuDetailRequestDto {
    private int id;
    private String menuType;
    private String menuName;
    private int price;
    private int kcal;
    private int hamburgerCategoryCode;
    private int drinkCategoryCode;
    private String size;
    private String deleteFileName;
    private MultipartFile newFile;
    private  boolean mcLunchFlag;
    private boolean hamburgerMcMorningFlag;
    private boolean setMenuFlag;
    private boolean mcMorningFlag;
    private boolean onlyMcMorningFlag;

    public Menu toMenuEntity(String tempFileName) {
        return Menu.builder()
                .id(id)
                .menu_type(menuType)
                .menu_name(menuName)
                .price(price)
                .kcal(kcal)
                .image(tempFileName)
                .hamburger_category_code(hamburgerCategoryCode)
                .drink_category_code(drinkCategoryCode)
                .size(size.isBlank() ? null : size)
                .mc_lunch_flag(mcLunchFlag ? 1 : 0)
                .hamburger_mc_morning_flag(hamburgerCategoryCode == -1)
                .set_menu_flag(setMenuFlag ? 1 : 0)
                .is_mc_morning_flag(mcMorningFlag ? 1 : 0)
                .only_mc_morning_flag(onlyMcMorningFlag ? 1 : 0)
                .build();

    }
}