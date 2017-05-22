package com.supermap.result;

/**
 * 
 * 操作结果
 * 
 * @author Linhao
 *
 */
public class Result implements ResultInterface{
	
	/**
	 * 返回状态码：成功
	 */
	public static final int RESULT_OK = 0;

	/**
	 * 返回状态码：没有权限
	 */
	public static final int RESULT_EXECUTE_NO_RIGHT = 403;
	
	/**
	 * 返回状态码：执行失败
	 */
	public static final int RESULT_EXCUTE_FAIL = 417;

	/**
	 * 返回状态码：数据库需要更新
	 */
	public static final int RESULT_DATABASE_NEED_UPDATE = 418;
	
	/**
	 * 返回状态码：服务器内部错误
	 */
	public static final int RESULT_SERVICE_ERROR = 500;
	
	/**
	 * 返回状态码：未set的默认值
	 */
	public static final int RESULT_NO_SET_DEFAULT = -1;
	
	/**
	 * 返回状态码：上传失败
	 */
	public static final int RESULT_UPLOAD_FAIL = 417;
	
	/**
	 * 返回状态码：输入流为空
	 */
	public static final int RESULT_UPLOAD_INPUTSTREAM_NULL = 1001;
	
	/**
	 * 返回状态码：路径为空
	 */
	public static final int RESULT_UPLOAD_PATH_NULL = 1002;
	
	/**
	 * 返回状态码：文件名为空
	 */
	public static final int RESULT_UPLOAD_FILENAME_NULL = 1003;
	
	/**
	 * 返回状态码：创建目录失败
	 */
	public static final int RESULT_UPLOAD_MARK_DIR_NULL = 1004;
	
	/**
	 * 返回状态码：文件删除失败
	 */
	public static final int RESULT_DELETEFILE_FAIL = 1005;
	
	
	private int code = RESULT_NO_SET_DEFAULT;
	
	private StringBuilder message;
	
	public Result(){}
	
	public Result(int code,String message){
		setCode(code);
		setMessage(message);
	}
	
	@Override
	public int getCode() {
		return code;
	}

	@Override
	public void setCode(int code) {
		this.code = code;
	}

	@Override
	public String getMessage() {
		if(message == null)
			return null;
		return message.toString();
	}

	@Override
	public void setMessage(String message) {
		if(message != null)
			this.message = new StringBuilder(message);
	}

	@Override
	public ResultMessage append(String message) {
		if (message != null) {
			if (this.message == null)
				this.message = new StringBuilder();

			this.message.append(message);
		} // end if (message != null)

		return this;
	}

	@Override
	public ResultMessage appendln(String message) {
		if (this.message == null)
			this.message = new StringBuilder();

		if(message != null){
			this.message.append(message);
			this.message.append("\r\n");
		}

		return this;
	}
}
