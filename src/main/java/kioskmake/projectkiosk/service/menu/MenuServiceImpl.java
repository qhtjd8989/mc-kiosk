package kioskmake.projectkiosk.service.menu;

import kioskmake.projectkiosk.domain.menu.Menu;
import kioskmake.projectkiosk.domain.menu.MenuRepository;
import kioskmake.projectkiosk.web.dto.admin.*;
import kioskmake.projectkiosk.web.dto.menu.ReadMenuRequestDto;
import kioskmake.projectkiosk.web.dto.menu.ReadMenuResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

	@Value("${file.path}")
	private String filePath;
	
    private final MenuRepository menuRepository;



	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Not ADMIN <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    @Override
    public List<ReadMenuResponseDto> getBurgerList(String burgerType) throws Exception {
		Map<String, Object> configMap = getBurgerCatgoryConfigMap(burgerType);

        return changeToReadMenuResponseDtoList(menuRepository.findBurgerList(configMap));
    }

    @Override
    public List<ReadMenuResponseDto> getBurgerByBurgerCode(int id) throws Exception {
        return changeToReadMenuResponseDtoList(menuRepository.findBurgerByBurgerCode(id));
    }

    @Override
    public ReadMenuResponseDto getMcMorningBurgerByBurgerCode(int id) throws Exception {
        return menuRepository.findMcMorningBurgerByBurgerCode(id)
                .map(Menu::toReadMenuResponseDto)
                .orElse(null);
    }

    @Override
    public List<ReadMenuResponseDto> getMcMorningBurgerList() throws Exception {
        return changeToReadMenuResponseDtoList(menuRepository.findMcMorningBurgerList());
    }

    @Override
    public List<ReadMenuResponseDto> getMenuListByMenuType(ReadMenuRequestDto readMenuRequestDto) throws Exception {
        return readMenuRequestDto.isMcMorning()
        ? changeToReadMenuResponseDtoList(menuRepository.findMcMorningMenuListByMenuType(readMenuRequestDto.toMenu()))
        : changeToReadMenuResponseDtoList(menuRepository.findMenuListByMenuType(readMenuRequestDto.toMenu()));
    }


    @Override
    public List<ReadMenuResponseDto> getChangeMenuInSet(ReadMenuRequestDto readMenuRequestDto) throws Exception {
        return changeToReadMenuResponseDtoList(menuRepository.findChangeMenuInSet(readMenuRequestDto.toMenu()));
    }

	@Override
	public List<ReadMenuResponseDto> getTopRankingMenuList() throws Exception {
		return changeToReadMenuResponseDtoList(menuRepository.findTopRankingMenuList());
	}

	private List<ReadMenuResponseDto> changeToReadMenuResponseDtoList(List<Menu> menuEntityList) {
        return menuEntityList.isEmpty() ? null
                : menuEntityList.stream()
                .map(Menu::toReadMenuResponseDto)
                .collect(Collectors.toList());
    }


	private Map<String, Object> getBurgerCatgoryConfigMap(String burgerType) {
		Map<String, Object> configMap = new HashMap<>();

		configMap.put("burger_type", burgerType);
		configMap.put("hamburger_category_code", burgerType.equals("beef") ? 2 : burgerType.equals("seaFood") ? 3 : 4);

		return configMap;
	}


	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ADMIN <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	@Override
	public boolean insertMenu(InsertMenuReqDto insertMenuReqDto) throws Exception {
		boolean count = false;
		String tempFileName = null;
		tempFileName = uploadFileAndReturnTempFileName(insertMenuReqDto.getImg(), "images/" + insertMenuReqDto.getMenuType() + "/");


		Menu menu = insertMenuReqDto.menuEntity(tempFileName);
		count = menuRepository.insertMenu(menu) > 0;

	    return count;
	}

	@Override
	public List<GetMenuListRespDto> getMenuList(int page, String menuType) throws Exception {
		List<GetMenuListRespDto> menuList = new ArrayList<>();
		Map<String, Object> map = new HashMap<>();
		menuType = menuType.toLowerCase();
		
		int index = (page - 1)  * 10;
		
		map.put("index", index);
		map.put("menu_type", menuType.equals("all") ? "ALL" : menuType.equals("burger") ? "1" : menuType.equals("side") ? "2" : menuType.equals("drink") ? "3" : "4");
		
		menuRepository.getAdminMenuList(map).forEach(menu -> {
			menuList.add(menu.toMenuList());
		});
		
		return isNotData(menuList) ? null : menuList;
	}
	
	private boolean isNotData(List<GetMenuListRespDto> menuList) {
		 return menuList.size() == 1;
	}

	@Override
	public GetMenuDetailRespDto getMenuDetail(String id, String menuType) throws Exception {
		Menu menu = null;

		menu = menuRepository.getMenuDetail(id, menuType);
			
		return menu != null ? menu.toDetailDto() : null;
	}

	@Override
	public boolean updateMenuDetail(UpdateMenuDetailRequestDto updateMenuDetailRequestDto) throws Exception {
		String tempFileName = null;
		if(updateMenuDetailRequestDto.getNewFile() != null) {
			tempFileName = uploadFileAndReturnTempFileName(updateMenuDetailRequestDto.getNewFile(), "images/" + updateMenuDetailRequestDto.getMenuType() + "/");
			deleteFile("images/" + updateMenuDetailRequestDto.getMenuType() + "/", updateMenuDetailRequestDto.getDeleteFileName());
		}
		boolean update = updateMenuDetailRequestDto.isOnlyMcMorningFlag() || updateMenuDetailRequestDto.isMcMorningFlag();

		return menuRepository.updateMenuDetail(updateMenuDetailRequestDto.toMenuEntity(tempFileName)) > 0;
	}

	@Override
	public boolean deleteMenu(DeleteMenuRequestDto deleteMenuRequestDto) throws Exception {
		return menuRepository.deleteMenu(deleteMenuRequestDto.toMenuEntity()) > 0;
	}

	private String uploadFileAndReturnTempFileName(MultipartFile file, String customPath) {
		String tempFileName = makeTempFileName(file);
		Path path = Paths.get(filePath + customPath + tempFileName);

		File f = new File(filePath + customPath);

		if(!f.exists()) {
			f.mkdirs();
		}

		try {
			Files.write(path, file.getBytes());
		} catch (IOException e) {
			e.printStackTrace();
		}

		return tempFileName;
	}

	private String makeTempFileName(MultipartFile file) {
		return UUID.randomUUID().toString().replaceAll("-", "") + "_" + file.getOriginalFilename();
	}

	private void deleteFile(String customPath, String fileName) {
		Path path = Paths.get(filePath + customPath + fileName);

		log.info(">>>>>>>>>>>>>>>> {}", path);

		File file = new File(path.toString());

		if(file.exists()) {
			try {
				Files.delete(path);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}