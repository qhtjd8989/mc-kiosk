package kioskmake.projectkiosk.web.dto.menu;

import kioskmake.projectkiosk.domain.menu.Menu;
import lombok.Data;

@Data
public class ReadMenuRequestDto {
    private String menuType;
    private String setSize;
    private boolean mcMorning;

    public Menu toMenu() {
        return Menu.builder()
                .menu_type(menuType)
                .set_flag(setSize != null)
                .size(setSize)
                .mc_morning_flag(mcMorning)
                .build();
    }
}