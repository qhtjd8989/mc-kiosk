package kioskmake.projectkiosk.web.dto.admin;

import kioskmake.projectkiosk.domain.menu.Menu;
import lombok.Data;

@Data
public class DeleteMenuRequestDto {
    private int id;
    private String menuType;

    public Menu toMenuEntity() {
        return Menu.builder()
                .id(id)
                .menu_type(menuType)
                .build();
    }
}