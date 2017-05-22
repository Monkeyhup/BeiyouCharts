package com.supermap.common;

import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 指标的节点
 * 
 * @author Linhao
 * 
 */
public class Node implements JSONSerialize {

	public static final String KEY_NAME = "name";

	public static final String KEY_SIZE = "size";
	
	public static final String KEY_LEVEL = "level";

	public static final String KEY_CHILDREN = "children";

	private String name;

	private Number size;

	private int level;

	private List<Node> nodes;

	public Node() {
	}

	public Node(String name, Number size) {
		setName(name);
		setSize(size);
	}
	
	public Node(String name, Number size,int level) {
		setName(name);
		setSize(size);
		setLevel(level);
	}

	public Node(String name, Number size, List<Node> nodes) {
		setName(name);
		setSize(size);
		setNodes(nodes);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Number getSize() {
		return size;
	}

	public void setSize(Number size) {
		this.size = size;
	}

	public List<Node> getNodes() {
		return nodes;
	}

	public void setNodes(List<Node> nodes) {
		this.nodes = nodes;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	/**
	 * 添加叶子节点
	 * 
	 * @param node
	 * @return
	 */
	public Node appendNode(Node node) {
		if (node == null)
			return this;
		if (nodes == null)
			nodes = new ArrayList<Node>();

		nodes.add(node);

		return this;
	}

	public JSONObject toJSONObject() {
		JSONObject json = new JSONObject();

		String name = getName();
		json.put(KEY_NAME, name != null ? name : "");
		Number size = getSize();
		json.put(KEY_SIZE, size != null ? size : 0);

		List<Node> nodes = getNodes();
		if(nodes != null && nodes.size() > 0){
			JSONArray array = new JSONArray();	
			for (int i = 0, len = nodes.size(); i < len; i++) {
				Node node = nodes.get(i);
				if (node != null)
					array.add(node.toJSONObject());
			}
			json.put(KEY_CHILDREN, array);
		}

		return json;
	}

}
