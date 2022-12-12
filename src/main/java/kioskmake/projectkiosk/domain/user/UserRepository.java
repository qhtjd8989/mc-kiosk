package kioskmake.projectkiosk.domain.user;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserRepository {
	public boolean insertUser(User user) throws Exception;
	public User userCheck(String user_name, String user_phone_number) throws Exception;
	public boolean updateUserPoint(int id, int point, String point_status) throws Exception;
	
}
