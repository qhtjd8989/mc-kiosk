package kioskmake.projectkiosk.web.dto.menu;

import kioskmake.projectkiosk.domain.menu.Menu;
import lombok.Data;

@Data
public class ReadAddMenuListRequestDto {
    private String menuType;

    public Menu toMenuEntity() {
        return Menu.builder()
                .menu_type(menuType)
                .menu_category_code(menuType.equals("burger") ? 1 : menuType.equals("side") ? 2 : 3)
                .build();
    }
}