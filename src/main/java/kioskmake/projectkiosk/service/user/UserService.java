package kioskmake.projectkiosk.service.user;

import kioskmake.projectkiosk.domain.user.User;
import kioskmake.projectkiosk.web.dto.UserReqDto;

public interface UserService {
	
	public boolean insertUser(UserReqDto insertUserReqDto) throws Exception;
	public User userCheck(String userName, String userPhoneNumber) throws Exception;
	public boolean updateUserPoint(int id, int point, String pointStatus) throws Exception;
}
