/**
 * Created by xiaomin on 2016/10/20.
 */
/*指标*/
 var selSecond=[
 ["农、林、牧、渔业","采矿业","制造业","电力、热力、燃气及水生产...","建筑业","批发和零售业","交通运输、仓储和邮政业",
 "住宿和餐饮业","信息传输、软件和信息技术...","房地产业","租赁和商务服务业","科学研究和技术服务业","水利、环境和公共设施管理",
 "居民服务、修理和其他服务","教育","卫生和社会工作","文化、体育和娱乐业","公共管理、社会保障和社会..."],
 ["企业法人","事业单位","机关法人","社会团体","其他法人"],
 ["内资企业","国有企业","集体企业","股份合作企业","联营企业","有限责任企业","股份有限公司","私营企业","其他企业","港澳台商投资企业","外商投资企业"],
 ["全部法人","小微企业","文化产业","健康服务业"],
 ["国有控股企业","集体控股企业","私人控股企业","港澳台商控股企业","外商控股企业","其他全控股企业"],
 ["农、林、牧、渔业","采矿业","制造业","电力、热力、燃气及水生产...","建筑业","批发和零售业","交通运输、仓储和邮政业",
 "住宿和餐饮业","信息传输、软件和信息技术...","房地产业","租赁和商务服务业","科学研究和技术服务业","水利、环境和公共设施管理",
 "居民服务、修理和其他服务","教育","卫生和社会工作","文化、体育和娱乐业","公共管理、社会保障和社会..."],
 ["企业法人","事业单位","机关法人","社会团体","其他法人"],
 ["内资企业","国有企业","集体企业","股份合作企业","联营企业","有限责任企业","股份有限公司","私营企业","其他企业","港澳台商投资企业","外商投资企业"],
 ["全部法人","小微企业","文化产业","健康服务业"],
 ["国有控股企业","集体控股企业","私人控股企业","港澳台商控股企业","外商控股企业","其他全控股企业"]

 ];
 function setSecond(){
 var fir=document.getElementById("first");
 var sec=document.getElementById("second");
 var secondContent= selSecond[fir.selectedIndex-1];
 sec.length=1;
 for(var i=0;i< secondContent.length;i++){
 sec.options[i+1]=new Option(secondContent[i],secondContent[i]);
     }
 }
